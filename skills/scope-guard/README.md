# scope-guard

> **Restricts coding agent blast radius to the exact requested function, blocking unsolicited refactors and out-of-scope edits.**

[![Category: Guardrail](https://img.shields.io/badge/Category-Guardrail-green.svg)](../../README.md)
[![Standard: Anthropic Agent Skills](https://img.shields.io/badge/Standard-Anthropic%20Agent%20Skills-7C3AED.svg)](https://github.com/anthropics)

---

## ⚡ The Problem: Blast Radius Explosion

You ask an AI coding agent to fix a single 1-line bug in a helper function. Instead:
- It silently reorders 25 import statements across the file.
- It "cleans up" or rewrites adjacent functions you didn't ask it to touch.
- It modifies unrelated files (e.g. `utils.ts`, `types.ts`, `globals.css`).
- You end up with a 200-line git diff for a 1-line fix, breaking git blame and creating PR merge conflicts.

---

## 🛠️ The Fix: Blast-Radius Containment

`scope-guard` establishes strict execution boundaries:

1. **Surgical Diff Enforcer**: Edits must be isolated strictly to the target function/component requested.
2. **Unsolicited Refactor Ban**: Forbids automated import reordering, style re-formatting, or renaming unmentioned variables.
3. **Multi-File Lockout**: Unless the user explicitly mentions multiple files, the agent is blocked from editing files outside the primary target.

---

## 📋 Example: Diff Interception

```diff
# REJECTED BY SCOPE-GUARD (Unsolicited import shuffling & adjacent rewrites):
- import { useState, useEffect } from "react";
- import { formatDate } from "@/lib/utils";
+ import { formatDate } from "@/lib/utils";
+ import { useEffect, useState } from "react";
...
- const renderBadge = () => <span>Status</span>;
+ const renderBadge = () => <span className="v2">Updated</span>;

# PERMITTED BY SCOPE-GUARD (Only the requested bug fix):
  const handleEmailUpdate = async () => {
-   if (!email) return;
+   if (!email || !email.includes("@")) return;
  };
```

---

## 🚀 Quickstart

### Claude Code
```bash
cp -r skills/scope-guard .claude/skills/
```

### Cursor
```bash
cp skills/scope-guard/SKILL.md .cursor/rules/scope-guard.mdc
```

### Antigravity
```bash
cp -r skills/scope-guard ~/.gemini/config/skills/
```
