export default function QRCodeGuide() {
  return (
    <>
      <h2>What is a QR Code?</h2>
      <p>A QR code (Quick Response code) is a two-dimensional barcode that can store various types of data — URLs, text, contact information, WiFi credentials, and more. QR codes can be read by smartphones, tablets, and dedicated scanners in any orientation.</p>

      <h2>How QR Codes Store Data</h2>
      <p>QR codes store data in a matrix of black and white squares. The data is encoded using Reed-Solomon error correction, which allows the code to be read even if part of it is damaged or obscured.</p>

      <h2>Error Correction Levels</h2>
      <table>
        <thead><tr><th>Level</th><th>Name</th><th>Recovery Capacity</th><th>Use Case</th></tr></thead>
        <tbody>
          <tr><td>L</td><td>Low</td><td>7%</td><td>Clean environments, digital displays</td></tr>
          <tr><td>M</td><td>Medium</td><td>15%</td><td>General use (default)</td></tr>
          <tr><td>Q</td><td>Quartile</td><td>25%</td><td>Industrial environments</td></tr>
          <tr><td>H</td><td>High</td><td>30%</td><td>Printed materials, damaged surfaces</td></tr>
        </tbody>
      </table>

      <h2>Data Types You Can Encode</h2>
      <table>
        <thead><tr><th>Type</th><th>Format</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td>URL</td><td>Plain URL</td><td><code>https://freeutil.app</code></td></tr>
          <tr><td>Plain text</td><td>Plain text</td><td><code>Hello World</code></td></tr>
          <tr><td>Email</td><td><code>mailto:</code></td><td><code>mailto:hello@example.com</code></td></tr>
          <tr><td>Phone</td><td><code>tel:</code></td><td><code>tel:+6612345678</code></td></tr>
          <tr><td>SMS</td><td><code>smsto:</code></td><td><code>smsto:+6612345678:Hello</code></td></tr>
          <tr><td>WiFi</td><td><code>WIFI:</code></td><td><code>WIFI:T:WPA;S:MyNetwork;P:password;;</code></td></tr>
          <tr><td>Contact</td><td>vCard</td><td>BEGIN:VCARD...</td></tr>
        </tbody>
      </table>

      <h2>Best Practices</h2>
      <ul>
        <li><strong>Size</strong>: Minimum 2x2 cm for print; larger for farther scanning distances</li>
        <li><strong>Contrast</strong>: Dark code on light background — avoid colors that reduce contrast</li>
        <li><strong>Quiet zone</strong>: Keep a white border (at least 4 modules wide) around the code</li>
        <li><strong>Test before printing</strong>: Always test with multiple devices before printing at scale</li>
        <li><strong>Short URLs</strong>: Use URL shorteners for long URLs — shorter data = simpler, more scannable code</li>
        <li><strong>Error correction</strong>: Use Level H when adding a logo in the center</li>
      </ul>

      <div className="callout callout-green">
        <p>✓ Adding a logo to the center of a QR code is fine — use error correction Level H which allows up to 30% of the code to be obscured. Keep the logo area under 25% of the total QR code area.</p>
      </div>
    </>
  )
}
