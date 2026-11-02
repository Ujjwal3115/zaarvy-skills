---
name: context-diet
description: Compresses source code and file context before passing to LLM reasoning. Use when ingesting files over 100 lines, preparing multi-file prompts, or pruning token bloat.
category: optimization
tags:
  - optimization
  - token-saving
  - context-compression
---

## Skill Purpose
Compresses source code and file context before LLM reasoning to maximize context window headroom while preserving 100% of structural, semantic, and executable integrity.

## Trigger Conditions
Activate this skill whenever:
- Ingesting source files exceeding 100 lines of code into conversation context.
- Aggregating multi-file prompts or preparing files for architecture reviews.
- Nearing token context budget limits or experiencing context truncation.
- User instructs to "slim context", "prune comments", or "optimize prompt tokens".

## Execution Protocol

1. **Header & License Elimination**:
   - Strip copyright notices, license headers, file headers, author blocks, and IDE annotations.

2. **Comment & Docstring Pruning**:
   - Strip multi-line docstrings (`"""..."""`, `'''...'''`, `/** ... */`, `{- ... -}`).
   - Strip cosmetic and trivial inline comments (e.g., `# Increment i by 1`, `// return result`).
   - Retain compiler/linter directives where essential for execution or linting (e.g., `# noqa`, `@ts-expect-error`, `nolint`).

3. **Import Consolidation**:
   - Collapse scattered, duplicate, or redundant import statements into canonical grouped statements.
   - Remove unused imports if deterministically detectable from the file body.

4. **Whitespace & Blank Line Normalization**:
   - Collapse consecutive blank lines to at most one empty line.
   - Trim trailing whitespace from all lines.
   - Retain standard code indentation (Python 4-space, JS 2-space, etc.).

5. **Integrity Preservation Check**:
   - Verify that all function signatures, variable names, class declarations, type annotations, control flow branches, and return contracts remain completely untouched.

6. **Audit Block Generation**:
   - Calculate or estimate token/character metrics before and after compression.
   - Append an audit footprint in the exact format:
     `[Context Diet] Before: ~X tokens | After: ~Y tokens | Saved: -Z%`

## Constraints
- **NEVER** alter public or private function signatures, parameter names, or type annotations.
- **NEVER** minify, rename, or shorten variable, function, or class names.
- **NEVER** alter executable logic, loops, conditional branches, or error handling blocks.
- **NEVER** remove security-critical validation logic or runtime assertions.

## Output Contract
Return the optimized code within standard markdown code fences, immediately followed by the standard single-line audit footprint:

```<language>
<compressed_code>
```

```
[Context Diet] Before: ~<X> tokens | After: ~<Y> tokens | Saved: -<Z>%
```
