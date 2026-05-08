'use client'

export default function MysqlVsPostgresql() {
  return (
    <article className="prose-freeutil">
      <p>MySQL and PostgreSQL are the two dominant open-source relational databases. Both are production-proven and capable, but they make different tradeoffs. Here's a practical comparison to inform your choice.</p>

      <h2>At a Glance</h2>
      <table>
        <thead><tr><th>Factor</th><th>MySQL</th><th>PostgreSQL</th></tr></thead>
        <tbody>
          <tr><td>Age</td><td>1995</td><td>1996</td></tr>
          <tr><td>License</td><td>GPL / Commercial (Oracle)</td><td>PostgreSQL License (fully open)</td></tr>
          <tr><td>Architecture</td><td>Multiple storage engines (InnoDB default)</td><td>Single engine, extensible</td></tr>
          <tr><td>ACID compliance</td><td>Yes (InnoDB)</td><td>Yes</td></tr>
          <tr><td>JSON support</td><td>Good (JSON type)</td><td>Excellent (JSONB with indexing)</td></tr>
          <tr><td>Full-text search</td><td>Basic</td><td>Better</td></tr>
          <tr><td>Window functions</td><td>8.0+ (basic)</td><td>Excellent</td></tr>
          <tr><td>Extensions</td><td>Limited</td><td>Rich (PostGIS, pgvector, etc.)</td></tr>
        </tbody>
      </table>

      <h2>JSON and JSONB</h2>
      <p>PostgreSQL's <code>JSONB</code> type stores JSON in a binary format that supports indexing and efficient querying — making Postgres a viable alternative to MongoDB for document storage:</p>
      <pre><code>{`-- PostgreSQL JSONB — query inside JSON documents
SELECT * FROM products WHERE data->>'category' = 'electronics';

-- Index a JSONB field for fast queries
CREATE INDEX idx_category ON products ((data->>'category'));

-- MySQL JSON — works but no binary storage or GIN indexes
SELECT * FROM products WHERE JSON_EXTRACT(data, '$.category') = 'electronics';`}</code></pre>

      <h2>Advanced SQL Features</h2>
      <p>PostgreSQL has stronger SQL standard compliance and more advanced features:</p>
      <pre><code>{`-- Window functions (PostgreSQL excels here)
SELECT name, salary,
  RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rank
FROM employees;

-- CTEs (both support, Postgres is stronger)
WITH monthly_sales AS (
  SELECT DATE_TRUNC('month', created_at) as month, SUM(amount) as total
  FROM orders GROUP BY 1
)
SELECT * FROM monthly_sales WHERE total > 100000;

-- UPSERT
-- PostgreSQL
INSERT INTO users (id, name) VALUES (1, 'Alice')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- MySQL
INSERT INTO users (id, name) VALUES (1, 'Alice')
ON DUPLICATE KEY UPDATE name = VALUES(name);`}</code></pre>

      <h2>When to Choose MySQL</h2>
      <ul>
        <li>WordPress, Drupal, or any PHP CMS (most use MySQL by default)</li>
        <li>Simple web apps with standard CRUD operations</li>
        <li>Team familiarity — MySQL knowledge is more common among junior developers</li>
        <li>Managed databases — AWS RDS MySQL, Google Cloud SQL, PlanetScale</li>
      </ul>

      <h2>When to Choose PostgreSQL</h2>
      <ul>
        <li>Complex queries with window functions, CTEs, or advanced analytics</li>
        <li>Geospatial data — PostGIS extension is the gold standard</li>
        <li>JSON/document storage alongside relational data</li>
        <li>Vector search — pgvector extension for AI embeddings</li>
        <li>Financial applications needing strict ACID compliance and exact numerics</li>
        <li>New projects with no legacy constraints — Postgres is generally the modern default</li>
      </ul>
    </article>
  )
}
