'use client'

export default function GatewayTimeout504() {
  return (
    <article className="prose-freeutil">
      <p>A 504 Gateway Timeout occurs when Nginx (or another proxy) is waiting for a response from an upstream server (Node.js, Gunicorn, PHP-FPM) and gives up before it responds. The upstream is alive but too slow.</p>

      <h2>How 504 Differs from 502 and 503</h2>
      <table>
        <thead><tr><th>Code</th><th>Meaning</th><th>Upstream state</th></tr></thead>
        <tbody>
          <tr><td>502 Bad Gateway</td><td>Upstream returned an invalid response</td><td>Running but broken</td></tr>
          <tr><td>503 Service Unavailable</td><td>Upstream is down or overloaded</td><td>Down or rejecting</td></tr>
          <tr><td><strong>504 Gateway Timeout</strong></td><td>Upstream didn't respond in time</td><td>Running but slow</td></tr>
        </tbody>
      </table>

      <h2>Increase Nginx Proxy Timeouts</h2>
      <pre><code>{`# /etc/nginx/nginx.conf or site config
server {
    location / {
        proxy_pass http://localhost:3000;

        proxy_connect_timeout  60s;   # Time to establish connection
        proxy_send_timeout     300s;  # Time to send request to upstream
        proxy_read_timeout     300s;  # Time to wait for upstream response ← most important

        # Also add these for large uploads/downloads:
        client_max_body_size    50m;
        proxy_buffering         off;
    }
}

# Reload Nginx after changes
sudo nginx -t && sudo systemctl reload nginx`}</code></pre>

      <h2>Find What's Slow</h2>
      <pre><code>{`# Time a slow endpoint directly (bypassing Nginx)
curl -w "\nTime: %{time_total}s\n" -o /dev/null http://localhost:3000/api/slow-endpoint

# Check if the database is the bottleneck
# PostgreSQL: find slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

# MySQL: check slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;  # Log queries > 2 seconds`}</code></pre>

      <h2>Common Root Causes</h2>
      <ul>
        <li><strong>Unoptimized database query</strong> — missing index on a large table, N+1 queries, full table scan</li>
        <li><strong>External API call without timeout</strong> — your app waits forever for a third-party API</li>
        <li><strong>Large file processing</strong> — image resize, PDF generation, CSV export on a single request</li>
        <li><strong>Memory pressure causing GC pauses</strong> — Node.js/Python spending time garbage collecting</li>
        <li><strong>Cold start</strong> — first request after a long idle period initializing connections</li>
      </ul>

      <h2>Fix: Add Timeouts to Your Application</h2>
      <pre><code>{`// Node.js — set timeout on outgoing HTTP requests
const axios = require('axios')
const response = await axios.get('https://api.external.com', {
  timeout: 5000  // 5 seconds max
})

// Set server request timeout
const server = app.listen(3000)
server.setTimeout(30000)  // 30 seconds

// Python requests
import requests
response = requests.get('https://api.external.com', timeout=5)`}</code></pre>

      <h2>Move Slow Work to Background Jobs</h2>
      <p>Never process heavy work in a web request. Return immediately and do the work asynchronously:</p>
      <pre><code>{`// ❌ Slow — blocks the request thread
app.post('/reports', async (req, res) => {
  const pdf = await generateLargePdf(req.body)  // 30 seconds
  res.send(pdf)
})

// ✅ Fast — queue work, return job ID immediately
app.post('/reports', async (req, res) => {
  const jobId = await queue.add('generate-pdf', req.body)
  res.json({ jobId, status: 'processing' })
})
// Client polls GET /reports/:jobId for status`}</code></pre>
    </article>
  )
}
