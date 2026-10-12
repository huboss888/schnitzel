# Coding workflow

## Tracker

Record the confirmed tracker provider, host, project, remote, and branch convention here during setup. Read issue requirements from that target; use its native CLI for issue and PR/MR operations. Ask when an issue number or target is ambiguous.

## Implementation

- Implement the issue's agreed scope. Record unresolved decisions instead of inventing requirements.
- Read `GLOSSARY.md` when present and use its terms. Maintain resolved terminology through `domain-modeling`; keep implementation details in the issue and code.
- Preserve unrelated changes. Work serially in the current checkout unless the user requests another execution model.

## Verification

- Do not create or run unit tests. Preserve existing test files and CI configuration.
- Prove acceptance criteria through the real app, using browser/Electron interaction, CLI execution, HTTP, and integration/end-to-end checks as appropriate.
- Use existing lint, typecheck, and build checks where useful. Inspect aggregate commands before running them so they do not indirectly run unit tests.
- Read the project-local verification skill for launch, database, fixtures, driving, evidence, and cleanup. Add or update relevant feature-map recipes as behavior changes.
- Exercise affected existing flows and relevant failure cases. Confirm persisted side effects as well as visible results. Keep evidence tied to the verified revision and fixture.
- Report passed, failed, blocked, and unverified acceptance criteria separately. A build or screenshot alone does not prove a complete flow.

## Publication and review

- Include the issue link, verified scope, actual evidence, and remaining gaps in the PR/MR. Use closing references only for fully resolved issues.
- Review requirements, repository standards, and evidence coverage. Missing unit tests are not a finding under this policy; missing real-behavior verification is.
- Review findings stay in chat unless the user requests posting. Publication does not authorize merging, auto-merge, or reviewer assignment.

## Documentation

Keep `AGENTS.md` as short pointers, this file as coding policy, `GLOSSARY.md` as vocabulary, and the verification skill as harness instructions. The issue owns change requirements; the compact feature map owns reusable verification recipes. Update existing entries and delete obsolete guidance rather than accumulating parallel documents.
