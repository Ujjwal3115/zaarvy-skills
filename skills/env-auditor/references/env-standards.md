# Environment Variable Standards & Audit Reference

This reference outlines cross-language conventions, syntax patterns, security rules, and audit heuristics for validating environment variables across modern codebases.

---

## 1. Cross-Language Variable Extraction Patterns

When auditing codebases, search for environment variable calls across backend, frontend, worker, and infrastructure files using the following syntax patterns:

| Ecosystem / Framework | Access Syntax | Client-Exposed Prefix |
| :--- | :--- | :--- |
| **Node.js / Express / Fastify** | `process.env.KEY`<br>`process.env['KEY']`<br>`process.env["KEY"]`<br>`const { KEY } = process.env` | N/A (Server-only) |
| **Next.js** | `process.env.KEY` (Server)<br>`process.env.NEXT_PUBLIC_KEY` (Client) | `NEXT_PUBLIC_*` |
| **Vite / Vue / SvelteKit** | `import.meta.env.VITE_KEY` (Client/SSR)<br>`process.env.KEY` | `VITE_*` |
| **Create React App / Webpack** | `process.env.REACT_APP_KEY` | `REACT_APP_*` |
| **Nuxt 3** | `useRuntimeConfig().public.KEY`<br>`useRuntimeConfig().KEY` | `public.*` |
| **Python Standard** | `os.getenv("KEY")`<br>`os.environ.get("KEY")`<br>`os.environ["KEY"]` | N/A (Server-only) |
| **Python Pydantic** | `class Settings(BaseSettings): KEY: str` | N/A |
| **Go Standard** | `os.Getenv("KEY")`<br>`os.LookupEnv("KEY")` | N/A |
| **Rust Standard** | `std::env::var("KEY")`<br>`env::var("KEY")`<br>`dotenv::var("KEY")` | N/A |
| **Docker / Compose** | `${KEY}`<br>`${KEY:-default}`<br>`ENV KEY=val`<br>`ARG KEY` | N/A |

---

## 2. Audit Severity Matrix

| Severity | Issue Type | Definition | Consequence |
| :--- | :--- | :--- | :--- |
| 🛑 **CRITICAL** | **Missing from `.env.example`** | Variable is actively accessed in code but completely omitted from `.env.example` / `.env.template`. | New developers cannot run the project; CI/CD and production container deployments fail with unhandled exceptions. |
| 🛑 **CRITICAL** | **Committed Secret Leak** | `.env.example` contains actual API keys, private keys, or credentials (e.g. `sk_live_...`, `ghp_...`, `BEGIN PRIVATE KEY`). | Immediate security compromise requiring token revocation. |
| ⚠️ **HIGH** | **Client Secret Exposure** | Server secrets (e.g. `DATABASE_URL`, `STRIPE_SECRET_KEY`) prefixed with client-exposed prefixes (`NEXT_PUBLIC_`, `VITE_`). | Secret gets baked into static JavaScript bundles sent to the user's browser. |
| ⚠️ **HIGH** | **Inconsistent Naming / Typos** | Slightly different names referencing the same concept (e.g. `DATABASE_URL` in backend vs `DATABASE_URI` in migrations, or `REDIS_PORT` vs `CACHE_PORT`). | Split configuration where updating one variable fails to configure the other component. |
| ℹ️ **MEDIUM** | **Zombie / Dead Variable** | Variable defined in `.env.example` but zero references exist anywhere in the repository. | Clutters configuration, creates developer confusion, and slows down onboarding. |
| ℹ️ **LOW** | **Missing Default / Fallback** | Unvalidated `process.env.FOO` or `os.getenv("FOO")` accessed in non-critical path without fallback or type guard. | Can produce unexpected `undefined` or `None` string values. |

---

## 3. Safe Placeholder Standards for `.env.example`

In committed `.env.example` or `.env.template` files, always enforce dummy placeholders that indicate format without exposing credentials:

| Variable Purpose | Recommended Placeholder | Prohibited Pattern |
| :--- | :--- | :--- |
| **Database Connection** | `postgresql://user:password@localhost:5432/dbname` | `postgresql://admin:ProdPass123@db.prod.internal:5432/db` |
| **Third-Party API Key** | `your_stripe_secret_key_here`<br>`sk_test_placeholder` | `sk_live_51Abc123...` |
| **JWT Secret** | `your_jwt_secret_min_32_chars` | `d41d8cd98f00b204e9800998ecf8427e` |
| **Port / Numeric** | `3000` or `8080` | None |
| **Feature Flag** | `true` or `false` | None |

---

## 4. Remediation Checklist

1. **Synchronize `.env.example`**:
   - For every variable identified in code, add a commented entry into `.env.example` with description and safe placeholder.
2. **Remove Dead Variables**:
   - Purge variables from `.env.example` that no longer exist in any active service or migration script.
3. **Quarantine Client Variables**:
   - Ensure variables with `NEXT_PUBLIC_` or `VITE_` contain strictly public assets (e.g. `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_ANALYTICS_ID`). Never private API keys.
4. **Implement Centralized Validation Schemas**:
   - Recommend adopting runtime validators like `@t3-oss/env-nextjs`, `zod`, or Python `pydantic-settings` to fail fast at startup rather than throwing deep inside business logic.
