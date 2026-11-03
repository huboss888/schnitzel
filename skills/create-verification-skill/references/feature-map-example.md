# Compact feature map example

Illustrative shape for a fictional Notes app. Use this format with the target project's real tools and predicates; `control-notes`, table names, IDs, and paths below are examples, not required dependencies. Each generated entry contains concrete values/recipes rather than unresolved placeholders.

```markdown
# Notes feature map

Read SKILL.md for launch, database identity, fixtures, evidence, and cleanup. The issue owns change requirements; this map records reusable behavior checks.

## Baseline preconditions

- A fresh SCRATCH_notes_<run-id> profile, launched and passing control-notes doctor. Never the person's dev profile.
- The harness fixtures loaded into it with control-notes fixtures load: account fixture-user with notes titled Quarterly plan and Grocery list.
- A recipe names the fixture rows it relies on, or discovers its data with a query before choosing it on the screen.
- A recipe whose precondition the fixtures lack reports a failure and names what is missing under its gotcha; extend the fixtures rather than weakening the recipe.

## Create a note

- Entry points: New note button; keyboard n outside editable controls; notes create CLI.
- Preconditions: baseline; no note with the run's chosen title.
- Drive: open the editor, fill title/body, save, capture the returned note ID. Reopen it through All notes. For CLI coverage, create a separate run-owned note with notes create --format json and capture its ID.
- Proof: the success state appears; reopening shows the saved values; a bound query by note ID returns exactly one notes record with the expected title/body and owner_id. The CLI-created record can be reopened in the same app. Save screenshot, transcript, and sanitized row assertions using the evidence convention in SKILL.md.
- Failure path: cancel an unfinished draft and confirm no record was added for its run-owned identifier/title.
- Gotcha: n types a character when an editor field has focus. An initial success message does not prove persistence.

## Search notes

- Entry points: Search button; keyboard / outside editable controls; notes search CLI.
- Preconditions: baseline; the fixture notes give a title match (Quarterly plan) and a body match.
- Drive: query by title, then body; open a result; try an absent term; clear the query. Run the matching and missing queries through the CLI when those paths are in scope.
- Proof: expected IDs appear, missing queries show an empty state, clearing restores the list, reopening shows the stored values. A before/after query confirms the run's notes and ownership were not changed by search. Capture the action and result for each claimed entry point.
- Gotcha: wait for the result/empty predicate within the harness timeout. A browser result does not prove a CLI path that was skipped.
```

Start with critical and changed flows, then add entries during implementation. Keep common setup in the harness entrypoint and the baseline in the map's opening section, and definitions in the glossary. If the map is split later, move entries to feature files and retain a small index instead of leaving duplicate recipes behind.
