---
name: scope-guard
description: Strictly forbids the agent from touching, "cleaning up," or refactoring files outside the exact function/component you asked it to edit.
category: guardrail
tags:
  - guardrail
  - blast-radius
  - code-containment
  - git
  - safety
---

## Skill Purpose
Strictly quarantines file and code modifications to the exact function, component, or file targeted by the user prompt, eliminating unsolicited refactoring, drive-by reformatting, and out-of-scope blast radius leaks.

## Trigger Conditions
Activate this skill whenever:
- User asks to fix a specific bug, adjust a function, or tweak an isolated component.
- Performing maintenance, small hotfixes, or single-file updates.
- Staging pull request diffs where minimal, focused change footprint is required.
- User instructs to "only touch this function", "don't reformat other files", or "keep diff minimal".

## Execution Protocol

1. **Scope Boundary Freezing**:
   - Parse the prompt to identify the exact target:
     - Target File(s): `ALLOWED_FILES` (default: strictly the files named in the instruction).
     - Target Function / Block: `[L_start, L_end]`.
   - Explicitly declare all other files, sibling components, utility scripts, and barrel exports (`index.ts`) as **Strictly Out-of-Scope**.

2. **Unsolicited Refactor Detection**:
   - Inspect proposed edits before applying:
     - Discard cosmetic import reordering across the file.
     - Discard variable renaming or type updates in unmentioned helper functions.
     - Discard linter or prettier-driven whitespace reformatting outside the target block.

3. **Blast Radius Gate (Secondary File Lock)**:
   - If resolving the task genuinely requires updating a secondary file (e.g., an imported interface or database migration):
     - **HALT**. Do not edit the secondary file unilaterally.
     - Formulate an explicit Scope Escalation Request asking the user for confirmation:
       `"Updating <target_file> requires modifying interface <interface_name> in <secondary_file>. Confirm scope expansion before proceeding."`

4. **Diff Verification**:
   - Run a diff check against the initial working copy.
   - Verify that 100% of modified lines reside within the declared `ALLOWED_FILES` and within the designated block boundary.

## Constraints
- **NEVER** edit files that were not explicitly named in the prompt or approved in a scope escalation.
- **NEVER** reformat, reorder, or organize imports in untouched files or unrelated lines.
- **NEVER** touch global configuration files (`tailwind.config.js`, `tsconfig.json`, `package.json`) during a component-level fix unless explicitly instructed.
- **NEVER** rename exports or modify public function signatures without explicit user consent.

## Output Contract
Respond with the surgical diff or code replacement, accompanied by a Scope Audit Receipt:

```markdown
### Scope Guard Audit
**Target File:** `path/to/target.tsx`  
**Target Scope:** `function handleAction()` (Lines 42–48)  
**Blast Radius:** 1 file, 2 lines modified (0 unrelated files touched)  
**Unsolicited Cleanups:** None (Strict containment enforced)
```
