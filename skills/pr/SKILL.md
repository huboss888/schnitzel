---
name: pr
description: Publish or update a GitHub PR or GitLab MR with issue references and verification evidence. Use when a person asks, when an implemented change has been verified, or in a long-running run from the branch's first commit on, as a draft. A run is long-running when its prompt says so; a subagent follows the mode of the run that started it.
license: MIT
metadata:
  source: "https://github.com/mattpocock/skills/tree/main/skills/engineering/pr"
  source-commit: "49dd158d1076134a641b33efb035946536778336"
---

# Publish PR or MR

Publish intended changes from the current checkout. Read `AGENTS.md`, coding guidance, glossary when present, contribution rules, and the host's PR/MR template. Resolve the selected provider, host, repository, head remote/branch, base, issue, and existing PR/MR from explicit context and project guidance. Use `gh` for GitHub or `glab` for GitLab. Read the installed `setup-project` dependency's [tracker reference](../setup-project/references/tracker.md) for host-specific operations and safe multiline publication. If the dependency is unavailable, report it before publishing; do not replace the missing contract with guessed commands.

## Prepare

- Inspect the full diff against the intended base and preserve unrelated staged, unstaged, and untracked work. Confirm that the target and branch are unambiguous before pushing. Follow the repo's branch convention; never silently create a fork or force-push.
- Find an existing open PR/MR for the exact source repository/branch and target. Reuse it. A closed or merged prior result is not authorization to reopen or create another. Reconcile uncertain prior writes before creating anything.
- Use evidence already produced during implementation and verification. Resolve the verified revision, dirty state, fixture, covered acceptance criteria, and actual screenshot/transcript/query artifacts. If subsequent changes invalidate it, require relevant verification before presenting the change as ready. Do not rerun checks merely to format publication text.
- Commit only intended changes when needed, then push to the confirmed remote. No unrelated implementation, unit tests, merging, auto-merge, reviewer assignment, or unsolicited metadata changes belong to publication.

## Write

Write the title and body in the reading language the project's coding guidance records; identifiers, paths, and commands stay as they are. Follow the repository's template and title conventions first. Otherwise use a concise title covering the full change and this compact body:

```markdown
## Summary
Concrete problem and resulting behavior. Add a small diagram or diff sketch only when it clarifies the change.

## Evidence
Issue acceptance criteria exercised, verified revision, fixture, and real before/after results. List failed, blocked, or unverified criteria separately. "Unverified" covers requirements and normal use; environment failures the project leaves to its users are not listed as gaps.

## Data problems seen
Breakage observed in the real data during this work, with counts, and what the program does with it. Omit when there is none.

## Merge risk
Affected existing flows and any hard-to-reverse migration or operational step; how to roll back when known.
```

Use glossary vocabulary. Include the issue link and closing reference only when every agreed requirement is resolved; otherwise use a non-closing reference. Verify the selected host's closing behavior against the target branch and project configuration instead of assuming a reference guarantees closure.

Use accessible, already published evidence URLs or the host's supported attachment flow. Never publish local file paths, credentials, raw sensitive database rows, or generated mockups as runtime proof. If attachments cannot be uploaded, report the omission and preserve the local evidence for review. Do not commit evidence files solely to host them.

## Publish and verify

Create or update the resolved PR/MR using structured arguments or a body file; preserve unrelated existing body content. Honor the user's requested draft state. When verification is incomplete, publish only if the user requested that incomplete state, label it accurately, and use a draft when supported; otherwise return the prepared body and the verification blocker.

In a long-running run (a run is long-running when its prompt says so; a subagent follows the mode of the run that started it), open the PR/MR as a draft once the branch has its first commit. Its Evidence section carries the passed, failed, blocked, and unverified acceptance criteria; update it on each round of the run's implement, verify, review, and fix loop, all on this one PR/MR. Mark it ready only when verification is complete and the review is clean. At the round cap it stays a draft, with the remaining items listed. Comment on the issue only when work stops before any commit exists.

Read back the result and verify URL, host/project, head/base, title/body, issue references, and included evidence. After a timeout or ambiguous response, search for the matching result before retrying; retry once only after its absence and the failure cause establish a safe correction. Stop and report unresolved uncertainty rather than duplicating publication.

Return the URL, branch/revision, coverage and evidence gaps. Attach the result when the current environment supports PR artifacts. End after publication. Review is the separate `review` skill; in a long-running run, run it next without asking.
