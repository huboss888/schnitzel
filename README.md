# Personal workflow skills

A personal collection of user-invoked agent workflows: retrospectives, pull requests, product requirements, and similar repeatable tasks.

Framework and library guidance belongs in the consuming project. Install React, Nuxt UI, and other technology skills directly from their official maintainers rather than copying them into this collection.

## Install

This repository uses the [Agent Skills format](https://agentskills.io/specification) and is discoverable by [Vercel's skills CLI](https://github.com/vercel-labs/skills#creating-skills). No npm publication, package.json, build, or registry manifest is needed.

From this checkout, list the available skills without installing:

```sh
npx skills@latest add . --list
```

Install a personal workflow globally for Codex:

```sh
npx skills@latest add . --skill retro --agent codex --global
```

Once this repository is hosted, replace `YOUR-OWNER/YOUR-REPO` with its actual GitHub owner and repository name:

```sh
npx skills@latest add YOUR-OWNER/YOUR-REPO --list
npx skills@latest add YOUR-OWNER/YOUR-REPO --skill retro --agent codex --global
npx skills@latest add YOUR-OWNER/YOUR-REPO --skill '*' --agent codex --global
```

The source argument identifies the repository; `--skill` selects a skill inside it. The CLI supports Git URLs and authenticated private repositories as well. Global Codex skills install under `~/.agents/skills/`; omit `--global` to install into the current project's `.agents/skills/`.

## Available workflows

| Skill | Invocation in Codex | Purpose |
| --- | --- | --- |
| [retro](skills/retro/SKILL.md) | `$retro` | Review a coding session and suggest improvements to the agent's environment. |
| [write-prd](skills/write-prd/SKILL.md) | `$write-prd` | Resolve product and implementation decisions, then create a PRD-backed GitHub issue. |

`pr` is an intended addition; it is not implemented yet.

The retro skill was imported from the existing personal installation. Its unavailable `writing-for-agents` dependency was replaced with inline writing guidance so the installed skill stands alone.

The write-prd skill was imported from [kdy1/kdy1-scripts](https://github.com/kdy1/kdy1-scripts/tree/c2ad695b9c553584841cc1c75a9aeb55baf9d52e/skills/write-prd) at commit `c2ad695b9c553584841cc1c75a9aeb55baf9d52e`, including its decision ledger, issue template, and Codex metadata. The only local change is `disable-model-invocation: true` for Claude Code compatibility; its upstream Codex policy already requires explicit invocation. This workflow files GitHub issues and prefers the authenticated `gh` CLI for issue operations.

## Add a workflow

Keep one skill per directory, with the directory name matching its frontmatter `name`:

```text
skills/
  retro/
    SKILL.md
    agents/
      openai.yaml
```

For example, a future PR skill would live in `skills/pr/SKILL.md`. Every skill requires YAML frontmatter with `name` and `description`, followed by its instructions:

```yaml
---
name: pr
description: Prepare or update a pull request when the user invokes this workflow.
disable-model-invocation: true
---
```

Write a concrete workflow body before adding the skill to the catalog. Add `references/`, `scripts/`, or `assets/` only when that workflow needs them, and use relative references within the skill. Avoid machine-specific paths and undeclared dependencies on other personal skills.

These workflows are explicit-only. For Codex, include `agents/openai.yaml`:

```yaml
policy:
  allow_implicit_invocation: false
```

The `disable-model-invocation: true` frontmatter field is the [Claude Code equivalent](https://code.claude.com/docs/en/skills#control-who-invokes-a-skill); it does not replace Codex's policy file. Invocation controls are agent-specific, so check the target agent's support. Do not use `metadata.internal: true` for this purpose: that hides a skill from the installer's normal discovery.

After adding a workflow, run `npx skills@latest add . --list` and confirm it appears. Inspect any relative references and test a realistic invocation before considering it ready.

## Project-specific technology skills

Run installation commands from the project that uses the technology, without `--global`. For example, install the official Vercel React guidance:

```sh
npx skills@latest add vercel-labs/agent-skills --skill vercel-react-best-practices --agent codex
```

For Nuxt UI, the [official repository provides a nuxt-ui skill](https://github.com/nuxt/ui/tree/v4/skills/nuxt-ui):

```sh
npx skills@latest add nuxt/ui --skill nuxt-ui --agent codex
```

Select upstream skills appropriate to the project's version. Keep these skills in the consuming project so their scope and updates follow the project.

## Hosting

This checkout can be installed locally now. Remote installation requires pushing these files to a Git repository you control, then using that repository's owner/name or URL in the commands above. An npm package named `skills` is not required; `skills@latest` is the installer itself.
