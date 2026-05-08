'use client'

export default function WebPerformanceOptimization() {
  return (
    <article className="prose-freeutil">
      <p>A 1-second delay in page load time reduces conversions by 7% and increases bounce rate by 11%. This guide covers the most impactful optimizations — techniques proven to make real-world differences.</p>

      <h2>Images (Biggest Impact)</h2>
      <pre><code>{`<!-- Use next-gen formats -->
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="Hero" width="1200" height="600" loading="lazy">
</picture>

<!-- Always set width and height to prevent CLS -->
<img src="photo.jpg" width="800" height="600" alt="">

<!-- Preload above-the-fold LCP image -->
<link rel="preload" as="image" href="hero.webp" fetchpriority="high">

<!-- Lazy load below-the-fold images -->
<img src="photo.jpg" loading="lazy" alt="">`}</code></pre>
      <ul>
        <li>Compress JPEGs to quality 75-85 (imperceptible quality loss)</li>
        <li>Use WebP (25-35% smaller than JPEG) or AVIF (30-50% smaller)</li>
        <li>Serve appropriately sized images — don't serve 1920px for a 400px container</li>
        <li>Use <code>srcset</code> for responsive images</li>
      </ul>

      <h2>JavaScript</h2>
      <pre><code>{`<!-- Defer non-critical scripts -->
<script src="analytics.js" defer></script>
<script src="chat-widget.js" async></script>

<!-- Code split with dynamic import (React/Next.js) -->
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>
})

<!-- Remove unused JavaScript -->
# Use Chrome DevTools → Coverage tab to find unused code`}</code></pre>

      <h2>CSS</h2>
      <pre><code>{`/* Critical CSS — inline in <head> to prevent render blocking */
<style>
  /* Only styles needed for above-the-fold content */
  body { margin: 0; font-family: sans-serif; }
  .hero { background: #1a1917; color: white; }
</style>

/* Load non-critical CSS asynchronously */
<link rel="preload" as="style" href="styles.css"
      onload="this.rel='stylesheet'">

/* Use font-display: swap to prevent FOIT */
@font-face {
  font-family: 'MyFont';
  src: url('font.woff2') format('woff2');
  font-display: swap;
}`}</code></pre>

      <h2>Caching</h2>
      <pre><code>{`# Nginx — cache static assets for 1 year (immutable files with hash in name)
location ~* \.(js|css|png|jpg|webp|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# HTML — short cache to allow updates
location ~* \.html$ {
    expires 1h;
    add_header Cache-Control "public, must-revalidate";
}`}</code></pre>

      <h2>CDN</h2>
      <p>A CDN (Content Delivery Network) serves your assets from servers geographically close to your users. Cloudflare's free tier is sufficient for most sites — just change your DNS nameservers and enable proxying. Typical improvement: 50-200ms reduction in TTFB for international users.</p>

      <h2>Measure Before and After</h2>
      <pre><code>{`# Tools to measure performance
# 1. Lighthouse (Chrome DevTools → Lighthouse tab)
# 2. PageSpeed Insights: pagespeed.web.dev
# 3. WebPageTest: webpagetest.org (real browsers, global locations)
# 4. GTmetrix: gtmetrix.com

# Key metrics to track:
# - Time to First Byte (TTFB) < 800ms
# - First Contentful Paint (FCP) < 1.8s
# - Largest Contentful Paint (LCP) < 2.5s
# - Total Blocking Time (TBT) < 200ms
# - Cumulative Layout Shift (CLS) < 0.1`}</code></pre>
    </article>
  )
}
