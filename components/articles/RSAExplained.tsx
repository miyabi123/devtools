export default function RSAExplained() {
  return (
    <>
      <h2>What is RSA?</h2>
      <p>RSA (Rivest–Shamir–Adleman) is the most widely used asymmetric encryption algorithm. It was published in 1977 and remains a cornerstone of modern internet security. RSA is used in SSL/TLS certificates, SSH keys, code signing, email encryption (S/MIME, PGP), and many other security applications.</p>

      <h2>How Asymmetric Encryption Works</h2>
      <p>RSA uses a key pair — a public key and a private key. These keys are mathematically related but it is computationally infeasible to derive the private key from the public key.</p>
      <ul>
        <li><strong>Public key</strong>: Share with everyone. Used to encrypt data or verify signatures.</li>
        <li><strong>Private key</strong>: Keep secret. Used to decrypt data or create signatures.</li>
      </ul>
      <table>
        <thead><tr><th>Use Case</th><th>Encrypt/Sign with</th><th>Decrypt/Verify with</th></tr></thead>
        <tbody>
          <tr><td>Send encrypted message</td><td>Recipient's public key</td><td>Recipient's private key</td></tr>
          <tr><td>Digital signature</td><td>Sender's private key</td><td>Sender's public key</td></tr>
          <tr><td>SSL/TLS handshake</td><td>Server's public key</td><td>Server's private key</td></tr>
        </tbody>
      </table>

      <h2>Key Sizes</h2>
      <table>
        <thead><tr><th>Key Size</th><th>Security Level</th><th>Status</th><th>Use Case</th></tr></thead>
        <tbody>
          <tr><td>1024-bit</td><td>Weak</td><td>❌ Deprecated</td><td>Legacy only — do not use</td></tr>
          <tr><td>2048-bit</td><td>Good</td><td>✅ Standard</td><td>Current minimum for SSL/TLS and SSH</td></tr>
          <tr><td>4096-bit</td><td>Very strong</td><td>✅ High security</td><td>Root CAs, long-lived certificates</td></tr>
        </tbody>
      </table>

      <h2>RSA vs ECDSA</h2>
      <p>Elliptic Curve Digital Signature Algorithm (ECDSA) is a modern alternative to RSA that provides the same security with much shorter keys:</p>
      <table>
        <thead><tr><th></th><th>RSA</th><th>ECDSA</th></tr></thead>
        <tbody>
          <tr><td>Security equivalent</td><td>2048-bit</td><td>256-bit (P-256)</td></tr>
          <tr><td>Key size</td><td>Large</td><td>Small</td></tr>
          <tr><td>Performance</td><td>Slower</td><td>Faster</td></tr>
          <tr><td>Compatibility</td><td>Universal</td><td>Very good (modern systems)</td></tr>
          <tr><td>Used in</td><td>Most SSL certs</td><td>Cloudflare, Google, Bitcoin</td></tr>
        </tbody>
      </table>

      <div className="callout callout-green">
        <p>✓ For new applications: prefer ECDSA P-256 for its better performance. Use RSA 2048-bit when maximum compatibility with older systems is required.</p>
      </div>
    </>
  )
}
