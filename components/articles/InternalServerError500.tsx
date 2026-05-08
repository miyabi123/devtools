'use client'

export default function InternalServerError500() {
  return (
    <article className="prose-freeutil">
      <p>A 500 Internal Server Error is a generic response meaning "something went wrong on the server." The fix requires reading logs to find the actual exception — the 500 itself tells you nothing useful.</p>

      <h2>Step 1: Read the Logs</h2>
      <pre><code>{`# Nginx error log
sudo tail -100 /var/log/nginx/error.log
sudo tail -f /var/log/nginx/error.log  # Follow in real time

# Application logs (adjust path to your app)
sudo journalctl -u myapp -n 100
pm2 logs myapp --lines 100
docker logs container_name --tail 100

# PHP error log
sudo tail -100 /var/log/php/error.log
# Or check php.ini for error_log path`}</code></pre>

      <h2>Common Causes by Platform</h2>

      <h3>Node.js / Express</h3>
      <pre><code>{`// ❌ Unhandled promise rejection → 500
app.get('/users', async (req, res) => {
  const users = await db.query('SELECT * FROM users')  // throws if DB is down
  res.json(users)
})

// ✅ Catch errors properly
app.get('/users', async (req, res) => {
  try {
    const users = await db.query('SELECT * FROM users')
    res.json(users)
  } catch (err) {
    console.error('DB query failed:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Global error handler (catches anything you missed)
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong' })
})`}</code></pre>

      <h3>PHP</h3>
      <pre><code>{`# Enable PHP error display temporarily (development only!)
# php.ini or .htaccess:
display_errors = On
error_reporting = E_ALL

# Check PHP-FPM logs
sudo tail -100 /var/log/php-fpm/www-error.log

# Common PHP 500 causes:
# - Syntax error in a PHP file
# - Wrong file permissions (should be 644 for files, 755 for dirs)
# - Missing PHP extension (e.g., extension=pdo_mysql not enabled)
# - .htaccess syntax error (Apache)`}</code></pre>

      <h3>Python (Django/Flask)</h3>
      <pre><code>{`# Django: check settings.py
DEBUG = True  # Show error pages during development
LOGGING = {
    'version': 1,
    'handlers': {'file': {'class': 'logging.FileHandler', 'filename': '/var/log/app.log'}},
    'root': {'handlers': ['file'], 'level': 'ERROR'},
}

# Common Python 500 causes:
# - Import error (missing package, wrong path)
# - Database migration not run (DoesNotExist, table not found)
# - Environment variable not set
# - Circular import`}</code></pre>

      <h2>Check File Permissions</h2>
      <pre><code>{`# Web server user (www-data on Ubuntu) needs read access to your app files
ls -la /var/www/myapp/

# Fix permissions
sudo chown -R www-data:www-data /var/www/myapp/
sudo chmod -R 755 /var/www/myapp/
sudo chmod -R 644 /var/www/myapp/*.php  # Files readable, not executable`}</code></pre>

      <h2>Isolate the Problem</h2>
      <pre><code>{`# Test specific endpoint directly (bypass Nginx)
curl -v http://localhost:3000/api/endpoint

# Add temporary debug logging around the suspected area
console.log('Before DB query')
const result = await db.query(...)
console.log('After DB query:', result)

# Check if the issue is intermittent (load-related) or constant
# Constant = code error or missing resource
# Intermittent = timeout, memory, or concurrency issue`}</code></pre>
    </article>
  )
}
