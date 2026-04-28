'use client'

export default function PngVsJpgVsWebp() {
  return (
    <article className="prose-freeutil">
      <p>
        Choosing the wrong image format is one of the most common causes of unnecessarily large web pages. PNG, JPG, and WebP each serve different purposes — understanding their differences helps you cut file sizes significantly without sacrificing visual quality.
      </p>

      <h2>JPG (JPEG)</h2>
      <p>
        JPG uses lossy compression — it permanently discards image data to achieve smaller file sizes. The compression algorithm works by reducing color precision in areas where the human eye is less sensitive, particularly in high-frequency detail areas.
      </p>
      <ul>
        <li><strong>Best for:</strong> photographs, complex images with gradients and many colors</li>
        <li><strong>Compression:</strong> lossy — each save degrades quality slightly</li>
        <li><strong>Transparency:</strong> not supported</li>
        <li><strong>Typical size:</strong> a 1920×1080 photo at quality 80 is roughly 200–400 KB</li>
        <li><strong>Browser support:</strong> universal</li>
      </ul>
      <p>
        The quality setting (typically 0–100) controls the tradeoff between file size and visual fidelity. Quality 80–85 is the sweet spot for most photos — visually indistinguishable from 100 but 60–70% smaller.
      </p>

      <h2>PNG</h2>
      <p>
        PNG uses lossless compression — every pixel is preserved exactly. It also supports alpha transparency (a full 8-bit alpha channel), making it the standard for images that need transparent backgrounds.
      </p>
      <ul>
        <li><strong>Best for:</strong> logos, icons, screenshots, images with text, images requiring transparency</li>
        <li><strong>Compression:</strong> lossless — quality never degrades</li>
        <li><strong>Transparency:</strong> full alpha channel support</li>
        <li><strong>Typical size:</strong> a 512×512 logo PNG is 20–100 KB depending on complexity</li>
        <li><strong>Browser support:</strong> universal</li>
      </ul>
      <p>
        PNG is a poor choice for photographs — a photo saved as PNG will be 3–5x larger than the same image as JPG at quality 80, with no visible quality improvement.
      </p>

      <h2>WebP</h2>
      <p>
        WebP is Google's modern image format supporting both lossy and lossless compression, plus full alpha transparency. It consistently achieves smaller file sizes than both JPG and PNG at equivalent quality.
      </p>
      <ul>
        <li><strong>Best for:</strong> almost everything — direct replacement for JPG and PNG on the web</li>
        <li><strong>Compression:</strong> lossy or lossless (your choice)</li>
        <li><strong>Transparency:</strong> supported (even in lossy mode)</li>
        <li><strong>Typical savings:</strong> 25–35% smaller than JPG, 25–50% smaller than PNG</li>
        <li><strong>Browser support:</strong> all modern browsers (Chrome, Firefox, Safari 14+, Edge). No IE support.</li>
      </ul>

      <h2>File Size Comparison</h2>
      <table>
        <thead>
          <tr><th>Image type</th><th>JPG</th><th>PNG</th><th>WebP (lossy)</th><th>WebP (lossless)</th></tr>
        </thead>
        <tbody>
          <tr><td>Photo (1920×1080)</td><td>350 KB</td><td>1.8 MB</td><td>220 KB</td><td>1.1 MB</td></tr>
          <tr><td>Logo (512×512, transparent)</td><td>N/A</td><td>45 KB</td><td>N/A</td><td>28 KB</td></tr>
          <tr><td>Screenshot (1440×900)</td><td>280 KB</td><td>900 KB</td><td>180 KB</td><td>550 KB</td></tr>
        </tbody>
      </table>

      <h2>When to Use Each Format</h2>
      <table>
        <thead>
          <tr><th>Use case</th><th>Recommended format</th></tr>
        </thead>
        <tbody>
          <tr><td>Photographs on a website</td><td>WebP (lossy), fallback to JPG</td></tr>
          <tr><td>Logo with transparent background</td><td>WebP (lossless) or PNG</td></tr>
          <tr><td>Screenshot or UI mockup</td><td>WebP (lossless) or PNG</td></tr>
          <tr><td>Icon (simple, flat colors)</td><td>SVG (vector) or WebP</td></tr>
          <tr><td>Open Graph / social preview image</td><td>JPG (maximum compatibility)</td></tr>
          <tr><td>Email images</td><td>JPG or PNG (WebP not supported in most email clients)</td></tr>
          <tr><td>Print design</td><td>PNG (lossless) or TIFF</td></tr>
        </tbody>
      </table>

      <h2>Implementing WebP with Fallback</h2>
      <p>
        To use WebP while supporting older browsers, use the <code>&lt;picture&gt;</code> element:
      </p>
      <pre><code>{`<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description" width="800" height="600">
</picture>`}</code></pre>
      <p>
        Browsers that support WebP use the <code>&lt;source&gt;</code>; others fall back to the <code>&lt;img&gt;</code> tag. In Next.js, the built-in <code>&lt;Image&gt;</code> component handles WebP conversion and fallback automatically.
      </p>

      <h2>AVIF — The Next Generation</h2>
      <p>
        AVIF (AV1 Image File Format) is the newest format, offering 30–50% smaller files than WebP at equivalent quality. Browser support is good (Chrome 85+, Firefox 93+, Safari 16+) but not yet universal. For cutting-edge optimization, add AVIF as the first <code>&lt;source&gt;</code> in your picture element with WebP as fallback.
      </p>
    </article>
  )
}
