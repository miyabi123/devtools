'use client'

export default function FaviconGuide() {
  return (
    <article className="prose-article">
      <p>
        A favicon (short for "favorites icon") is the small icon that appears in browser tabs,
        bookmarks, and search results. Getting it right requires more than just a tiny image —
        modern browsers, mobile devices, and PWAs each have specific requirements.
      </p>

      <h2>What Sizes Do You Need?</h2>
      <p>
        There is no single favicon size. Different contexts use different sizes, and browsers
        automatically pick the best fit:
      </p>
      <table>
        <thead>
          <tr>
            <th>Size</th>
            <th>Used For</th>
            <th>Required?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>16×16px</td>
            <td>Browser tab (most browsers)</td>
            <td>Essential</td>
          </tr>
          <tr>
            <td>32×32px</td>
            <td>Browser tab (Retina), taskbar</td>
            <td>Essential</td>
          </tr>
          <tr>
            <td>48×48px</td>
            <td>Windows site shortcut</td>
            <td>Recommended</td>
          </tr>
          <tr>
            <td>180×180px</td>
            <td>Apple Touch Icon (iOS home screen)</td>
            <td>Important for mobile</td>
          </tr>
          <tr>
            <td>192×192px</td>
            <td>Android home screen / PWA</td>
            <td>Important for PWA</td>
          </tr>
          <tr>
            <td>512×512px</td>
            <td>PWA splash screen, app stores</td>
            <td>Required for PWA</td>
          </tr>
        </tbody>
      </table>
      <p>
        The minimum viable set for most websites: 16×16, 32×32, 180×180, and 192×192. If you're
        building a PWA, also include 512×512.
      </p>

      <h2>ICO vs PNG vs SVG</h2>
      <h3>ICO Format</h3>
      <p>
        The <code>favicon.ico</code> file in your root directory is still the most universally
        supported format. Old browsers (IE, older Edge) only recognize <code>favicon.ico</code>.
        Modern <code>.ico</code> files can contain multiple sizes in a single file (16×16, 32×32,
        48×48), and browsers pick the best one.
      </p>
      <p>
        Place <code>favicon.ico</code> in the root of your site. Browsers fetch it automatically
        even without a <code>&lt;link&gt;</code> tag.
      </p>

      <h3>PNG Format</h3>
      <p>
        PNG favicons have better compression and alpha transparency than ICO. Most modern browsers
        support PNG favicons when declared with a <code>&lt;link&gt;</code> tag. PNG is the
        recommended format for sizes above 32×32 and for Apple Touch Icons.
      </p>

      <h3>SVG Favicons</h3>
      <p>
        SVG favicons are vector-based — they look sharp at any size and on any screen density.
        Chrome, Firefox, and Safari support SVG favicons, but iOS Safari does not. Use SVG as an
        enhancement alongside PNG/ICO:
      </p>
      <pre><code>{`<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" href="/favicon-32x32.png">
<link rel="icon" href="/favicon.ico">`}</code></pre>
      <p>
        Browsers use the first supported format. SVG also supports media queries, so you can have
        a light and dark mode favicon:
      </p>
      <pre><code>{`<!-- favicon.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <style>
    @media (prefers-color-scheme: dark) {
      circle { fill: #ffffff; }
    }
  </style>
  <circle cx="16" cy="16" r="16" fill="#1a1917"/>
</svg>`}</code></pre>

      <h2>HTML Tags to Add</h2>
      <p>A complete, modern favicon setup looks like this:</p>
      <pre><code>{`<!-- Standard favicon -->
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">

<!-- Apple Touch Icon (iOS home screen) -->
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<!-- apple-touch-icon should be 180×180px -->

<!-- Web App Manifest (for PWA / Android) -->
<link rel="manifest" href="/manifest.json">`}</code></pre>
      <p>In your <code>manifest.json</code>:</p>
      <pre><code>{`{
  "name": "My App",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}`}</code></pre>

      <h2>Best Practices for Favicon Design</h2>
      <ul>
        <li>
          <strong>Keep it simple.</strong> A favicon is displayed at 16×16px. Detailed logos with
          thin lines or small text become unreadable. Use a symbol, initial, or simplified version
          of your logo.
        </li>
        <li>
          <strong>Use a square source image.</strong> 1:1 aspect ratio. At least 512×512px as your
          master file — downscale from there.
        </li>
        <li>
          <strong>Use PNG with transparency.</strong> Transparent background adapts to both light
          and dark browser chrome.
        </li>
        <li>
          <strong>Test at actual size.</strong> Zoom out your browser to see how the favicon
          looks at 16×16px before finalizing the design.
        </li>
        <li>
          <strong>Consider contrast.</strong> Dark icons are barely visible against dark browser
          themes. Use an SVG with dark/light mode variants, or pick an icon color with strong
          contrast in both contexts.
        </li>
      </ul>

      <h2>Where to Place Favicon Files</h2>
      <p>
        All favicon files should go in your <strong>public root directory</strong> (or equivalent
        static files folder):
      </p>
      <pre><code>{`public/
├── favicon.ico          ← root (auto-detected by browsers)
├── favicon.svg
├── apple-touch-icon.png ← 180×180
├── icon-192.png
├── icon-512.png
└── manifest.json`}</code></pre>
      <p>
        In Next.js App Router, placing a <code>favicon.ico</code> in the <code>app/</code> directory
        generates the correct <code>&lt;link&gt;</code> tags automatically.
      </p>

      <h2>Checking Your Favicon</h2>
      <p>After deploying, verify your favicon is working:</p>
      <ol>
        <li>Open your site in Chrome — check the tab icon</li>
        <li>Bookmark the page — check the bookmark icon</li>
        <li>
          On an iPhone: tap Share → Add to Home Screen — check the iOS icon
        </li>
        <li>
          Use browser dev tools Network tab to confirm <code>favicon.ico</code> returns a 200
          response, not a 404
        </li>
      </ol>
      <p>
        Hard-refresh (<code>Ctrl+Shift+R</code>) the page if the old favicon is still showing —
        browsers cache favicons aggressively.
      </p>
    </article>
  )
}
