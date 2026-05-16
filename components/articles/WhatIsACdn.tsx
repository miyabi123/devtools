'use client'

export default function WhatIsACdn() {
  return (
    <article className="prose-freeutil">
      <p>A CDN (Content Delivery Network) is a globally distributed network of servers that caches your website's static content close to your users. Instead of every visitor fetching assets from your origin server in Singapore, users in Brazil get them from a server in São Paulo.</p>

      <h2>How It Works</h2>
      <pre><code>{`Without CDN:
User in Brazil → Origin server in Singapore → 200ms+ latency

With CDN:
User in Brazil → CDN edge in São Paulo → ~20ms latency
                 (if cached) ─────────────────────────────┘
                 (if not cached) → Origin in Singapore → cached for next user`}</code></pre>
      <p>CDNs have <strong>Points of Presence (PoPs)</strong> — data centers in cities worldwide. When a user requests a file, the CDN routes them to the nearest PoP. If the PoP has the file cached, it serves it directly. If not, it fetches from your origin, caches it, and serves it — all in one request.</p>

      <h2>What CDNs Cache</h2>
      <ul>
        <li>Images (JPEG, PNG, WebP, SVG)</li>
        <li>JavaScript and CSS files</li>
        <li>Web fonts</li>
        <li>Video and audio files</li>
        <li>HTML pages (with appropriate cache headers)</li>
        <li>API responses (if configured)</li>
      </ul>
      <p>CDNs don't typically cache POST requests or responses with user-specific data (unless specifically configured with edge functions).</p>

      <h2>CDN vs Web Hosting</h2>
      <table>
        <thead><tr><th></th><th>Web Hosting (Origin)</th><th>CDN</th></tr></thead>
        <tbody>
          <tr><td>Purpose</td><td>Run your application</td><td>Cache and deliver assets fast</td></tr>
          <tr><td>Location</td><td>One region</td><td>Global edge network</td></tr>
          <tr><td>Dynamic content</td><td>✅ Yes</td><td>⚠️ Limited (edge functions)</td></tr>
          <tr><td>Static content</td><td>✅ Yes (slow for distant users)</td><td>✅ Yes (fast everywhere)</td></tr>
          <tr><td>Cost</td><td>Compute-based</td><td>Bandwidth-based (often cheaper)</td></tr>
        </tbody>
      </table>

      <h2>Cloudflare Free Tier</h2>
      <p>Cloudflare's free plan is the easiest CDN to add to any existing site — change your DNS nameservers to Cloudflare and traffic is automatically proxied through their network. This gives you CDN caching, DDoS protection, and SSL with zero code changes.</p>
      <pre><code>{`# After enabling Cloudflare proxy, set cache headers on your origin
Cache-Control: public, max-age=31536000, immutable  # Static assets with hashes
Cache-Control: public, max-age=3600                  # Images
Cache-Control: no-cache                              # HTML (let Cloudflare decide)`}</code></pre>

      <h2>When a CDN Helps Most</h2>
      <p>CDNs have the highest impact when your users are geographically distant from your servers and your site has substantial static assets. Adding Cloudflare to a typical website typically reduces page load time by 30-50% for users outside the origin server's region.</p>
    </article>
  )
}
