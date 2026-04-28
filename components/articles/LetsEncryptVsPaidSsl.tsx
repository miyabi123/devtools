'use client'

export default function LetsEncryptVsPaidSsl() {
  return (
    <article className="prose-freeutil">
      <p>
        Let's Encrypt launched in 2016 and fundamentally changed the SSL market — free, automated certificates trusted by all major browsers. Today, over 300 million websites use Let's Encrypt. But paid SSL certificates still exist and still have legitimate use cases. Here's how to decide.
      </p>

      <h2>What Let's Encrypt Provides</h2>
      <p>
        Let's Encrypt issues Domain Validated (DV) certificates — the CA verifies you control the domain, nothing more. This provides the same encrypted connection as paid certificates. The padlock icon in the browser looks identical.
      </p>
      <ul>
        <li><strong>Cost:</strong> Free</li>
        <li><strong>Validation type:</strong> Domain Validated (DV)</li>
        <li><strong>Validity period:</strong> 90 days (designed for auto-renewal)</li>
        <li><strong>Wildcard support:</strong> Yes (<code>*.yourdomain.com</code>) via DNS challenge</li>
        <li><strong>SAN support:</strong> Yes — multiple domains per certificate</li>
        <li><strong>Browser trust:</strong> All major browsers</li>
        <li><strong>Warranty:</strong> None</li>
        <li><strong>Auto-renewal:</strong> Via Certbot or ACME clients</li>
      </ul>

      <h2>Certificate Validation Types</h2>
      <p>
        The main thing paid certificates offer that Let's Encrypt doesn't is higher validation tiers:
      </p>
      <table>
        <thead>
          <tr><th>Type</th><th>Verifies</th><th>Browser display</th><th>Cost</th></tr>
        </thead>
        <tbody>
          <tr><td>DV (Domain Validated)</td><td>Domain ownership only</td><td>Padlock only</td><td>Free–$50/yr</td></tr>
          <tr><td>OV (Organization Validated)</td><td>Domain + organization identity</td><td>Padlock (cert details show org)</td><td>$50–$200/yr</td></tr>
          <tr><td>EV (Extended Validation)</td><td>Domain + rigorous org vetting</td><td>Padlock (no green bar since 2019)</td><td>$100–$500/yr</td></tr>
        </tbody>
      </table>
      <p>
        Note: Chrome and Firefox removed the green address bar for EV certificates in 2019. EV certificates no longer provide any visible difference to users in modern browsers — the padlock looks the same as DV.
      </p>

      <h2>When Let's Encrypt Is Sufficient</h2>
      <p>
        Let's Encrypt is sufficient for the vast majority of websites:
      </p>
      <ul>
        <li>Personal websites and blogs</li>
        <li>Small to medium business websites</li>
        <li>Web applications and SaaS products</li>
        <li>APIs and internal services</li>
        <li>Development and staging environments</li>
        <li>Any site where technical encryption is the goal</li>
      </ul>

      <h2>When a Paid Certificate May Be Worth It</h2>
      <ul>
        <li>
          <strong>OV certificates for enterprise trust:</strong> Some enterprise clients, procurement processes, or compliance requirements specify OV certificates to verify the organization's identity in certificate details.
        </li>
        <li>
          <strong>Warranty for financial liability:</strong> Paid certificates include a warranty ($10K–$1.75M depending on tier) that covers losses if the CA misisues a certificate and causes financial harm. This matters for banks and high-stakes financial services.
        </li>
        <li>
          <strong>Cannot automate renewal:</strong> Some hosting environments or load balancers don't support ACME protocol automation. A 1–2 year paid certificate avoids manual 90-day renewal.
        </li>
        <li>
          <strong>Legacy system compatibility:</strong> Very old systems (Windows XP before SP3, Android before 2.3) don't trust Let's Encrypt's cross-signed root. Paid CAs with older roots may have slightly better legacy compatibility.
        </li>
        <li>
          <strong>Dedicated support:</strong> Paid CAs offer human support for certificate issues — useful in time-sensitive production incidents.
        </li>
      </ul>

      <h2>Setting Up Let's Encrypt with Certbot</h2>
      <pre><code>{`# Install Certbot (Ubuntu/Debian)
sudo apt install certbot python3-certbot-nginx

# Get certificate and configure Nginx automatically
sudo certbot --nginx -d example.com -d www.example.com

# Get wildcard certificate (requires DNS challenge)
sudo certbot certonly --manual --preferred-challenges dns \\
  -d "*.example.com" -d example.com

# Test auto-renewal
sudo certbot renew --dry-run

# Check renewal timer
sudo systemctl status certbot.timer`}</code></pre>

      <h2>The Verdict</h2>
      <p>
        For 95% of use cases, Let's Encrypt is the right choice — it's free, automatic, and provides identical encryption to paid alternatives. The remaining 5% where paid makes sense: compliance requirements mandating OV/EV, financial services needing warranty coverage, or legacy systems that can't automate 90-day renewal.
      </p>
    </article>
  )
}
