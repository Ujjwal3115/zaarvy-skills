# Loop Breaker & Anti-Thrashing Diagnostic Checklist

A deterministic circuit-breaker protocol for AI coding agents to stop repetitive code thrashing, endless trial-and-error cycles, and compounding regressions.

---

## 1. The Agent Thrashing Problem

When coding agents encounter an unfamiliar error (e.g. an asynchronous race condition, a subtle TypeScript type inference conflict, or an off-by-one boundary), they often fall into a **Thrashing Loop**:
- **Turn 1**: Tries Fix A (alters line 15). Test fails.
- **Turn 2**: Tries a slight variation of Fix A (alters line 16). Test fails again with the same error.
- **Turn 3**: Tries another variation of Fix A, now adding console logs and breaking adjacent logic.
- **Turn 4+**: Agent begins thrashing, editing random files, introducing hallucinations, and wasting context tokens.

---

## 2. The Two-Strike Circuit Breaker Rule

```
┌─────────────────────────────────────────────────────────────┐
│ ATTEMPT 1: Initial hypothesis fails                         │
│ └── Strike Count = 1                                        │
│     └── Permitted to refine hypothesis and retry fix.       │
├─────────────────────────────────────────────────────────────┤
│ ATTEMPT 2: Second consecutive attempt fails                 │
│ └── Strike Count = 2 (CRITICAL THRESHOLD REACHED)           │
│     └── ⛔ CODE-EDITING TOOLS ARE STRICTLY LOCKED OUT       │
├─────────────────────────────────────────────────────────────┤
│ TURN 3: MANDATORY DIAGNOSTIC REFLECTION                     │
│ └── Agent MUST NOT execute edit_file or write_file          │
│ └── Agent MUST complete the 4-Point Root Cause Diagnostic   │
│ └── Awaits user confirmation or presents novel hypothesis   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. The 4-Point Root Cause Diagnostic Template

On Turn 3 (after two consecutive failures), the agent must output this exact audit block before touching any code:

```markdown
### 🛑 Loop Breaker: Diagnostic Lockout (Turn 3)

1. **Flawed Root Assumption**:
   - What core belief guided the last 2 failed attempts that is proven incorrect?
   - *(e.g. "I assumed the user ID was passed as an integer route param, but the middleware parses it as a string UUID.")*

2. **Mechanism of Failure**:
   - Exact runtime/type error and why both prior attempts triggered it.

3. **Alternative Architectural Thesis**:
   - What completely different angle explains the behavior?
   - *(e.g. "The issue is not inside the controller logic; the database migration hasn't run yet.")*

4. **Proposed Minimal Verification**:
   - What targeted read/check will prove this thesis before writing code?
```

---

## 4. Anti-Patterns That Trigger Instant Lockout

The agent must lock itself out immediately if:
1. It proposes reverting to a code state that already failed on a prior turn.
2. It changes variable names without changing algorithmic control flow.
3. It blames the test harness without reading the test assertion logic.
4. It catches an exception and silences it (`catch (e) {}` or `except: pass`) to make the test artificially pass.
