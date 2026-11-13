---
name: n-plus-one-hunter
description: Scans ORM loops across Prisma, SQLAlchemy, Mongoose, Django, and TypeORM to identify hidden N+1 database queries, missing eager loading, and unindexed relation bottlenecks.
category: performance
tags:
  - performance
  - database
  - orm
  - n-plus-one
  - query-optimization
  - indexing
---

## Skill Purpose
Identifies catastrophic database performance degradation by detecting $N+1$ query loops (where 1 query retrieves $N$ parent records, followed by $N$ secondary queries in loops) across modern ORMs (Prisma, SQLAlchemy, Mongoose, Django, TypeORM, GORM), providing refactored eager loading syntax and missing foreign key index recommendations.

## Trigger Conditions
Activate this skill whenever:
- Reviewing backend routes, GraphQL resolvers, REST controllers, or API endpoint handlers.
- Diagnosing high database latency, connection pool exhaustion, or CPU spikes under load.
- Adding or modifying ORM queries that traverse relationships (one-to-many, many-to-many).
- Performing code reviews on database interaction layers.
- User instructs to "find N+1 queries", "optimize database queries", "audit ORM performance", or "check query loops".

## Execution Protocol

1. **AST / Pattern Loop Scanning**:
   - Locate iterative control flow blocks:
     - `for (const x of items)`, `for x in items:`
     - `items.map(async ...)`, `Promise.all(items.map(...))`
     - `forEach`, `while`, list comprehensions
   - Check if database access calls exist within the loop body:
     - **Prisma**: `prisma.<model>.find...`, `prisma.<model>.count`
     - **SQLAlchemy**: `session.query(...)`, lazy property access (`user.posts`)
     - **Mongoose**: `Model.findById(...)`, `Model.findOne(...)`
     - **Django**: Accessing reverse foreign keys or many-to-many attributes inside a template or loop
     - **TypeORM / GORM**: Repo find calls inside iteration

2. **Quantify Query Explosion ($Q_{\text{complexity}}$)**:
   - Calculate worst-case query count: $Q = 1 + N \times k$, where $N$ is parent record count and $k$ is number of nested relation queries per iteration.
   - Flag as **CRITICAL** if $N$ is unbounded (no `take` or `limit` on parent query).
   - Flag as **HIGH** if inside paginated requests where $N \ge 20$.

3. **Formulate Eager Loading & Batching Strategy**:
   - **Prisma**: Transform loop into top-level `include: { relation: true }` or single batched query with `where: { parentId: { in: parentIds } }`.
   - **SQLAlchemy**: Apply `options(selectinload(Model.relation))` or `joinedload(Model.relation)`.
   - **Mongoose**: Apply `.populate('relation')` or aggregate `$lookup` pipeline.
   - **Django**: Apply `.select_related()` (for ForeignKey/OneToOne) or `.prefetch_related()` (for ManyToMany).

4. **Schema Index Verification**:
   - Check schema definition files (`schema.prisma`, `models.py`, `migrations/`) for foreign key indices.
   - If the relational foreign key column lacks an explicit index, output a migration snippet adding a B-Tree index on the joining column.

## Constraints
- **NEVER** replace an N+1 loop with in-memory array filtering after fetching all table records without filtering (e.g. avoid `findMany()` without a `where` clause).
- **NEVER** use `joinedload` on large one-to-many collections if it creates a massive Cartesian product; prefer `selectinload` or batched subqueries.
- **NEVER** introduce schema changes without considering composite indices if filtering and sorting are applied simultaneously.
- **NEVER** touch unrelated endpoint logic outside the query bottleneck.

## Output Contract
Respond with the standard Query Optimization Diagnostic:

```markdown
### ⚡ N+1 Query Audit & Bottleneck Report

#### 1. Query Complexity Summary
- **Vulnerable Location:** `src/path/to/service.ts:L45-L60`
- **ORM / Framework:** Prisma | SQLAlchemy | Mongoose | Django
- **Theoretical Query Count:** $1 + N$ queries (e.g. 50 items $\implies$ 51 roundtrips)
- **Estimated Latency Impact:** $51 \times 15\text{ms} = 765\text{ms}$ network overhead

#### 2. Root Cause Analysis
- [Explain the loop construct triggering sequential or parallel roundtrips]

#### 3. Optimized Refactoring
```typescript
// BEFORE: Leaky N+1
const results = await Promise.all(users.map(u => prisma.post.findMany({ where: { userId: u.id } })));

// AFTER: 1 Eager-Loaded Query
const results = await prisma.user.findMany({
  include: { posts: true }
});
```

#### 4. Required Schema Indexing
```prisma
model Post {
  userId String
  @@index([userId]) // Prevents full-table scans on eager load
}
```
```
