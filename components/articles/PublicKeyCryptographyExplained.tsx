'use client'

export default function PublicKeyCryptographyExplained() {
  return (
    <>
      <h2>The Core Idea: Two Keys, One Pair</h2>
      <p>
        Public key cryptography (also called asymmetric cryptography) solves a problem that stumped mathematicians for centuries: how do two people communicate securely without ever meeting to agree on a secret first?
      </p>
      <p>
        The answer is a pair of mathematically linked keys. A <strong>public key</strong> you share with everyone. A <strong>private key</strong> you keep secret. What one key encrypts, only the other can decrypt — and knowing the public key doesn't let you figure out the private key (at least not in any practical amount of time).
      </p>
      <div className="callout callout-blue">
        <p>
          <strong>The mailbox analogy:</strong> Your public key is like a mailbox slot — anyone can drop a message in. Your private key is the mailbox key — only you can open it and read what's inside.
        </p>
      </div>

      <h2>Symmetric vs Asymmetric Encryption</h2>
      <p>Before public key cryptography, encryption was <strong>symmetric</strong> — the same key encrypts and decrypts. This works fine if two parties already share a secret key, but creates a chicken-and-egg problem: how do you securely share that key in the first place?</p>
      <table>
        <thead>
          <tr><th>Property</th><th>Symmetric</th><th>Asymmetric</th></tr>
        </thead>
        <tbody>
          <tr><td>Keys</td><td>One shared key</td><td>Public + private key pair</td></tr>
          <tr><td>Speed</td><td>Very fast</td><td>Much slower</td></tr>
          <tr><td>Key distribution</td><td>Hard problem</td><td>Solved — share public key freely</td></tr>
          <tr><td>Common use</td><td>Bulk data encryption (AES)</td><td>Key exchange, signatures, certificates</td></tr>
          <tr><td>Examples</td><td>AES-256, ChaCha20</td><td>RSA, ECDSA, Ed25519</td></tr>
        </tbody>
      </table>
      <p>
        In practice, most systems use <em>both</em>: asymmetric crypto to exchange a session key, then symmetric crypto for fast bulk encryption. This is exactly what TLS does.
      </p>

      <h2>How Encryption Works with Key Pairs</h2>
      <h3>Encrypting for a recipient</h3>
      <p>
        If Alice wants to send Bob a message only Bob can read, she encrypts it with <strong>Bob's public key</strong>. Only Bob's private key can decrypt it. Even Alice cannot decrypt it after encrypting.
      </p>
      <pre><code>{`Alice encrypts with Bob's public key  →  [encrypted message]
Bob decrypts with Bob's private key   →  original message`}</code></pre>

      <h3>Signing to prove identity</h3>
      <p>
        If Alice wants to prove a message came from her and wasn't tampered with, she signs it with <strong>her private key</strong>. Anyone with her public key can verify the signature.
      </p>
      <pre><code>{`Alice signs with Alice's private key  →  [message + signature]
Anyone verifies with Alice's public key → authentic / tampered`}</code></pre>

      <h2>Digital Signatures Explained</h2>
      <p>
        A digital signature doesn't encrypt the whole message. Instead:
      </p>
      <ul>
        <li>Alice computes a <strong>hash</strong> of the message (e.g., SHA-256)</li>
        <li>She <strong>encrypts that hash</strong> with her private key — this is the signature</li>
        <li>Bob receives the message + signature</li>
        <li>Bob hashes the message independently and <strong>decrypts the signature</strong> using Alice's public key</li>
        <li>If the two hashes match: the message is authentic and unmodified</li>
      </ul>
      <p>
        Digital signatures are used everywhere: TLS certificates, code signing, JWT tokens (the signature part), Git commit signing, and email (DKIM).
      </p>

      <h2>Key Exchange: Diffie-Hellman</h2>
      <p>
        TLS doesn't actually encrypt your data with RSA or ECDSA keys — that would be slow. Instead, it uses those keys to authenticate the server, then performs a <strong>Diffie-Hellman key exchange</strong> to agree on a symmetric session key.
      </p>
      <p>
        The magic of Diffie-Hellman is that both parties can compute the same secret value without ever transmitting it. An eavesdropper who sees all the messages still cannot compute the shared secret — this is the basis of <strong>forward secrecy</strong>.
      </p>
      <div className="callout">
        <p>
          <strong>The paint analogy:</strong> Alice and Bob each add a secret color to a shared public color, exchange the results, then add their secret color again. Both end up with the same final mixture — but an observer who only saw the intermediate values can't reproduce it.
        </p>
      </div>

      <h2>Common Public Key Algorithms</h2>
      <h3>RSA</h3>
      <p>
        The classic algorithm. Security based on the difficulty of factoring large numbers. Key sizes of 2048-bit (standard) or 4096-bit (high security). Slower than modern alternatives. Widely supported.
      </p>
      <h3>ECDSA (Elliptic Curve DSA)</h3>
      <p>
        Uses elliptic curve math instead of integer factoring. A 256-bit ECDSA key offers similar security to a 3072-bit RSA key. Much faster and smaller keys. Used in most modern TLS certificates.
      </p>
      <h3>Ed25519</h3>
      <p>
        A specific elliptic curve (Curve25519) optimized for speed and security. The preferred algorithm for SSH keys today. Deterministic signatures (no random number vulnerability). 256-bit key, extremely fast.
      </p>
      <table>
        <thead>
          <tr><th>Algorithm</th><th>Key Size</th><th>Speed</th><th>Best For</th></tr>
        </thead>
        <tbody>
          <tr><td>RSA-2048</td><td>2048-bit</td><td>Slow</td><td>Legacy compatibility</td></tr>
          <tr><td>RSA-4096</td><td>4096-bit</td><td>Very slow</td><td>Long-term certificates</td></tr>
          <tr><td>ECDSA P-256</td><td>256-bit</td><td>Fast</td><td>TLS certificates</td></tr>
          <tr><td>Ed25519</td><td>256-bit</td><td>Very fast</td><td>SSH keys, JWT signing</td></tr>
        </tbody>
      </table>

      <h2>Real-World Uses</h2>
      <ul>
        <li><strong>HTTPS/TLS</strong> — server certificate proves identity; Diffie-Hellman creates session key</li>
        <li><strong>SSH</strong> — your key pair authenticates you to servers without passwords</li>
        <li><strong>JWT</strong> — RS256/ES256 signatures verify token authenticity</li>
        <li><strong>Code signing</strong> — software publishers sign builds so your OS can verify authenticity</li>
        <li><strong>PGP/GPG email</strong> — encrypt emails so only the recipient can read them</li>
        <li><strong>Blockchain</strong> — transactions are signed with private keys to prove ownership</li>
        <li><strong>DKIM</strong> — email servers sign messages; receiving servers verify with DNS public key</li>
      </ul>

      <h2>Why Can't You Figure Out the Private Key from the Public Key?</h2>
      <p>
        For RSA, this would require factoring an extremely large number (the product of two primes). The largest RSA key ever factored publicly was 829 bits — and took hundreds of computers years to crack. A 2048-bit key is exponentially harder.
      </p>
      <p>
        For elliptic curves, it's the discrete logarithm problem on an elliptic curve — similarly believed to be computationally infeasible with current computers.
      </p>
      <div className="callout">
        <p>
          <strong>Quantum computing caveat:</strong> A sufficiently powerful quantum computer could break RSA and ECDSA using Shor's algorithm. This is why post-quantum cryptography (algorithms resistant to quantum attacks) is an active area of research, with NIST publishing new standards in 2024.
        </p>
      </div>

      <h2>Summary</h2>
      <p>
        Public key cryptography enables secure communication without a pre-shared secret. The public key encrypts or verifies; the private key decrypts or signs. It underpins HTTPS, SSH, email security, code signing, and most modern secure systems. While RSA was the original standard, ECDSA and Ed25519 are now preferred for their smaller keys and better performance.
      </p>
    </>
  )
}
