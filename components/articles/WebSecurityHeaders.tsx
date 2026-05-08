'use client'

export default function WebSecurityHeaders() {
  return (
    <article className="prose-freeutil">
      <p>HTTP security headers are one of the easiest wins in web security — a few lines of Nginx config significantly reduce your attack surface. Here's every important header, what it does, and how to set it.</p>

      <h2>Content-Security-Policy (CSP)</h2>
      <p>Tells browsers which sources are trusted for scripts, styles, images, and other resources. The most powerful XSS mitigation.</p>
      <pre><code>{`# Basic CSP — allow resources only from same origin
Content-Security-Policy: default-src 'self'

# Typical CSP for a modern web app
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';

# Report violations without blocking (testing mode)
Content-Security-Policy-Report-Only: default-src 'self'; report-uri /csp-report`}</code></pre>

      <h2>Strict-Transport-Security (HSTS)</h2>
      <p>Forces browsers to always use HTTPS for your domain, even if a user types <code>http://</code>.</p>
      <pre><code>{`# Basic HSTS — 1 year
Strict-Transport-Security: max-age=31536000

# Include all subdomains + HSTS preload list
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

# ⚠️ Warning: Only add once you're 100% committed to HTTPS
# The preload directive submits your domain to browsers' hardcoded list`}</code></pre>

      <h2>X-Frame-Options</h2>
      <p>Prevents your page from being embedded in iframes on other sites (clickjacking protection).</p>
      <pre><code>{`X-Frame-Options: DENY         # Never allow framing
X-Frame-Options: SAMEORIGIN   # Allow framing by same origin only

# Modern equivalent via CSP (preferred)
Content-Security-Policy: frame-ancestors 'none'`}</code></pre>

      <h2>X-Content-Type-Options</h2>
      <p>Prevents MIME type sniffing — browsers respect the declared Content-Type instead of guessing.</p>
      <pre><code>{`X-Content-Type-Options: nosniff`}</code></pre>

      <h2>Referrer-Policy</h2>
      <p>Controls how much referrer information is sent when users click links from your site.</p>
      <pre><code>{`Referrer-Policy: strict-origin-when-cross-origin
# → Sends full URL for same-origin, only origin for cross-origin HTTPS, nothing for HTTP`}</code></pre>

      <h2>Permissions-Policy</h2>
      <p>Controls which browser features your page can use (camera, microphone, geolocation, etc.).</p>
      <pre><code>{`Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`}</code></pre>

      <h2>Nginx Configuration</h2>
      <pre><code>{`# /etc/nginx/sites-available/yoursite
server {
    listen 443 ssl http2;
    server_name example.com;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'" always;
}`}</code></pre>

      <h2>Test Your Headers</h2>
      <pre><code>{`# Check current headers
curl -I https://yoursite.com

# Online tools
# securityheaders.com — grades your headers A to F
# observatory.mozilla.org — comprehensive security scan`}</code></pre>
    </article>
  )
}
