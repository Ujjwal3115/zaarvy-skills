# Context Diet: Token Compression Benchmarks & Reference Rules

This reference outlines expected token compression rates, pruning algorithms, and language-specific rules applied by `context-diet`.

---

## 1. Expected Compression Ratios

| File Type / Language | Typical Redundancy Profile | Expected Token Reduction |
| :--- | :--- | :--- |
| **Python** (`.py`) | Docstrings, copyright headers, multi-line imports, loose blank lines | **45% – 65%** |
| **TypeScript / JavaScript** (`.ts`, `.tsx`, `.js`) | JSDoc blocks, verbose type annotations on internal helpers, imports | **40% – 60%** |
| **Go** (`.go`) | Package doc comments, boilerplate error checks, verbose struct tags | **30% – 50%** |
| **SQL** (`.sql`) | Inline explanatory comments, multi-line indentation, commented debugging queries | **50% – 70%** |
| **JSON / Config** (`.json`, `.yaml`) | Indentation whitespace, verbose mock objects, redundant defaults | **35% – 55%** |

---

## 2. Token Estimation Heuristics

For audit blocks when exact BPE tokenizers are unavailable in-context:
- **Rule of Thumb**: ~4 characters per token for English text and source code.
- **Lines of Code**: Code stripped of comments and extra whitespace averages 7–9 tokens per line (compared to 15–20 tokens for commented code).

---

## 3. Preservation Invariants (Zero-Loss Guarantee)

Under no circumstances may `context-diet` remove or alter:
1. **Public/Exported Type Signatures**: Class definitions, function signatures, TypeScript interfaces, Python type annotations (`def func(x: int) -> str:`).
2. **Control Flow & Branching**: Every `if`, `else`, `switch`, `match`, loop, and recursive call must remain intact.
3. **Variable & Parameter Names**: Never rename identifiers or minify variable names.
4. **Behavioral Constants & Enums**: Never alter numeric, string, or boolean literals.
5. **Directives & Pragmas**: Keep compiler/linter directives if required for execution (e.g., `# noqa`, `@ts-expect-error`).

