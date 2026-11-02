# Contributing to Zaarvy Skills

Thank you for contributing to the **Zaarvy Skills** ecosystem! Zaarvy Skills is a zero-install, agent-native skills warehouse compatible with **Claude Code**, **Cursor**, **OpenCode CLI**, and **Antigravity**.

---

## 1. Skill Architecture Standard

Every skill must live in its own directory under `skills/<skill-name>/`:

```
skills/<skill-name>/
├── SKILL.md                   # (Required) Protocol, frontmatter, constraints
├── references/                # (Optional) Benchmarks, background docs
│   └── reference-doc.md
├── scripts/                   # (Optional) Helper CLI scripts
│   └── helper.sh
└── test-fixtures/             # (Recommended) Realistic fixtures for evaluation
    └── sample.json
```

---

## 2. Universal `SKILL.md` Specification

### Frontmatter

Each `SKILL.md` must begin with YAML frontmatter bounded by `---`:

```yaml
---
name: my-skill-name
description: Clear, action-oriented description under 1024 characters stating exactly what the skill does and precise trigger conditions.
category: optimization       # Allowed: optimization | code-analysis | mocking | testing | security | scaffolding
tags:
  - optimization
  - tooling
---
```

### Constraints:
1. `name` must be 1–64 characters, lowercase alphanumeric with single hyphens, and **must strictly match the folder name**.
2. `description` must explicitly state trigger conditions.
3. `category` must be one of the recognized categories.

### Standard Body Sections

The markdown body of `SKILL.md` must contain these 5 exact level-2 headings:

```markdown
## Skill Purpose
Single-sentence explanation of what the skill achieves.

## Trigger Conditions
Concrete conditions and user intents that cause the agent to activate this skill.

## Execution Protocol
Step-by-step deterministic instructions the agent executes.

## Constraints
Explicit boundaries and anti-patterns (what the agent must NEVER do).

## Output Contract
Predictable, machine-parseable response structure or template.
```

---

## 3. Local Verification

Before submitting a Pull Request, run the automated verification script:

```bash
# Validate all skills against schema and ensure registry sync
node scripts/verify-skills.js

# Automatically update registry.json when adding a new skill
node scripts/verify-skills.js --sync

# Validate a specific skill during authoring
node scripts/verify-skills.js --skill my-skill-name
```

---

## 4. Pull Request Checklist

- [ ] Folder name matches `name` in frontmatter.
- [ ] Frontmatter contains valid `name`, `description`, and `category`.
- [ ] Body contains all 5 required section headings.
- [ ] At least one realistic test fixture is provided in `test-fixtures/`.
- [ ] `node scripts/verify-skills.js --sync` runs with 0 errors.
- [ ] `registry.json` is committed with updated skill metadata.
