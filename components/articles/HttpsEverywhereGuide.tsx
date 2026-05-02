'use client'

export default function HttpsEverywhereGuide() {
  return (
    <>
      <h2>There's No Good Reason to Use HTTP Anymore</h2>
      <p>
        In 2025, running a website on HTTP instead of HTTPS is like leaving your front door unlocked because "I'm not doing anything secret inside." The consequences aren't just about data theft — HTTP affects your search rankings, your users' experience, your browser compatibility, and your legal compliance.
      </p>
      <p>
        More importantly: SSL certificates are free. There's no cost barrier left. Every website should be on HTTPS.
      </p>

      <h2>What Browsers Do to HTTP Sites</h2>
      <p>
        Chrome, Firefox, Safari, and Edge now actively warn users about HTTP sites. The progression has been relentless:
      </p>
      <ul>
        <li>2017 — Chrome started showing "Not Secure" on HTTP pages with password or payment fields</li>
        <li>2018 — Chrome extended "Not Secure" to ALL HTTP pages</li>
        <li>2020 — Chrome started blocking "mixed content" (HTTP resources on HTTPS pages) by default</li>
        <li>2023+ — Browsers began blocking HTTP downloads on HTTPS pages and showing full-page interstitials for dangerous HTTP connections</li>
      </ul>
      <p>
        A user who sees "Not Secure" in the address bar for your business website will question whether to trust it with their information — or trust it at all.
      </p>

      <h2>HTTPS and SEO Rankings</h2>
      <p>
        Google has used HTTPS as a ranking signal since 2014. While it's described as a "lightweight signal," the real SEO impact comes from user behavior: visitors who see a security warning leave faster, increasing bounce rate — which is a strong negative ranking signal.
      </p>
      <p>
        Additionally, Google's crawl rate and indexing can be affected for HTTP sites, and the Chrome "Not Secure" label directly reduces click-through rates from search results.
      </p>

      <h2>HTTPS Protects More Than Just Passwords</h2>
      <p>Without HTTPS, attackers (or your ISP) can:</p>
      <ul>
        <li><strong>Read everything</strong> — forms, search queries, pages viewed, even "anonymous" browsing</li>
        <li><strong>Inject content</strong> — ISPs are known to inject ads into HTTP pages; attackers can inject malware</li>
        <li><strong>Steal session cookies</strong> — HTTP cookies can be captured and used to hijack sessions</li>
        <li><strong>Perform MITM attacks</strong> — substitute malicious content or steal data in transit</li>
        <li><strong>Track users</strong> — without HTTPS, "referrer" headers leak which pages users visited</li>
      </ul>

      <h2>Even Static Sites Need HTTPS</h2>
      <p>
        "My site doesn't collect any data, so what's there to protect?" — This misses several important points:
      </p>
      <ul>
        <li><strong>Your users' privacy</strong> — even reading a blog post reveals something about interests. HTTP makes that visible to ISPs and network operators.</li>
        <li><strong>Content integrity</strong> — without HTTPS, ISPs and WiFi operators can modify your page content, inject ads, or substitute malicious scripts.</li>
        <li><strong>HTTP/2 and HTTP/3</strong> — both modern protocols work only over HTTPS. Your site will be significantly slower on HTTP for users on high-latency connections.</li>
        <li><strong>Browser features</strong> — Service Workers (for PWA), Geolocation, Camera/Microphone, Push Notifications, and Web Bluetooth all require HTTPS.</li>
        <li><strong>Referrer headers</strong> — HTTP sites don't receive the referring URL when visitors come from HTTPS sites. You lose analytics data about traffic sources.</li>
      </ul>

      <h2>Legal and Compliance Considerations</h2>
      <p>
        Many data protection laws require "appropriate technical measures" to protect personal data. HTTPS is consistently cited as a baseline requirement:
      </p>
      <ul>
        <li><strong>GDPR (Europe)</strong> — Article 32 requires encryption in transit for personal data</li>
        <li><strong>PDPA (Thailand)</strong> — requires adequate security measures for personal data</li>
        <li><strong>PCI DSS</strong> — requires TLS 1.2+ for all cardholder data environments</li>
        <li><strong>HIPAA (US healthcare)</strong> — requires encryption for protected health information</li>
      </ul>
      <p>
        Even if you just have a contact form, you're collecting personal data (name, email). Processing that over HTTP is arguably non-compliant with PDPA and GDPR.
      </p>

      <h2>How to Get HTTPS for Free</h2>
      <h3>Option 1: Cloudflare (Easiest)</h3>
      <p>
        Add your domain to Cloudflare (free plan) → Update your name servers → HTTPS is active within minutes. Cloudflare issues a free SSL certificate and handles renewals automatically. Works with any hosting provider.
      </p>

      <h3>Option 2: Let's Encrypt with Certbot</h3>
      <pre><code>{`# Nginx on Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d example.com -d www.example.com

# Auto-renewal test
sudo certbot renew --dry-run`}</code></pre>

      <h3>Option 3: Your hosting provider</h3>
      <p>
        Most modern hosting providers — Vercel, Netlify, Render, Railway, DigitalOcean App Platform — issue Let's Encrypt certificates automatically. Check your hosting dashboard; HTTPS may already be available with one click.
      </p>

      <h2>Common Migration Issues</h2>
      <h3>Mixed Content</h3>
      <p>
        After migrating to HTTPS, check for "mixed content" — HTTP resources (images, scripts, fonts) loaded on an HTTPS page. Browsers block active mixed content (scripts, iframes) and warn about passive mixed content (images).
      </p>
      <pre><code>{`# Find mixed content in your HTML
grep -r "http://" ./public --include="*.html" | grep -v "https://"`}</code></pre>

      <h3>Update hardcoded HTTP URLs</h3>
      <p>
        Change absolute URLs in your code, database, and CMS from <code>http://example.com</code> to <code>https://example.com</code> or protocol-relative <code>//example.com</code>.
      </p>

      <h3>Set up HTTP → HTTPS redirects</h3>
      <pre><code>{`# Nginx: redirect HTTP to HTTPS
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$host$request_uri;
}

# Apache: in .htaccess
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`}</code></pre>

      <h3>Update canonical tags and sitemap</h3>
      <p>
        Change all canonical tags and sitemap URLs from <code>http://</code> to <code>https://</code>. Update Google Search Console with the HTTPS version of your site.
      </p>

      <h2>Summary</h2>
      <p>
        HTTPS is no longer optional. It protects your users, improves your search rankings, enables modern browser features, satisfies legal requirements, and costs nothing. Free SSL via Cloudflare or Let's Encrypt takes 30 minutes to set up. Run the migration, fix mixed content, set up redirects, and your users and search engines will both thank you.
      </p>
    </>
  )
}
