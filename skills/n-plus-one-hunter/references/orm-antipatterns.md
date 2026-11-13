# ORM N+1 Query Anti-Patterns & Optimization Reference

The N+1 query problem occurs when an application executes 1 initial database query to retrieve $N$ parent records, followed by $N$ secondary queries to fetch related child entities inside a loop.

---

## 1. ORM Anti-Pattern vs Solution Matrix

| ORM / Framework | 🛑 Leaky Anti-Pattern (N+1 Queries) | ✅ Optimized Eager Solution (1 or 2 Queries) |
| :--- | :--- | :--- |
| **Prisma (TypeScript)** | ```ts<br>const users = await prisma.user.findMany();<br>const data = await Promise.all(<br>  users.map(u => prisma.post.findMany({<br>    where: { userId: u.id }<br>  }))<br>);<br>``` | ```ts<br>const users = await prisma.user.findMany({<br>  include: { posts: true }<br>});<br>// OR batched in-clause:<br>const posts = await prisma.post.findMany({<br>  where: { userId: { in: users.map(u => u.id) } }<br>});<br>``` |
| **SQLAlchemy (Python)** | ```python<br>users = session.query(User).all()<br>for u in users:<br>    # Each loop hits DB lazily<br>    print([p.title for p in u.posts])<br>``` | ```python<br>from sqlalchemy.orm import selectinload<br>users = session.query(User).options(<br>    selectinload(User.posts)<br>).all()<br>``` |
| **Mongoose (Node/Mongo)** | ```ts<br>const orders = await Order.find();<br>for (const order of orders) {<br>  const user = await User.findById(order.userId);<br>}<br>``` | ```ts<br>const orders = await Order.find()<br>  .populate('userId')<br>  .lean();<br>``` |
| **Django ORM (Python)** | ```python<br>books = Book.objects.all()<br>for b in books:<br>    print(b.author.name)<br>``` | ```python<br># For Foreign Key (1-to-1, Many-to-1):<br>books = Book.objects.select_related('author').all()<br># For Many-to-Many / Reverse FK:<br>books = Book.objects.prefetch_related('tags').all()<br>``` |
| **TypeORM (TypeScript)** | ```ts<br>const users = await userRepo.find();<br>for (const u of users) {<br>  u.photos = await photoRepo.find({ where: { userId: u.id } });<br>}<br>``` | ```ts<br>const users = await userRepo.find({<br>  relations: { photos: true }<br>});<br>``` |
| **GORM (Go)** | ```go<br>var users []User<br>db.Find(&users)<br>for i := range users {<br>    db.Model(&users[i]).Association("Orders").Find(&users[i].Orders)<br>}<br>``` | ```go<br>var users []User<br>db.Preload("Orders").Find(&users)<br>``` |

---

## 2. Detection Heuristics for Agents

When scanning source code, flag the following structural code shapes:

1. **Async Loop Callers**:
   - `for (const x of items) { await ormModel.find... }`
   - `items.map(async (x) => await ormModel.find...)`
   - `await Promise.all(items.map(...))` where the callback body performs database queries.
2. **Missing Eager Load Declarations**:
   - Queries retrieving collections where downstream template rendering or JSON serialization accesses child relationship properties (`u.posts`, `order.items`, `book.author`) without prior `include`, `selectinload`, `populate`, or `select_related`.
3. **Foreign Key Index Absence**:
   - Relationship fields (e.g. `userId`, `authorId`, `tenantId`, `organizationId`) lacking an explicit `@index` or `db.Index` in the schema definition, turning even batched `$in` queries into slow table scans.

---

## 3. Database Indexing Rules for Relationships

Eager loading is only half the solution; without proper indexing, batched queries suffer:

- **Single-Column FK Index**: Every foreign key column used in a `WHERE parent_id IN (...)` clause MUST have a B-Tree index:
  ```prisma
  // Prisma
  model Post {
    id        String @id @default(cuid())
    userId    String
    user      User   @relation(fields: [userId], references: [id])
    @@index([userId])
  }
  ```
- **Composite Index for Filtering + Sorting**: When fetching related entities filtered by status and sorted by timestamp:
  ```sql
  CREATE INDEX idx_posts_user_created ON posts (user_id, created_at DESC);
  ```
