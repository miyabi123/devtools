'use client'

export default function EnvironmentVariablesGuide() {
  return (
    <article className="prose-freeutil">
      <p>Environment variables are the standard way to configure applications without hardcoding values in source code. They're essential for keeping secrets out of git, running the same code in dev/staging/production, and following 12-factor app principles.</p>

      <h2>What Are Environment Variables?</h2>
      <p>Key-value pairs available to any process on the system. Set once, read by your application at runtime. The values can differ between environments without changing code.</p>
      <pre><code>{`# Set in shell (current session only)
export DATABASE_URL="postgres://user:pass@localhost:5432/mydb"
export PORT=3000

# Read in your app
const dbUrl = process.env.DATABASE_URL
const port = process.env.PORT || 3000`}</code></pre>

      <h2>The .env File</h2>
      <p>Store variables in a <code>.env</code> file for local development. Load with dotenv:</p>
      <pre><code>{`# .env (NEVER commit to git)
DATABASE_URL=postgres://user:pass@localhost:5432/mydb
JWT_SECRET=your-very-long-random-secret-key
STRIPE_SECRET_KEY=sk_test_abc123
SENDGRID_API_KEY=SG.xyz789
PORT=3000
NODE_ENV=development`}</code></pre>
      <pre><code>{`# .gitignore — always ignore .env files
.env
.env.local
.env.*.local
.env.production`}</code></pre>
      <pre><code>{`// Node.js — load .env at app startup
require('dotenv').config()  // CommonJS
// or
import 'dotenv/config'      // ESM

// Python
from dotenv import load_dotenv
load_dotenv()`}</code></pre>

      <h2>.env.example — Document Required Variables</h2>
      <p>Commit a <code>.env.example</code> with placeholder values so developers know what variables are needed:</p>
      <pre><code>{`# .env.example (DO commit this)
DATABASE_URL=postgres://user:password@localhost:5432/dbname
JWT_SECRET=replace-with-random-string-min-32-chars
STRIPE_SECRET_KEY=sk_test_your_stripe_key
PORT=3000
NODE_ENV=development`}</code></pre>

      <h2>Environment Variables in Docker</h2>
      <pre><code>{`# Pass directly to docker run
docker run -e DATABASE_URL=postgres://... -e PORT=3000 myapp

# Pass from .env file
docker run --env-file .env myapp

# In docker-compose.yml
services:
  app:
    image: myapp
    env_file:
      - .env
    environment:
      NODE_ENV: production
      PORT: 3000
      # Reference from host environment:
      STRIPE_KEY: \${STRIPE_SECRET_KEY}`}</code></pre>

      <h2>Environment Variables in CI/CD</h2>
      <pre><code>{`# GitHub Actions — store secrets in repo Settings → Secrets
name: Deploy
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run deploy
        env:
          DATABASE_URL: \${{ secrets.DATABASE_URL }}
          STRIPE_KEY: \${{ secrets.STRIPE_SECRET_KEY }}`}</code></pre>

      <h2>Best Practices</h2>
      <ul>
        <li><strong>Never hardcode secrets</strong> in source code — even "temporarily"</li>
        <li><strong>Never commit .env</strong> files — add to .gitignore before creating them</li>
        <li><strong>Use different values per environment</strong> — dev DB ≠ production DB</li>
        <li><strong>Validate required variables at startup</strong> — fail fast with a clear error</li>
        <li><strong>Rotate secrets regularly</strong> — especially after team member departures</li>
      </ul>
      <pre><code>{`// Validate required env vars at startup
const required = ['DATABASE_URL', 'JWT_SECRET', 'STRIPE_KEY']
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(\`Missing required environment variable: \${key}\`)
  }
}`}</code></pre>
    </article>
  )
}
