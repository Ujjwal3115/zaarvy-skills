# env-auditor

> **Cross-checks runtime `process.env` and `os.getenv` calls against `.env.example` to prevent deployment crashes and secret leaks.**

[![Category: DevOps](https://img.shields.io/badge/Category-DevOps-orange.svg)](../../README.md)
[![Standard: Anthropic Agent Skills](https://img.shields.io/badge/Standard-Anthropic%20Agent%20Skills-7C3AED.svg)](https://github.com/anthropics)

---

## ⚡ The Problem: Configuration Drift

During feature development, AI agents frequently introduce new environment variables into backend code without updating `.env.example`:
- You deploy to Vercel, Railway, or AWS $\implies$ runtime crashes with `undefined` errors.
- Agents accidentally prefix private backend secrets with `NEXT_PUBLIC_` or `VITE_`, leaking database or payment keys into browser bundles.
- Stale variables linger in `.env.example` years after their code was deleted.

---

## 🛠️ The Fix: Multi-Language Env Auditing

`env-auditor` scans source code across Node.js, TypeScript, Python, Go, Rust, and Docker, cross-checking every variable against `.env.example`:

1. **Catches Missing Variables**: Flags any variable referenced in code that is omitted from `.env.example`.
2. **Detects Browser Secret Leaks**: Alerts if server-only keys (`STRIPE_SECRET_KEY`, `DATABASE_URL`) use public client prefixes.
3. **Identifies Naming Typos**: Finds near-duplicate variables (e.g. `REDIS_CACHE_URL` in TS vs `REDIS_URL` in Python).
4. **Prunes Zombie Variables**: Highlights `.env.example` entries with zero references anywhere in the repository.

---

## 📋 Sample Audit Report

```markdown
### 🛡️ Environment Variable Audit Report

- 🛑 Missing from .env.example:
  • STRIPE_WEBHOOK_SECRET (src/server.ts:8) — Causes production 500 on deploy
  • AWS_S3_BUCKET (src/worker.py:7) — Causes worker crash
- ⚠️ Client Security Leak:
  • NEXT_PUBLIC_STRIPE_SECRET_KEY (src/client.tsx:7) — Secret baked into user's browser bundle!
- ℹ️ Zombie Variable:
  • ZOMBIE_MAILGUN_KEY (line 12 of .env.example) — 0 occurrences in codebase
```

---

## 🚀 Quickstart

### Claude Code
```bash
cp -r skills/env-auditor .claude/skills/
```

### Cursor
```bash
cp skills/env-auditor/SKILL.md .cursor/rules/env-auditor.mdc
```

### Antigravity
```bash
cp -r skills/env-auditor ~/.gemini/config/skills/
```
