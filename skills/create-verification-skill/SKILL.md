---
name: create-verification-skill
description: "Generate and prove a project-local verification skill that drives the real app and captures evidence, for any language, framework, or platform. Use only when the user explicitly invokes this workflow."
disable-model-invocation: true
license: MIT
metadata:
  source: "https://github.com/cursor/plugins/tree/main/pstack/skills/create-verification-skill"
  source-commit: "ff8f83da30af53de945acd0e1dc10a7b21a3187f"
---

# Create a verification skill

Every serious project needs a scripted way to drive the real app and prove behavior: launch it, exercise a feature the way a user would, and capture evidence. This skill generates that as a project-local skill tailored to the repo. You write the generator's output for the next agent, not for a human: it will be read cold, mid-task, by an agent that has never seen the app.

Follow the target repo's `AGENTS.md`, coding guidance, and existing skill conventions. Work serially. Create `verify-<app>/` in a project-local skills directory discovered by the running agent; call that directory `<skill-dir>` below. Confirm that the generated skill is discoverable before handing it over. The generated `SKILL.md` owns harness instructions; do not duplicate them into `harness.md`. Honor the project's unit-test policy and use real application, integration, and end-to-end verification.

## 1. Interview the repo, not the user

Answer these from the codebase and only ask the user what you cannot observe:

- **Surface:** what does a user actually touch? A web UI, a CLI/TUI, a desktop app, an API, a mobile app, a library? A repo can have several; pick the primary one and note the rest.
- **Run:** how does the app start locally? Prefer the repo's own documented dev command (package scripts, Makefile, README quickstart). Note ports, env vars, seed data, auth.
- **System:** which frontend, backend/main process, workers, and database must be running? For Electron, establish the launched process's profile/user-data path and actual database file. Read [references/database-verification.md](references/database-verification.md) when persistent state or database setup is involved.
- **Drive:** how can an agent interact with it programmatically? Existing harnesses first — Playwright/Cypress specs, expect scripts, PTY helpers, curl-able endpoints, a debug port. Only then pick a generic recipe: browser/CDP for web and Electron, a tmux/PTY harness for CLI/TUI, plain HTTP for services.
- **Observe:** what evidence can be captured? Screenshots, terminal transcripts, response bodies, logs, exit codes, DB state.
- **Isolate:** can two instances run side by side (ports, data dirs, profiles)? If not, say so in the generated skill: refusing to double-drive a shared instance beats corrupting the user's session.

If the checkout doesn't build or start as-is, fix that first (or report it precisely) before generating; a skill written against a broken base teaches wrong steps. When an irrelevant missing asset blocks startup (a static dir the API never serves, a sample config), the generated skill may create it, clearly marked as verification scaffolding, and remove it in cleanup.

## 2. Generate the skill

Write `<skill-dir>/SKILL.md` with YAML frontmatter (`name: verify-<app>` and a `description` that names the app, the surface, and when to reach for it — without frontmatter the skill never registers) and these sections, each grounded in what the interview actually found (no placeholders left):

- **Launch:** the exact command that starts the app for verification, and how to tell it's ready (a log line, a port answering, a prompt). Include teardown. For a short-lived CLI or TUI there is no server to keep alive: launch means build the binary (or install deps) once, then start each drive in its own isolated PTY or tmux session.
- **Doctor:** one read-only check that answers "is this instance worth driving?" — process up, right version/build, port owned by us, auth valid. An agent runs this first whenever anything looks off.
- **Database and fixtures:** the actual instance/file, credential lookup by environment-variable name, migrations/seed commands, run-owned fixture IDs, read-only query tool and assertions, and targeted cleanup. Record evidence that the app and query tool use the same database. Direct DB writes may prepare fixtures in an established isolated local instance; exercise feature mutations through the app. Keep credentials and sensitive rows out of the skill and evidence. When isolation is unknown, keep database inspection read-only and report mutation verification as blocked until an isolated target is available.
- **Drive:** the harness recipe with real selectors/commands from this repo, not examples. Prefer stable handles (ARIA labels, data attributes, prompt strings, route paths) over coordinates and tab order.
- **Evidence:** what to capture for a proof and where it goes. State the proof standards: exercise the real user path, not internal setters or test-only endpoints; capture the action and the resulting state, not just the final screen; verify side effects (files written, rows inserted, messages sent) alongside what's visible; mocks only where a production boundary already isolates the external system. When the safe path is a dry-run or test mode, verify what it actually skips by observing (files, network, git refs) rather than trusting its name: some dry-runs still touch the network or open a browser.
- **Cleanup:** how to tear down instances the run created. Never kill by process name; kill what you started. Cleanup removes instances and scratch state, never the evidence: proof artifacts survive the teardown, in a location the skill names.
- **Helpers:** any script the skill ships is executable and its invocation is shown in the skill body. A helper the reader has to reverse-engineer is not a helper.

Make the entrypoint link to `feature-map.md` and name the evidence location. For each verification run, capture revision and dirty-state coverage, fixture, entry point, observable predicates, results, and cleanup. Grow the skill from observed facts, not assumed commands; adapt tools and syntax to the available environment. Add one actual harness pointer to `AGENTS.md`, updating any existing pointer rather than adding a second. If a prior `harness.md` exists, consolidate its useful recipes and update callers before removing duplication. Check whether the generated skill is ignored before a requested commit/publication; preserve existing ignore policy and explain any tracking gap.

## 3. Seed the feature map

Create one `<skill-dir>/feature-map.md`, starting with the critical flows and the current issue's affected behavior. Use [references/feature-map-example.md](references/feature-map-example.md) for its compact shape. Each feature entry contains user entry points, preconditions/fixture, driving steps, observable proof including persisted state when relevant, and a gotcha only when it changes execution. Shared launch/database instructions stay in `SKILL.md`; domain definitions stay in `GLOSSARY.md`; change requirements stay in the issue. Do not copy them into the map or enumerate every screen upfront.

Replace the example Notes app, tools, paths, and queries with real repo evidence. Update entries as behavior changes and remove obsolete recipes. Split entries into feature files with a small index only when the single file becomes cumbersome; retain one authoritative map and migrate links. A successful path does not cover another entry point or predicate that was skipped.

## 4. Prove the generated skill before handing it over

Run its own instructions end to end once: launch, doctor, drive ONE mapped feature (one is enough; the map exists so later runs can cover the rest), capture evidence, clean up. After cleanup, confirm the evidence still exists at the named location — a cleanup that eats the proof fails this step. Fix what fails, and run the generated cleanup after every failed iteration too, so broken attempts don't strand processes and ports. A generated skill that was never executed is a draft, not a deliverable.

This generation smoke proof does not verify an entire implementation. Before declaring a change ready for publication, exercise every issue acceptance criterion, relevant failure path, and affected existing flow in scope. Record each as passed, failed, blocked, or unverified, with evidence tied to the changed revision. Do not write or run unit tests as a substitute for this coverage. If the harness cannot be executed, preserve the draft and report the missing capability; do not claim proof.

## 5. Offer the maintenance loop

Explain how to update the generated skill and feature map as the app changes. If `maintain-verification-skill` is installed, suggest invoking it; otherwise offer to update the generated files directly when requested. Suggest a cadence only if they ask.
