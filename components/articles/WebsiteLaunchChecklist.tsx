'use client'

export default function WebsiteLaunchChecklist() {
  return (
    <article className="prose-freeutil">
      <p>Use this checklist before every website launch. Work through each section methodically — issues caught here are free; issues caught in production are expensive. Items marked ⚠️ are critical blockers.</p>

      <h2>Performance</h2>
      <ul>
        <li>⚠️ PageSpeed Insights score ≥ 90 on mobile (pagespeed.web.dev)</li>
        <li>⚠️ All images have explicit width and height attributes (prevents CLS)</li>
        <li>Images are WebP or AVIF format with JPG/PNG fallback</li>
        <li>Above-the-fold images have <code>fetchpriority="high"</code>, others have <code>loading="lazy"</code></li>
        <li>JavaScript deferred or async where possible</li>
        <li>CSS not render-blocking (critical CSS inlined, rest loaded async)</li>
        <li>Gzip/Brotli compression enabled on server</li>
        <li>Static assets have long Cache-Control headers (1 year for hashed assets)</li>
        <li>CDN configured and serving assets</li>
        <li>Time to First Byte (TTFB) &lt; 800ms</li>
      </ul>

      <h2>Security</h2>
      <ul>
        <li>⚠️ HTTPS enforced with valid TLS certificate</li>
        <li>⚠️ HTTP → HTTPS redirect in place (301)</li>
        <li>⚠️ HSTS header set (<code>Strict-Transport-Security: max-age=31536000</code>)</li>
        <li>Security headers configured (CSP, X-Content-Type-Options, X-Frame-Options)</li>
        <li>Admin URLs not guessable (not /admin)</li>
        <li>No sensitive data in URLs (tokens, passwords)</li>
        <li>Error pages don't expose stack traces or server information</li>
        <li>SSL Labs score ≥ A (ssllabs.com/ssltest)</li>
      </ul>

      <h2>SEO</h2>
      <ul>
        <li>⚠️ Every page has a unique, descriptive <code>&lt;title&gt;</code> tag (50-60 chars)</li>
        <li>⚠️ Every page has a unique meta description (120-160 chars)</li>
        <li>Canonical URLs set on all pages</li>
        <li>robots.txt exists and allows important pages</li>
        <li>sitemap.xml generated and submitted to Google Search Console</li>
        <li>Open Graph tags set (og:title, og:description, og:image)</li>
        <li>Images have descriptive alt text</li>
        <li>H1 tag appears exactly once per page</li>
        <li>Internal links use descriptive anchor text (not "click here")</li>
        <li>No broken links (check with a crawler)</li>
      </ul>

      <h2>Functionality</h2>
      <ul>
        <li>⚠️ Forms submit correctly and send confirmation emails</li>
        <li>⚠️ Contact forms tested with real email addresses</li>
        <li>⚠️ Payment flows tested in staging with test cards</li>
        <li>404 error page exists and is helpful (links to main sections)</li>
        <li>500 error page exists (shows user-friendly message)</li>
        <li>All CTA buttons link to correct pages</li>
        <li>Login/signup flow tested end-to-end</li>
        <li>Password reset flow tested</li>
      </ul>

      <h2>Cross-Browser & Cross-Device</h2>
      <ul>
        <li>Tested in Chrome, Firefox, Safari, Edge</li>
        <li>Tested on iOS Safari and Android Chrome</li>
        <li>Mobile viewport meta tag present</li>
        <li>No horizontal scrolling on mobile</li>
        <li>Touch targets ≥ 44×44px on mobile</li>
        <li>Text readable without zooming on mobile</li>
      </ul>

      <h2>Accessibility</h2>
      <ul>
        <li>Color contrast ratio ≥ 4.5:1 for normal text</li>
        <li>Keyboard navigation works (Tab through interactive elements)</li>
        <li>Skip navigation link at top of page</li>
        <li>Forms have associated labels for all inputs</li>
        <li>axe DevTools or Lighthouse accessibility audit passing</li>
      </ul>

      <h2>Analytics & Monitoring</h2>
      <ul>
        <li>⚠️ Analytics installed and tracking page views</li>
        <li>Conversion goals configured in analytics</li>
        <li>Error tracking configured (Sentry, or similar)</li>
        <li>⚠️ Uptime monitoring set up with alerts (UptimeRobot free tier works)</li>
        <li>SSL expiry monitoring configured</li>
        <li>Automated backups configured and tested</li>
      </ul>

      <h2>Content</h2>
      <ul>
        <li>No placeholder text (Lorem Ipsum) in production</li>
        <li>No "Coming Soon" or "Under Construction" content</li>
        <li>Privacy policy page exists and is current</li>
        <li>Terms of service exists (if applicable)</li>
        <li>Cookie consent if required by jurisdiction</li>
        <li>Contact information is accurate</li>
        <li>All images are properly licensed</li>
      </ul>
    </article>
  )
}
