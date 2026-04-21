export default function ImageCompressionGuide() {
  return (
    <>
      <h2>Why Compress Images?</h2>
      <p>Images are typically the largest assets on a web page, often accounting for 50-80% of total page weight. Compressing images reduces file size, resulting in faster page loads, lower bandwidth costs, and better Core Web Vitals scores — all of which directly impact user experience and SEO rankings.</p>

      <h2>Lossy vs Lossless Compression</h2>
      <table>
        <thead><tr><th></th><th>Lossy</th><th>Lossless</th></tr></thead>
        <tbody>
          <tr><td>How it works</td><td>Permanently removes data</td><td>Reorganizes data without loss</td></tr>
          <tr><td>File size reduction</td><td>High (60-80%)</td><td>Low-medium (10-30%)</td></tr>
          <tr><td>Quality</td><td>Slightly reduced</td><td>Identical to original</td></tr>
          <tr><td>Best for</td><td>Photos, complex images</td><td>Logos, icons, screenshots</td></tr>
          <tr><td>Formats</td><td>JPEG, WebP</td><td>PNG, WebP, GIF</td></tr>
        </tbody>
      </table>

      <h2>Image Format Guide</h2>
      <h3>JPEG</h3>
      <ul>
        <li>Best for photographs and complex images with many colors</li>
        <li>Lossy compression — quality setting 75-85% is usually indistinguishable</li>
        <li>Does not support transparency</li>
        <li>Universal browser support</li>
      </ul>

      <h3>PNG</h3>
      <ul>
        <li>Best for images requiring transparency (logos, icons)</li>
        <li>Lossless compression — exact reproduction</li>
        <li>Larger file size than JPEG for photos</li>
        <li>Supports alpha transparency</li>
      </ul>

      <h3>WebP</h3>
      <ul>
        <li>Modern format developed by Google</li>
        <li>25-34% smaller than JPEG at equivalent quality</li>
        <li>Supports both lossy and lossless compression</li>
        <li>Supports transparency</li>
        <li>Supported by all modern browsers</li>
      </ul>

      <h2>Recommended Quality Settings</h2>
      <table>
        <thead><tr><th>Use Case</th><th>Format</th><th>Quality</th><th>Expected Savings</th></tr></thead>
        <tbody>
          <tr><td>Hero images</td><td>WebP</td><td>80-85%</td><td>40-60%</td></tr>
          <tr><td>Product photos</td><td>WebP/JPEG</td><td>75-80%</td><td>50-70%</td></tr>
          <tr><td>Thumbnails</td><td>WebP/JPEG</td><td>70-75%</td><td>60-80%</td></tr>
          <tr><td>Logos/Icons</td><td>SVG/PNG</td><td>Lossless</td><td>10-30%</td></tr>
        </tbody>
      </table>

      <div className="callout callout-green">
        <p>✓ Quick tip: Use WebP as your primary format. Serve it with a PNG/JPEG fallback for browsers that don't support WebP. Most modern websites now default to WebP, saving 25-35% in bandwidth compared to JPEG.</p>
      </div>
    </>
  )
}
