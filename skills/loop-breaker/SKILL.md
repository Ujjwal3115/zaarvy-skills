---
name: loop-breaker
description: If an agent fails a fix twice, it is blocked from editing code on turn 3 until it explains the broken root assumption and proposes a different approach.
category: guardrail
tags:
  - guardrail
  - debugging
  - agent-behavior
  - anti-thrashing
  - diagnostics
---

## Skill Purpose
Prevents repetitive code thrashing and compounding errors by strictly locking out code-modifying tools on Turn 3 after two consecutive failed attempts, requiring the agent to diagnose its broken root assumption and present a fundamentally different thesis before touching code again.

## Trigger Conditions
Activate this skill whenever:
- An automated test, linter, or compiler fails after a code modification attempt.
- The same error message or regression persists across two consecutive turns.
- Debugging complex race conditions, state synchronization bugs, or elusive logical regressions.
- User instructs to "stop thrashing", "re-think the problem", or "break the debugging loop".

## Execution Protocol

1. **Strike Tracking**:
   - Maintain an internal counter $C_{\text{fail}}$ of consecutive failed fixes targeting the same issue.
   - **Strike 1**: Acknowledge failure, refine hypothesis, attempt second surgical adjustment.
   - **Strike 2**: $C_{\text{fail}} = 2 \implies$ **TRIGGER CIRCUIT BREAKER LOCKOUT**.

2. **Turn-3 Code-Edit Lockout**:
   - On the turn immediately following the second failure, the agent is **STRICTLY FORBIDDEN** from invoking `write_file`, `edit_file`, or running modifying terminal commands.
   - Read-only tools (`read_file`, search) remain permitted to inspect logs, contracts, or upstream data.

3. **Mandatory 4-Point Root Cause Diagnostic**:
   - The agent must pause and output the standard Diagnostic Receipt:
     1. **Flawed Root Assumption**: The explicit belief that guided the first two attempts and is now proven incorrect.
     2. **Mechanism of Failure**: Why both attempts failed to resolve the runtime or logic error.
     3. **Alternative Architectural Thesis**: A fundamentally different explanation of the issue (e.g. state management vs race condition, client vs backend).
     4. **Proposed Minimal Experiment**: A specific check or question to the user to validate the new thesis *before* editing code.

4. **Resumption of Edits**:
   - Only after presenting the alternative thesis and receiving user confirmation (or verifying the read-only assumption) may code-editing tools be unlocked.

## Constraints
- **NEVER** call `edit_file` or `write_file` on Turn 3 after two consecutive failed attempts.
- **NEVER** retry minor variations of a failed fix (e.g. slightly increasing timeouts, renaming variables, shuffling lines).
- **NEVER** catch and silence errors (`catch (e) {}`, `except: pass`) merely to make an assertion pass.
- **NEVER** blame the testing framework or build tool without inspecting the underlying assertion logic.

## Output Contract
When the two-strike threshold is met, respond with the mandatory Diagnostic Lockout template:

```markdown
### 🛑 Loop Breaker: Diagnostic Lockout (Turn 3)
**Consecutive Failures:** 2  
**Target File / Area:** `path/to/buggy_file.ts`

#### 1. Flawed Root Assumption
- [Explain the incorrect premise behind attempts 1 & 2]

#### 2. Mechanism of Failure
- [Explain exact error trace and why previous edits failed]

#### 3. Alternative Architectural Thesis
- [Present a fundamentally different root cause explanation]

#### 4. Proposed Validation Next Step
- [Read-only check or confirmation requested from the user before resuming edits]
```
