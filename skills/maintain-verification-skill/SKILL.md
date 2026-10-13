---
name: maintain-verification-skill
description: Audit and repair a project's verification harness and compact feature map against source and live behavior. Use only when explicitly invoked for verification maintenance.
disable-model-invocation: true
license: MIT
metadata:
  source: "https://github.com/cursor/plugins/tree/main/pstack/skills/maintain-verification-skill"
  source-commit: "e5a02f8fb0409c2db7eb06eae9078b235a2b5009"
---

# Maintain verification skill

Keep one project's verification recipes usable. Work serially in the current checkout. Edit only the verification skill, its owned helpers, and its feature map. Report product regressions without changing expected behavior to conceal them.

1. Locate the verification skill from `AGENTS.md` or project-local skill directories. If several fit, resolve the requested target; if none exists, point to `create-verification-skill`. Read its launch, database, fixture, evidence, and cleanup contracts. For database-backed work, read the installed `create-verification-skill` dependency's [database reference](../create-verification-skill/references/database-verification.md). Resolve the dependency by name if it is not a sibling directory; if unavailable, report database operations as blocked until its contract is available.
2. Read the compact `feature-map.md`. Also support an existing split map with its index. Repair dead links, duplicate entries, and obsolete recipes. Keep shared environment instructions in the skill entrypoint; remove duplicated specs or glossary definitions from the map.
3. Inspect source for each mapped feature, serially. Check its real entry points, persistence path, and observable outcomes. Add a missing critical or recently changed flow only with concrete source evidence; do not expand into an exhaustive screen catalog.
4. Follow the harness and drive every mapped feature at least once, covering the entry points and predicates its recipe promises. A successful convenient path does not prove another skipped path. Health-check before driving and again after unexpected failures; reset or relaunch when state is uncertain. Check persisted effects using run-owned identifiers. Preserve evidence and clean failed-iteration fixtures before retrying.
5. Classify differences: doc drift gets a recipe correction; a harness gap gets a verified helper fix; broken product behavior gets a finding, sorted by the Boundary section of the project's coding guidance (program defect, user environment, existing data) before it is reported. Re-drive each corrected recipe or helper. Do not weaken acceptance predicates to make a regression pass.
6. Tear down owned instances and fixtures, then confirm evidence survives. Stop a persistent failing recipe with a precise blocker and continue independent coverage where possible; do not retry indefinitely or leave processes behind.

Report `clean`, `changed`, or `blocked`, plus feature coverage, evidence paths/revision, unreachable prerequisites, and product findings. Keep run notes in scratch artifacts. Update an existing legacy split map in place unless consolidation is useful and in scope. Never maintain two competing maps or a duplicate `harness.md`.

No automatic branch, PR/MR, issue, or review comment is created. When publication is requested, pass the verified changes and evidence to the installed `pr` workflow.
