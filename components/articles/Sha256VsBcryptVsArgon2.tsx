'use client'

export default function Sha256VsBcryptVsArgon2() {
  return (
    <article className="prose-freeutil">
      <p>
        Using SHA-256 to hash passwords is one of the most common security mistakes in web development. Understanding why — and what to use instead — is essential knowledge for any developer handling user credentials.
      </p>

      <h2>Why SHA-256 Is Wrong for Passwords</h2>
      <p>
        SHA-256 is a cryptographic hash function designed to be fast. Very fast. A modern GPU can compute billions of SHA-256 hashes per second. This speed is an asset for checksums and data integrity — but a critical vulnerability for password hashing.
      </p>
      <p>
        If an attacker obtains your hashed passwords, they can run a dictionary attack or brute-force attempt at billions of guesses per second. A 6-character password hashed with SHA-256 can be cracked in seconds. Even with a salt, SHA-256 is simply too fast to provide meaningful protection against offline attacks.
      </p>
      <div className="callout">
        <p>⚠️ Never use MD5, SHA-1, SHA-256, or SHA-512 alone for password hashing. Use a purpose-built password hashing function: bcrypt, Argon2, or scrypt.</p>
      </div>

      <h2>bcrypt</h2>
      <p>
        bcrypt was designed in 1999 specifically for password hashing. Its key feature is a configurable work factor (cost factor) — a parameter that controls how slow the hashing is. As hardware gets faster, you increase the work factor to maintain the same effective resistance.
      </p>
      <ul>
        <li><strong>Work factor:</strong> typically 10–14 (each increment doubles compute time)</li>
        <li><strong>At cost 12:</strong> ~250ms per hash on modern hardware — fast enough for login, slow enough to resist attacks</li>
        <li><strong>Output:</strong> 60-character string including salt, cost, and hash</li>
        <li><strong>Password limit:</strong> 72 bytes — passwords longer than 72 characters are silently truncated</li>
        <li><strong>Library support:</strong> excellent — available in virtually every language</li>
      </ul>
      <pre><code>{`// Node.js
const bcrypt = require('bcrypt')

// Hash password
const hash = await bcrypt.hash(password, 12) // cost factor 12

// Verify password
const match = await bcrypt.compare(password, hash) // returns true/false

// Python
import bcrypt
hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12))
match = bcrypt.checkpw(password.encode(), hash)`}</code></pre>

      <h2>Argon2</h2>
      <p>
        Argon2 won the Password Hashing Competition in 2015 and is the current state-of-the-art recommendation. It has three variants:
      </p>
      <ul>
        <li><strong>Argon2id</strong> — recommended for most use cases; hybrid of Argon2i and Argon2d, resistant to both side-channel and GPU attacks</li>
        <li><strong>Argon2i</strong> — optimized against side-channel attacks</li>
        <li><strong>Argon2d</strong> — optimized against GPU cracking</li>
      </ul>
      <p>
        Argon2 introduces a memory parameter that bcrypt lacks — attackers must use significant RAM for each guess, which neutralizes GPU and ASIC cracking (GPUs have limited memory per core).
      </p>
      <ul>
        <li><strong>Parameters:</strong> time cost (iterations), memory cost (KB), parallelism</li>
        <li><strong>OWASP minimum:</strong> Argon2id with m=19456 (19 MB), t=2, p=1</li>
        <li><strong>No password length limit</strong></li>
        <li><strong>Library support:</strong> good and growing — available in Node.js, Python, Go, Rust, PHP</li>
      </ul>
      <pre><code>{`// Node.js
const argon2 = require('argon2')

// Hash
const hash = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 19456,  // 19 MB
  timeCost: 2,
  parallelism: 1,
})

// Verify
const match = await argon2.verify(hash, password)

// Python
import argon2
ph = argon2.PasswordHasher(time_cost=2, memory_cost=19456, parallelism=1)
hash = ph.hash(password)
ph.verify(hash, password)`}</code></pre>

      <h2>Comparison</h2>
      <table>
        <thead>
          <tr><th>Factor</th><th>SHA-256</th><th>bcrypt</th><th>Argon2id</th></tr>
        </thead>
        <tbody>
          <tr><td>Designed for passwords</td><td>❌</td><td>✅</td><td>✅</td></tr>
          <tr><td>Configurable slowness</td><td>❌</td><td>✅ (time)</td><td>✅ (time + memory)</td></tr>
          <tr><td>Memory hardness</td><td>❌</td><td>❌</td><td>✅</td></tr>
          <tr><td>GPU resistance</td><td>❌</td><td>Partial</td><td>✅</td></tr>
          <tr><td>Password length limit</td><td>None</td><td>72 bytes</td><td>None</td></tr>
          <tr><td>Library support</td><td>Universal</td><td>Excellent</td><td>Good</td></tr>
          <tr><td>OWASP recommended</td><td>❌</td><td>✅</td><td>✅ (preferred)</td></tr>
        </tbody>
      </table>

      <h2>Which to Use in 2025</h2>
      <p>
        <strong>Argon2id</strong> is the first choice for new projects. It's the OWASP recommendation and offers the strongest resistance to modern attack hardware. If your language or framework doesn't have a mature Argon2 library, <strong>bcrypt at cost 12</strong> is an excellent and battle-tested alternative.
      </p>
      <p>
        For existing systems using bcrypt, there's no urgent reason to migrate — bcrypt remains secure. Re-hash to Argon2 lazily at login time when users authenticate successfully.
      </p>
    </article>
  )
}
