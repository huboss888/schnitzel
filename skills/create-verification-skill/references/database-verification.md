# Database verification

Use for fullstack, Electron, and other stateful apps. Put the discovered project-specific commands and contracts in the generated verification skill, then reference them from feature recipes. This reference supplies the discovery and proof rules; it is not a new document to copy wholesale into the project.

## Establish identity and access

- Inspect the project's data layer and documented development setup to identify the engine, instance/file, schemas, migrations, fixtures, and available query interface. Prefer the existing CLI or connection library; avoid inventing a universal SQL helper across different engines.
- Establish that the launched application and inspection tool use the same target. For server databases, compare sanitized host, port, database, and schema. For Electron/SQLite, confirm the absolute database file in the launched profile, including whether a temporary or copied user-data directory changes it. A familiar database filename is insufficient.
- Resolve credentials from existing local configuration or environment-variable names without printing their values. Never copy connection strings, tokens, production data, or sensitive raw query output into tracked docs or evidence.
- Use read-only database access for inspection. When an isolated local verification target is not established, do not run migrations, seeds, deletes, or application mutations against an unknown/shared target. Record the blocker and prepare the isolated instance/profile needed for proof.

## Three kinds of state

The generated skill names each and keeps them apart.

- **Proof:** a fresh, disposable instance per run, prepared as below. It may start from the dev seed.
- **Evidence:** the record of a run, kept after cleanup under `.scratch/`.
- **Dev seed:** the person's dev instance, rebuilt by one command (see below). No proof runs there.

## Prepare an isolated run

- Use a disposable database, schema, tenant, container volume, or Electron profile consistent with the app's existing development conventions. Name a database or schema the run creates with the prefix `SCRATCH_` (or the engine's equivalent, such as a `SCRATCH_` file name or profile folder under `.scratch/`), and write to no database of another name. Record the run ID and fixture identifiers so setup and cleanup can target only that run.
- Apply the actual migrations and seed commands only to that confirmed isolated target. Direct DB writes may prepare fixtures, not implement the feature being proved. Never run a reset or broad delete against an existing user database; the dev seed's rebuild of its named dev instance is the one exception.

## Dev seed

- Name the dev instance the person opens day to day, with the evidence that it is not production: its host, file, or profile, and the configuration that selects it. When that cannot be established, the seed is blocked; never point it at an unconfirmed target.
- One command rebuilds it with data covering every module, so a person can open the program and walk through any feature. It runs the actual migrations, then writes the data. It may write the database directly, because it is not proof.
- It is idempotent: a full rebuild, so running it twice gives the same state. Never append to whatever is there.
- It runs on the dev instance only when a person runs it or asks for it, and nothing else writes there. When a change extends the seed, prove it on a `SCRATCH_` instance and give the person the command that rebuilds their dev instance. The same command, given a `SCRATCH_` target, builds a proof run's starting state.
- The seed grows with each feature: when a feature lands, add the data that shows it. A journey whose precondition the seed lacks fails and names what is missing.
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

Stop only owned processes and remove only run-owned fixtures/storage (the run's `SCRATCH_` databases and instances); files under `.scratch/` stay for a person to delete. Do not use broad truncation, process-name kills, or deletion of an inferred profile. Retain proof artifacts and confirm they survive cleanup. Report residue or failed cleanup accurately; do not call an incomplete teardown clean.
