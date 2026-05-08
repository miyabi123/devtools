'use client'

export default function HttpStatusCodesGuide() {
  return (
    <article className="prose-freeutil">
      <p>
        HTTP status codes are three-digit numbers returned by servers to tell clients what happened with their request. Understanding them is essential for debugging APIs, configuring redirects, and reading server logs. Here's every code you'll actually encounter.
      </p>

      <h2>1xx — Informational</h2>
      <table>
        <thead><tr><th>Code</th><th>Name</th><th>When you see it</th></tr></thead>
        <tbody>
          <tr><td>100</td><td>Continue</td><td>Server received request headers, client should proceed with body</td></tr>
          <tr><td>101</td><td>Switching Protocols</td><td>Upgrading from HTTP to WebSocket</td></tr>
        </tbody>
      </table>

      <h2>2xx — Success</h2>
      <table>
        <thead><tr><th>Code</th><th>Name</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><strong>200</strong></td><td>OK</td><td>Standard success. GET returns data, POST returns result.</td></tr>
          <tr><td><strong>201</strong></td><td>Created</td><td>Resource created successfully. POST to create a user → 201.</td></tr>
          <tr><td><strong>204</strong></td><td>No Content</td><td>Success but no body. DELETE operations often return 204.</td></tr>
          <tr><td>206</td><td>Partial Content</td><td>Range request — used for video streaming and resumable downloads.</td></tr>
        </tbody>
      </table>

      <h2>3xx — Redirection</h2>
      <table>
        <thead><tr><th>Code</th><th>Name</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><strong>301</strong></td><td>Moved Permanently</td><td>URL changed forever. Browsers and Google update their records. Use for HTTP→HTTPS and domain changes.</td></tr>
          <tr><td><strong>302</strong></td><td>Found (Temporary)</td><td>Temporary redirect. Browser follows it but keeps the original URL cached.</td></tr>
          <tr><td><strong>304</strong></td><td>Not Modified</td><td>Cached response is still valid. Browser uses local cache — no data transferred.</td></tr>
          <tr><td>307</td><td>Temporary Redirect</td><td>Like 302 but guarantees the HTTP method is preserved (POST stays POST).</td></tr>
          <tr><td>308</td><td>Permanent Redirect</td><td>Like 301 but preserves the HTTP method. Use instead of 301 for POST redirects.</td></tr>
        </tbody>
      </table>

      <h2>4xx — Client Errors</h2>
      <table>
        <thead><tr><th>Code</th><th>Name</th><th>Meaning &amp; Fix</th></tr></thead>
        <tbody>
          <tr><td><strong>400</strong></td><td>Bad Request</td><td>Malformed request syntax, invalid JSON, missing required field. Fix the request payload.</td></tr>
          <tr><td><strong>401</strong></td><td>Unauthorized</td><td>Authentication required or failed. Send a valid token/credentials.</td></tr>
          <tr><td><strong>403</strong></td><td>Forbidden</td><td>Authenticated but not permitted. Check user roles and permissions.</td></tr>
          <tr><td><strong>404</strong></td><td>Not Found</td><td>Resource doesn't exist. Check the URL, or the resource was deleted.</td></tr>
          <tr><td>405</td><td>Method Not Allowed</td><td>HTTP method not supported by this endpoint (e.g. POST to a GET-only route).</td></tr>
          <tr><td>408</td><td>Request Timeout</td><td>Server timed out waiting for the request. Client should retry.</td></tr>
          <tr><td><strong>409</strong></td><td>Conflict</td><td>Request conflicts with current state — duplicate entry, version mismatch.</td></tr>
          <tr><td>410</td><td>Gone</td><td>Resource permanently deleted. Unlike 404, indicates intentional removal.</td></tr>
          <tr><td><strong>413</strong></td><td>Payload Too Large</td><td>Request body exceeds server limit. Increase <code>client_max_body_size</code> in Nginx.</td></tr>
          <tr><td>415</td><td>Unsupported Media Type</td><td>Content-Type header is missing or unsupported. Add <code>Content-Type: application/json</code>.</td></tr>
          <tr><td><strong>422</strong></td><td>Unprocessable Entity</td><td>Request is well-formed but semantically invalid. Common in REST APIs for validation errors.</td></tr>
          <tr><td><strong>429</strong></td><td>Too Many Requests</td><td>Rate limit exceeded. Check <code>Retry-After</code> header and implement backoff.</td></tr>
        </tbody>
      </table>

      <h2>5xx — Server Errors</h2>
      <table>
        <thead><tr><th>Code</th><th>Name</th><th>Meaning &amp; Fix</th></tr></thead>
        <tbody>
          <tr><td><strong>500</strong></td><td>Internal Server Error</td><td>Generic server crash. Check server logs for the actual exception.</td></tr>
          <tr><td><strong>502</strong></td><td>Bad Gateway</td><td>Proxy (Nginx) received an invalid response from upstream (Node.js, Gunicorn). Check if upstream is running.</td></tr>
          <tr><td><strong>503</strong></td><td>Service Unavailable</td><td>Server overloaded or down for maintenance. Often temporary — implement retry logic.</td></tr>
          <tr><td><strong>504</strong></td><td>Gateway Timeout</td><td>Proxy timed out waiting for upstream. Increase <code>proxy_read_timeout</code> in Nginx or optimize slow queries.</td></tr>
          <tr><td>507</td><td>Insufficient Storage</td><td>Server disk is full. Free up disk space.</td></tr>
        </tbody>
      </table>

      <h2>Common Confusions</h2>
      <h3>401 vs 403</h3>
      <p>
        <strong>401</strong> means "I don't know who you are — please authenticate." <strong>403</strong> means "I know who you are, but you're not allowed." If a user tries to access an admin page after logging in as a regular user, that's 403, not 401.
      </p>

      <h3>301 vs 302</h3>
      <p>
        Use <strong>301</strong> when a URL has permanently moved — search engines will update their index and transfer PageRank. Use <strong>302</strong> for temporary redirects (A/B testing, maintenance pages) where you want to preserve the original URL in search indexes.
      </p>

      <h3>404 vs 410</h3>
      <p>
        Both mean "not found," but <strong>410</strong> signals the resource is intentionally and permanently gone. Google removes 410 pages from its index faster than 404 pages.
      </p>

      <h3>400 vs 422</h3>
      <p>
        <strong>400</strong> is for syntactically malformed requests (broken JSON, missing headers). <strong>422</strong> is for requests that are syntactically correct but semantically invalid (valid JSON, but a field fails business validation like "email already exists").
      </p>

      <h2>502 Bad Gateway — Quick Debug</h2>
      <pre><code>{`# Check if upstream (Node.js) is running
sudo systemctl status myapp

# Check Nginx error log
sudo tail -f /var/log/nginx/error.log

# Test upstream directly (bypass Nginx)
curl http://localhost:3000/api/health

# Check Nginx proxy_pass config
sudo nginx -T | grep proxy_pass`}</code></pre>
    </article>
  )
}
