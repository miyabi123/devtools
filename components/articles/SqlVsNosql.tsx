'use client'

export default function SqlVsNosql() {
  return (
    <article className="prose-freeutil">
      <p>SQL and NoSQL databases make different tradeoffs. Neither is universally better — the right choice depends on your data structure, query patterns, scale, and consistency requirements.</p>

      <h2>SQL (Relational Databases)</h2>
      <p>Data is stored in tables with rows and columns. Relationships are defined between tables using foreign keys. The schema must be defined upfront. Examples: PostgreSQL, MySQL, SQLite, SQL Server.</p>
      <pre><code>{`-- Structured, relational data
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  total DECIMAL(10,2)
);

-- Powerful joins
SELECT u.email, COUNT(o.id) as order_count
FROM users u LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.email;`}</code></pre>

      <h2>NoSQL Databases</h2>
      <p>Several different models — document, key-value, column-family, and graph — all united by not using the relational table model. Schema is flexible.</p>
      <ul>
        <li><strong>Document (MongoDB, Firestore)</strong> — JSON-like documents, nested structures</li>
        <li><strong>Key-value (Redis, DynamoDB)</strong> — simple lookup by key, ultra-fast</li>
        <li><strong>Column-family (Cassandra)</strong> — optimized for time-series, huge scale</li>
        <li><strong>Graph (Neo4j)</strong> — relationships are first-class, social networks</li>
      </ul>
      <pre><code>{`// MongoDB document — flexible structure
{
  "_id": "user_42",
  "email": "alice@example.com",
  "orders": [
    { "id": "order_1", "total": 299.99, "items": [...] }
  ],
  "preferences": { "theme": "dark" }
}`}</code></pre>

      <h2>ACID vs BASE</h2>
      <table>
        <thead><tr><th>ACID (SQL)</th><th>BASE (NoSQL)</th></tr></thead>
        <tbody>
          <tr><td>Atomic — all or nothing</td><td>Basically Available</td></tr>
          <tr><td>Consistent — valid state always</td><td>Soft state — may change over time</td></tr>
          <tr><td>Isolated — concurrent transactions</td><td>Eventually consistent</td></tr>
          <tr><td>Durable — persisted on commit</td><td>Available over consistent</td></tr>
        </tbody>
      </table>

      <h2>Scaling Differences</h2>
      <p><strong>SQL scales vertically</strong> — bigger server, more RAM, faster disk. Horizontal scaling (sharding) is possible but complex. Works well up to millions of rows per table.</p>
      <p><strong>NoSQL scales horizontally</strong> — add more nodes. DynamoDB, Cassandra, and MongoDB are designed to distribute data across many servers transparently. Built for billions of records.</p>

      <h2>When to Use SQL</h2>
      <ul>
        <li>Data has clear relationships (users, orders, products)</li>
        <li>You need complex queries, joins, and aggregations</li>
        <li>Data integrity is critical (financial, medical)</li>
        <li>Schema is relatively stable</li>
        <li>Team knows SQL (nearly universal skill)</li>
      </ul>

      <h2>When to Use NoSQL</h2>
      <ul>
        <li>Flexible schema — documents vary in structure</li>
        <li>Massive scale (millions of writes per second)</li>
        <li>Simple access patterns (key lookups, range queries)</li>
        <li>Content management, catalogs, user profiles</li>
        <li>Caching (Redis), session storage, queues</li>
        <li>Real-time analytics and time-series data</li>
      </ul>

      <h2>Common Combinations</h2>
      <p>Many production systems use both: PostgreSQL for transactional data (orders, users, payments) and Redis for caching, sessions, and queues. The tools complement each other rather than compete.</p>
    </article>
  )
}
