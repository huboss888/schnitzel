# Repository scope

This repository distributes personal, user-invoked workflow skills. See README.md for installation and the catalog; edit workflow instructions under skills/<name>/SKILL.md.

- Keep new workflows explicit-only: `policy.allow_implicit_invocation: false` in agents/openai.yaml and `disable-model-invocation: true` in SKILL.md for Claude Code compatibility.
- Use lowercase hyphenated skill names, with matching directory and frontmatter names.
- Keep skills portable and self-contained. Use relative paths for supporting resources and declare any real dependencies.
- Install framework/library skills from official upstream sources into consuming projects; do not vendor them into this collection.
- Confirm discovery with `npx skills@latest add . --list` after adding or changing a skill. Listing should not install skills.
