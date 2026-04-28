'use client'

export default function RequestEntityTooLarge() {
  return (
    <article className="prose-freeutil">
      <p>The 413 Request Entity Too Large error occurs when a client sends a request body larger than the server is configured to accept. It's most common when uploading files or sending large JSON payloads.</p>

      <h2>Fix in Nginx</h2>
      <p>Nginx limits request body size with the <code>client_max_body_size</code> directive. The default is 1MB.</p>
      <pre><code>{`# In nginx.conf or your server block
http {
    client_max_body_size 50M;  # Allow up to 50MB
}

# Or in a specific server block
server {
    client_max_body_size 100M;
}

# Or for a specific location
location /upload {
    client_max_body_size 500M;
}`}</code></pre>
      <p>After editing, reload Nginx: <code>sudo nginx -s reload</code></p>

      <h2>Fix in Apache</h2>
      <pre><code>{`# In httpd.conf or .htaccess
LimitRequestBody 52428800  # 50MB in bytes

# Or in a Directory or Location block
<Location /upload>
    LimitRequestBody 524288000  # 500MB
</Location>`}</code></pre>

      <h2>Fix in Node.js (Express)</h2>
      <pre><code>{`const express = require('express')
const app = express()

// For JSON bodies
app.use(express.json({ limit: '50mb' }))

// For URL-encoded bodies (form data)
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// For file uploads (using multer)
const multer = require('multer')
const upload = multer({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
})`}</code></pre>

      <h2>Fix in PHP</h2>
      <pre><code>{`# In php.ini
upload_max_filesize = 50M
post_max_size = 55M       # must be larger than upload_max_filesize
memory_limit = 128M

# Or in .htaccess (if php_value is enabled)
php_value upload_max_filesize 50M
php_value post_max_size 55M`}</code></pre>

      <h2>Behind a Proxy or Load Balancer</h2>
      <p>If Nginx sits in front of another server (Node.js, Gunicorn, etc.), you need to increase the limit in <strong>both</strong> layers. A common mistake is increasing the limit in Node.js but forgetting Nginx is still blocking at 1MB.</p>

      <h2>Client-side Validation</h2>
      <p>Always validate file size on the frontend before upload to give users immediate feedback:</p>
      <pre><code>{`input.addEventListener('change', (e) => {
  const file = e.target.files[0]
  const maxSize = 50 * 1024 * 1024  // 50MB
  if (file.size > maxSize) {
    alert('File too large. Maximum size is 50MB.')
    e.target.value = ''
  }
})`}</code></pre>
    </article>
  )
}
