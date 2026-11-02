# Repository scope

This repository distributes personal workflow skills. See README.md for installation, the catalog, and the operating model; edit workflow instructions under skills/<name>/SKILL.md.

- Keep workflows explicit-only: `policy.allow_implicit_invocation: false` in agents/openai.yaml and `disable-model-invocation: true` in SKILL.md. The exception is the steps a long-running run must invoke itself (`pr`, `review`): they set `allow_implicit_invocation: true`, omit `disable-model-invocation`, and say in their description when an agent uses them. Any other workflow that a person's decision gates stays explicit-only.
- Use lowercase hyphenated skill names, with matching directory and frontmatter names.
- Keep skills portable and self-contained. Use relative paths for supporting resources and declare any real dependencies.
- Keep this collection serial, because it is built for one agent on one machine within a token budget (see the README's opening position). Shared helpers may be read within an authorized workflow; do not import parallel-agent, model-routing, or stacked-PR orchestration by default.
- Generated project docs have narrow owners: coding.md for policy, GLOSSARY.md for terms, the verification skill for harness setup, and one compact feature map for behavior recipes. Avoid a duplicate harness.md or permanent decision ledger.
- A section of the setup-project coding.md template stays there only when two or more steps use it; text that one skill uses lives in that skill, and coding.md keeps at most a one-line pointer or setting.
- Project-specific policy belongs in the generated coding.md, not in a skill: its Language, Boundary, Decisions, and PRD scope sections. A skill reads those sections and falls back to the collection's default when they are absent. Do not hard-code one project's language, audience, or repository layout into a skill.
- Skill instructions stay in English. What a skill writes for people follows the project's Language section.
- Preserve the default no-unit-test policy in generated coding guidance. Use meaningful real-app, integration/end-to-end, lint/typecheck/build checks, and persisted-state proof as appropriate.
- Write shared workflow instructions without repeated agent-specific setup or invocation explanations; keep required platform metadata in its configuration files.
- When importing skills, use AGENTS.md for references to shared repository instructions instead of CLAUDE.md.
- Install framework/library skills from official upstream sources into consuming projects; do not vendor them into this collection.
- Confirm discovery with `npx skills@latest add . --list` after adding or changing a skill. Listing should not install skills.
