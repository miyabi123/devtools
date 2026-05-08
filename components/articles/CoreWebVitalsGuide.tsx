'use client'

export default function CoreWebVitalsGuide() {
  return (
    <article className="prose-freeutil">
      <p>Core Web Vitals are Google's standardized metrics for measuring real-world page experience. Since 2021, they've been a confirmed ranking signal in Google Search. Understanding and optimizing them improves both SEO and user experience.</p>

      <h2>The Three Core Web Vitals</h2>

      <h3>LCP — Largest Contentful Paint</h3>
      <p>Measures loading performance — how quickly the largest visible element (usually a hero image or H1 heading) renders in the viewport.</p>
      <table>
        <thead><tr><th>Score</th><th>LCP</th></tr></thead>
        <tbody>
          <tr><td>✅ Good</td><td>≤ 2.5 seconds</td></tr>
          <tr><td>⚠️ Needs Improvement</td><td>2.5 – 4.0 seconds</td></tr>
          <tr><td>❌ Poor</td><td>{'>'} 4.0 seconds</td></tr>
        </tbody>
      </table>
      <p><strong>Common LCP elements:</strong> hero images, background images, large text blocks, video posters.</p>
      <p><strong>How to improve LCP:</strong></p>
      <ul>
        <li>Preload the LCP image: <code>{'<link rel="preload" as="image" href="hero.webp">'}</code></li>
        <li>Use a CDN to serve assets closer to users</li>
        <li>Optimize and compress images (WebP, AVIF)</li>
        <li>Eliminate render-blocking scripts and CSS</li>
        <li>Use server-side rendering instead of client-side rendering</li>
      </ul>

      <h3>INP — Interaction to Next Paint</h3>
      <p>Replaced FID (First Input Delay) in March 2024. Measures responsiveness — how quickly the page responds to user interactions (clicks, taps, key presses).</p>
      <table>
        <thead><tr><th>Score</th><th>INP</th></tr></thead>
        <tbody>
          <tr><td>✅ Good</td><td>≤ 200ms</td></tr>
          <tr><td>⚠️ Needs Improvement</td><td>200 – 500ms</td></tr>
          <tr><td>❌ Poor</td><td>{'>'} 500ms</td></tr>
        </tbody>
      </table>
      <p><strong>How to improve INP:</strong></p>
      <ul>
        <li>Break up long tasks ({'>'} 50ms) with <code>setTimeout</code> or <code>scheduler.yield()</code></li>
        <li>Avoid heavy JavaScript in event handlers</li>
        <li>Use web workers for CPU-intensive work</li>
        <li>Defer non-critical JavaScript</li>
      </ul>

      <h3>CLS — Cumulative Layout Shift</h3>
      <p>Measures visual stability — how much content unexpectedly moves while the page loads. A score of 0 is perfect (no shifts).</p>
      <table>
        <thead><tr><th>Score</th><th>CLS</th></tr></thead>
        <tbody>
          <tr><td>✅ Good</td><td>≤ 0.1</td></tr>
          <tr><td>⚠️ Needs Improvement</td><td>0.1 – 0.25</td></tr>
          <tr><td>❌ Poor</td><td>{'>'} 0.25</td></tr>
        </tbody>
      </table>
      <p><strong>How to improve CLS:</strong></p>
      <ul>
        <li>Always set <code>width</code> and <code>height</code> attributes on images and videos</li>
        <li>Reserve space for ads with a fixed container size</li>
        <li>Avoid inserting content above existing content</li>
        <li>Use <code>font-display: swap</code> for web fonts</li>
        <li>Avoid CSS animations that trigger layout (use <code>transform</code> instead)</li>
      </ul>

      <h2>How to Measure Core Web Vitals</h2>
      <pre><code>{`# Tools for measuring:

# 1. PageSpeed Insights (lab + field data)
https://pagespeed.web.dev/

# 2. Chrome DevTools — Lighthouse tab
# Run audit → Performance section shows CWV scores

# 3. Chrome DevTools → Performance tab
# Record interactions to profile INP

# 4. Google Search Console — Core Web Vitals report
# Shows real-user data from Chrome users

# 5. web-vitals JavaScript library
import { getLCP, getINP, getCLS } from 'web-vitals'
getLCP(metric => console.log('LCP:', metric.value))
getINP(metric => console.log('INP:', metric.value))
getCLS(metric => console.log('CLS:', metric.value))`}</code></pre>
    </article>
  )
}
