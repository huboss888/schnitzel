# Coding workflow

## Tracker

Record the confirmed tracker provider, host, project, remote, and branch convention here during setup. Read issue requirements from that target; use its native CLI for issue and PR/MR operations. Ask when an issue number or target is ambiguous.

Workflow labels. Setup creates the missing ones on the tracker; no other step creates labels. Rename one here, and the skills follow.

| Label | Colour | Meaning |
| --- | --- | --- |
| `needs-decision` | `#FBCA04` | Waits for a decision someone outside the conversation must make (see Decisions). A long-running run skips every issue it blocks. |
| `prd` | `#0E8A16` | An implementation-ready issue published by `write-prd`. |
| `bug` | `#D73A4A` | A program defect, as the Boundary section defines it. User-environment and existing-data cases do not get it. |
| `wontfix` | `#FFFFFF` | Decided not to do. |

## Language

Record the project's languages here during setup. The default:

- **Traditional Chinese (繁體中文)** for what people read: chat replies, issues, PR/MR titles and descriptions, review reports, `GLOSSARY.md`, and ADRs. Identifiers, paths, commands, and quoted program text stay as they are.
- **English** for what only agents and tools read: `AGENTS.md`, this file, the verification skill and its feature map, code, comments, and commit messages.

A glossary term is written as its name in the reading language followed by the name the code uses, for example `工作階段 (work stage)`, so that prose and code refer to the same thing.

## Boundary

Record who uses this program here during setup. The default is an internal tool for a small, known group of trained users. Sort every failure, open question, and review finding into one of three kinds before deciding what to do with it.

- **Program defect.** With valid input and a working environment, the program does the wrong thing: wrong or lost data, an unmet requirement, a broken rule of this repository. Rejecting invalid user input (a wrong file, a malformed import, a value too long) is the program's job, so failing to reject it is a defect too. Defects are fixed.
- **User environment.** It happens only when the environment fails or was tampered with: permissions, I/O errors, a full disk, a locked file, a share dropping out, folders edited by hand. The program says what happened and what was and was not saved, and builds no recovery. It is not a requirement, a verification target, or a finding, unless it is common in this program's real use. Never inject such faults to look for them.
- **Existing data.** Data as received breaks what the program assumes: missing, duplicated, inconsistent, wrongly typed, names with lost characters. The data is not ours to fix. The program must not crash on it, must not drop or change it silently, and must show what it found; doing any of those is a program defect. Handle only breakage observed in the real data. Do not speculate about data that might be broken.

A reproduction proves that a case exists, not which kind it is. Cases of the last two kinds are listed in one line each under "not raised", so they stay visible without being acted on. Observed data problems are reported in the issue, with counts.

## Decisions

Who settles an open point depends on whether it changes what is stored or delivered. The test: could two users making the same choices end up with different stored data, exported output, or delivered scope?

- **No.** Only how the screen looks or behaves differs: list order, empty and loading states, wording, disabled states, progress display. The implementer decides and states the choice in the issue. No question, no waiting.
- **Yes, and something already answers it.** A repository contract, a recorded decision, the reference implementation, or the real data. Cite it. Inspect before asking: record here which sources count for this project (a specification, a production data snapshot, a legacy program).
- **Yes, and the owner has delegated it or a safe default exists.** Proceed on a stated provisional choice and mark it "to confirm" in the issue. It can be overturned later; say what overturning would cost.
- **Yes, and nothing answers it.** Ask, and do not build on it until answered.

A point that waits for someone outside the conversation is filed as an issue of its own, with the options, the evidence, what it blocks, and the choice taken meanwhile, and labelled `needs-decision`. It is not kept as a line in another document. Once settled, a decision that meets the ADR test becomes an ADR; any other stays in its closed issue.

## PRD scope

Optional ledger categories that apply to this project: none.

## Implementation

