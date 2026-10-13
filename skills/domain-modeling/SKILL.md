---
name: domain-modeling
description: Resolve project terminology and maintain a concise local glossary, with selective ADRs. Use when explicitly invoked or applied as a dependency within the user's requested PRD workflow.
disable-model-invocation: true
license: MIT
metadata:
  source: "https://github.com/mattpocock/skills/tree/main/skills/engineering/domain-modeling"
  source-commit: "49dd158d1076134a641b33efb035946536778336"
---

# Domain modeling

Sharpen domain language during the requested design conversation. This helper may be read and applied by `write-prd`; it does not start a separate interview or publish anything.

Read the root `GLOSSARY.md` when present. Write the glossary and ADRs in the reading language the project's coding guidance records. When that guidance says the glossary or the ADRs live in another repository, read them there and do not create a local copy; hand the resolved terms back to the calling workflow with the path they belong in. Respect an existing `GLOSSARY-MAP.md` and work only in the relevant context. Start with one root glossary for a new small project and create it only after a term is resolved.

When language conflicts with an existing definition, surface the conflict. For overloaded terms, propose a canonical term and distinguish the concepts it covers. Use concrete scenarios and nearby code to expose unclear relationships. Existing code is evidence of current behavior, not authority to invent the user's desired behavior.

Capture resolved terms as they crystallize using [GLOSSARY-FORMAT.md](GLOSSARY-FORMAT.md). Keep definitions short, list confusing alternatives only when useful, and update existing entries rather than appending duplicates. Keep API schemas, acceptance criteria, architecture, launch commands, and database recipes in their owning artifacts; the glossary defines domain terms only.

Offer an ADR only for a hard-to-reverse decision with a real tradeoff whose rationale would surprise a future reader. Use [ADR-FORMAT.md](ADR-FORMAT.md), recording the resolved decision rather than creating empty templates. Ordinary reversible choices stay in the issue.

Return the terminology resolved, files changed, and remaining questions to the calling workflow. Reading an existing glossary alone does not require running this helper.
