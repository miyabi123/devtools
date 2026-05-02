'use client'

export default function HttpStatusCodesGuide() {
  return (
    <>
      <h2>What Are HTTP Status Codes?</h2>
      <p>
        Every HTTP response includes a three-digit status code that tells the client what happened with its request. The first digit indicates the category; the remaining two give the specific status. Understanding these codes is essential for debugging APIs, configuring servers, and handling errors gracefully in your code.
      </p>

      <h2>1xx — Informational</h2>
      <p>Rarely seen by application code. These indicate the server has received the request and is continuing to process it.</p>
      <table>
        <thead><tr><th>Code</th><th>Name</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>100</code></td><td>Continue</td><td>Server received headers; client should send the body</td></tr>
          <tr><td><code>101</code></td><td>Switching Protocols</td><td>Server agrees to upgrade (e.g., HTTP → WebSocket)</td></tr>
          <tr><td><code>103</code></td><td>Early Hints</td><td>Preload hints sent before final response (used for performance)</td></tr>
        </tbody>
      </table>

      <h2>2xx — Success</h2>
      <p>The request was received, understood, and accepted.</p>
      <table>
        <thead><tr><th>Code</th><th>Name</th><th>When to Use</th></tr></thead>
        <tbody>
          <tr><td><code>200</code></td><td>OK</td><td>Standard success. GET, POST, PUT all return 200 for successful responses with a body.</td></tr>
          <tr><td><code>201</code></td><td>Created</td><td>Resource successfully created. Use after POST creates a new record. Include <code>Location</code> header pointing to new resource.</td></tr>
          <tr><td><code>202</code></td><td>Accepted</td><td>Request accepted for processing, but processing not complete (async jobs).</td></tr>
          <tr><td><code>204</code></td><td>No Content</td><td>Success but no response body. Use for DELETE or PUT when no body is needed.</td></tr>
          <tr><td><code>206</code></td><td>Partial Content</td><td>Used with <code>Range</code> requests — video streaming, resumable downloads.</td></tr>
        </tbody>
      </table>
      <div className="callout callout-green">
        <p><strong>Common mistake:</strong> Using 200 for everything, even errors. If your API returns <code>{`{"error": "Not found"}`}</code> with a 200 status, clients can't detect failures without parsing the body every time.</p>
      </div>

      <h2>3xx — Redirection</h2>
      <p>The client must take additional action to complete the request.</p>
      <table>
        <thead><tr><th>Code</th><th>Name</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td><code>301</code></td><td>Moved Permanently</td><td>Resource has a new permanent URL. Browsers cache this aggressively. SEO: passes link equity. Use for permanent site migrations.</td></tr>
          <tr><td><code>302</code></td><td>Found</td><td>Temporary redirect. Browser doesn't cache. Method may change to GET on redirect (browser behavior varies).</td></tr>
          <tr><td><code>303</code></td><td>See Other</td><td>Redirect to a different resource after POST. Always changes method to GET. Use after form submission to prevent re-POST on refresh.</td></tr>
          <tr><td><code>304</code></td><td>Not Modified</td><td>Cache is still valid. Server sends no body — client uses cached version. Response to conditional requests with <code>If-None-Match</code> / <code>If-Modified-Since</code>.</td></tr>
          <tr><td><code>307</code></td><td>Temporary Redirect</td><td>Temporary redirect that preserves the HTTP method. POST stays POST.</td></tr>
          <tr><td><code>308</code></td><td>Permanent Redirect</td><td>Like 301 but preserves HTTP method. POST stays POST.</td></tr>
        </tbody>
      </table>
      <div className="callout">
        <p><strong>301 vs 308:</strong> Both are permanent, but 308 guarantees the method doesn't change. If you're redirecting an API endpoint that accepts POST, use 308. For web pages where the browser will follow with GET anyway, 301 is fine.</p>
      </div>

      <h2>4xx — Client Errors</h2>
      <p>The request contains an error. The problem is on the client side.</p>
      <table>
        <thead><tr><th>Code</th><th>Name</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>400</code></td><td>Bad Request</td><td>Malformed request — invalid JSON, missing required fields, invalid parameters. Include error details in response body.</td></tr>
          <tr><td><code>401</code></td><td>Unauthorized</td><td>Authentication required or failed. Despite the name, it means "not authenticated." Should include <code>WWW-Authenticate</code> header.</td></tr>
          <tr><td><code>403</code></td><td>Forbidden</td><td>Authenticated but not authorized. The server understands who you are but won't let you do this.</td></tr>
          <tr><td><code>404</code></td><td>Not Found</td><td>Resource doesn't exist. Can also be used deliberately to hide existence of resources from unauthorized users.</td></tr>
          <tr><td><code>405</code></td><td>Method Not Allowed</td><td>HTTP method not supported for this endpoint. Include <code>Allow</code> header listing valid methods.</td></tr>
          <tr><td><code>408</code></td><td>Request Timeout</td><td>Server timed out waiting for the client to send the request body.</td></tr>
          <tr><td><code>409</code></td><td>Conflict</td><td>Conflict with current resource state — duplicate unique key, optimistic locking failure, or state machine violation.</td></tr>
          <tr><td><code>410</code></td><td>Gone</td><td>Resource existed but was permanently deleted. Unlike 404, communicates intentional removal. Search engines remove 410 pages faster.</td></tr>
          <tr><td><code>413</code></td><td>Content Too Large</td><td>Request body exceeds server limits. Common with file uploads. See Nginx's <code>client_max_body_size</code>.</td></tr>
          <tr><td><code>415</code></td><td>Unsupported Media Type</td><td>Server won't accept the <code>Content-Type</code> of the request body.</td></tr>
          <tr><td><code>422</code></td><td>Unprocessable Entity</td><td>Request syntax is correct but semantically invalid — validation errors on fields. Preferred by many REST APIs over 400 for validation failures.</td></tr>
          <tr><td><code>429</code></td><td>Too Many Requests</td><td>Rate limit exceeded. Should include <code>Retry-After</code> header.</td></tr>
        </tbody>
      </table>

      <h3>401 vs 403 — The Classic Confusion</h3>
      <div className="callout callout-blue">
        <p>
          <strong>401</strong> = "I don't know who you are. Please authenticate."<br/>
          <strong>403</strong> = "I know who you are. You're not allowed to do this."<br/>
          If a user is logged in but tries to access another user's data, return 403, not 401.
        </p>
      </div>

      <h2>5xx — Server Errors</h2>
      <p>The server failed to fulfill a valid request. The problem is on the server side.</p>
      <table>
        <thead><tr><th>Code</th><th>Name</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>500</code></td><td>Internal Server Error</td><td>Generic server error. Something went wrong that wasn't anticipated. Log the error server-side; don't expose stack traces to clients.</td></tr>
          <tr><td><code>501</code></td><td>Not Implemented</td><td>Server doesn't support the requested functionality or HTTP method.</td></tr>
          <tr><td><code>502</code></td><td>Bad Gateway</td><td>Upstream server returned an invalid response. Common when Nginx proxies to a Node.js app that crashed.</td></tr>
          <tr><td><code>503</code></td><td>Service Unavailable</td><td>Server temporarily unable to handle requests — maintenance, overload. Include <code>Retry-After</code> if downtime is known.</td></tr>
          <tr><td><code>504</code></td><td>Gateway Timeout</td><td>Upstream server didn't respond in time. Often seen when a backend is slow or down behind a proxy/load balancer.</td></tr>
        </tbody>
      </table>

      <h2>Quick Decision Guide for API Designers</h2>
      <table>
        <thead><tr><th>Situation</th><th>Status Code</th></tr></thead>
        <tbody>
          <tr><td>GET returns data</td><td>200</td></tr>
          <tr><td>POST creates a resource</td><td>201 + Location header</td></tr>
          <tr><td>DELETE succeeds with no body</td><td>204</td></tr>
          <tr><td>Required field missing</td><td>400 or 422</td></tr>
          <tr><td>No API key provided</td><td>401</td></tr>
          <tr><td>Valid API key, wrong permissions</td><td>403</td></tr>
          <tr><td>Record not found</td><td>404</td></tr>
          <tr><td>Duplicate record conflict</td><td>409</td></tr>
          <tr><td>Rate limited</td><td>429</td></tr>
          <tr><td>Unhandled exception</td><td>500</td></tr>
          <tr><td>Downstream service down</td><td>502 or 503</td></tr>
        </tbody>
      </table>

      <h2>Status Codes in Browser Caching</h2>
      <p>Some status codes have specific caching behavior:</p>
      <ul>
        <li><strong>200</strong> — cached based on response headers (<code>Cache-Control</code>, <code>ETag</code>)</li>
        <li><strong>301</strong> — cached indefinitely by browsers (no expiry) — use cautiously</li>
        <li><strong>302, 307</strong> — generally not cached</li>
        <li><strong>304</strong> — not cached itself; tells browser to use its cached copy</li>
        <li><strong>404, 410</strong> — may be cached for a short time depending on headers</li>
      </ul>

      <h2>Summary</h2>
      <p>
        HTTP status codes are the API's way of communicating clearly with clients. Use 2xx for success, 3xx for redirects, 4xx when the client made an error, and 5xx when your server has a problem. Being precise with status codes — 201 vs 200, 422 vs 400, 403 vs 401 — makes APIs easier to consume and debug.
      </p>
    </>
  )
}
