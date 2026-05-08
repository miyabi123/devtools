'use client'

export default function CiCdExplained() {
  return (
    <article className="prose-freeutil">
      <p>CI/CD (Continuous Integration / Continuous Deployment) automates the process of testing and deploying code. Every push triggers a pipeline that runs tests, builds the app, and deploys it — eliminating manual steps and catching bugs before they reach users.</p>

      <h2>CI vs CD</h2>
      <ul>
        <li><strong>Continuous Integration (CI)</strong> — automatically build and test code on every push. Catches integration bugs early. The pipeline fails visibly if tests break.</li>
        <li><strong>Continuous Delivery (CD)</strong> — automatically deploy to staging after CI passes. A human approves production deploys.</li>
        <li><strong>Continuous Deployment (CD)</strong> — automatically deploy to production after CI passes. No human gates.</li>
      </ul>

      <h2>A Basic CI/CD Pipeline</h2>
      <pre><code>{`Push code → CI Pipeline:
  1. Install dependencies
  2. Run linter (ESLint, Flake8)
  3. Run unit tests
  4. Run integration tests
  5. Build (npm run build, docker build)
  6. Push to container registry
  7. Deploy to staging
  8. [Optional] Deploy to production`}</code></pre>

      <h2>GitHub Actions — Complete Example</h2>
      <pre><code>{`# .github/workflows/deploy.yml
name: Test and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: testpass
          POSTGRES_DB: testdb
        ports: ['5432:5432']
        options: --health-cmd pg_isready --health-interval 10s --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test
        env:
          DATABASE_URL: postgres://postgres:testpass@localhost:5432/testdb

  deploy:
    needs: test           # Only runs if tests pass
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'  # Only on main branch

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to server
        uses: appleboy/ssh-action@v1
        with:
          host: \${{ secrets.SERVER_HOST }}
          username: \${{ secrets.SERVER_USER }}
          key: \${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/myapp
            git pull origin main
            npm ci --production
            pm2 restart myapp`}</code></pre>

      <h2>CI Tool Comparison</h2>
      <table>
        <thead><tr><th>Tool</th><th>Best for</th><th>Free tier</th></tr></thead>
        <tbody>
          <tr><td>GitHub Actions</td><td>GitHub repos, everything</td><td>2,000 min/month</td></tr>
          <tr><td>GitLab CI</td><td>GitLab repos, self-hosted option</td><td>400 min/month</td></tr>
          <tr><td>CircleCI</td><td>Fast pipelines, parallelism</td><td>6,000 min/month</td></tr>
          <tr><td>Jenkins</td><td>Self-hosted, complex pipelines</td><td>Free (self-hosted)</td></tr>
          <tr><td>Cloudflare Pages</td><td>Static sites, Next.js</td><td>Unlimited deploys</td></tr>
        </tbody>
      </table>
    </article>
  )
}
