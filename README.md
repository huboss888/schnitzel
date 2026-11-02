# Personal workflow skills

A personal collection of skills for a serial, issue-driven workflow on one machine: project setup, product decisions, implementation, verification, publication, and review. A person invokes them, except `pr` and `review`, which an agent also runs itself.

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
| [create-verification-skill](skills/create-verification-skill/SKILL.md) | Generate and prove an app/database harness, a dev seed, and a compact feature map. | Adapted from [poteto/pstack](https://github.com/cursor/plugins/tree/main/pstack/skills/create-verification-skill) |
| [maintain-verification-skill](skills/maintain-verification-skill/SKILL.md) | Audit harness, dev seed, and feature-map drift against source and live behavior. | Adapted from [poteto/pstack](https://github.com/cursor/plugins/tree/main/pstack/skills/maintain-verification-skill) |
| [pr](skills/pr/SKILL.md) | Publish or update a PR/MR with issue references and real evidence. Agent-invocable. | Adapted from [Matt's pr](https://github.com/mattpocock/skills/tree/main/skills/engineering/pr) |
| [review](skills/review/SKILL.md) | Review requirements, standards, and verification evidence. Agent-invocable. | Adapted from [Matt's code-review](https://github.com/mattpocock/skills/tree/main/skills/engineering/code-review) |
| [retro](skills/retro/SKILL.md) | Suggest improvements to the agent's working environment. | Adapted from [Matt Pocock](https://github.com/mattpocock/skills) |
| [feature-walkthrough](skills/feature-walkthrough/SKILL.md) | Show how a program feature is used, a screenshot per step, as one HTML page, for deciding about it or for doing it. Needs Node. | Original |

## Operating model

- **Daytime, a person decides.** `write-prd` stays explicit-only and publishes an issue only once no open decision blocks it. A point that waits for someone is filed as its own issue, labelled `needs-decision`. `setup-project` creates the four workflow labels (`needs-decision`, `prd`, `bug`, `wontfix`) that the generated `docs/agents/coding.md` lists under Tracker.
- **Unattended work, for example overnight.** The agent picks an open issue that no waiting issue blocks, implements it, verifies it, and publishes and reviews it without asking. This is why `pr` and `review` are agent-invocable; the generated coding guidance carries the rule, because every run reads it.

## Expected workflow

```text
Install all skills globally
          |
     setup-project
          |
       write-prd ----> domain-modeling ----> local glossary          person decides
          |
          |-- point waits for someone --> its own issue, labelled needs-decision
          |
     Published issue, nothing blocks it
          |
 - - - - -|- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          |                                                          unattended
  Agent picks an open issue no waiting issue blocks
          |
  Implement, then run the project's verify-* skill
          |-- missing: create-verification-skill (person)
          |-- stale:   maintain-verification-skill (person)
          |-- extend the dev seed with the feature
          |
          pr                            Agent publishes PR/MR with evidence
          |
        review                          Agent reviews; posts findings when unattended
          |
 - - - - -|- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          |
  Person reviews and merges; walks through it on the dev seed
          |
        retro                           Optional
```

Run setup once per project, and again when its tracker or policy changes. Its Node helper checks the selected `gh`/`glab`, authentication, and repository-read access; missing tools or login are explicit prerequisites. Successful reads do not establish write permissions.

The generated coding guidance's defaults: no unit tests are created or run; acceptance, affected existing flows, and relevant failure paths are proven through the real app, integration/end-to-end checks, and persisted-state assertions, with existing lint, typecheck, and build checks still useful. Work is serial in the main checkout, with no git worktrees. Scratch files go under an ignored `.scratch/` at the repository root, and verification databases carry the `SCRATCH_` prefix. A feature is done only when the dev seed shows it. Generating a harness and proving one feature is not proof of an entire implementation.

## Thin project documentation

| Artifact | Owns |
| --- | --- |
| `AGENTS.md` | Short pointers to the applicable guidance. |
| `docs/agents/coding.md` | Tracker, language, boundary, who decides what, implementation, verification, where each document lives, and one-line pointers to `pr`, `review`, and the PRD scope setting. |
| `GLOSSARY.md` | Resolved domain terminology, created only when needed. Written for people, in the project's reading language, each term with the name the code uses. |
| `docs/adr/` | The few decisions that are hard to reverse, surprising, and the result of a real trade-off. |
| Project-local `verify-<app>/SKILL.md` | Launch, database identity, fixtures, the dev seed, driving tools, evidence, and cleanup. |
| Its `feature-map.md` | Baseline preconditions and compact recipes for critical and changed user flows. Split only when cumbersome. |

The issue owns change requirements. The glossary defines terms. The feature map explains how to exercise behavior. Common setup stays in the verification entrypoint; there is no duplicate `harness.md`. The verification skill keeps three kinds of state apart: a disposable proof instance per run, evidence kept after cleanup, and the dev seed, the one command that rebuilds the person's dev instance.

## Built for internal tools

The defaults assume an internal program with a small, known group of trained users, written up for readers of Traditional Chinese. Four sections of the generated `docs/agents/coding.md` carry that, and a project changes them there, not in the skills:

| Section | Default | Used by |
| --- | --- | --- |
| Language | Traditional Chinese for what people read (issues, PR/MR, reviews, glossary, ADRs); English for what agents and tools read. | every skill that writes |
| Boundary | A failure is a program defect, a user-environment case, or broken existing data. Only the first is a requirement, a verification target, or a review finding by default. | `write-prd`, the verification skills, `review`, `pr` |
| Decisions | A point that changes nothing stored or delivered is the implementer's. One that does is answered by a contract, by evidence, by a provisional choice the owner has delegated, or by the user. A point that waits is its own labelled issue. | `write-prd`, unattended work |
| PRD scope | No optional decision-ledger categories. | `write-prd` |

## Under evaluation

Open questions. Each gives what would settle it and the evidence so far.

- [ ] **Drop `GLOSSARY.md` and `domain-modeling`.** Against keeping them: one more document to maintain, and pstack works without one. For keeping them: they map reading-language terms to code names, which matters when people read one language and the code uses another. Settled by whether agents and people actually read it. In the retro sample, explicit reads appeared in 9 of 206 transcripts, against 24 commits that changed it.
- [ ] **A fresh implementer subagent per issue for the unattended loop** (mattpocock implement-spec; see also software-factory, in progress). It conflicts with "serial". Settled by whether unattended runs lose track across issues in one context. Evidence so far: in the retro sample, implementer subagents already published MRs themselves.
- [ ] **Dev seed: always replayed, or a snapshot** used as a cache of the replay and refused when it is older than the schema or the seed script. Settled by how long the replay takes as the seed grows. No evidence yet; the dev seed is new.
- [ ] **A usability reviewer:** a fresh agent given the dev seed and the screens, without the code, asked to do a task. Getting lost becomes a finding, without a human in the loop. Settled by whether its findings match what people stumble on. No evidence yet; in the retro sample, people could not walk through features at all, because their dev instance was nearly empty.
- [ ] **Human review policy** (none, tiered, every), as a setting in `coding.md`. Settled by how often unattended changes that a person reviewed needed correction. No evidence yet.

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

A new workflow is explicit-only unless it is a step an unattended agent must run itself, as `pr` and `review` are ([AGENTS.md](AGENTS.md) holds the rule). Alongside `disable-model-invocation: true` in the frontmatter, include `agents/openai.yaml`:

```yaml
policy:
  allow_implicit_invocation: false
```

Keep both settings so supported agents enforce explicit invocation. Do not use `metadata.internal: true` for this purpose: that hides a skill from the installer's normal discovery.

After adding a workflow, run `npx skills@latest add . --list` and confirm it appears. Inspect any relative references and test a realistic invocation before considering it ready.

Skill metadata records upstream sources and pinned commits where known; applicable skill folders retain upstream license notices. Keep new workflows serial, prefer shared dependency guidance over copied procedures, and keep generated project docs scoped to their owners above.
