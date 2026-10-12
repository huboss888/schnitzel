#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Read-only checks. Never forward CLI output: auth diagnostics may contain secrets.
function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    shell: false,
    windowsHide: true,
    timeout: 15000,
    maxBuffer: 1024 * 1024,
    env: { ...process.env, GH_PROMPT_DISABLED: '1', GLAB_CHECK_UPDATE: 'false' },
  });
  return {
    ok: !result.error && result.status === 0,
    missing: result.error?.code === 'ENOENT',
    stdout: result.stdout || '',
  };
}

export function parseRemote(value) {
  let host;
  let project;
  try {
    if (/^(https?|ssh|git):\/\//i.test(value)) {
      const url = new URL(value);
      // HTTP ports matter for self-hosted APIs; SSH ports are transport-only.
      host = /https?:/.test(url.protocol) ? url.host : url.hostname;
      project = url.pathname.replace(/^\/+/, '');
    } else {
      const match = value.match(/^(?:[^@\s/:]+@)?([^\s/:]+):(.+)$/);
      if (!match) return null;
      [, host, project] = match;
    }
    project = project.replace(/\/+$/, '').replace(/\.git$/, '');
    if (!/^[a-zA-Z0-9.-]+(?::\d+)?$/.test(host)) return null;
    if (project.split('/').length < 2) return null;
    if (!project.split('/').every((part) => /^[\p{L}\p{N}_.-]+$/u.test(part) && !['.', '..'].includes(part))) return null;
    return { host: host.toLowerCase(), project };
  } catch {
    return null;
  }
}

export function inspectProject({ cwd = process.cwd(), remote, provider, offline = false } = {}) {
  if (provider && !['github', 'gitlab'].includes(provider)) throw new Error('Provider must be github or gitlab.');
  const projectPath = resolve(cwd);
  const report = { cwd: projectPath, status: 'blocked', checks: [], target: null };
  const check = (name, status) => report.checks.push({ name, status });
  try {
    if (!statSync(projectPath).isDirectory()) throw new Error('not a directory');
  } catch {
    check('cwd', 'not-an-existing-directory');
    return report;
  }
  const git = run('git', ['--version'], projectPath);
  if (!git.ok) {
    check('git', git.missing ? 'missing' : 'failed');
    return report;
  }
  check('git', 'available');
  if (!run('git', ['rev-parse', '--show-toplevel'], projectPath).ok) {
    check('repository', 'not-a-git-repository');
    return report;
  }
  const listed = run('git', ['remote'], projectPath);
  if (!listed.ok) {
    check('remote', 'unavailable');
    return report;
  }
  const names = listed.stdout.split(/\r?\n/).filter(Boolean);
  if (!names.length) {
    report.status = 'local-only';
    check('remote', 'not-configured');
    return report;
  }
  const selected = remote ?? (names.includes('origin') ? 'origin' : names.length === 1 ? names[0] : undefined);
  if (!selected || !names.includes(selected)) {
    check('remote', selected ? 'not-found' : 'ambiguous');
    return report;
  }
  const remoteResult = run('git', ['remote', 'get-url', selected], projectPath);
  const target = remoteResult.ok ? parseRemote(remoteResult.stdout.trim()) : null;
  if (!target) {
    check('remote', 'unsupported-url');
    return report;
  }
  const inferred = target.host === 'github.com' ? 'github' : target.host === 'gitlab.com' ? 'gitlab' : null;
  if (inferred && provider && provider !== inferred) {
    check('provider', 'conflicts-with-public-host');
    return report;
  }
  const chosen = provider || inferred;
  report.target = { ...target, remote: selected, provider: chosen };
  if (!chosen) {
    check('provider', 'requires-explicit-selection');
    return report;
  }
  if (chosen === 'github' && target.project.split('/').length !== 2) {
    check('project', 'invalid-github-path');
    return report;
  }
  const cli = chosen === 'github' ? 'gh' : 'glab';
  const installed = run(cli, ['--version'], projectPath);
  check(cli, installed.ok ? 'available' : installed.missing ? 'missing' : 'failed');
  if (!installed.ok) return report;
  if (offline) {
    check('authentication', 'not-checked');
    check('repository-access', 'not-checked');
    report.status = 'offline';
    return report;
  }
  const auth = run(cli, ['auth', 'status', '--hostname', target.host], projectPath);
  check('authentication', auth.ok ? 'verified' : 'failed-or-unreachable');
  if (!auth.ok) return report;
  const endpoint = chosen === 'github'
    ? `repos/${target.project.split('/').map(encodeURIComponent).join('/')}`
    : `projects/${encodeURIComponent(target.project)}`;
  const access = run(cli, ['api', '--hostname', target.host, '--method', 'GET', endpoint], projectPath);
  let matches = false;
  if (access.ok) {
    try {
      const payload = JSON.parse(access.stdout);
      const returned = chosen === 'github' ? payload.full_name : payload.path_with_namespace;
      matches = typeof returned === 'string' && returned.toLowerCase() === target.project.toLowerCase();
    } catch {
      // A successful exit with an unexpected body does not establish access.
    }
  }
  check('repository-access', matches ? 'verified-read' : 'failed-or-unexpected-target');
  if (matches) report.status = 'ready';
  return report;
}

function main(argv) {
  if (argv.includes('--help')) {
    process.stdout.write('Usage: node check-project.mjs [--cwd PATH] [--remote NAME] [--provider github|gitlab] [--offline]\nRead-only; no credentials or raw CLI output are printed.\n');
    return;
  }
  const options = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--offline') options.offline = true;
    else if (['--cwd', '--remote', '--provider'].includes(arg)) {
      if (!argv[i + 1] || argv[i + 1].startsWith('--')) throw new Error(`Missing value for ${arg}.`);
      options[arg.slice(2)] = argv[++i];
    } else throw new Error('Unknown option. Use --help.');
  }
  const report = inspectProject(options);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  process.exitCode = report.status === 'blocked' ? 1 : 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    process.stdout.write(`${JSON.stringify({ status: 'blocked', error: error.message })}\n`);
    process.exitCode = 1;
  }
}
