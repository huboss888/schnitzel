# Database verification

Use for fullstack, Electron, and other stateful apps. Put the discovered project-specific commands and contracts in the generated verification skill, then reference them from feature recipes. This reference supplies the discovery and proof rules; it is not a new document to copy wholesale into the project.

## Establish identity and access

- Inspect the project's data layer and documented development setup to identify the engine, instance/file, schemas, migrations, fixtures, and available query interface. Prefer the existing CLI or connection library; avoid inventing a universal SQL helper across different engines.
- Establish that the launched application and inspection tool use the same target. For server databases, compare sanitized host, port, database, and schema. For Electron/SQLite, confirm the absolute database file in the launched profile, including whether a temporary or copied user-data directory changes it. A familiar database filename is insufficient.
- Resolve credentials from existing local configuration or environment-variable names without printing their values. Never copy connection strings, tokens, production data, or sensitive raw query output into tracked docs or evidence.
- Use read-only database access for inspection. When an isolated local verification target is not established, do not run migrations, seeds, deletes, or application mutations against an unknown/shared target. Record the blocker and prepare the isolated instance/profile needed for proof.

## Prepare an isolated run

- Use a disposable database, schema, tenant, container volume, or Electron profile consistent with the app's existing development conventions. Record the run ID and fixture identifiers so setup and cleanup can target only that run.
- Apply the actual migrations and seed commands only to that confirmed isolated target. Direct DB writes may prepare fixtures, not implement the feature being proved. Never run a reset or broad delete against an existing user database.
- A verifier's transaction does not undo writes from the application's separate connection. Choose explicit fixture cleanup, disposal of owned storage, or another proven isolation boundary. Document foreign-key order and background workers when they affect teardown.

## Prove a feature

1. Read the initial predicates for the run-owned fixture: relevant values, owner/tenant, relationship, and record count. Keep results narrow and sanitized.
2. Perform the feature action through its actual UI, CLI, or public API. Capture the returned record/request ID and visible result.
3. Query committed state using that identifier. Check expected values and ownership, required relationships, and the absence of unintended duplicates or cross-tenant changes. Use bound parameters or the query tool's safe argument mechanism for dynamic identifiers.
4. Reopen/reload through a second real application view when persistence is part of the claim. For asynchronous writes, wait on a bounded observable predicate; do not declare success after a fixed sleep or inspect an old transaction snapshot.
5. Pair failure-path verification with persisted-state checks: a rejected or cancelled action must leave the expected unchanged state. Where both browser and Electron paths exist, report which were exercised rather than assuming one proves the other.

When there is no database, verify the actual backing artifact or service response and mark database coverage not applicable with observed evidence.

## Evidence and cleanup

Record revision/dirty state, target identity without secrets, run/fixture IDs, query or assertion, sanitized observed values, user action, result, and evidence paths. Avoid a database dump. Keep screenshots/transcripts paired with the relevant persisted-state predicate.

Stop only owned processes and remove only run-owned fixtures/storage. Do not use broad truncation, process-name kills, or deletion of an inferred profile. Retain proof artifacts and confirm they survive cleanup. Report residue or failed cleanup accurately; do not call an incomplete teardown clean.
