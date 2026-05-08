'use client'

export default function CertificateExpiredFix() {
  return (
    <article className="prose-freeutil">
      <p>An expired SSL certificate immediately breaks your site for all visitors — browsers show a hard error page they can't bypass. Here's how to renew quickly and prevent it from happening again.</p>

      <h2>Renew Let's Encrypt with Certbot</h2>
      <pre><code>{`# Renew all certificates that expire within 30 days
sudo certbot renew

# Force renew a specific certificate (even if not expiring soon)
sudo certbot renew --cert-name yourdomain.com --force-renewal

# Renew and automatically reload Nginx
sudo certbot renew --post-hook "systemctl reload nginx"

# Check what certificates you have and their expiry
sudo certbot certificates`}</code></pre>

      <h2>Verify the New Certificate Is Live</h2>
      <pre><code>{`# Check expiry from the command line
echo | openssl s_client -connect yourdomain.com:443 2>/dev/null \
  | openssl x509 -noout -dates

# Check from outside your server (use a different machine or online tool)
curl -vI https://yourdomain.com 2>&1 | grep "expire date"

# After renewal, reload the web server
sudo systemctl reload nginx     # Nginx
sudo systemctl reload apache2   # Apache`}</code></pre>

      <h2>Set Up Auto-Renewal (If Not Already)</h2>
      <pre><code>{`# Check if Certbot timer is running
sudo systemctl status certbot.timer

# If not enabled, enable it
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Test that renewal will work
sudo certbot renew --dry-run

# Alternatively, add a cron job
sudo crontab -e
# Add: 0 3 * * * certbot renew --quiet --post-hook "systemctl reload nginx"`}</code></pre>

      <h2>Renew a Paid Certificate</h2>
      <ol>
        <li>Generate a new CSR from your server (or use your CA's portal)</li>
        <li>Submit the CSR to your CA and complete domain validation</li>
        <li>Download the new certificate files</li>
        <li>Replace the old files on your server</li>
        <li>Reload your web server</li>
      </ol>
      <pre><code>{`# Replace certificate on Nginx
sudo cp new_cert.pem /etc/ssl/certs/yourdomain.crt
sudo cp new_key.pem /etc/ssl/private/yourdomain.key
sudo nginx -t && sudo systemctl reload nginx`}</code></pre>

      <h2>Prevent Future Expiry</h2>
      <ul>
        <li><strong>Enable auto-renewal</strong> — Certbot's systemd timer renews 30 days before expiry</li>
        <li><strong>Monitor certificate expiry</strong> — set up alerts in your monitoring system</li>
        <li><strong>Use a certificate monitoring service</strong> — many free options alert you 30/14/7 days before expiry</li>
      </ul>
      <pre><code>{`# Quick monitoring script — add to cron
#!/bin/bash
DOMAIN="yourdomain.com"
EXPIRY=$(echo | openssl s_client -connect $DOMAIN:443 2>/dev/null \
  | openssl x509 -noout -enddate | cut -d= -f2)
DAYS=$(( ( $(date -d "$EXPIRY" +%s) - $(date +%s) ) / 86400 ))
if [ $DAYS -lt 14 ]; then
  echo "ALERT: $DOMAIN cert expires in $DAYS days" | mail -s "SSL Alert" you@example.com
fi`}</code></pre>
    </article>
  )
}
