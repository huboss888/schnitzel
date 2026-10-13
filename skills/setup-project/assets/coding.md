# Coding workflow

## Tracker

Record the confirmed tracker provider, host, project, remote, and branch convention here during setup. Read issue requirements from that target; use its native CLI for issue and PR/MR operations. Ask when an issue number or target is ambiguous.

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

A point that waits for someone outside the conversation is filed as an issue of its own, with the options, the evidence, what it blocks, and the choice taken meanwhile. It is not kept as a line in another document. Once settled, a decision that meets the ADR test becomes an ADR; any other stays in its closed issue.

## PRD scope

`write-prd` asks the core categories of its decision ledger for every feature. Its optional categories are asked only when listed here: Security, Privacy, and Compliance; Integrations; Feature Flag and Rollout; Operations; Observability; Scale and Concurrency.

Optional categories that apply to this project: none.

List a category when the project has what it is about (accounts or personal data, an external service, staged rollout, a server or worker to operate, metrics and alerts, concurrent users or heavy load). Add one as soon as there is a reason to; no feature has to have run into it first.

## Implementation

- Implement the issue's agreed scope. Record unresolved decisions instead of inventing requirements.
- Read `GLOSSARY.md` when present and use its terms. Maintain resolved terminology through `domain-modeling`; keep implementation details in the issue and code.
- Preserve unrelated changes. Work serially in the current checkout unless the user requests another execution model.

## Verification

- Do not create or run unit tests. Preserve existing test files and CI configuration.
- Prove acceptance criteria through the real app, using browser/Electron interaction, CLI execution, HTTP, and integration/end-to-end checks as appropriate.
- Use existing lint, typecheck, and build checks where useful. Inspect aggregate commands before running them so they do not indirectly run unit tests.
- Read the project-local verification skill for launch, database, fixtures, driving, evidence, and cleanup. Add or update relevant feature-map recipes as behavior changes.
- Exercise affected existing flows and the failure cases the Boundary section makes the program's job: invalid input, and broken data observed in the real data. Confirm persisted side effects as well as visible results. Keep evidence tied to the verified revision and fixture.
- Report passed, failed, blocked, and unverified acceptance criteria separately. A build or screenshot alone does not prove a complete flow.

## Publication and review

- Include the issue link, verified scope, actual evidence, and remaining gaps in the PR/MR. Use closing references only for fully resolved issues.
- Review requirements, repository standards, and evidence coverage. Missing unit tests are not a finding under this policy; missing real-behavior verification is.
- Classify every review finding by the Boundary section before ranking it.
- Review findings stay in chat unless the user requests posting. Publication does not authorize merging, auto-merge, or reviewer assignment.

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
