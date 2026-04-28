'use client'

export default function NginxSslLetsEncrypt() {
  return (
    <article className="prose-freeutil">
      <p>This guide walks through enabling HTTPS on an Nginx server using Let's Encrypt and Certbot — from installation to auto-renewal and security headers. By the end, your site will have a valid TLS certificate that renews automatically.</p>

      <h2>Prerequisites</h2>
      <ul>
        <li>Ubuntu 20.04+ or Debian 11+ server</li>
        <li>Nginx installed and serving your site on port 80</li>
        <li>A domain pointing to your server's IP (A record)</li>
        <li>Port 80 and 443 open in your firewall</li>
      </ul>

      <h2>Step 1: Install Certbot</h2>
      <pre><code>{`sudo apt update
sudo apt install certbot python3-certbot-nginx`}</code></pre>

      <h2>Step 2: Obtain a Certificate</h2>
      <p>Certbot can configure Nginx automatically. Run with the <code>--nginx</code> flag and specify your domains:</p>
      <pre><code>{`sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com`}</code></pre>
      <p>Certbot will: verify domain ownership via HTTP challenge, obtain the certificate, and modify your Nginx config to enable HTTPS with a redirect from HTTP.</p>
      <p>For a wildcard certificate (covers all subdomains), use the DNS challenge instead:</p>
      <pre><code>{`sudo certbot certonly --manual --preferred-challenges dns \\
  -d "*.yourdomain.com" -d "yourdomain.com"
# You'll need to add a TXT DNS record to your domain`}</code></pre>

      <h2>Step 3: Verify Your Nginx Config</h2>
      <p>After Certbot runs, your Nginx server block will look similar to this:</p>
      <pre><code>{`server {
    listen 443 ssl;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /var/www/html;
    index index.html;
    location / { try_files $uri $uri/ =404; }
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;  # Redirect HTTP → HTTPS
}`}</code></pre>

      <h2>Step 4: Test and Reload Nginx</h2>
      <pre><code>{`sudo nginx -t          # Test config for syntax errors
sudo systemctl reload nginx  # Apply changes`}</code></pre>

      <h2>Step 5: Verify Auto-renewal</h2>
      <p>Certbot installs a systemd timer that runs twice daily. Test that it works:</p>
      <pre><code>{`sudo certbot renew --dry-run  # Simulates renewal without making changes
sudo systemctl status certbot.timer  # Check timer is active`}</code></pre>
      <p>Certificates will auto-renew when they have less than 30 days remaining.</p>

      <h2>Step 6: Add Security Headers</h2>
      <p>Add these headers to your Nginx config for a better security posture:</p>
      <pre><code>{`server {
    # ... SSL config from above ...

    # HSTS — tell browsers to always use HTTPS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Prevent clickjacking
    add_header X-Frame-Options "SAMEORIGIN" always;

    # Prevent MIME type sniffing
    add_header X-Content-Type-Options "nosniff" always;

    # Control referrer information
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}`}</code></pre>

      <h2>Checking Your SSL Configuration</h2>
      <pre><code>{`# Check certificate details and expiry
openssl s_client -connect yourdomain.com:443 -showcerts 2>/dev/null | openssl x509 -noout -dates

# Check which TLS versions are supported
nmap --script ssl-enum-ciphers -p 443 yourdomain.com`}</code></pre>
      <p>You can also test your configuration at SSL Labs (ssllabs.com/ssltest/) for a detailed security report and grade.</p>
    </article>
  )
}
