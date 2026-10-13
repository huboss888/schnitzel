---
name: setup-project
description: Establish a project's tracker access, coding policy, and pointers to glossary and verification guidance. Use only when explicitly invoked for project setup.
disable-model-invocation: true
license: MIT
metadata:
  source: "https://github.com/mattpocock/skills/tree/main/skills/engineering/setup-matt-pocock-skills"
  source-commit: "49dd158d1076134a641b33efb035946536778336"
---

# Setup project

Prepare one project for issue-driven implementation and real-app verification. Run serially in the current checkout. Preserve existing instructions and user edits; repeat setup without adding duplicate sections or resetting policy.

## Inspect and resolve access

Read `AGENTS.md`, any existing coding guidance, remotes, contribution docs, package/build scripts, and project-local verification skills. Resolve the intended target from explicit user context, then existing project configuration, then the Git remote. Ask when targets conflict or a self-hosted provider cannot be identified.

Run the bundled read-only helper using its absolute path:

```text
node <absolute-skill-path>/scripts/check-project.mjs --cwd <project-path>
node <absolute-skill-path>/scripts/check-project.mjs --cwd <project-path> --remote origin --provider gitlab
```

The JSON reports the selected host/project, CLI availability, authentication, and repository-read access without printing credentials or CLI responses. A self-hosted host cannot be recognised from its name: the first form reports `requires-explicit-selection`, and the second, with the confirmed provider, is the one to run. `--offline` checks local facts only. A successful read does not prove issue/MR write permissions. Provider overrides are for a confirmed self-hosted GitHub or GitLab instance, not guesses based on its hostname.

If Node, Git, the selected CLI, authentication, or access is missing, report the precise prerequisite. Use official installation instructions for the current OS and the selected host's CLI login flow within the user's setup authorization. Human/browser authentication stays with the user; do not request tokens in chat or put them in project files. Rerun the helper after setup. Do not create a test issue or PR to check access. For a project without a remote, establish local guidance and state that issue publication is unavailable until a target is configured.

## Establish coding guidance

Use [assets/coding.md](assets/coding.md) as the starting policy for `docs/agents/coding.md`. Replace its tracker-writing instruction with the confirmed provider, host, project path, selected remote, and base-branch convention. For a project without a target, record that publication is not configured instead of leaving template text. Omit facts that cannot yet be established and identify any publication blocker in the handoff. If the project has equivalent guidance, update or reuse it instead of creating another copy. Existing explicit policy conflicts require a user decision; never silently overwrite them with this collection's defaults.

The default policy forbids creating or running unit tests. Verification uses actual user paths, integration/end-to-end checks, and persisted side effects. Existing lint, typecheck, and build commands may be used; inspect aggregate commands before running them because they may include unit tests. Preserve existing test files and CI configuration.

Three sections of the template describe this project rather than the collection, so settle them with the user in one small batch instead of leaving the defaults unexamined:

- **Language:** which language people read and which language agents and tools read. The default is Traditional Chinese for people and English for agents.
- **Boundary:** who uses the program. The default is an internal tool for a small, known group of trained users, which leaves environment failures to the user and broken incoming data to its owner.
- **Decisions:** which sources may answer an open point without asking: a specification, a production data snapshot, a legacy program, or none.

**PRD scope** lists the optional decision-ledger categories that apply; the default is none, which fits an internal tool with no accounts, external services, staged rollout, or servers to operate. List one whenever the project evidently has what it covers, whether that is known at setup or learned later. When guidance, a glossary, or decisions already live in another repository, record that path in the Documentation section and do not create a local copy.

Add one compact managed block to `AGENTS.md`, updating it in place on repeat runs:

```markdown
<!-- schnitzel:start -->
- For planning, implementation, publication, and review, read `docs/agents/coding.md`: language, boundary, who decides what, and where each document lives.
- Read `GLOSSARY.md` when it exists and use its domain terms.
- For real-app verification, read the project-local `verify-<app>/SKILL.md` and its feature map when available.
<!-- schnitzel:end -->
```

Replace the verification pointer with the actual discovered skill path. If none exists, omit that line and mention `create-verification-skill` in the handoff. Respect an existing multi-context glossary layout; otherwise use one root glossary, created lazily by `domain-modeling`. Do not create empty glossary, ADR, harness, or feature-map files.

## Handoff

Report tracker readiness and remaining blockers separately from local guidance completion. Name the guidance files changed and the next usable skill. The verification skill will own runtime/database instructions; do not add a duplicate `harness.md`. Installing skills alone does not install CLIs, authenticate accounts, provision databases, or enable browser tools.
