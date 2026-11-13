# Blast Radius Containment & Scope Guard Rules

Guidelines and validation gates for AI coding agents to ensure changes are strictly quarantined to the exact targeted component, function, or file requested by the user.

---

## 1. The "Drive-By Cleanup" Problem

Autonomous coding agents frequently suffer from "helpful overreach":
- Asked to fix a button click handler in `AuthCard.tsx`, the agent runs a linter or formatter and rewrites 80 lines of unrelated JSX.
- Asked to add a single field to a Prisma schema, the agent reorganizes 15 unrelated database models.
- Asked to adjust a CSS class, the agent updates global configuration files (`tailwind.config.js`).

**Impact**: This bloats Git pull request reviews, causes merge conflicts on team branches, obscures the actual bug fix in git blame, and introduces subtle visual regressions.

---

## 2. The Scope Boundary Contract

Before executing any file write or command, the agent must establish a deterministic **Scope Boundary**:

| Level | Definition | Permitted File Edits | Forbidden Actions |
| :--- | :--- | :--- | :--- |
| **Surgical (Level 1)** | Fix a single function, bug, or parameter. | The lines inside the designated function/block only. | Touching other functions in the same file; modifying imports not required by the fix; reformatting whitespace. |
| **Component (Level 2)** | Update or refactor a specific named component/module. | The single component file designated by the prompt. | Touching parent pages, sibling components, global styles, or barrel exports (`index.ts`). |
| **Contract (Level 3)** | Update an API signature or schema that crosses file boundaries. | The target file + immediate consumer files. | **Requires explicit user approval** before touching consumer files. |

---

## 3. Scope Boundary Enforcement Algorithm

1. **Prompt Ingestion**:
   - Extract the target noun: `file_path`, `function_name`, or `component_name`.
   - Freeze the **In-Scope Boundary**: `ALLOWED_FILES = [target_file]`.
2. **Pre-Flight Diff Inspection**:
   - Run `git diff --stat` or examine proposed tool call paths.
   - For every file in the diff:
     - If `file` is not in `ALLOWED_FILES`: **REJECT EDIT**.
     - If `file` has changes outside lines $[L_{\text{start}}, L_{\text{end}}]$ of the target function/component: **STRIP UNRELATED CHUNKS**.
3. **Cosmetic Purity Check**:
   - Discard all whitespace-only hunks, newline format changes (`CRLF` $\leftrightarrow$ `LF`), and sorted import blocks unless explicitly requested.
4. **Boundary Escalation Protocol**:
   - If an error or type mismatch requires editing a secondary file:
     - **DO NOT TOUCH THE SECOND FILE AUTOMATICALLY**.
     - Prompt the user:
       > *"The fix in `A.ts` requires updating interface `UserProfile` in `types.ts`. Please confirm if I should expand my scope to edit `types.ts`."*
