'use client'

export default function ErrSslProtocolError() {
  return (
    <article className="prose-freeutil">
      <p>ERR_SSL_PROTOCOL_ERROR appears in Chrome when the browser cannot establish a secure TLS connection. It's one of the more cryptic SSL errors because it can have many root causes — here's how to diagnose and fix each one.</p>

      <h2>Common Causes</h2>

      <h3>1. Expired Certificate</h3>
      <p>The most frequent cause. Certificates have a validity period — once expired, the browser rejects the connection immediately.</p>
      <p>Check: paste the domain into a certificate decoder, or run:</p>
      <pre><code>{`echo | openssl s_client -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates`}</code></pre>
      <p>Fix: renew the certificate. With Let's Encrypt: <code>sudo certbot renew</code>.</p>

      <h3>2. TLS Version Mismatch</h3>
      <p>If the server only supports TLS 1.0 or 1.1, Chrome 98+ will refuse to connect — these versions are deprecated. Check which TLS versions your server supports:</p>
      <pre><code>{`# Check supported TLS versions
nmap --script ssl-enum-ciphers -p 443 yourdomain.com

# Or with OpenSSL
openssl s_client -connect yourdomain.com:443 -tls1_2
openssl s_client -connect yourdomain.com:443 -tls1_3`}</code></pre>
      <p>Fix in Nginx — restrict to TLS 1.2 and 1.3:</p>
      <pre><code>{`ssl_protocols TLSv1.2 TLSv1.3;`}</code></pre>

      <h3>3. Self-signed Certificate</h3>
      <p>Browsers don't trust self-signed certificates by default. For development, either add a browser exception or use a tool like <code>mkcert</code> to create a locally-trusted certificate:</p>
      <pre><code>{`# Install mkcert
brew install mkcert  # macOS
mkcert -install       # installs local CA
mkcert localhost 127.0.0.1  # creates trusted cert`}</code></pre>

      <h3>4. Incomplete Certificate Chain</h3>
      <p>If the server doesn't send the intermediate certificate(s), some clients will show this error. Nginx needs the full chain concatenated:</p>
      <pre><code>{`# Concatenate cert + intermediate
cat certificate.crt intermediate.crt > fullchain.pem
# Then in nginx.conf:
ssl_certificate /path/to/fullchain.pem;`}</code></pre>

      <h3>5. Localhost HTTPS Issues</h3>
      <p>For local development, use <code>mkcert</code> (above) or ensure you're using <code>127.0.0.1</code> rather than <code>localhost</code> if your cert was issued for one but not the other.</p>

      <h3>6. Antivirus / Firewall Interference</h3>
      <p>Some antivirus software performs SSL inspection by intercepting HTTPS connections and re-signing them with its own certificate. If the CA used for this isn't trusted by Chrome, you'll get this error. Temporarily disable SSL inspection in your security software to test.</p>

      <h3>7. System Date/Time Wrong</h3>
      <p>TLS certificates are validated against the current time. If your system clock is significantly wrong, all SSL connections may fail. Ensure NTP is running and your clock is synchronized.</p>

      <h2>Quick Diagnostic Checklist</h2>
      <ol>
        <li>Is the certificate expired? → Renew it</li>
        <li>Is the server only supporting TLS 1.0/1.1? → Upgrade to TLS 1.2+</li>
        <li>Is the certificate self-signed? → Use mkcert for dev, Let's Encrypt for production</li>
        <li>Is the certificate chain complete? → Concatenate cert + intermediate</li>
        <li>Is the system clock correct? → Check NTP</li>
        <li>Does the issue affect all sites? → Check antivirus SSL inspection</li>
      </ol>
    </article>
  )
}
