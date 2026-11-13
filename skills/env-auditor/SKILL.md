---
name: env-auditor
description: Cross-checks process.env, os.getenv, and configuration calls across the repository against .env.example to catch missing, mismatched, or leaked variables before deployment.
category: devops
tags:
  - devops
  - env
  - configuration
  - security
  - deployment
---

## Skill Purpose
Prevents deployment failures, runtime crashes, and secret leaks by systematically extracting all environment variable calls across project source files (Node.js, TypeScript, Python, Go, Rust, Docker) and cross-checking them against `.env.example` templates, identifying missing keys, zombie entries, typos, and insecure client exposures.

## Trigger Conditions
Activate this skill whenever:
- Preparing a repository or feature branch for deployment, release, or pull request merge.
- Modifying backend configurations, external integrations, or environment settings.
- Adding new third-party APIs (e.g. Stripe, OpenAI, Redis, AWS S3, SendGrid).
- Onboarding developers or verifying local development reproduction.
- User instructs to "check env vars", "audit .env", "find missing environment variables", or "verify config".

## Execution Protocol

1. **Locate Environment Templates**:
   - Find committed template files: `.env.example`, `.env.template`, `.env.sample`, or `.env.defaults`.
   - Parse all declared variable keys into a set $E_{\text{template}}$.
   - Verify that `.env` itself is properly ignored in `.gitignore`.

2. **Multi-Language AST/Regex Source Extraction**:
   - Recursively scan application source directories (`src/`, `lib/`, `app/`, `server/`, `services/`, `workers/`, `cmd/`) excluding `node_modules/`, `dist/`, `.git/`, and test mock directories.
   - Extract variable access tokens using language-specific patterns:
     - **Node / TypeScript**: `process\.env\.([A-Z0-9_]+)`, `process\.env\[['"]([A-Z0-9_]+)['"]\]`, `import\.meta\.env\.([A-Z0-9_]+)`
     - **Python**: `os\.getenv\(['"]([A-Z0-9_]+)['"]\)`, `os\.environ\.get\(['"]([A-Z0-9_]+)['"]\)`, `os\.environ\[['"]([A-Z0-9_]+)['"]\]`
     - **Go**: `os\.Getenv\(['"]([A-Z0-9_]+)['"]\)`, `os\.LookupEnv\(['"]([A-Z0-9_]+)['"]\)`
     - **Rust**: `env::var\(['"]([A-Z0-9_]+)['"]\)`, `std::env::var\(['"]([A-Z0-9_]+)['"]\)`
     - **Docker / Infra**: `\$\{([A-Z0-9_]+)(?::-.*?)?\}`, `ENV\s+([A-Z0-9_]+)=`
   - Store active code variables in a set $E_{\text{code}}$ tagged with file paths and line numbers.

3. **Cross-Check & Discrepancy Classification**:
   - **Missing from Template ($E_{\text{code}} \setminus E_{\text{template}}$)**: Variables consumed by application code that are absent from `.env.example`. (Severity: **CRITICAL**).
   - **Zombie / Dead Variables ($E_{\text{template}} \setminus E_{\text{code}}$)**: Variables declared in `.env.example` that are never referenced anywhere in code. (Severity: **MEDIUM**).
   - **Client-Side Secret Exposure**: Variables prefixed with client tags (`NEXT_PUBLIC_`, `VITE_`, `REACT_APP_`) containing sensitive terms (`SECRET`, `KEY`, `PASSWORD`, `PRIVATE`, `TOKEN`). (Severity: **HIGH**).
   - **Naming Inconsistencies & Typos**: Detect near-duplicate keys across files (e.g. `REDIS_CACHE_URL` in TypeScript vs `REDIS_URL` in Python; `DATABASE_URI` vs `DATABASE_URL`). (Severity: **HIGH**).
   - **Committed Real Secrets**: Ensure `.env.example` values contain only dummy placeholders and do not leak live credentials. (Severity: **CRITICAL**).

4. **Remediation Plan**:
   - Provide an updated snippet to append to `.env.example` with safe, descriptive placeholder values.
   - Highlight any dead variables ready to be deprecated.
   - Recommend runtime validation schemas (e.g. Zod or Pydantic Settings) if unvalidated raw calls are detected.

## Constraints
- **NEVER** expose, print, or log real production secrets or active `.env` file credentials in reports.
- **NEVER** recommend hardcoding credentials or default fallbacks directly in source code for sensitive keys.
- **NEVER** ignore client prefix rules (e.g. exposing server-only database URLs to Next.js or Vite client bundles).
- **NEVER** delete variables from `.env.example` without verifying they aren't used by deployment infrastructure or CI scripts.

## Output Contract
Respond with the standard Environment Variable Audit Report:

```markdown
### 🛡️ Environment Variable Audit Report

#### 1. Summary Matrix
| Category | Count | Status |
| :--- | :--- | :--- |
| **Active Code References** | `<total_code_vars>` | Analyzed |
| **Template Declarations** | `<total_template_vars>` | `.env.example` |
| **Missing in Template** | `<missing_count>` | 🛑 Action Required |
| **Zombie / Unused in Code** | `<zombie_count>` | ℹ️ Review |
| **Security Violations** | `<security_count>` | ⚠️ Immediate Fix |

#### 2. Discrepancy Findings
- 🛑 **Missing from `.env.example`**:
  - `VAR_NAME` (found in `src/path/to/file.ts#L42`) — *Impact: deployment crash*
- ⚠️ **Client Exposure / Security Violations**:
  - `NEXT_PUBLIC_STRIPE_SECRET_KEY` (found in `src/client.tsx#L7`) — *Violation: secret key prefixed for client bundle*
- ⚠️ **Naming Inconsistencies / Near-Matches**:
  - `REDIS_URL` (`worker.py`) vs `REDIS_CACHE_URL` (`server.ts`)
- ℹ️ **Zombie / Dead Variables**:
  - `LEGACY_UNUSED_VAR` (declared in `.env.example` line 12, never referenced in code)

#### 3. Recommended `.env.example` Patch
\`\`\`bash
# Add these missing variables to .env.example
NEW_VAR_1=placeholder_description
NEW_VAR_2=http://localhost:6379
\`\`\`
```
