# Dead Code & Orphaned AST Analysis Reference

During rapid feature iteration and AI-assisted refactoring, developers frequently create new components or utility functions while abandoning existing ones, leaving "zombie code" that bloats bundle sizes, misleads future coding agents, and increases maintenance costs.

---

## 1. Dead Code Taxonomy

| Classification | Definition | Detection Mechanism | Remediation |
| :--- | :--- | :--- | :--- |
| **Fully Orphaned File** | A file where inbound reference degree $d_{\text{in}}(f) = 0$, and the file is not a registered framework entrypoint. | Traverse the repository import DAG from designated entrypoints; files unvisited in the traversal are orphans. | Safe deletion after verifying lack of dynamic/reflection imports. |
| **Zombie Named Export** | A function, interface, class, or constant marked `export` that has 0 external importers and 0 internal callers. | AST symbol table analysis comparing exported tokens against project-wide import specifiers. | Remove `export` modifier (if used internally) or delete entirely. |
| **Stale Prototype File** | Scratch, test, or experimental files created during prompt sessions (e.g. `temp-fix.ts`, `test-backup.js`, `old_handler.py`). | Match against naming heuristics (`*backup*`, `*temp*`, `*old*`, `*copy*`, `*test2*`) combined with zero imports. | Immediate deletion. |
| **Dead Dependency** | A package in `package.json` or `pyproject.toml` with zero import or require statements in source code. | Diff `dependencies` list against scanned module specifiers. | Remove from package manifest and run package manager prune. |

---

## 2. Recognized Framework Entrypoints (False-Positive Defense)

Before classifying a file as an orphan, check if it matches recognized ecosystem entrypoint conventions:

| Framework | Presumed Living Entrypoints (Even with 0 direct imports) |
| :--- | :--- |
| **Next.js (App Router)** | `app/**/page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`, `middleware.ts` |
| **Next.js (Pages Router)** | `pages/**/*.tsx`, `pages/api/**/*.ts`, `_app.tsx`, `_document.tsx` |
| **Vite / SPA** | `index.html`, `src/main.tsx`, `src/index.tsx`, `vite.config.ts` |
| **Node / Backend** | `server.ts`, `index.ts`, `app.ts`, `src/bin/*.ts`, CLI bins defined in `package.json` |
| **Astro / Remix** | `src/pages/**/*.astro`, `app/routes/**/*.tsx` |
| **Testing / Tooling** | `*.test.ts`, `*.spec.ts`, `vitest.config.ts`, `playwright.config.ts`, `jest.config.js` |

---

## 3. Dynamic Import & Reflection Heuristics

Some files appear orphaned to static regex search because they are imported dynamically or through convention:

- **Dynamic Template Strings**: `import(`./locales/${lang}.json`)` $\implies$ Flag parent directory (`locales/`) as dynamic; do not delete individual JSON files without manual review.
- **Dependency Injection**: NestJS `@Module({ controllers: [UsersController] })` or Inversify decorators. Look for decorators before pruning classes.
- **Public Assets & SVGs**: SVGs or static assets referenced via `<img src="/assets/..." />` or CSS `url(...)`.

---

## 4. Pruning Safety Protocol

1. **Mark as Deprecated (Soft Pruning)**:
   - For public library exports or shared monorepo packages, apply `@deprecated` JSDoc annotation before outright removal.
2. **Atomic Deletion Commits**:
   - Never mix dead code removal with new feature implementation. Dead code removal should always live in a dedicated `refactor(cleanup)` or `chore(prune)` commit to ensure clean git bisectability.
