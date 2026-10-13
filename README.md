# Personal workflow skills

A personal collection of **user-invoked** skills for a serial, issue-driven workflow on one machine: project setup, product decisions, implementation, verification, publication, and review.

Framework and library guidance belongs in the consuming project. Install React, Nuxt UI, and other technology skills directly from their official maintainers rather than copying them into this collection.

## Install

This repository uses the [Agent Skills format](https://agentskills.io/specification) and is discoverable by [Vercel's skills CLI](https://github.com/vercel-labs/skills#creating-skills). No npm publication, package.json, build, or registry manifest is needed.

```sh
npx skills@latest add huboss888/schnitzel --skill '*' --global
```

List the available skills without installing:

```sh
npx skills@latest add huboss888/schnitzel --list
```

The installer handles your selected agents' skill locations. CLI authentication, project configuration, and app/database setup happen later through the workflow below. To try unpushed changes from this checkout, replace `huboss888/schnitzel` with `.`.

## Available skills

| Skill | Purpose | Source |
| --- | --- | --- |
| [setup-project](skills/setup-project/SKILL.md) | Check tracker access and establish project coding guidance. | Adapted from [Matt's setup](https://github.com/mattpocock/skills/tree/main/skills/engineering/setup-matt-pocock-skills) |
| [write-prd](skills/write-prd/SKILL.md) | Resolve decisions, update local terms, and publish a GitHub/GitLab issue. | Adapted from [kdy1](https://github.com/kdy1/kdy1-scripts/tree/main/skills/write-prd) |
| [domain-modeling](skills/domain-modeling/SKILL.md) | Maintain a concise domain glossary and selective ADRs. | Adapted from [Matt Pocock](https://github.com/mattpocock/skills/tree/main/skills/engineering/domain-modeling) |
| [create-verification-skill](skills/create-verification-skill/SKILL.md) | Generate and prove an app/database harness with a compact feature map. | Adapted from [poteto/pstack](https://github.com/cursor/plugins/tree/main/pstack/skills/create-verification-skill) |
| [maintain-verification-skill](skills/maintain-verification-skill/SKILL.md) | Audit harness and feature-map drift against source and live behavior. | Adapted from [poteto/pstack](https://github.com/cursor/plugins/tree/main/pstack/skills/maintain-verification-skill) |
| [pr](skills/pr/SKILL.md) | Publish or update a PR/MR with issue references and real evidence. | Adapted from [Matt's pr](https://github.com/mattpocock/skills/tree/main/skills/engineering/pr) |
| [review](skills/review/SKILL.md) | Review requirements, standards, and verification evidence in chat. | Adapted from [Matt's code-review](https://github.com/mattpocock/skills/tree/main/skills/engineering/code-review) |
| [retro](skills/retro/SKILL.md) | Suggest improvements to the agent's working environment. | Adapted from [Matt Pocock](https://github.com/mattpocock/skills) |

## Expected workflow

```text
Install all skills globally
          |
     setup-project
          |
       write-prd ----> domain-modeling ----> local glossary
          |
     Published issue
          |
  "Implement issue #123"                 No implementation skill needed
          |
  Run the project's verify-* skill
          |-- missing: create-verification-skill
          |-- stale:   maintain-verification-skill
          |
          pr                            Publish PR/MR with evidence
          |
        review                          Findings in chat; post when requested
          |
        retro                           Optional
```

Run setup once per project, and again when its tracker or policy changes. Its Node helper checks the selected `gh`/`glab`, authentication, and repository-read access; missing tools or login are explicit prerequisites. Successful reads do not establish write permissions.

The default project policy forbids creating or running unit tests. Prove issue acceptance criteria, affected existing flows, and relevant failure paths through the real app, integration/end-to-end checks, and persisted-state assertions. Existing lint, typecheck, and build checks remain useful. Verification evidence records the revision, fixture, actual results, and cleanup; generating a harness and proving one feature is not proof of an entire implementation.

## Thin project documentation

| Artifact | Owns |
| --- | --- |
| `AGENTS.md` | Short pointers to the applicable guidance. |
| `docs/agents/coding.md` | Tracker, language, boundary, who decides what, verification policy, and publication/review rules. |
| `GLOSSARY.md` | Resolved domain terminology, created only when needed. Written for people, in the project's reading language, each term with the name the code uses. |
| `docs/adr/` | The few decisions that are hard to reverse, surprising, and the result of a real trade-off. |
| Project-local `verify-<app>/SKILL.md` | Launch, database identity, fixtures, driving tools, evidence, and cleanup. |
| Its `feature-map.md` | Compact recipes for critical and changed user flows. Split only when cumbersome. |

The issue owns change requirements. The glossary defines terms. The feature map explains how to exercise behavior. Common setup stays in the verification entrypoint; there is no duplicate `harness.md`. Database writes prepare fixtures only in an established isolated local instance; feature mutations go through the app and database reads confirm persisted effects.

## Built for internal tools

The defaults assume an internal program with a small, known group of trained users, written up for readers of Traditional Chinese. Three sections of the generated `docs/agents/coding.md` carry that, and a project changes them there, not in the skills:

| Section | Default | Used by |
| --- | --- | --- |
| Language | Traditional Chinese for what people read (issues, PR/MR, reviews, glossary, ADRs); English for what agents and tools read. | every skill that writes |
| Boundary | A failure is a program defect, a user-environment case, or broken existing data. Only the first is a requirement, a verification target, or a review finding by default. | `write-prd`, the verification skills, `review`, `pr` |
| Decisions | A point that changes nothing stored or delivered is the implementer's. One that does is answered by a contract, by evidence, by a provisional choice the owner has delegated, or by the user. | `write-prd` |

The decision ledger of `write-prd` has core categories, asked for every feature, and optional ones (security and compliance, integrations, feature flags, operations, observability, scale and concurrency), asked only when the project lists them under **PRD scope**. The default lists none. A point that waits for someone outside the conversation is filed as its own issue; there is no permanent decision log.

## Install dependencies together

Installing the full collection includes the helpers used by other skills. When selecting individual skills, include:

| Workflow | Also install |
| --- | --- |
| `write-prd` | `setup-project`, `domain-modeling` |
| `pr`, remote `review` | `setup-project` |
| `maintain-verification-skill` | `create-verification-skill`; it maintains an existing project-local `verify-*` skill. |

Helpers are read and applied within the requested workflow; they do not require another human invocation or start unrelated work.

## Add a workflow

Keep one skill per directory, with the directory name matching its frontmatter `name`:

```text
skills/
  retro/
    SKILL.md
    agents/
      openai.yaml
```

Every skill requires YAML frontmatter with `name` and `description`, followed by its instructions:

```yaml
---
name: my-workflow
description: Describe this workflow and when the user invokes it.
disable-model-invocation: true
---
```

Write a concrete workflow body before adding the skill to the catalog. Add `references/`, `scripts/`, or `assets/` only when that workflow needs them, and use relative references within the skill. Avoid machine-specific paths and undeclared dependencies on other personal skills.

These workflows are explicit-only. Alongside `disable-model-invocation: true` in the frontmatter, include `agents/openai.yaml`:

```yaml
policy:
  allow_implicit_invocation: false
```

Keep both settings so supported agents enforce explicit invocation. Do not use `metadata.internal: true` for this purpose: that hides a skill from the installer's normal discovery.

After adding a workflow, run `npx skills@latest add . --list` and confirm it appears. Inspect any relative references and test a realistic invocation before considering it ready.

Skill metadata records upstream sources and pinned commits where known; applicable skill folders retain upstream license notices. Keep new workflows serial, prefer shared dependency guidance over copied procedures, and keep generated project docs scoped to their owners above.
