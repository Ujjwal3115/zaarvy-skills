# Test Fixture: Sample 2-Strike Thrashing Incident & Loop Breaker Intervention

---

### Scenario: Race Condition in Token Refresh Hook

**Bug Report**: `useAuth` hook intermittently triggers 401 Unauthorized during concurrent API calls.

---

#### ❌ Turn 1 (Attempt 1 - Failed)
- **Agent Action**: Edited `useAuth.ts` to add a 100ms `setTimeout` before refreshing the token.
- **Test Result**: `FAILED: ConcurrentRequestsTest - expected 200 OK, got 401 Unauthorized (Race condition persisted)`
- **Strike Count**: 1

---

#### ❌ Turn 2 (Attempt 2 - Failed)
- **Agent Action**: Increased `setTimeout` to 300ms and added `isRefreshing` local state flag.
- **Test Result**: `FAILED: ConcurrentRequestsTest - expected 200 OK, got 401 Unauthorized (Timeout exceeded, deadlock occurred)`
- **Strike Count**: 2 (THRESHOLD MET)

---

#### 🛡️ Turn 3: Loop Breaker Enforced (Code Edit Lockout)

```markdown
### 🛑 Loop Breaker: Diagnostic Lockout (Turn 3)

1. **Flawed Root Assumption**:
   - I assumed that delaying subsequent requests with a timeout would allow the primary refresh call to complete. In reality, multiple concurrent requests independently trigger the refresh logic simultaneously because the promise is not shared.

2. **Mechanism of Failure**:
   - Both attempts treated the issue as a timing delay rather than a singleton promise-sharing problem. `setTimeout` only exacerbated race conditions under load.

3. **Alternative Architectural Thesis**:
   - Instead of timeouts or boolean flags, store the active `refreshPromise` in a module-level variable. All concurrent requests awaiting a token refresh must attach to the exact same ongoing promise (`refreshPromise ||= fetchNewToken()`).

4. **Proposed Minimal Verification**:
   - Inspect `apiClient.ts` to verify whether Axios/Fetch interceptors support singleton promise attachment before writing code.
```

---

#### ✅ Resolution (Post-Intervention)
User approved the singleton promise approach. The agent executed the single targeted change, and all concurrent tests passed immediately with 0 retries.
