export default function SelfSignedCertGuide() {
  return (
    <>
      <h2>What is a Self-signed Certificate?</h2>
      <p>A self-signed certificate is an SSL certificate that is signed by the entity it certifies, rather than by a trusted Certificate Authority (CA). It provides the same encryption as a CA-issued certificate but does not provide trust — browsers will show a security warning when they encounter a self-signed certificate.</p>

      <h2>When to Use Self-signed Certificates</h2>
      <ul>
        <li>Local development (localhost)</li>
        <li>Internal services not exposed to the public internet</li>
        <li>Testing SSL/TLS configuration before deploying real certificates</li>
        <li>IoT devices and embedded systems</li>
        <li>Development Docker containers</li>
      </ul>

      <div className="callout">
        <p>⚠️ Never use self-signed certificates in production for public-facing websites. Use free certificates from Let's Encrypt instead — they are trusted by all major browsers and auto-renew every 90 days.</p>
      </div>

      <h2>Generate with OpenSSL</h2>
      <h3>One-command method (key + certificate together)</h3>
      <pre><code>{`openssl req -x509 -newkey rsa:2048 -nodes \\
  -keyout private.key \\
  -out cert.pem \\
  -days 365 \\
  -subj "/CN=localhost/O=My Dev/C=TH"`}</code></pre>

      <h3>Two-step method</h3>
      <pre><code>{`# Step 1: Generate private key
openssl genrsa -out private.key 2048

# Step 2: Generate certificate
openssl req -x509 -new -nodes \\
  -key private.key \\
  -sha256 -days 365 \\
  -out cert.pem \\
  -subj "/CN=localhost"`}</code></pre>

      <h2>Configure in Nginx</h2>
      <pre><code>{`server {
  listen 443 ssl;
  server_name localhost;

  ssl_certificate     /path/to/cert.pem;
  ssl_certificate_key /path/to/private.key;

  location / {
    # your config
  }
}`}</code></pre>

      <h2>Configure in Node.js</h2>
      <pre><code>{`const https = require('https')
const fs = require('fs')

const options = {
  cert: fs.readFileSync('./cert.pem'),
  key: fs.readFileSync('./private.key')
}

https.createServer(options, (req, res) => {
  res.writeHead(200)
  res.end('Hello HTTPS!')
}).listen(443)`}</code></pre>

      <h2>Trust the Certificate in Your Browser</h2>
      <p>To avoid browser warnings during development, add your self-signed certificate to your system's trusted certificate store:</p>
      <ul>
        <li><strong>macOS</strong>: Open Keychain Access → drag cert.pem → set Trust to "Always Trust"</li>
        <li><strong>Windows</strong>: Double-click cert.pem → Install Certificate → Trusted Root Certification Authorities</li>
        <li><strong>Chrome/Firefox</strong>: Settings → Privacy → Certificates → Import</li>
      </ul>
    </>
  )
}
