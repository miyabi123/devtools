'use client'

export default function CloudflareFreeGuide() {
  return (
    <>
      <h2>What is Cloudflare?</h2>
      <p>
        Cloudflare is a global network that sits between your users and your web server, providing CDN, DDoS protection, DNS, SSL, and a growing suite of developer tools. What makes it remarkable is how much you get completely free. For many small to medium websites, the free tier covers everything you need.
      </p>

      <h2>What's Included in the Free Plan</h2>
      <h3>CDN (Content Delivery Network)</h3>
      <p>
        Cloudflare caches your static assets (images, CSS, JS) on 300+ edge locations worldwide. When a user in Bangkok visits your site, they get files from the nearest Cloudflare server rather than your origin server in a US data center. Dramatically faster load times globally.
      </p>

      <h3>Free SSL/TLS</h3>
      <p>
        Automatic HTTPS with a Cloudflare-issued SSL certificate. Enables HTTPS on your site even if your origin server doesn't have SSL configured (Cloudflare handles it at the edge). Automatic HTTP → HTTPS redirects.
      </p>

      <h3>DDoS Protection</h3>
      <p>
        Unmetered DDoS mitigation is included on all plans including free. Cloudflare absorbs attack traffic at the edge before it reaches your server. This is enterprise-grade protection that would cost thousands per month elsewhere.
      </p>

      <h3>DNS</h3>
      <p>
        Cloudflare's authoritative DNS is among the fastest in the world. Free for any domain you add to Cloudflare. Change DNS records with near-instant propagation (compared to hours on other providers).
      </p>

      <h3>Cloudflare Pages</h3>
      <p>
        Deploy unlimited static sites for free. Connect your GitHub/GitLab repository and every push auto-deploys. Custom domains, preview URLs for every PR, unlimited bandwidth on free tier.
      </p>
      <pre><code>{`# Deploy with Wrangler CLI
npm install -g wrangler
wrangler pages deploy ./dist --project-name my-site`}</code></pre>

      <h3>Cloudflare Workers (Free)</h3>
      <p>
        100,000 requests/day free. Run JavaScript/TypeScript at the edge — no cold starts, deployed globally in milliseconds. Great for API endpoints, redirects, authentication, A/B testing.
      </p>
      <pre><code>{`export default {
  async fetch(request) {
    return new Response('Hello from the edge!', {
      headers: { 'Content-Type': 'text/plain' },
    })
  },
}`}</code></pre>

      <h3>R2 Object Storage</h3>
      <p>
        10 GB free storage, no egress fees (unlike AWS S3). S3-compatible API. Great for storing user uploads, backups, and static assets without the surprising bandwidth bills.
      </p>

      <h3>Analytics</h3>
      <p>
        Basic traffic analytics without JavaScript — Cloudflare sees all traffic at the network level. No cookies, GDPR-friendly, doesn't slow your page. Shows requests, bandwidth, threats blocked, and top countries.
      </p>

      <h3>Firewall Rules (5 free)</h3>
      <p>
        Block, challenge, or allow traffic based on IP, country, ASN, user agent, URI path, and more. Free tier gets 5 rules — enough to block known bad actors or restrict admin paths.
      </p>

      <h2>Setting Up Cloudflare — Step by Step</h2>
      <h3>Step 1: Add your site</h3>
      <p>
        Sign up at cloudflare.com → Add a Site → Enter your domain → Select Free plan.
      </p>

      <h3>Step 2: Review imported DNS records</h3>
      <p>
        Cloudflare scans your existing DNS records and imports them. Review the list carefully — make sure all A, CNAME, MX, and TXT records are present before switching name servers.
      </p>

      <h3>Step 3: Update name servers at your registrar</h3>
      <p>
        Cloudflare gives you two name servers (e.g., <code>aria.ns.cloudflare.com</code>, <code>bob.ns.cloudflare.com</code>). Log in to your domain registrar (Namecheap, GoDaddy, Google Domains, etc.) and replace the existing name servers with Cloudflare's.
      </p>

      <h3>Step 4: Wait for propagation (up to 24h, usually minutes)</h3>
      <p>
        Cloudflare will send an email when your domain is active. Usually takes 5–30 minutes.
      </p>

      <h3>Step 5: Configure SSL/TLS mode</h3>
      <p>In SSL/TLS → Overview, choose your encryption mode:</p>
      <table>
        <thead><tr><th>Mode</th><th>When to use</th></tr></thead>
        <tbody>
          <tr><td>Off</td><td>Don't use. HTTP only.</td></tr>
          <tr><td>Flexible</td><td>HTTPS to visitor, HTTP to origin. Use only if your origin has no SSL.</td></tr>
          <tr><td>Full</td><td>HTTPS both ways, but doesn't verify origin certificate.</td></tr>
          <tr><td>Full (Strict)</td><td>Recommended. HTTPS both ways, verifies origin certificate.</td></tr>
        </tbody>
      </table>

      <h3>Step 6: Enable "Always Use HTTPS"</h3>
      <p>SSL/TLS → Edge Certificates → Always Use HTTPS → On. Redirects all HTTP requests to HTTPS.</p>

      <h2>Useful Free Features to Enable</h2>
      <ul>
        <li><strong>Speed → Optimization → Auto Minify</strong> — minify HTML, CSS, JS automatically</li>
        <li><strong>Speed → Optimization → Brotli</strong> — compress text assets with Brotli</li>
        <li><strong>Caching → Configuration → Browser Cache TTL</strong> — set longer cache for static assets</li>
        <li><strong>Security → Settings → Security Level</strong> — set to "Medium" to filter obvious bots</li>
        <li><strong>Rules → Page Rules</strong> — 3 free rules for cache control, redirects, security</li>
      </ul>

      <h2>Cloudflare Pages for Static Sites</h2>
      <pre><code>{`# Connect GitHub repo via dashboard, or deploy manually:
npm install -g wrangler
wrangler login

# Build your Next.js/Astro/Hugo site then deploy:
wrangler pages deploy out/ --project-name my-project

# Set up custom domain in Pages dashboard
# → Custom domains → Add custom domain → yourdomain.com`}</code></pre>

      <h2>What the Free Plan Doesn't Include</h2>
      <ul>
        <li>Advanced rate limiting rules</li>
        <li>Bot Management (Cloudflare Bot Fight Mode free, full bot management paid)</li>
        <li>Image Optimization (Cloudflare Images paid)</li>
        <li>Load Balancing (paid)</li>
        <li>Argo Smart Routing (paid)</li>
        <li>Priority support</li>
      </ul>
      <p>
        For most websites under significant traffic, the free tier is genuinely complete. The paid plans ($20/month Pro, $200/month Business) add advanced security features and SLAs, not basic functionality.
      </p>

      <h2>Summary</h2>
      <p>
        Cloudflare's free tier offers CDN, automatic HTTPS, DDoS protection, fast DNS, Cloudflare Pages for static sites, and Workers for edge functions. For static sites especially, there's no reason to pay for hosting anywhere else. Setting up takes about 30 minutes and the performance and security benefits are immediate.
      </p>
    </>
  )
}
