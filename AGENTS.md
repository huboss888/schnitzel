# Repository scope

This repository distributes personal, user-invoked workflow skills. See README.md for installation and the catalog; edit workflow instructions under skills/<name>/SKILL.md.

- Keep new workflows explicit-only: `policy.allow_implicit_invocation: false` in agents/openai.yaml and `disable-model-invocation: true` in SKILL.md.
- Use lowercase hyphenated skill names, with matching directory and frontmatter names.
- Keep skills portable and self-contained. Use relative paths for supporting resources and declare any real dependencies.
- Keep this collection serial. Shared helpers may be read within an authorized workflow; do not import parallel-agent, model-routing, or stacked-PR orchestration by default.
- Generated project docs have narrow owners: coding.md for policy, GLOSSARY.md for terms, the verification skill for harness setup, and one compact feature map for behavior recipes. Avoid a duplicate harness.md or permanent decision ledger.
- Preserve the default no-unit-test policy in generated coding guidance. Use meaningful real-app, integration/end-to-end, lint/typecheck/build checks, and persisted-state proof as appropriate.
- Write shared workflow instructions without repeated agent-specific setup or invocation explanations; keep required platform metadata in its configuration files.
- When importing skills, use AGENTS.md for references to shared repository instructions instead of CLAUDE.md.
- Install framework/library skills from official upstream sources into consuming projects; do not vendor them into this collection.
- Confirm discovery with `npx skills@latest add . --list` after adding or changing a skill. Listing should not install skills.
