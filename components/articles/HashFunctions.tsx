export default function HashFunctions() {
  return (
    <>
      <h2>What is a Cryptographic Hash Function?</h2>
      <p>A cryptographic hash function takes an input of any size and produces a fixed-size output (the hash or digest). Hash functions are one-way — you can compute the hash from the input, but you cannot recover the input from the hash. Even a tiny change in the input produces a completely different hash (the avalanche effect).</p>

      <h2>Key Properties</h2>
      <ul>
        <li><strong>Deterministic</strong>: Same input always produces the same hash</li>
        <li><strong>One-way</strong>: Computationally infeasible to reverse</li>
        <li><strong>Avalanche effect</strong>: Small input changes cause large output changes</li>
        <li><strong>Collision resistant</strong>: Infeasible to find two different inputs with the same hash</li>
        <li><strong>Fixed output size</strong>: Output length is always the same regardless of input size</li>
      </ul>

      <h2>MD5</h2>
      <p>MD5 produces a 128-bit (32 hex character) hash. It was widely used but is now considered cryptographically broken. Collision attacks have been demonstrated — two different files can produce the same MD5 hash.</p>
      <pre><code>{`MD5("Hello World") = b10a8db164e0754105b7a99be72e3fe5`}</code></pre>
      <div className="callout">
        <p>⚠️ Do NOT use MD5 for security purposes — passwords, certificate fingerprints, or digital signatures. Use only for non-security checksums like file integrity verification in trusted environments.</p>
      </div>

      <h2>SHA-1</h2>
      <p>SHA-1 produces a 160-bit (40 hex character) hash. Like MD5, it has been broken — collision attacks have been demonstrated (Google's SHAttered attack in 2017). Major browsers no longer accept SSL certificates signed with SHA-1.</p>
      <pre><code>{`SHA1("Hello World") = 0a4d55a8d778e5022fab701977c5d840bbc486d0`}</code></pre>

      <h2>SHA-256</h2>
      <p>SHA-256 is part of the SHA-2 family and produces a 256-bit (64 hex character) hash. It is the current standard for most security applications, including SSL/TLS certificates, Bitcoin, JWT signatures, and code signing.</p>
      <pre><code>{`SHA256("Hello World") = a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e`}</code></pre>

      <h2>SHA-512</h2>
      <p>SHA-512 produces a 512-bit (128 hex character) hash. It is more secure than SHA-256 but slower on 32-bit systems. It performs better on 64-bit systems due to its 64-bit operations. Use SHA-512 for password hashing combined with a proper algorithm like bcrypt or Argon2.</p>

      <h2>Comparison Table</h2>
      <table>
        <thead><tr><th>Algorithm</th><th>Output Size</th><th>Speed</th><th>Security Status</th><th>Use Case</th></tr></thead>
        <tbody>
          <tr><td>MD5</td><td>128-bit (32 chars)</td><td>Very fast</td><td>❌ Broken</td><td>Legacy checksums only</td></tr>
          <tr><td>SHA-1</td><td>160-bit (40 chars)</td><td>Fast</td><td>❌ Broken</td><td>Legacy only</td></tr>
          <tr><td>SHA-256</td><td>256-bit (64 chars)</td><td>Fast</td><td>✅ Secure</td><td>SSL, JWT, Bitcoin, general use</td></tr>
          <tr><td>SHA-384</td><td>384-bit (96 chars)</td><td>Medium</td><td>✅ Secure</td><td>High-security applications</td></tr>
          <tr><td>SHA-512</td><td>512-bit (128 chars)</td><td>Fast on 64-bit</td><td>✅ Secure</td><td>Password hashing base, file integrity</td></tr>
        </tbody>
      </table>

      <h2>Practical Use Cases</h2>
      <ul>
        <li><strong>File integrity verification</strong>: Download a file and verify its SHA-256 hash matches the published checksum</li>
        <li><strong>Password storage</strong>: Never store plain passwords — store the hash (use bcrypt/Argon2, not raw SHA)</li>
        <li><strong>Digital signatures</strong>: Sign the hash of a document, not the document itself</li>
        <li><strong>Data deduplication</strong>: Use hashes to detect duplicate files efficiently</li>
        <li><strong>Git commits</strong>: Each Git commit is identified by its SHA-1 hash (Git is moving to SHA-256)</li>
        <li><strong>SSL certificates</strong>: Certificates are signed with SHA-256 hash of the certificate data</li>
      </ul>
    </>
  )
}
