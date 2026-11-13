---
name: dead-code-reaper
description: Identifies orphaned components, unused exports, stale prototypes, and abandoned helper files left behind after heavy AI refactors or fast iterations.
category: refactoring
tags:
  - refactoring
  - dead-code
  - cleanup
  - ast
  - maintenance
  - codebase-hygiene
---

## Skill Purpose
Purges repository bloat and eliminates maintenance hazards by traversing import graphs from recognized framework entrypoints to discover orphaned files ($d_{\text{in}} = 0$), zombie named exports, abandoned scratchpad files, and unused package dependencies left behind after iterative AI modifications.

## Trigger Conditions
Activate this skill whenever:
- Completing a major architectural refactoring, component rewrite, or library migration.
- Codebase bloat, sluggish build times, or bloated bundle size warnings occur.
- Preparing a repository for release, open-sourcing, or technical debt remediation.
- Investigating obsolete files that may confuse future AI coding agents.
- User instructs to "find dead code", "clean up unused files", "reap zombies", or "prune orphaned exports".

## Execution Protocol

1. **Establish Living Entrypoints ($V_{\text{entry}}$)**:
   - Identify active root files based on ecosystem:
     - Next.js: `app/**/page.tsx`, `layout.tsx`, `route.ts`, `pages/**/*.tsx`
     - Vite / SPA: `index.html`, `src/main.tsx`, `src/index.tsx`
     - Backend: `server.ts`, `app.ts`, `index.ts`, `cmd/**/*.go`, `main.py`
     - Testing: `**/*.test.ts`, `**/*.spec.ts`

2. **Construct Inbound Reference Graph**:
   - Recursively parse all import / export specifiers across the codebase:
     - `import ... from '...'`
     - `export { ... } from '...'`
     - `require('...')`, `import('...')`
     - Python: `from ... import ...`, `import ...`
     - Go: `import "..."`
   - Build a directed dependency graph $G = (V, E)$.

3. **Categorize Dead Code Artifacts**:
   - **Orphaned Source Files**: Non-entrypoint files with zero inbound edges ($d_{\text{in}}(f) = 0$).
   - **Zombie Named Exports**: Exported functions, types, interfaces, or constants in active files that are never referenced in any other file and never called locally.
   - **Stale Prototype Scaffolds**: Files containing temporary markers (`temp`, `scratch`, `backup`, `old_`, `draft`) with zero active references.
   - **Unused Dependencies**: Manifest entries in `package.json` or `pyproject.toml` with zero matching import specifiers.

4. **Verify Dynamic Exclusions**:
   - Exclude files loaded via dynamic string templates (e.g. i18n locales, CMS plugins).
   - Exclude framework metadata (e.g. `robots.txt`, `favicon.ico`, `sitemap.ts`).
   - Check for dependency injection or decorator-based consumption (NestJS, Inversify).

5. **Formulate Safe Remediation Plan**:
   - Generate a prioritized audit table detailing each candidate file or symbol with confidence rating and estimated bundle/line savings.
   - Present specific deletion commands or code patch snippets.

## Constraints
- **NEVER** delete files automatically without providing an explicit list and awaiting user confirmation.
- **NEVER** classify framework convention files (Next.js `loading.tsx`, `error.tsx`, `middleware.ts`, `layout.tsx`) as dead code even if unreferenced by other source files.
- **NEVER** remove exported symbols from public-facing library packages (`dist`, `index.ts` in published npm libraries) without checking public API contracts.
- **NEVER** mix dead code deletion with feature logic in the same commit.

## Output Contract
Respond with the standard Dead Code Audit Report:

```markdown
### 🧹 Dead Code & Orphaned Artifacts Report

#### 1. Audit Summary
- **Files Scanned:** `<total_files>`
- **Orphaned Files Detected:** `<orphan_count>`
- **Zombie Exports Detected:** `<zombie_export_count>`
- **Recoverable Lines of Code:** `<approx_lines>`

#### 2. Fully Orphaned Files (Zero Inbound Imports)
| File Path | Estimated Lines | Reason | Safe to Delete? |
| :--- | :--- | :--- | :--- |
| `src/components/OrphanedModal.tsx` | 38 lines | Unreferenced component after dialog rewrite | ✅ Yes |
| `src/helpers/stale-ai-prototype.ts` | 24 lines | Temporary AI scratchpad artifact | ✅ Yes |

#### 3. Zombie Named Exports (In Living Files)
- **`src/utils/math.ts`**:
  - `unusedDeadCalculation` (Lines 14-16) — *Exported but never imported or called internally.*

#### 4. Safe Remediation Instructions
To remove verified orphan files:
\`\`\`bash
rm src/components/OrphanedModal.tsx
rm src/helpers/stale-ai-prototype.ts
\`\`\`
```
