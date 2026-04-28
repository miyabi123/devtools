'use client'

export default function RsaVsEcdsaVsEd25519() {
  return (
    <article className="prose-freeutil">
      <p>
        When generating SSH keys, signing JWT tokens, or issuing SSL certificates, you'll choose a key algorithm. RSA has been the default for decades, but ECDSA and Ed25519 offer better performance and equivalent or superior security. Here's how to choose.
      </p>

      <h2>RSA</h2>
      <p>
        RSA (Rivest–Shamir–Adleman) is the oldest and most widely supported asymmetric algorithm. Its security relies on the difficulty of factoring large integers. Key sizes of 2048 bits are current standard; 4096 bits are used for high-security applications.
      </p>
      <ul>
        <li><strong>Key sizes:</strong> 2048, 3072, or 4096 bits</li>
        <li><strong>Security of RSA-2048:</strong> approximately 112 bits (NIST recommendation through 2030)</li>
        <li><strong>Security of RSA-3072:</strong> approximately 128 bits</li>
        <li><strong>Compatibility:</strong> universal — supported everywhere</li>
        <li><strong>Performance:</strong> slow key generation, slow signing, fast verification</li>
      </ul>
      <pre><code>{`# Generate RSA-2048 SSH key
ssh-keygen -t rsa -b 2048 -C "your@email.com"

# Generate RSA-4096
ssh-keygen -t rsa -b 4096 -C "your@email.com"`}</code></pre>

      <h2>ECDSA</h2>
      <p>
        ECDSA (Elliptic Curve Digital Signature Algorithm) achieves the same security level as RSA with much smaller keys. A 256-bit ECDSA key provides roughly the same security as RSA-3072. The most common curves are P-256 (secp256r1) and P-384.
      </p>
      <ul>
        <li><strong>Key sizes:</strong> 256, 384, or 521 bits</li>
        <li><strong>Security of P-256:</strong> approximately 128 bits</li>
        <li><strong>Compatibility:</strong> very good — supported since OpenSSL 1.0, all modern SSH clients</li>
        <li><strong>Performance:</strong> significantly faster than RSA for signing and key generation</li>
        <li><strong>Caveat:</strong> security depends on a random nonce per signature; a weak RNG can leak the private key</li>
      </ul>
      <pre><code>{`# Generate ECDSA P-256 SSH key
ssh-keygen -t ecdsa -b 256 -C "your@email.com"

# Generate ECDSA P-384
ssh-keygen -t ecdsa -b 384 -C "your@email.com"`}</code></pre>

      <h2>Ed25519</h2>
      <p>
        Ed25519 is based on the Edwards-curve Digital Signature Algorithm using Curve25519, designed by Daniel J. Bernstein. It's the most modern option — faster than ECDSA, immune to the nonce reuse vulnerability, and with a fixed 256-bit key size providing approximately 128 bits of security.
      </p>
      <ul>
        <li><strong>Key size:</strong> always 256 bits</li>
        <li><strong>Security:</strong> approximately 128 bits</li>
        <li><strong>Performance:</strong> fastest of the three for signing and verification</li>
        <li><strong>Deterministic:</strong> signatures are deterministic — no random nonce, so no nonce-reuse vulnerability</li>
        <li><strong>Compatibility:</strong> good but not universal — requires OpenSSH 6.5+, OpenSSL 1.1.1+, not supported in some older systems</li>
      </ul>
      <pre><code>{`# Generate Ed25519 SSH key (recommended for new keys)
ssh-keygen -t ed25519 -C "your@email.com"`}</code></pre>

      <h2>Performance Comparison</h2>
      <table>
        <thead>
          <tr><th>Algorithm</th><th>Key size</th><th>Security bits</th><th>Sign speed</th><th>Verify speed</th></tr>
        </thead>
        <tbody>
          <tr><td>RSA-2048</td><td>2048 bits</td><td>~112</td><td>Slow</td><td>Fast</td></tr>
          <tr><td>RSA-4096</td><td>4096 bits</td><td>~140</td><td>Very slow</td><td>Moderate</td></tr>
          <tr><td>ECDSA P-256</td><td>256 bits</td><td>~128</td><td>Fast</td><td>Fast</td></tr>
          <tr><td>ECDSA P-384</td><td>384 bits</td><td>~192</td><td>Moderate</td><td>Moderate</td></tr>
          <tr><td>Ed25519</td><td>256 bits</td><td>~128</td><td>Fastest</td><td>Fastest</td></tr>
        </tbody>
      </table>

      <h2>Which to Use — By Use Case</h2>
      <h3>SSH Keys</h3>
      <p>
        <strong>Ed25519</strong> is the right choice for all new SSH keys. It's faster, smaller, more secure against implementation mistakes, and supported by all modern SSH servers and clients (OpenSSH 6.5+, released 2014). Use RSA-4096 only if you need to connect to legacy systems that don't support Ed25519.
      </p>

      <h3>SSL/TLS Certificates</h3>
      <p>
        <strong>ECDSA P-256</strong> is ideal for SSL certificates — smaller key size means smaller TLS handshakes and faster connections. All major CAs support ECDSA. RSA-2048 remains the safe default if you need maximum compatibility with very old clients. Let's Encrypt supports both.
      </p>

      <h3>JWT Signing</h3>
      <p>
        For JWT, the algorithm choice maps to the <code>alg</code> header:
      </p>
      <ul>
        <li><strong>RS256/RS512</strong> — RSA signing, widely supported</li>
        <li><strong>ES256/ES384</strong> — ECDSA signing, smaller signatures</li>
        <li><strong>EdDSA</strong> — Ed25519 signing, fastest and most secure, but library support is still catching up</li>
      </ul>
      <p>
        ES256 (ECDSA P-256) is the best balance of security, performance, and library support for JWT in 2025.
      </p>
    </article>
  )
}
