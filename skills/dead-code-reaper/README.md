# dead-code-reaper

> **Traverses import graphs from framework entrypoints to discover orphaned components, zombie exports, and stale AI artifacts.**

[![Category: Refactoring](https://img.shields.io/badge/Category-Refactoring-purple.svg)](../../README.md)
[![Standard: Anthropic Agent Skills](https://img.shields.io/badge/Standard-Anthropic%20Agent%20Skills-7C3AED.svg)](https://github.com/anthropics)

---

## ⚡ The Problem: Zombie Code Bloat

Fast-paced AI refactoring leaves behind tons of abandoned code:
- You ask an agent to replace a Modal with an inline sheet $\implies$ the old `Modal.tsx` file sits abandoned in `components/` forever.
- Utility functions left behind in `utils/` with zero callers.
- Temporary scratchpad files (`temp-fix.ts`, `old-helper.js`) created during debugging turns.
- Result: Bloated bundles, slower builds, and future AI agents getting confused by obsolete code.

---

## 🛠️ The Fix: Dependency Graph Traversal

`dead-code-reaper` constructs a directed dependency graph $G = (V, E)$ originating from your real application entrypoints (`main.tsx`, `page.tsx`, `server.ts`):

1. **Fully Orphaned Files**: Finds files with zero inbound imports ($d_{\text{in}} = 0$) that are safe to delete.
2. **Zombie Named Exports**: Identifies functions marked `export` that are never imported or called internally.
3. **Stale Prototype Artifacts**: Flags temporary files matching AI scratchpad heuristics.
4. **Zero-False-Positive Shield**: Respects Next.js App Router conventions (`loading.tsx`, `error.tsx`, `route.ts`), dynamic imports, and CLI bins.

---

## 📋 Sample Pruning Report

```markdown
### 🧹 Dead Code & Orphaned Artifacts Report

- Files Scanned: 48
- Orphaned Files Detected: 2 (Safe to remove)
  • `src/components/LegacyModal.tsx` (38 lines) — 0 inbound imports
  • `src/helpers/stale-ai-prototype.ts` (22 lines) — Temporary scratchpad
- Zombie Exports: 1
  • `unusedDeadCalculation` in `src/utils/math.ts` — 0 callers

Safe Deletion Command:
$ rm src/components/LegacyModal.tsx src/helpers/stale-ai-prototype.ts
```

---

## 🚀 Quickstart

### Claude Code
```bash
cp -r skills/dead-code-reaper .claude/skills/
```

### Cursor
```bash
cp skills/dead-code-reaper/SKILL.md .cursor/rules/dead-code-reaper.mdc
```

### Antigravity
```bash
cp -r skills/dead-code-reaper ~/.gemini/config/skills/
```
