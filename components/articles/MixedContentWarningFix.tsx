'use client'

export default function MixedContentWarningFix() {
  return (
    <article className="prose-freeutil">
      <p>Mixed content warnings appear when an HTTPS page loads resources (images, scripts, stylesheets) over HTTP. Browsers block or warn about these requests because they undermine the security of the HTTPS connection.</p>

      <h2>Types of Mixed Content</h2>
      <ul>
        <li><strong>Active mixed content</strong> — scripts and iframes loaded over HTTP. Browsers <em>block</em> these entirely. Causes broken functionality.</li>
        <li><strong>Passive mixed content</strong> — images, audio, video over HTTP. Browsers <em>warn</em> but may load them. Causes the padlock to disappear.</li>
      </ul>

      <h2>Find Mixed Content</h2>
      <pre><code>{`# Browser DevTools → Console tab
# Look for: "Mixed Content: The page was loaded over HTTPS, but..."

# Browser DevTools → Network tab
# Filter by "http://" — any resource on a different protocol is mixed content

# Command line scan with curl (basic check)
curl -s https://yoursite.com | grep -o 'src="http://[^"]*"'
curl -s https://yoursite.com | grep -o 'href="http://[^"]*"'`}</code></pre>

      <h2>Fix: Update Hardcoded HTTP URLs</h2>
      <pre><code>{`# Find and replace http:// with https:// in your codebase
grep -r 'http://' ./src/ --include="*.html" --include="*.js" --include="*.css"

# Replace in files
sed -i 's|http://yoursite.com|https://yoursite.com|g' ./src/**/*.html

# Database: if URLs are stored in DB (e.g. WordPress)
UPDATE wp_options SET option_value = REPLACE(option_value, 'http://', 'https://') 
WHERE option_name IN ('siteurl', 'home');`}</code></pre>

      <h2>Fix: WordPress Mixed Content</h2>
      <pre><code>{`# Plugin: "Better Search Replace" or "Really Simple SSL"
# Both will scan and replace http:// with https:// in the database

# Manual wp-config.php fix
define('WP_HOME', 'https://yoursite.com');
define('WP_SITEURL', 'https://yoursite.com');

# wp-config.php: force SSL
define('FORCE_SSL_ADMIN', true);
if (strpos($_SERVER['HTTP_X_FORWARDED_PROTO'], 'https') !== false)
    $_SERVER['HTTPS'] = 'on';`}</code></pre>

      <h2>Fix: Content Security Policy Header</h2>
      <p>Add a CSP header to automatically upgrade HTTP requests to HTTPS:</p>
      <pre><code>{`# Nginx — upgrade all insecure requests automatically
add_header Content-Security-Policy "upgrade-insecure-requests" always;

# HTML meta tag (if you can't set headers)
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">`}</code></pre>

      <h2>Fix: Protocol-Relative URLs</h2>
      <p>Use protocol-relative URLs (<code>//</code>) for external resources to automatically match the page protocol:</p>
      <pre><code>{`<!-- ❌ Will cause mixed content on HTTPS -->
<script src="http://cdn.example.com/lib.js"></script>

<!-- ✅ Uses same protocol as the page -->
<script src="//cdn.example.com/lib.js"></script>

<!-- ✅ Even better: explicit HTTPS -->
<script src="https://cdn.example.com/lib.js"></script>`}</code></pre>
    </article>
  )
}
