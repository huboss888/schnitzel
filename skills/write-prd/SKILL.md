---
name: write-prd
disable-model-invocation: true
description: Resolve product decisions, maintain local domain terminology, and publish an implementation-ready GitHub or GitLab issue. Use only when the user explicitly invokes this PRD workflow.
metadata:
  source: "https://github.com/kdy1/kdy1-scripts/tree/main/skills/write-prd"
  source-commit: "c2ad695b9c553584841cc1c75a9aeb55baf9d52e"
---

# Write PRD

## Goal

Turn a feature request into a complete PRD-backed issue on the project's configured tracker. Work serially in the current conversation. Do not invent material defaults. Before creating the issue, every applicable functional and operational decision is closed in one of the ways the project's coding guidance allows: answered by the user, marked not applicable, determined by an authoritative contract or by evidence, decided by the implementer because it changes nothing that is stored or delivered, or taken provisionally under a delegation. A decision that changes what is stored or delivered and that nothing answers is always the user's.

## Required References

Read these files before asking PRD questions or writing the issue:

- `references/question-ledger.md` for the required decision ledger.
- `references/issue-template.md` for the fallback issue shape.
- The installed `setup-project` dependency's [tracker reference](../setup-project/references/tracker.md) for provider/host resolution and safe operations. Resolve it by name if not installed as a sibling directory. Missing setup/access blocks publication, not independent local PRD work.
- The installed [domain-modeling](../domain-modeling/SKILL.md) helper, applied inside this invocation as terminology is resolved. Read its guidance rather than requiring a separate human invocation. If it is missing, report the dependency before promising glossary maintenance.

