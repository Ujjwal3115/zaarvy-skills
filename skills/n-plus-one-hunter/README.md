# n-plus-one-hunter

> **Scans ORM query loops across Prisma, SQLAlchemy, Mongoose, and Django to eliminate hidden N+1 bottlenecks.**

[![Category: Performance](https://img.shields.io/badge/Category-Performance-red.svg)](../../README.md)
[![Standard: Anthropic Agent Skills](https://img.shields.io/badge/Standard-Anthropic%20Agent%20Skills-7C3AED.svg)](https://github.com/anthropics)

---

## ⚡ The Problem: The N+1 Query Explosion

AI coding agents love writing intuitive nested queries inside loops:
```typescript
// LEAKY ANTI-PATTERN:
const users = await prisma.user.findMany(); // 1 Query
const data = await Promise.all(
  users.map(u => prisma.post.findMany({ where: { userId: u.id } })) // N Queries!
);
```
- In local development with 3 records, it runs in 15ms.
- In production with 200 users, it triggers **201 database queries**, overwhelming connection pools and freezing response times.

---

## 🛠️ The Fix: Batched Eager Loading & Indexing

`n-plus-one-hunter` scans loops for ORM access and rewrites them into optimal single-roundtrip queries:

| ORM | 🛑 Before (N+1 Queries) | ✅ After (1 Batched Query) |
| :--- | :--- | :--- |
| **Prisma** | `await Promise.all(users.map(...))` | `prisma.user.findMany({ include: { posts: true } })` |
| **SQLAlchemy** | `for u in users: print(u.posts)` | `session.query(User).options(selectinload(User.posts))` |
| **Mongoose** | `for (const o of orders) await Item.findById(...)` | `Order.find().populate('items').lean()` |
| **Django** | `for b in books: print(b.author.name)` | `Book.objects.select_related('author').all()` |

Additionally, it inspects your database schema to ensure relational foreign keys (`userId`, `authorId`) have **explicit B-Tree indexes**.

---

## 📋 Sample Bottleneck Report

```markdown
### ⚡ N+1 Query Audit & Bottleneck Report

- Location: `src/services/userService.ts:42-55`
- ORM: Prisma
- Query Explosion: 1 parent query + 50 loop queries = 51 roundtrips (~765ms network lag).
- Fix: Replace nested loop with `include: { posts: true }`.
- Index Check: Added `@@index([userId])` to prevent table scans on eager load.
```

---

## 🚀 Quickstart

### Claude Code
```bash
cp -r skills/n-plus-one-hunter .claude/skills/
```

### Cursor
```bash
cp skills/n-plus-one-hunter/SKILL.md .cursor/rules/n-plus-one-hunter.mdc
```

### Antigravity
```bash
cp -r skills/n-plus-one-hunter ~/.gemini/config/skills/
```
