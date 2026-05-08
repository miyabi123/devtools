'use client'

export default function SqlInjectionExplained() {
  return (
    <article className="prose-freeutil">
      <p>SQL injection lets attackers manipulate database queries by injecting SQL code through user input. It can expose all data in your database, bypass authentication, or delete everything. It's entirely preventable with parameterized queries.</p>

      <h2>How SQL Injection Works</h2>
      <pre><code>{`// Vulnerable code — string concatenation
const query = "SELECT * FROM users WHERE email = '" + req.body.email + "'"

// Normal input: alice@example.com
// Query: SELECT * FROM users WHERE email = 'alice@example.com'

// Malicious input: ' OR '1'='1
// Query: SELECT * FROM users WHERE email = '' OR '1'='1'
// → Returns ALL users — authentication bypassed!

// Malicious input to extract data: ' UNION SELECT username, password FROM admins --
// Query: SELECT * FROM users WHERE email = '' UNION SELECT username, password FROM admins --'

// Malicious input to destroy data: '; DROP TABLE users; --
// Query: SELECT * FROM users WHERE email = ''; DROP TABLE users; --'`}</code></pre>

      <h2>Prevention: Parameterized Queries</h2>
      <p>Never concatenate user input into SQL. Use parameterized queries (also called prepared statements) — the database driver handles escaping automatically:</p>
      <pre><code>{`// ❌ Vulnerable — string concatenation
const query = "SELECT * FROM users WHERE email = '" + email + "'"

// ✅ Safe — parameterized (node-postgres)
const result = await db.query(
  'SELECT * FROM users WHERE email = $1',
  [email]  // ← email is passed separately, never interpolated
)

// ✅ Safe — parameterized (MySQL2)
const [rows] = await db.execute(
  'SELECT * FROM users WHERE email = ?',
  [email]
)

// ✅ Safe — ORM (Prisma, Sequelize, Django ORM)
const user = await prisma.user.findUnique({ where: { email } })
// ORMs use parameterized queries internally`}</code></pre>

      <h2>ORM vs Raw Queries</h2>
      <p>ORMs (Prisma, Sequelize, Django ORM, SQLAlchemy) are safe by default because they parameterize all queries. The vulnerability appears when developers use raw SQL strings inside ORMs:</p>
      <pre><code>{`// ✅ Safe — ORM query
await prisma.user.findMany({ where: { name: { contains: searchTerm } } })

// ❌ Vulnerable — raw query in ORM with string interpolation
await prisma.$queryRaw\`SELECT * FROM users WHERE name LIKE '%\${searchTerm}%'\`

// ✅ Safe — raw query with proper parameterization
await prisma.$queryRaw\`SELECT * FROM users WHERE name LIKE \${'%' + searchTerm + '%'}\``}</code></pre>

      <h2>Testing for SQL Injection</h2>
      <pre><code>{`# Try these payloads in any user input that queries a database:
'          # Single quote — should NOT cause an error
' OR '1'='1  # Should NOT bypass login
'; --      # Should NOT execute additional statements
1; DROP TABLE test; --   # Should NOT work

# Automated testing
# SQLMap: sqlmap -u "https://target.com/search?q=test" --dbs
# OWASP ZAP: Active scan includes SQLi tests`}</code></pre>
    </article>
  )
}
