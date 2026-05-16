'use client'

export default function WhatIsBase64() {
  return (
    <article className="prose-freeutil">
      <p>Base64 is an encoding scheme that converts binary data into a string of 64 printable ASCII characters. It's not encryption — it doesn't protect data. It just makes binary data safe to transport over text-based systems.</p>

      <h2>Why Base64 Exists</h2>
      <p>Many protocols (email, HTTP headers, URLs) were designed for ASCII text. Binary data — images, PDFs, executable files — contains bytes that can corrupt these protocols. Base64 solves this by representing any binary data using only letters, numbers, +, /, and =.</p>
      <pre><code>{`Binary: 01001000 01100101 01101100 01101100 01101111
Text:   "Hello"

Base64 encoded: "SGVsbG8="`}</code></pre>

      <h2>How It Works</h2>
      <p>Base64 takes 3 bytes (24 bits) and encodes them as 4 characters (6 bits each). This is why Base64 output is always 4/3 the size of the original — a 300-byte file becomes 400 characters of Base64.</p>
      <p>The <code>=</code> padding at the end appears when the input isn't divisible by 3.</p>

      <h2>Common Use Cases</h2>
      <ul>
        <li><strong>Data URIs</strong> — embed images directly in HTML/CSS: <code>{'<img src="data:image/png;base64,iVBOR...">'}</code></li>
        <li><strong>JWT tokens</strong> — the header and payload are Base64url-encoded (URL-safe variant)</li>
        <li><strong>Email attachments</strong> — MIME standard requires attachments to be Base64-encoded</li>
        <li><strong>API payloads</strong> — sending binary files (PDFs, images) in JSON APIs</li>
        <li><strong>Basic Auth</strong> — HTTP Basic Authentication encodes <code>username:password</code> in Base64</li>
        <li><strong>Cryptographic keys</strong> — PEM format uses Base64 to represent key bytes</li>
      </ul>

      <h2>Base64 vs URL-safe Base64</h2>
      <pre><code>{`Standard Base64:  uses + and / which have meaning in URLs
URL-safe Base64:  replaces + with - and / with _ (safe in URLs)

Standard: "SGVsbG8+Wg=="
URL-safe: "SGVsbG8-Wg"   (also removes padding =)

# JavaScript
btoa("Hello")                     // Standard Base64
btoa("Hello").replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')  // URL-safe`}</code></pre>

      <h2>Base64 Is NOT Encryption</h2>
      <p>This is the most important thing to understand. Base64 encoding is trivially reversible by anyone. Never use it to "protect" sensitive data — anyone who sees the encoded string can decode it instantly. Use encryption (AES) for protecting data, not Base64.</p>
      <pre><code>{`// This is NOT secure
const "secret" = btoa("password123")  // "cGFzc3dvcmQxMjM="
atob("cGFzc3dvcmQxMjM=")             // "password123" — trivial to reverse`}</code></pre>
    </article>
  )
}