Read `AGENTS.md`, coding guidance, and `GLOSSARY.md` when present. Four sections of the coding guidance steer this workflow: **Language** (what the issue is written in), **Boundary** (which failures are the program's to handle), **Decisions** (who may close a row, and which sources may answer one), and **PRD scope** (which optional ledger categories apply to this project). When the coding guidance lacks them, apply the original rule: only the user, an explicit not-applicable, or a contract closes a row. Keep the decision ledger in the conversation or scratch artifacts, not as another permanent project doc. Update resolved local terminology through the helper; requirements remain in the issue and harness recipes remain in the verification skill. Do not create empty glossary or ADR files.

## Operating Rules

- Follow all active system, developer, repository, and scoped instructions.
- Read the target repository's authoritative docs, contracts, contribution guidance, issue templates, and metadata conventions for the affected area before finalizing decisions.
- Resolve provider, host, and target project from explicit context, configured tracker guidance, then the current Git remote. Ask before filing when no unique target can be established or a self-hosted provider is unknown.
- The Feature Flag and Rollout category is optional. When it is in scope, determine whether a flag applies from an explicit user decision or repository contract, and allow the user to mark flags not applicable with a stated reason unless a repository contract requires one.
- When a feature flag applies, require its complete contract before finalizing or filing the issue. Treat it only as a rollout control, never as a substitute for authorization, tenancy, billing, budget, resource state, or other safety enforcement.
- Do not invent a flag key, rollout percentage, cohort, timing, or removal threshold.
- Use the configured tracker: `gh` for GitHub or `glab` for GitLab, preserving self-hosted hosts and subgroup paths. Verify authentication and project access before publication. A bare issue number is scoped to its project.
- Inspect the target repository's labels before filing. Apply `PRD` when that label already exists or when the repository contract or user requires it. Do not create labels. If `PRD` is absent and not required, file without it.
- Follow repository-required issue metadata. Do not add unrelated labels, assignees, milestones, project fields, issue types, or other metadata without an explicit user request or repository requirement. If required metadata cannot be applied, report the conflict and do not file.
- Ask questions in small batches. Prefer grouped, concrete questions that close decision-ledger rows.
- Do not close a ledger row with common practice or agent preference when it changes what is stored or delivered. Such a row closes only through an explicit user answer, an explicit `not applicable`, an authoritative contract or cited evidence that directly determines the answer, or, where the Decisions section allows it, a provisional choice marked "to confirm".
- A row that changes only how the screen looks or behaves is `implementer-decided`: choose, state the choice in the issue, and do not ask. Apply the Decisions test literally; when unsure which side a row falls on, it is the user's.
- Ask the ledger's core categories for every feature. Ask an optional category only when the PRD scope section lists it, or when this feature plainly needs it; in that case say so and suggest adding it to that section. Without coding guidance, treat every category as in scope.
- Apply the Boundary section to the failure rows: ask about invalid input and about broken data observed in the real data; do not turn environment failures into requirements unless the project records them as common.
- If a repository contract determines a row, cite the path or command evidence in the ledger and ask the user only when product intent remains open.
- If the user asks to skip a category, record it as explicitly out of scope or not applicable with the user's stated reason.
- Do not create the issue while any applicable ledger row remains open. A `provisional` row is not open, but the issue lists it under "To confirm" with the choice taken and what overturning it would cost.
- Follow the coding policy's verification approach. Under this collection's default, acceptance criteria require real-app, integration/end-to-end, failure-path, and persisted-state evidence; do not add unit-test requirements. Mark database checks not applicable only when the feature has no relevant persisted state.

## Workflow

1. Ground the request.
   - Identify the feature idea, affected product or domain, likely repository contracts, and issue target.
   - Read applicable docs, schemas, interfaces, existing issues, nearby code, and issue templates needed to avoid asking discoverable questions.
   - Gather the evidence the Decisions section names before asking anything: run the reference implementation on the feature when one exists, and query the real data for the cases the feature must handle. For a port or a rewrite, most open points surface here, not in an interview. Record what could not be run and why.
   - Determine which optional categories are in scope and initialize a visible decision ledger using `references/question-ledger.md`. Read the glossary; identify terms that need resolution without starting a redundant interview.

2. Collect decisions.
   - Ask only questions that materially close open ledger rows.
   - Keep asking until every applicable row is answered, explicitly not applicable, contract-determined, implementer-decided, or provisional.
   - After each user answer, update the ledger and capture resolved domain terms locally through `domain-modeling`. If applicable rows remain open, perform any needed read-only investigation and ask the next small batch of questions in the same turn; do not wait for a separate request to continue.
   - Reconcile contradictions immediately and track evidence, open questions, and user answers separately. Partial or ambiguous answers leave the affected decisions open and require follow-up questions, not inferred defaults.
   - While applicable rows remain open, do not end with only a progress summary, draft, or final plan, ask whether to continue, or request a mode switch to continue collecting decisions. Pair progress summaries with the next questions using the available question mechanism.
   - Honor an explicit user request to pause or stop. If a real access blocker prevents progress, explain what is missing and how it can be resolved, but continue investigating and asking independent questions before ending for that blocker.

3. Handle Plan Mode.
   - Plan Mode does not stop decision collection: continue read-only investigation and questions under step 2. Perform no tracker write or other mutation prohibited by the active mode. Keep proposed glossary edits in the plan when local writes are prohibited.
   - Use the available question mechanism permitted by the active instructions. Waiting for a user answer is part of the collection loop; after the answer arrives, resume automatically. If no suitable tool exists, ask directly and resume when the user replies.
   - Only when every applicable ledger row is closed, return a final plan containing the exact issue title, body, target, metadata, glossary changes, and later host-specific filing action, following the active mode's required output format.
   - When later running outside Plan Mode from a complete prior plan, create the issue without asking for another confirmation.

4. Write the PRD issue.
   - Follow the target repository's issue style and template when present; otherwise use `references/issue-template.md`.
   - Include functional and operational decisions without adding unsupported choices.
   - When a feature flag applies, include its complete contract and observable default, enabled, disabled, evaluation-failure, targeting, rollback, and lifecycle behavior.
   - Keep the issue implementation-ready with concrete scope, acceptance criteria, test scenarios, and explicit out-of-scope boundaries.

5. File the issue.
   - Outside Plan Mode, inspect available labels and required metadata, then create the issue when the ledger is complete.
   - Add `--label "PRD"` only when the label exists or is explicitly required. Add other metadata only when explicitly requested or required by the repository.
   - Search for duplicates and an uncertain prior result before creating the issue. Use the tracker reference's body-file or structured-input approach for multiline Markdown.
   - Read back the created issue and verify project, title, body, and metadata. On an ambiguous write, reconcile existing issues before a bounded retry; do not blindly create another.
   - Report the created issue URL, title, target project, applied metadata, glossary changes, and any follow-up risk. Do not implement the published feature in this invocation.

Provider-specific commands live in the shared tracker reference. Adapt argument passing to the active shell; preserve actual newlines and avoid putting secrets or multiline prose in interpolated command text.
