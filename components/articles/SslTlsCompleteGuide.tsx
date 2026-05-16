'use client'

export default function SslTlsCompleteGuide() {
  return (
    <article className="prose-freeutil">
      <p>SSL/TLS is the foundation of web security. This guide covers everything in one place — from how TLS actually works, to setting up certificates, to debugging the errors that keep appearing in your logs.</p>

      <h2>How TLS Works (The Short Version)</h2>
      <p>TLS (Transport Layer Security) creates an encrypted tunnel between browser and server. When you visit an HTTPS site, a handshake occurs before any data is exchanged:</p>
      <ol>
        <li><strong>ClientHello</strong> — browser sends supported TLS versions and cipher suites</li>
        <li><strong>ServerHello</strong> — server picks TLS version and cipher, sends its certificate</li>
        <li><strong>Certificate verification</strong> — browser verifies the cert is signed by a trusted CA and matches the domain</li>
        <li><strong>Key exchange</strong> — browser and server use asymmetric crypto (RSA or ECDH) to establish a shared secret</li>
        <li><strong>Session keys</strong> — symmetric keys (AES) derived from the shared secret for fast encryption</li>
        <li><strong>Encrypted communication</strong> — all data from this point is AES-encrypted</li>
      </ol>

      <h2>Certificate Types</h2>
      <table>
        <thead><tr><th>Type</th><th>Validates</th><th>Best for</th></tr></thead>
        <tbody>
          <tr><td>DV (Domain Validated)</td><td>Domain ownership only</td><td>Most websites, Let's Encrypt</td></tr>
          <tr><td>OV (Organization Validated)</td><td>Domain + organization identity</td><td>Business sites, enterprise</td></tr>
          <tr><td>EV (Extended Validation)</td><td>Rigorous organization vetting</td><td>Banks (green bar removed in 2019)</td></tr>
          <tr><td>Wildcard (*.example.com)</td><td>All subdomains of a domain</td><td>Multi-subdomain sites</td></tr>
          <tr><td>Multi-SAN</td><td>Multiple specific domains</td><td>Multiple related domains</td></tr>
        </tbody>
      </table>

      <h2>Get a Free Certificate with Let's Encrypt</h2>
      <pre><code>{`# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate + configure Nginx automatically
sudo certbot --nginx -d example.com -d www.example.com

# Wildcard certificate (requires DNS challenge)
sudo certbot certonly --manual --preferred-challenges dns \
  -d "*.example.com" -d example.com

# Verify auto-renewal
sudo certbot renew --dry-run
sudo systemctl status certbot.timer`}</code></pre>

      <h2>Nginx TLS Configuration</h2>
      <pre><code>{`server {
    listen 443 ssl;
    http2 on;
    server_name example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    # Modern TLS settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305;
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # OCSP stapling (faster cert verification)
    ssl_stapling on;
    ssl_stapling_verify on;
}

# Redirect HTTP → HTTPS
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$host$request_uri;
}`}</code></pre>

      <h2>Debugging SSL Problems</h2>
      <pre><code>{`# Check certificate details
openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -text -noout

# Check expiry
echo | openssl s_client -connect example.com:443 2>/dev/null \
  | openssl x509 -noout -dates

# Check certificate chain
openssl s_client -connect example.com:443 2>/dev/null | grep "Verify return code"
# Should be: 0 (ok)

# Test specific TLS version
openssl s_client -connect example.com:443 -tls1_2
openssl s_client -connect example.com:443 -tls1_3

# Check cipher suites
nmap --script ssl-enum-ciphers -p 443 example.com`}</code></pre>

      <h2>Common SSL Errors and Fixes</h2>
      <table>
        <thead><tr><th>Error</th><th>Cause</th><th>Fix</th></tr></thead>
        <tbody>
          <tr><td>ERR_SSL_PROTOCOL_ERROR</td><td>TLS mismatch, expired cert, or bad config</td><td>Check TLS version, cert expiry, server config</td></tr>
          <tr><td>Certificate expired</td><td>Not renewed in time</td><td><code>certbot renew</code>, set up auto-renewal</td></tr>
          <tr><td>NET::ERR_CERT_AUTHORITY_INVALID</td><td>Self-signed or missing intermediate</td><td>Use CA cert + include full chain</td></tr>
          <tr><td>Certificate name mismatch</td><td>Domain not in SAN</td><td>Reissue cert with correct domains</td></tr>
          <tr><td>Mixed content</td><td>HTTP resources on HTTPS page</td><td>Update all resource URLs to HTTPS</td></tr>
        </tbody>
      </table>

      <h2>Test Your Configuration</h2>
      <pre><code>{`# Online tools
# SSL Labs: ssllabs.com/ssltest — comprehensive test, grades A to F
# Security Headers: securityheaders.com
# Certificate Transparency: crt.sh — see all certs issued for your domain

# Command line
curl -vI https://example.com 2>&1 | grep -E "SSL|TLS|certificate|issuer"

# Check what grade you'd get
# Aim for A or A+ on SSL Labs`}</code></pre>
    </article>
  )
}