- Implement the issue's agreed scope. Record unresolved decisions instead of inventing requirements.
- Read `GLOSSARY.md` when present and use its terms. When a change introduces or clarifies a domain term, add it to `GLOSSARY.md` in the same change, in the format `domain-modeling` describes (its `GLOSSARY-FORMAT.md`). Keep implementation details in the issue and code.
- Write no comment that restates what the code does or narrates the change. Comment only where someone editing the line would otherwise undo it: a workaround or an outside constraint, in one line, linking the issue or ADR that holds the reasoning and what would let it be removed. Agents copy nearby comments, so delete stale or redundant ones in code you touch.
- Preserve unrelated changes. Work serially in the main checkout. Do not create git worktrees.
- Scratch files (verification runs, evidence, walkthrough output, issue and PR/MR body files, temporary packages) go under `.scratch/` at the repository root, which `.gitignore` excludes. A person deletes it; there is no inventory or removal command.
- A database or schema created for verification is named with the prefix `SCRATCH_` (or the engine's equivalent). Nothing writes to a database of any other name, except the verification skill's dev seed command, which rebuilds the dev instance it names.
- The dev seed runs on the person's dev instance only when a person runs it or asks for it. When a change extends the seed, prove it on a `SCRATCH_` instance and give the person the command that rebuilds their dev instance.
- Some rules are stated in one file of the code and nowhere else (generated limits, a layout table, a list of what goes where). Name those files here, one line each, with what they decide. Point to them; never restate their content in a document.

### Long-running runs

A run is long-running when its prompt says so; a subagent follows the mode of the run that started it. A person hands over the list, for example "implement #1 #2 #3 in order, long-running". No agent picks issues by itself.

Work the issues the prompt names, in the given order, one at a time. For each:

1. If the issue carries `needs-decision`, or an open `needs-decision` issue blocks it, skip it: comment on the issue naming the blocker, and go on to the next. Never decide the waiting point.
2. If a branch or an open PR/MR from an earlier run exists for it, continue on that branch and that PR/MR instead of starting another.
3. Implement and verify, publishing with `pr` from the first commit on. Then review with `review`.
4. Fix the review's program-defect findings, as the Boundary section classifies them, on the same branch; re-verify, update the PR/MR with `pr`, and review the new head, for at most 2 review rounds in all. The loop ends when verification is complete and the review is clean, or at the cap; `pr` says how the PR/MR records either outcome.

A person reviews, merges, and closes the issue.

## Verification

- Do not create or run unit tests. Preserve existing test files and CI configuration.
- Prove acceptance criteria through the real app, using browser/Electron interaction, CLI execution, HTTP, and integration/end-to-end checks as appropriate.
- Use existing lint, typecheck, and build checks where useful. Inspect aggregate commands before running them so they do not indirectly run unit tests.
- Read the project-local verification skill for launch, database, fixtures, dev seed, driving, evidence, and cleanup. Add or update relevant feature-map recipes as behavior changes.
- A feature is not done until the dev seed holds data that shows it, so a person can open their dev instance and walk through it. The seed grows with each feature.
- Exercise affected existing flows and the failure cases the Boundary section makes the program's job: invalid input, and broken data observed in the real data. Confirm persisted side effects as well as visible results. Keep evidence tied to the verified revision and fixture.
- Report passed, failed, blocked, and unverified acceptance criteria separately. A build or screenshot alone does not prove a complete flow.

## Publication and review

- Publish a finished, verified change with the `pr` skill; it holds the publication rules.
- Review a published change with the `review` skill; it holds the review rules.

## Documentation

Each kind of content has one owner. Update the owner and delete obsolete guidance rather than accumulating parallel documents.

| Where | Owns | Read by |
| --- | --- | --- |
| `AGENTS.md` | Short pointers, and the few rules that must hold on every run. | Agents |
| `docs/agents/` | This file, and other guidance written for agents. | Agents |
| The project-local verification skill and its feature map | How to launch, drive, and prove the program. | Agents |
| `GLOSSARY.md` | Domain vocabulary. | People and agents |
| `docs/adr/` | The few decisions that pass the ADR test. | People and agents |
| Issues | Change requirements, and points waiting for a decision. | People and agents |
| PRs/MRs | What changed and the evidence. | People and agents |

When one of these lives in another repository (several programs sharing one contract or one glossary), record its path here and do not create a local copy.
