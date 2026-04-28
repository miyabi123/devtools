'use client'

export default function HttpsVsHttp() {
  return (
    <article className="prose-freeutil">
      <p>
        If you've ever noticed the padlock icon in your browser's address bar, you've seen HTTPS in action. But what exactly is the difference between HTTP and HTTPS, and why does it matter for your website and your users?
      </p>

      <h2>The Core Difference</h2>
      <p>
        HTTP (HyperText Transfer Protocol) is the foundation of data communication on the web. When you visit a website over HTTP, data travels between your browser and the server in plain text — readable by anyone who can intercept the connection.
      </p>
      <p>
        HTTPS (HTTP Secure) is HTTP with an added layer of encryption provided by TLS (Transport Layer Security). The same data is transmitted, but it's encrypted in transit — unreadable to anyone intercepting the connection.
      </p>

      <h2>How TLS Encryption Works</h2>
      <p>
        When your browser connects to an HTTPS site, a TLS handshake occurs before any data is exchanged:
      </p>
      <ol>
        <li>The server presents its SSL/TLS certificate, which contains its public key.</li>
        <li>The browser verifies the certificate is signed by a trusted Certificate Authority (CA).</li>
        <li>Browser and server negotiate a shared encryption key using asymmetric cryptography.</li>
        <li>All subsequent communication uses symmetric encryption with that shared key.</li>
      </ol>
      <p>
        The entire handshake takes milliseconds. After it completes, everything — headers, cookies, request bodies, response data — is encrypted.
      </p>

      <h2>What HTTPS Protects Against</h2>
      <table>
        <thead>
          <tr><th>Attack</th><th>HTTP</th><th>HTTPS</th></tr>
        </thead>
        <tbody>
          <tr><td>Eavesdropping (ISP, Wi-Fi sniffing)</td><td>❌ Vulnerable</td><td>✅ Protected</td></tr>
          <tr><td>Man-in-the-middle attacks</td><td>❌ Vulnerable</td><td>✅ Protected</td></tr>
          <tr><td>Content injection (ads, malware)</td><td>❌ Vulnerable</td><td>✅ Protected</td></tr>
          <tr><td>Cookie theft</td><td>❌ Vulnerable</td><td>✅ Protected</td></tr>
          <tr><td>Session hijacking</td><td>❌ Vulnerable</td><td>✅ Protected</td></tr>
        </tbody>
      </table>
      <p>
        HTTPS does <strong>not</strong> protect against attacks on the server itself, vulnerabilities in your application code, or phishing (a fake HTTPS site is still a fake site).
      </p>

      <h2>Performance: Is HTTPS Slower?</h2>
      <p>
        HTTPS used to add noticeable latency due to the TLS handshake. With TLS 1.3 (the current standard), this overhead is minimal — typically adding only one additional round trip for new connections. For returning visitors, session resumption means zero additional round trips.
      </p>
      <p>
        In practice, HTTPS is often <em>faster</em> than HTTP because it enables HTTP/2 and HTTP/3, which offer multiplexing, header compression, and other optimizations that browsers only enable over encrypted connections.
      </p>

      <h2>SEO and Browser Behavior</h2>
      <p>
        Google has used HTTPS as a ranking signal since 2014. Sites served over HTTP receive a small ranking penalty compared to HTTPS equivalents. More importantly, Chrome and Firefox now mark all HTTP sites as "Not Secure" in the address bar — a warning that visibly erodes user trust.
      </p>
      <p>
        Some browser features are also restricted to HTTPS-only contexts: Service Workers, geolocation, camera/microphone access, Web Crypto API, and push notifications all require a secure origin.
      </p>

      <h2>Getting HTTPS for Free</h2>
      <p>
        Let's Encrypt provides free, automated SSL/TLS certificates trusted by all major browsers. Certbot (the recommended Let's Encrypt client) can configure Nginx or Apache automatically and set up auto-renewal. There is no longer any reason to serve a website over HTTP.
      </p>
      <pre><code>{`# Install Certbot and get a certificate for Nginx
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Certificates auto-renew via a systemd timer
sudo certbot renew --dry-run`}</code></pre>

      <h2>HTTP to HTTPS Redirect</h2>
      <p>
        After enabling HTTPS, redirect all HTTP traffic to HTTPS so users and search engines always use the secure version:
      </p>
      <pre><code>{`# Nginx — redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

# Apache — redirect in .htaccess
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`}</code></pre>

      <h2>HSTS — Locking In HTTPS</h2>
      <p>
        HTTP Strict Transport Security (HSTS) tells browsers to always use HTTPS for your domain — even if a user manually types http://. Add this header to your HTTPS responses:
      </p>
      <pre><code>{`Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`}</code></pre>
      <p>
        The <code>preload</code> directive allows submission to the HSTS preload list, hardcoding your domain as HTTPS-only in browsers before any connection is made.
      </p>
    </article>
  )
}
