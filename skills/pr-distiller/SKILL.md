---
name: pr-distiller
description: Distills multi-file git diffs into executive risk and architecture reviews. Use when analyzing git diffs, reviewing pull requests, or preparing release changelogs.
category: code-analysis
tags:
  - code-analysis
  - git
  - pull-request
  - code-review
---

## Skill Purpose
Analyzes unified git diffs to generate executive-grade pull request summaries, categorize breaking changes and security risks, assign deterministic risk ratings, and draft conventional commit entries.

## Trigger Conditions
Activate this skill whenever:
- User provides a git diff (`git diff`, `git show`, or PR diff patch) for analysis.
- Reviewing pull requests or staging changes before merge.
- Generating release notes, audit reports, or deployment risk evaluations.
- User asks: "review this PR", "what did this diff break?", or "evaluate PR risk".

## Execution Protocol

1. **Noise Filtering**:
   - Filter out whitespace-only differences, line-ending alterations (`CRLF` vs `LF`), and pure formatting/linter changes from risk consideration.

2. **Semantic Categorization**:
   Audit the filtered hunk lines and group observations into four distinct bins:
   - **Breaking Changes**: Altered API route paths/methods, parameter type mutations, removed fields, database migration constraints, altered environment variables.
   - **Security Concerns**: Hardcoded credentials/tokens, plaintext secrets, authentication/authorization bypasses, unsafe SQL interpolation, insecure deserialization, unvalidated input handling.
   - **Logic Flaws & Regressions**: Unhandled null/nil pointers, off-by-one boundary conditions, missing error checks, race conditions.
   - **Minor Refactors**: Renamed internal variables, documentation updates, dead code deletions, non-breaking performance optimizations.

3. **Deterministic Risk Rating Scoring**:
   Calculate the composite Risk Level:
   - **CRITICAL**: Any hardcoded credential, authentication bypass, unmitigated data loss risk, or destructive database drop.
   - **HIGH**: Public API breaking changes without deprecation, database schema migrations with locking locks, unhandled major exception paths.
   - **MEDIUM**: Non-breaking internal schema alterations, new external network dependencies, complex state-machine updates.
   - **LOW**: Documentation changes, test suite additions, minor non-breaking refactors, style tweaks.

4. **Conventional Changelog Generation**:
   - Synthesize a concise Conventional Commit header (`feat:`, `fix:`, `refactor:`, `breaking:`) with a high-impact summary.

## Constraints
- **NEVER** accept diffs without scanning for embedded secrets, API keys, or backdoor bypass tokens.
- **NEVER** mark a diff containing altered API signatures or removed route parameters as `LOW` risk.
- **NEVER** hallucinate file paths or line numbers not explicitly visible in the diff hunks.
- **NEVER** include cosmetic or formatting changes in the Breaking Changes or Security categories.

## Output Contract
Respond with the standardized review template:

```markdown
### PR Executive Summary
**Overall Risk Level:** [CRITICAL | HIGH | MEDIUM | LOW]
**Impact Radius:** [Target Services / Modules impacted]

#### 🚨 Breaking Changes
- [File/Endpoint]: Description of breaking impact (or "None detected")

#### 🔒 Security & Privacy Findings
- [File/Line]: Security vulnerability description with remediation recommendation (or "None detected")

#### ⚠️ Logic & Reliability Flaws
- [File/Line]: Edge cases, unhandled errors, or potential regressions (or "None detected")

#### 📦 Changelog Entry
`<type>(<scope>): <concise description>`
```
