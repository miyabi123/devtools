export default function SSLCertTypes() {
  return (
    <>
      <h2>SSL Certificate Formats</h2>
      <p>SSL/TLS certificates can be stored in several different file formats. Understanding the differences is essential when configuring web servers, load balancers, and application servers. The same certificate can exist in multiple formats — they contain the same information, just encoded differently.</p>

      <h2>PEM Format</h2>
      <p>PEM (Privacy Enhanced Mail) is the most common certificate format on Linux and Unix systems. It is Base64 encoded DER data wrapped between header and footer lines.</p>
      <pre><code>{`-----BEGIN CERTIFICATE-----
MIIDzTCCArWgAwIBAgIQCjeHZIR4...
(Base64 encoded data)
-----END CERTIFICATE-----`}</code></pre>
      <ul>
        <li>File extensions: <code>.pem</code>, <code>.crt</code>, <code>.cer</code>, <code>.key</code></li>
        <li>Used by: Nginx, Apache, Node.js, OpenSSL, Let's Encrypt</li>
        <li>Human readable: Yes (Base64 text)</li>
        <li>Can contain multiple certificates in one file (certificate chain)</li>
      </ul>

      <h2>DER Format</h2>
      <p>DER (Distinguished Encoding Rules) is the binary encoding of a certificate. PEM is just DER data that has been Base64 encoded.</p>
      <ul>
        <li>File extensions: <code>.der</code>, <code>.cer</code></li>
        <li>Used by: Java applications, Android, Windows (sometimes)</li>
        <li>Human readable: No (binary)</li>
        <li>Smaller file size than PEM</li>
      </ul>

      <h2>PKCS#12 / PFX Format</h2>
      <p>PKCS#12 (PFX) is an archive format that can store a certificate, its private key, and the entire certificate chain in a single password-protected file.</p>
      <ul>
        <li>File extensions: <code>.pfx</code>, <code>.p12</code></li>
        <li>Used by: Windows IIS, Azure, AWS, Java keystores</li>
        <li>Password protected: Yes</li>
        <li>Contains: Certificate + private key + chain (all in one file)</li>
      </ul>

      <h2>PKCS#8 Format</h2>
      <p>PKCS#8 is a standard syntax for storing private key information. It can store RSA, DSA, EC, and other key types, optionally encrypted with a passphrase.</p>
      <pre><code>{`-----BEGIN PRIVATE KEY-----        (unencrypted)
-----BEGIN ENCRYPTED PRIVATE KEY-- (encrypted)
-----END PRIVATE KEY-----`}</code></pre>

      <h2>Format Conversion Commands</h2>
      <table>
        <thead><tr><th>Conversion</th><th>OpenSSL Command</th></tr></thead>
        <tbody>
          <tr><td>PEM → DER</td><td><code>openssl x509 -in cert.pem -outform DER -out cert.der</code></td></tr>
          <tr><td>DER → PEM</td><td><code>openssl x509 -in cert.der -inform DER -out cert.pem</code></td></tr>
          <tr><td>PEM → PFX</td><td><code>openssl pkcs12 -export -out bundle.pfx -inkey key.pem -in cert.pem</code></td></tr>
          <tr><td>PFX → PEM</td><td><code>openssl pkcs12 -in bundle.pfx -out cert.pem -nodes</code></td></tr>
        </tbody>
      </table>

      <div className="callout callout-green">
        <p>✓ Quick rule: Use PEM for Linux servers (Nginx, Apache, Node.js). Use PFX/PKCS12 for Windows IIS and Java. Use DER when required by specific applications.</p>
      </div>
    </>
  )
}
