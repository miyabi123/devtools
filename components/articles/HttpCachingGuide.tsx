'use client'

export default function HttpCachingGuide() {
  return (
    <article className="prose-freeutil">
      <p>HTTP caching reduces server load and speeds up repeat visits. When implemented correctly, returning visitors load your pages near-instantly from their local cache or a CDN edge node.</p>

      <h2>Cache-Control Header</h2>
      <p>The primary header for controlling caching behavior:</p>
      <table>
        <thead><tr><th>Directive</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>max-age=N</code></td><td>Cache for N seconds</td></tr>
          <tr><td><code>no-cache</code></td><td>Must revalidate with server before using cached copy</td></tr>
          <tr><td><code>no-store</code></td><td>Never cache (sensitive data like bank pages)</td></tr>
          <tr><td><code>public</code></td><td>Can be cached by CDNs and shared caches</td></tr>
          <tr><td><code>private</code></td><td>Only browser cache (user-specific data)</td></tr>
          <tr><td><code>immutable</code></td><td>Never revalidate (for hashed filenames)</td></tr>
          <tr><td><code>must-revalidate</code></td><td>Revalidate when stale (don't use stale copies)</td></tr>
          <tr><td><code>s-maxage=N</code></td><td>Override max-age for shared caches (CDNs)</td></tr>
        </tbody>
      </table>

      <h2>Caching Strategy by Content Type</h2>
      <pre><code>{`# Static assets with hashed filenames (app.a3f9b2.js, style.8d4c1e.css)
Cache-Control: public, max-age=31536000, immutable
# → Cache for 1 year, never revalidate — safe because filename changes on update

# Static assets without hashes (logo.png, fonts/font.woff2)
Cache-Control: public, max-age=604800  # 1 week
# → Cache for a week, will check for updates after

# HTML pages
Cache-Control: public, max-age=3600, must-revalidate  # 1 hour
# → Cache for 1 hour, then revalidate

# User-specific pages (dashboard, account)
Cache-Control: private, max-age=0, must-revalidate
# → Only browser cache, revalidate always

# Sensitive/financial data
Cache-Control: no-store
# → Never cache`}</code></pre>

      <h2>ETags — Conditional Requests</h2>
      <p>An ETag is a fingerprint of the content. The browser caches the ETag and sends it back with subsequent requests. If the content hasn't changed, the server returns 304 Not Modified (no body = faster).</p>
      <pre><code>{`# Server response
HTTP/1.1 200 OK
ETag: "abc123def456"
Cache-Control: max-age=3600

# Browser's conditional request after cache expires
GET /api/data
If-None-Match: "abc123def456"

# Server response if unchanged (tiny response, no body)
HTTP/1.1 304 Not Modified

# Server response if changed (full response with new ETag)
HTTP/1.1 200 OK
ETag: "xyz789uvw012"
...body...`}</code></pre>

      <h2>Nginx Cache Headers</h2>
      <pre><code>{`server {
    # Cache hashed static assets for 1 year
    location ~* \.(js|css|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
    }

    # Cache images for 1 week
    location ~* \.(png|jpg|webp|svg|ico)$ {
        expires 7d;
        add_header Cache-Control "public";
    }

    # Don't cache HTML
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, must-revalidate";
    }
}`}</code></pre>

      <h2>Cache Invalidation</h2>
      <p>The hard problem: how do you update a resource that's cached for a year?</p>
      <ul>
        <li><strong>Hash-based filenames</strong> — <code>app.a3f9b2.js</code>. When the content changes, the hash changes, the filename changes, the old cache is never used. This is why bundlers like webpack and Vite add content hashes.</li>
        <li><strong>Versioned URLs</strong> — <code>/api/v2/users</code> or <code>?v=2</code></li>
        <li><strong>CDN cache purge</strong> — Cloudflare and most CDNs let you purge specific URLs or the entire cache via API</li>
        <li><strong>Short TTL</strong> — accept some staleness, set max-age to minutes instead of years</li>
      </ul>
    </article>
  )
}
