'use client'

export default function SymmetricVsAsymmetricEncryption() {
  return (
    <article className="prose-freeutil">
      <p>Encryption comes in two fundamental flavors — symmetric (one key) and asymmetric (key pair). TLS, SSH, and GPG use both together, combining their respective strengths. Here's how each works and when to use them.</p>

      <h2>Symmetric Encryption</h2>
      <p>The same key encrypts and decrypts data. Fast, efficient, but requires both parties to share the secret key securely — the "key distribution problem."</p>
      <pre><code>{`Plaintext + Key → [Encryption] → Ciphertext
Ciphertext + Same Key → [Decryption] → Plaintext`}</code></pre>
      <p>The dominant algorithm is <strong>AES</strong> (Advanced Encryption Standard):</p>
      <ul>
        <li><strong>AES-128</strong> — 128-bit key, fast, sufficient for most uses</li>
        <li><strong>AES-256</strong> — 256-bit key, used for high-security requirements</li>
        <li><strong>AES-GCM</strong> — AES with authenticated encryption (recommended mode)</li>
      </ul>
      <p><strong>Speed:</strong> AES-256 processes ~1 GB/s on modern hardware with hardware acceleration (AES-NI instruction set).</p>

      <h2>Asymmetric Encryption</h2>
      <p>Uses a mathematically linked key pair: a public key (safe to share) and a private key (kept secret). What one key encrypts, only the other can decrypt.</p>
      <pre><code>{`// Encryption: anyone with public key can encrypt
Plaintext + Public Key → [RSA Encrypt] → Ciphertext
Ciphertext + Private Key → [RSA Decrypt] → Plaintext

// Signatures: private key signs, public key verifies
Data + Private Key → [Sign] → Signature
Signature + Public Key → [Verify] → Valid/Invalid`}</code></pre>
      <p>Common asymmetric algorithms:</p>
      <ul>
        <li><strong>RSA</strong> — most widely supported, large keys (2048–4096 bits)</li>
        <li><strong>ECDSA / Ed25519</strong> — elliptic curve, smaller keys with same security</li>
        <li><strong>Diffie-Hellman / ECDH</strong> — key exchange, not encryption directly</li>
      </ul>
      <p><strong>Speed:</strong> RSA operations are ~1000x slower than AES. Asymmetric encryption is impractical for bulk data.</p>

      <h2>How TLS Uses Both</h2>
      <p>This is why TLS is fast despite using RSA/ECDSA certificates:</p>
      <ol>
        <li>Asymmetric crypto (RSA/ECDH) is used only during the <strong>handshake</strong> to securely exchange a session key</li>
        <li>All actual data is encrypted with <strong>AES symmetric encryption</strong> using that session key</li>
      </ol>
      <p>You get the security of asymmetric (no shared secret needed upfront) with the speed of symmetric (AES for data transfer).</p>

      <h2>Comparison</h2>
      <table>
        <thead><tr><th></th><th>Symmetric (AES)</th><th>Asymmetric (RSA/EC)</th></tr></thead>
        <tbody>
          <tr><td>Keys</td><td>One shared key</td><td>Public + private key pair</td></tr>
          <tr><td>Speed</td><td>Very fast</td><td>1000x slower</td></tr>
          <tr><td>Key distribution</td><td>Difficult (share secret)</td><td>Easy (public key is public)</td></tr>
          <tr><td>Use for bulk data</td><td>✅ Yes</td><td>❌ Too slow</td></tr>
          <tr><td>Digital signatures</td><td>❌ No</td><td>✅ Yes</td></tr>
          <tr><td>Key agreement</td><td>❌ No</td><td>✅ Yes (ECDH)</td></tr>
          <tr><td>Examples</td><td>AES-256, ChaCha20</td><td>RSA, ECDSA, Ed25519</td></tr>
        </tbody>
      </table>

      <h2>Practical Applications</h2>
      <ul>
        <li><strong>Database encryption at rest</strong> → AES-256 (symmetric)</li>
        <li><strong>SSL/TLS certificates</strong> → RSA or ECDSA (asymmetric) for handshake, AES for data</li>
        <li><strong>SSH authentication</strong> → Ed25519 (asymmetric) key pairs</li>
        <li><strong>JWT signing</strong> → HS256 (symmetric HMAC) or RS256/ES256 (asymmetric)</li>
        <li><strong>Password hashing</strong> → neither — use bcrypt or Argon2 (KDF, not encryption)</li>
        <li><strong>File encryption (GPG)</strong> → hybrid (asymmetric for key exchange, symmetric for file)</li>
      </ul>
    </article>
  )
}
