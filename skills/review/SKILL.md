---
name: review
description: Review a branch, GitHub PR, or GitLab MR against its issue, coding standards, and real-app verification evidence. Use only when explicitly invoked; report in chat unless posting is requested.
disable-model-invocation: true
license: MIT
metadata:
  source: "https://github.com/mattpocock/skills/tree/main/skills/engineering/code-review"
  source-commit: "49dd158d1076134a641b33efb035946536778336"
---

# Review

Perform one serial, evidence-based review in the current conversation. Write the report in the reading language the project's coding guidance records; identifiers, paths, and commands stay as they are. Review does not authorize code edits, commits, pushes, approval, merge, or public comments. Read `AGENTS.md`, coding guidance, glossary, and applicable standards. Read the installed `setup-project` dependency's [tracker reference](../setup-project/references/tracker.md) when remote issue/PR/MR operations are needed. If unavailable, local diff review can continue, but report remote operations as blocked rather than guessing the missing contract.

## Establish scope

Resolve the explicit PR/MR URL or number, branch/base, or supplied diff first. Otherwise identify the current branch's unique request. Pin head and base revisions, confirm they resolve, and inspect the complete diff and commit list against their merge base. Preserve local changes; do not checkout over a dirty tree. Inspect remote objects read-only when the local checkout is a different revision.

Identify the originating issue or spec from the request's verified links, explicit user input, or project configuration. Do not interpret an MR number as an issue number. If no spec exists, report requirements review as unavailable; never invent acceptance criteria.

## Review three dimensions

1. **Requirements:** compare the actual changed behavior with issue acceptance criteria, scope, errors, permission/ownership rules, and persisted effects. Identify missing, incorrect, or extra behavior with concrete code and requirement references.
2. **Standards:** inspect repository-documented rules and relevant consistency, naming, coupling, duplication, and unnecessary abstraction. Treat general code smells as judgment calls, suppress them when the repository endorses the pattern, and do not repeat mechanically enforced checks as speculative findings.
3. **Verification:** inspect the project's verification skill and applicable feature-map recipes, then follow supplied evidence. Check revision and dirty-state coverage, actual entry points, affected existing flows, the failure paths that are the program's job, database identity and run-owned fixtures, resulting persisted state, and cleanup. A screenshot or build alone cannot establish all of these. Missing unit tests are not a finding under the collection's policy; unsupported behavior claims or absent acceptance coverage are.

Keep source analysis distinct from executed verification. Reproduce narrowly when the existing harness and available environment permit it; use its isolation/cleanup rules. Reproduce through the real entry points only: do not inject environment faults (a simulated permission or I/O error, a full disk) to go looking for a failure. Report unavailable tools or evidence as a coverage gap. Do not claim a live pass from code inspection or request unit tests that conflict with project policy.

## Classify before ranking

Sort every candidate finding by the Boundary section of the project's coding guidance before deciding whether it is a finding. Without that section, use these defaults:

- **Program defect:** valid input, working environment, wrong result; or invalid input that the program fails to reject. This is a finding.
- **User environment:** it needs the environment to fail or be tampered with. Not a finding unless the project records the case as common in real use, and even then it does not block a merge.
- **Existing data:** the incoming data is broken. Not a finding in itself. It becomes a program defect when the program crashes on it, drops or changes it silently, or hides it, and only for breakage observed in the real data.

Having reproduced a case shows that it exists; it does not move it to another kind.

## Report

Return prioritized findings in chat. Each finding names the trigger, effect, code location, requirement or standard, and supporting evidence. Deduplicate by root cause, distinguish confirmed defects from coverage gaps, and omit speculative or purely cosmetic preferences. After the findings, list what was noticed and not raised, one line each, under the two headings "user environment" and "existing data", so the reader can see it was considered. Summarize coverage and unverified areas even when there are no actionable findings; no findings is not proof of correctness.

Post only when explicitly requested, using the selected host's supported review/comment operation. Keep findings anchored to the pinned revision, recheck the head before posting, and refresh the affected review if it changed. Reconcile uncertain submission outcomes before a bounded retry. Report the posted URL when available without changing approval state.
