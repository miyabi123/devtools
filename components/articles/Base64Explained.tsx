export default function Base64Explained() {
  return (
    <>
      <h2>What is Base64?</h2>
      <p>Base64 is an encoding scheme that converts binary data into a string of ASCII characters. It uses 64 characters — A-Z, a-z, 0-9, and <code>+</code> and <code>/</code> — to represent any binary data. The name "Base64" comes from the 64 printable characters used in the alphabet.</p>
      <p>Base64 is not encryption. It is simply a way to represent binary data as text. Anyone can decode a Base64 string without a key. Its purpose is <em>encoding</em>, not security.</p>

      <h2>Why Does Base64 Exist?</h2>
      <p>Many protocols and systems were originally designed to handle only text (ASCII). Binary data like images, certificates, and files cannot be safely transmitted through these text-only systems without corruption. Base64 solves this by converting binary data to a safe, printable text format.</p>
      <p>Common examples of text-only protocols where Base64 is essential:</p>
      <ul>
        <li><strong>Email (SMTP/MIME)</strong> — attachments are Base64 encoded</li>
        <li><strong>HTTP headers</strong> — cannot contain raw binary</li>
        <li><strong>JSON payloads</strong> — must be valid text strings</li>
        <li><strong>HTML/CSS data URIs</strong> — embed images directly in code</li>
        <li><strong>XML documents</strong> — binary must be encoded as text</li>
      </ul>

      <h2>How Base64 Encoding Works</h2>
      <p>Base64 converts every 3 bytes (24 bits) of binary data into 4 Base64 characters (6 bits each). This is why Base64 encoded data is approximately 33% larger than the original.</p>
      <pre><code>{`Input:  "Man"
Binary: 01001101 01100001 01101110
Groups: 010011 010110 000101 101110
Index:  19     22     5      46
Output: "TWFu"`}</code></pre>

      <p>If the input is not a multiple of 3 bytes, <code>=</code> padding characters are added to complete the final 4-character block.</p>

      <h2>Standard Base64 vs URL-safe Base64</h2>
      <table>
        <thead><tr><th></th><th>Standard Base64</th><th>URL-safe Base64</th></tr></thead>
        <tbody>
          <tr><td>Characters 62–63</td><td><code>+</code> and <code>/</code></td><td><code>-</code> and <code>_</code></td></tr>
          <tr><td>Padding</td><td><code>=</code></td><td><code>=</code> or omitted</td></tr>
          <tr><td>Safe in URLs</td><td>No — <code>+</code> means space, <code>/</code> is path separator</td><td>Yes</td></tr>
          <tr><td>Used in</td><td>Email, files, general encoding</td><td>JWT, URL parameters, filenames</td></tr>
        </tbody>
      </table>

      <div className="callout callout-blue">
        <p>💡 JWT tokens use URL-safe Base64 (also called Base64URL). The header and payload of a JWT are Base64URL encoded, not encrypted.</p>
      </div>

      <h2>Common Use Cases</h2>

      <h3>1. Data URIs (Inline Images)</h3>
      <p>You can embed images directly in HTML or CSS without a separate file request:</p>
      <pre><code>{`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." />`}</code></pre>

      <h3>2. API Payloads</h3>
      <p>When sending binary files through a JSON API, Base64 is the standard approach:</p>
      <pre><code>{`{
  "filename": "document.pdf",
  "content": "JVBERi0xLjQKJeLjz9MKMTAgMCBvYmoK..."
}`}</code></pre>

      <h3>3. Basic Authentication</h3>
      <p>HTTP Basic Auth encodes credentials as Base64:</p>
      <pre><code>{`Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
// Decodes to: username:password`}</code></pre>

      <h3>4. SSL/TLS Certificates (PEM format)</h3>
      <p>PEM certificate files are Base64 encoded DER certificates wrapped with header/footer lines:</p>
      <pre><code>{`-----BEGIN CERTIFICATE-----
MIIDzTCCArWgAwIBAgIQCjeHZIR4...
-----END CERTIFICATE-----`}</code></pre>

      <h2>Base64 in Different Languages</h2>
      <pre><code>{`# Python
import base64
encoded = base64.b64encode(b"Hello World")  # b'SGVsbG8gV29ybGQ='
decoded = base64.b64decode(b"SGVsbG8gV29ybGQ=")  # b'Hello World'

// JavaScript
const encoded = btoa("Hello World")  // "SGVsbG8gV29ybGQ="
const decoded = atob("SGVsbG8gV29ybGQ=")  // "Hello World"

// Node.js
const encoded = Buffer.from("Hello World").toString("base64")
const decoded = Buffer.from("SGVsbG8gV29ybGQ=", "base64").toString()`}</code></pre>

      <div className="callout">
        <p>⚠️ Base64 is NOT encryption. Never use Base64 to "hide" passwords or sensitive data. It provides zero security — any developer can decode it instantly.</p>
      </div>
    </>
  )
}
