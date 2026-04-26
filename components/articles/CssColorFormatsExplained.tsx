'use client'

export default function CssColorFormatsExplained() {
  return (
    <article className="prose-article">
      <p>
        CSS supports over a dozen ways to specify colors. Choosing the right format — HEX, RGB,
        HSL, or HSV — affects readability, maintainability, and how easy it is to adjust colors in
        code. This guide explains each format, when to use it, and how to convert between them.
      </p>

      <h2>HEX Colors</h2>
      <p>
        HEX is the most common format in web development. A HEX color is a 6-digit hexadecimal
        number representing the red, green, and blue channels:
      </p>
      <pre><code>{`#RRGGBB

#ff5733   → R=255, G=87,  B=51
#1a1917   → R=26,  G=25,  B=23
#ffffff   → R=255, G=255, B=255  (white)
#000000   → R=0,   G=0,   B=0    (black)`}</code></pre>
      <p>
        Shorthand notation works when each channel's two digits are identical:
      </p>
      <pre><code>{`#fff  = #ffffff
#000  = #000000
#f53  = #ff5533`}</code></pre>
      <p>
        HEX supports transparency with an 8-digit form (#RRGGBBAA) where the last two digits are
        the alpha channel (00 = fully transparent, ff = fully opaque):
      </p>
      <pre><code>{`#ff573380   → 50% transparent red
#1a191780   → 50% transparent near-black`}</code></pre>
      <p>
        <strong>Use HEX when:</strong> you're working with design system tokens, copying colors
        from Figma, or writing colors that need to be compact and copy-pasteable.
      </p>

      <h2>RGB and RGBA</h2>
      <p>
        RGB expresses the same three channels as decimal numbers from 0 to 255:
      </p>
      <pre><code>{`rgb(255, 87, 51)      /* same as #ff5733 */
rgba(255, 87, 51, 0.5) /* 50% transparent */`}</code></pre>
      <p>
        CSS Color Level 4 introduced a space-separated syntax that also supports alpha without the
        separate <code>rgba()</code> function:
      </p>
      <pre><code>{`/* Modern CSS (Chrome 111+, Safari 15+) */
rgb(255 87 51)
rgb(255 87 51 / 50%)
rgb(255 87 51 / 0.5)`}</code></pre>
      <p>
        <strong>Use RGB when:</strong> you're performing math on color values in JavaScript, or
        working with values that come directly from image processing libraries.
      </p>

      <h2>HSL — The Most Intuitive Format</h2>
      <p>
        HSL stands for Hue, Saturation, Lightness. Unlike RGB and HEX, it's designed around how
        humans perceive color rather than how screens display it.
      </p>
      <ul>
        <li>
          <strong>Hue (0–360°)</strong> — the color on the color wheel: 0=red, 60=yellow,
          120=green, 180=cyan, 240=blue, 300=magenta, 360=red again.
        </li>
        <li>
          <strong>Saturation (0–100%)</strong> — color intensity. 0% is gray, 100% is full color.
        </li>
        <li>
          <strong>Lightness (0–100%)</strong> — brightness. 0% is black, 100% is white, 50% is the
          "pure" color.
        </li>
      </ul>
      <pre><code>{`hsl(0, 100%, 50%)    /* pure red */
hsl(120, 100%, 50%)  /* pure green */
hsl(240, 100%, 50%)  /* pure blue */
hsl(0, 0%, 50%)      /* medium gray */
hsl(210, 20%, 30%)   /* muted blue-gray */`}</code></pre>
      <p>
        The power of HSL is how easily you can create color variations by adjusting a single value:
      </p>
      <pre><code>{`/* Adjust lightness for hover/active states */
hsl(210, 80%, 55%)   /* base button */
hsl(210, 80%, 48%)   /* hover (darker) */
hsl(210, 80%, 40%)   /* active (darkest) */

/* Adjust saturation for muted variants */
hsl(210, 80%, 55%)   /* vibrant */
hsl(210, 30%, 55%)   /* muted */
hsl(210, 10%, 55%)   /* almost gray */`}</code></pre>
      <p>
        <strong>Use HSL when:</strong> building design systems, creating color scales, or
        generating colors programmatically (dark mode, tints, shades).
      </p>

      <h2>HSV / HSB — Used in Design Tools</h2>
      <p>
        HSV (Hue, Saturation, Value) — also called HSB (Hue, Saturation, Brightness) — is the
        format used in Photoshop, Figma color pickers, and most design tools. It is not a valid CSS
        format but is common in design workflows.
      </p>
      <p>
        The difference from HSL: in HSV, a color at 100% value with 100% saturation is the pure
        color. In HSL, the pure color is at 50% lightness. HSV's "value" represents how much black
        is mixed in (0% = black), while HSL's "lightness" mixes both black and white.
      </p>

      <h2>CSS Color Level 4 — New Formats</h2>
      <p>Modern CSS adds new color spaces for wider gamuts:</p>
      <ul>
        <li>
          <strong>oklch()</strong> — perceptually uniform lightness; great for generating color
          scales where perceived brightness is consistent.
        </li>
        <li>
          <strong>display-p3</strong> — the P3 wide color gamut used by modern Apple displays and
          most new monitors; supports colors outside the sRGB range.
        </li>
        <li>
          <strong>color-mix()</strong> — mix two colors in any color space:{' '}
          <code>color-mix(in hsl, red 50%, blue)</code>
        </li>
      </ul>

      <h2>Converting Between Formats</h2>
      <p>The formulas for HEX ↔ RGB are simple arithmetic:</p>
      <pre><code>{`// HEX to RGB
const r = parseInt(hex.slice(1, 3), 16)
const g = parseInt(hex.slice(3, 5), 16)
const b = parseInt(hex.slice(5, 7), 16)

// RGB to HEX
const hex = '#' + [r, g, b]
  .map(v => v.toString(16).padStart(2, '0'))
  .join('')`}</code></pre>
      <p>
        RGB to HSL requires normalizing RGB to 0–1, finding the max/min channels, then computing
        hue, saturation, and lightness — a few lines of math that any color converter handles
        automatically.
      </p>

      <h2>Choosing the Right Format</h2>
      <table>
        <thead>
          <tr>
            <th>Format</th>
            <th>Best For</th>
            <th>CSS Support</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>HEX</td>
            <td>Design tokens, Figma handoff, compact notation</td>
            <td>All browsers</td>
          </tr>
          <tr>
            <td>RGB / RGBA</td>
            <td>JavaScript math, canvas, image processing</td>
            <td>All browsers</td>
          </tr>
          <tr>
            <td>HSL / HSLA</td>
            <td>Design systems, color scales, dark mode</td>
            <td>All browsers</td>
          </tr>
          <tr>
            <td>oklch()</td>
            <td>Perceptually uniform palettes, modern CSS</td>
            <td>Chrome 111+, Safari 15.4+</td>
          </tr>
          <tr>
            <td>display-p3</td>
            <td>Wide gamut displays, mobile apps</td>
            <td>Chrome 111+, Safari 10.1+</td>
          </tr>
        </tbody>
      </table>
    </article>
  )
}
