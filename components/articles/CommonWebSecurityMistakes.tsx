'use client'

export default function CommonWebSecurityMistakes() {
  return (
    <>
      <h2>Security Mistakes Are Expensive</h2>
      <p>
        Most web application breaches don't happen because attackers are brilliant — they happen because developers make predictable, preventable mistakes. The good news: fixing these issues is usually straightforward once you know what to look for.
      </p>

      <h2>1. Hardcoded Secrets in Code</h2>
      <p>
        Embedding API keys, database passwords, JWT secrets, and private keys directly in source code is one of the most common and dangerous mistakes. Code gets committed to Git, shared with colleagues, pushed to public repositories.
      </p>
      <pre><code>{`// ❌ Wrong
const stripe = new Stripe('sk_live_abc123xyz...')
const db = mysql.connect({ password: 'mypassword123' })

// ✅ Right — use environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const db = mysql.connect({ password: process.env.DB_PASSWORD })`}</code></pre>
      <p><strong>Fix:</strong></p>
      <ul>
        <li>Use <code>.env</code> files locally, add them to <code>.gitignore</code></li>
        <li>Use your platform's secret manager (Vercel env vars, Railway secrets, AWS Secrets Manager)</li>
        <li>Scan for leaked secrets: <code>git secret scan</code>, truffleHog, or GitHub's built-in secret scanning</li>
        <li>If you've committed a secret: revoke it immediately, don't just delete from code</li>
      </ul>

      <h2>2. Storing Passwords with Weak Hashing</h2>
      <p>
        MD5, SHA-1, and even SHA-256 are designed to be fast — which is exactly what you don't want for passwords. Attackers can try billions of MD5 hashes per second with consumer GPUs.
      </p>
      <pre><code>{`// ❌ Wrong — fast hashes are wrong for passwords
const hash = crypto.createHash('md5').update(password).digest('hex')
const hash = crypto.createHash('sha256').update(password).digest('hex')

// ✅ Right — use slow, purpose-built password hashing
const bcrypt = require('bcrypt')
const hash = await bcrypt.hash(password, 12)     // cost factor 12

// Or Argon2 (recommended in 2025)
const argon2 = require('argon2')
const hash = await argon2.hash(password)`}</code></pre>
      <p><strong>Fix:</strong> Use bcrypt (cost factor ≥ 10), Argon2id, or scrypt. Never use MD5/SHA for passwords. Add pepper (server-side secret) for extra protection.</p>

      <h2>3. SQL Injection</h2>
      <p>
        Concatenating user input directly into SQL queries allows attackers to modify the query structure and access or delete your entire database.
      </p>
      <pre><code>{`// ❌ Wrong — SQL injection vulnerability
const query = "SELECT * FROM users WHERE email = '" + email + "'"
// Attacker enters: ' OR '1'='1 — returns all users

// ✅ Right — parameterized queries
const query = "SELECT * FROM users WHERE email = ?"
db.execute(query, [email])

// ✅ Right — ORM (Prisma, TypeORM, Sequelize)
const user = await prisma.user.findUnique({ where: { email } })`}</code></pre>
      <p><strong>Fix:</strong> Always use parameterized queries or an ORM. Never concatenate user input into SQL strings.</p>

      <h2>4. No Rate Limiting</h2>
      <p>
        Without rate limiting, attackers can brute-force login forms, spam contact forms, flood APIs, or enumerate user accounts. A single attacker can try millions of password combinations in minutes.
      </p>
      <pre><code>{`// Express.js with express-rate-limit
const rateLimit = require('express-rate-limit')

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,                    // 10 login attempts per window
  message: 'Too many login attempts',
})

app.post('/login', loginLimiter, loginHandler)`}</code></pre>
      <p><strong>Fix:</strong> Rate limit login endpoints, password reset, OTP, and any form that accepts user input. Use IP + account-based limiting. Consider progressive delays (exponential backoff) instead of hard blocks.</p>

      <h2>5. Missing Security Headers</h2>
      <p>
        HTTP security headers prevent entire categories of attacks. Most are trivial to add but commonly missed.
      </p>
      <pre><code>{`# Nginx: add to server block
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'" always;`}</code></pre>
      <table>
        <thead><tr><th>Header</th><th>Prevents</th></tr></thead>
        <tbody>
          <tr><td><code>Strict-Transport-Security</code></td><td>SSL stripping, MITM on HTTPS sites</td></tr>
          <tr><td><code>X-Content-Type-Options: nosniff</code></td><td>MIME sniffing attacks</td></tr>
          <tr><td><code>X-Frame-Options</code></td><td>Clickjacking (embedding your site in an iframe)</td></tr>
          <tr><td><code>Content-Security-Policy</code></td><td>XSS — restricts which scripts/resources can load</td></tr>
          <tr><td><code>Referrer-Policy</code></td><td>URL leakage via Referer header</td></tr>
        </tbody>
      </table>
      <p><strong>Fix:</strong> Check your headers at <code>securityheaders.com</code>. Start with HSTS, X-Content-Type-Options, and X-Frame-Options — they're one-liners with no side effects.</p>

      <h2>6. Verbose Error Messages</h2>
      <p>
        Stack traces, database error messages, and file paths in production responses give attackers a roadmap of your system.
      </p>
      <pre><code>{`// ❌ Wrong — leaks implementation details
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.stack })
  // "Error: connect ECONNREFUSED 127.0.0.1:5432 at /app/db/postgres.js:45"
})

// ✅ Right — log internally, generic message to client
app.use((err, req, res, next) => {
  console.error(err)  // log full error to your logging system
  res.status(500).json({ error: 'Internal server error' })
})`}</code></pre>
      <p><strong>Fix:</strong> Catch all unhandled errors, log them internally (Sentry, Datadog, CloudWatch), and return generic messages to clients. Never expose stack traces in production.</p>

      <h2>7. Open CORS Configuration</h2>
      <pre><code>{`// ❌ Wrong — allows any origin
app.use(cors({ origin: '*' }))

// ✅ Right — whitelist specific origins
app.use(cors({
  origin: ['https://app.example.com', 'https://www.example.com'],
  credentials: true,
}))`}</code></pre>
      <p><strong>Fix:</strong> Specify exact allowed origins. Only use <code>*</code> for public APIs that have no authentication and no user-specific data.</p>

      <h2>8. No Input Validation or Sanitization</h2>
      <p>
        Trusting user input without validation leads to XSS, injection attacks, business logic bypasses, and data corruption.
      </p>
      <pre><code>{`// ✅ Validate with Zod (TypeScript)
import { z } from 'zod'

const UserSchema = z.object({
  email: z.string().email().max(255),
  age: z.number().int().min(0).max(150),
  role: z.enum(['user', 'admin']),
})

// Parse and validate — throws on invalid input
const user = UserSchema.parse(req.body)`}</code></pre>
      <p><strong>Fix:</strong> Validate all inputs server-side (never trust client-side validation alone). Use schema validation libraries (Zod, Joi, Yup). Sanitize HTML if you render user-generated content.</p>

      <h2>9. Insecure Direct Object References (IDOR)</h2>
      <p>
        When your API uses predictable IDs and doesn't verify ownership, users can access other users' data by changing the ID in the URL.
      </p>
      <pre><code>{`// ❌ Wrong — doesn't check if user owns this order
app.get('/api/orders/:id', async (req, res) => {
  const order = await Order.findById(req.params.id)
  res.json(order)
})

// ✅ Right — verify ownership
app.get('/api/orders/:id', auth, async (req, res) => {
  const order = await Order.findOne({
    id: req.params.id,
    userId: req.user.id,   // must belong to current user
  })
  if (!order) return res.status(404).json({ error: 'Not found' })
  res.json(order)
})`}</code></pre>
      <p><strong>Fix:</strong> Always verify that the authenticated user is authorized to access the specific resource they're requesting. Use UUIDs instead of sequential integers to make IDs less predictable.</p>

      <h2>10. Storing Sensitive Data in localStorage</h2>
      <p>
        localStorage is accessible to any JavaScript on the page. If your site has an XSS vulnerability, attackers can steal everything in localStorage — including auth tokens.
      </p>
      <pre><code>{`// ❌ Wrong — JWT in localStorage is vulnerable to XSS
localStorage.setItem('auth_token', jwt)

// ✅ Better — HttpOnly cookies can't be read by JavaScript
// Set cookie server-side:
res.cookie('auth_token', jwt, {
  httpOnly: true,   // not accessible by JavaScript
  secure: true,     // HTTPS only
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000,  // 15 minutes
})`}</code></pre>
      <p><strong>Fix:</strong> Store auth tokens in <code>HttpOnly</code> cookies instead of localStorage. These cookies are sent automatically by the browser but can't be read by JavaScript, preventing token theft via XSS.</p>

      <h2>Summary Checklist</h2>
      <ul>
        <li>✅ Secrets in environment variables, not code</li>
        <li>✅ Passwords hashed with bcrypt or Argon2</li>
        <li>✅ Parameterized queries everywhere</li>
        <li>✅ Rate limiting on authentication endpoints</li>
        <li>✅ Security headers configured</li>
        <li>✅ Generic error messages in production</li>
        <li>✅ CORS restricted to known origins</li>
        <li>✅ All inputs validated server-side</li>
        <li>✅ Authorization checks on every resource access</li>
        <li>✅ Auth tokens in HttpOnly cookies</li>
      </ul>
    </>
  )
}
