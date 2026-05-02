'use client'

export default function DataEncryptionExplained() {
  return (
    <>
      <h2>Two Types of Data Encryption</h2>
      <p>
        When people talk about "encrypting data," they usually mean one of two distinct scenarios: protecting data while it's being transmitted (in transit), or protecting data while it's stored (at rest). Both are necessary for complete security, and they use different approaches.
      </p>
      <table>
        <thead><tr><th>Type</th><th>When</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td><strong>In Transit</strong></td><td>Data moving across a network</td><td>Browser ↔ Web server (HTTPS)</td></tr>
          <tr><td><strong>At Rest</strong></td><td>Data stored on disk or in a database</td><td>Encrypted database, encrypted S3 bucket</td></tr>
        </tbody>
      </table>

      <h2>Encryption In Transit</h2>
      <h3>How it works</h3>
      <p>
        Encryption in transit prevents eavesdropping and tampering as data moves between systems. The standard protocol is <strong>TLS (Transport Layer Security)</strong>, which underpins HTTPS, secure email (SMTPS), and most other secure network protocols.
      </p>
      <p>
        TLS uses a combination of asymmetric encryption (for the initial handshake and key exchange) and symmetric encryption (for the actual data transfer). The session key is negotiated freshly for each connection, meaning capturing one session's traffic doesn't help decrypt other sessions (forward secrecy).
      </p>

      <h3>What is and isn't protected</h3>
      <ul>
        <li>✅ Data cannot be read by anyone between client and server</li>
        <li>✅ Data cannot be modified in transit without detection</li>
        <li>✅ Server identity is verified via certificate</li>
        <li>❌ Metadata (IP addresses, timing) is still visible to network observers</li>
        <li>❌ Data is decrypted at the server — the server can read everything</li>
      </ul>

      <h3>Implementation</h3>
      <pre><code>{`# Nginx: enforce TLS 1.2+, strong ciphers
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
ssl_prefer_server_ciphers off;
add_header Strict-Transport-Security "max-age=63072000" always;`}</code></pre>

      <h2>Encryption At Rest</h2>
      <h3>How it works</h3>
      <p>
        Encryption at rest protects stored data from being read if the physical storage is stolen, a cloud provider employee accesses your storage, or an attacker gains access to your server.
      </p>

      <h3>Levels of encryption at rest</h3>

      <h4>Full Disk Encryption (FDE)</h4>
      <p>
        Encrypts the entire storage volume. If the disk is stolen, data is unreadable without the encryption key. AWS EBS, Azure Disk Storage, and Google Persistent Disk all support FDE. Transparent to applications — no code changes needed.
      </p>
      <pre><code>{`# AWS: enable EBS encryption by default in a region
aws ec2 enable-ebs-encryption-by-default --region ap-southeast-1`}</code></pre>

      <h4>Database Encryption (TDE — Transparent Data Encryption)</h4>
      <p>
        Database engines like PostgreSQL, MySQL, and SQL Server support encrypting data files on disk. "Transparent" means the database handles encryption/decryption automatically — your queries and application code don't change.
      </p>

      <h4>Application-Level (Field) Encryption</h4>
      <p>
        Encrypt specific sensitive fields before storing them in the database. Even if someone gets database access, they can't read encrypted fields without the encryption key.
      </p>
      <pre><code>{`// Encrypt sensitive field before storing
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex') // 32 bytes

function encrypt(text: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv(ALGORITHM, KEY, iv)
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return [iv, tag, encrypted].map(b => b.toString('hex')).join(':')
}

function decrypt(encryptedText: string): string {
  const [ivHex, tagHex, dataHex] = encryptedText.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const tag = Buffer.from(tagHex, 'hex')
  const data = Buffer.from(dataHex, 'hex')
  const decipher = createDecipheriv(ALGORITHM, KEY, iv)
  decipher.setAuthTag(tag)
  return decipher.update(data) + decipher.final('utf8')
}`}</code></pre>

      <h2>AES — The Standard Symmetric Algorithm</h2>
      <p>
        AES (Advanced Encryption Standard) is the dominant symmetric encryption algorithm. It's fast, battle-tested, and used everywhere from TLS to disk encryption to password managers.
      </p>
      <table>
        <thead><tr><th>Variant</th><th>Key Size</th><th>Security</th><th>Use</th></tr></thead>
        <tbody>
          <tr><td>AES-128</td><td>128-bit</td><td>Very strong</td><td>General use</td></tr>
          <tr><td>AES-192</td><td>192-bit</td><td>Stronger</td><td>Uncommon</td></tr>
          <tr><td>AES-256</td><td>256-bit</td><td>Strongest</td><td>High-security use cases</td></tr>
        </tbody>
      </table>
      <p>
        Always use AES with an authenticated encryption mode:
      </p>
      <ul>
        <li><strong>AES-GCM</strong> (Galois/Counter Mode) — recommended. Fast, provides both encryption and authentication (integrity check). Used in TLS 1.3.</li>
        <li><strong>AES-CBC</strong> — older mode. Requires separate HMAC for integrity. More complex, more room for mistakes. Avoid in new code.</li>
        <li><strong>AES-ECB</strong> — never use. Deterministic encryption leaks patterns.</li>
      </ul>

      <h2>Key Management</h2>
      <p>
        Encryption is only as strong as your key management. A common mistake is encrypting data but storing the encryption key next to the encrypted data.
      </p>
      <ul>
        <li><strong>Use a KMS</strong> (Key Management Service) — AWS KMS, Google Cloud KMS, HashiCorp Vault. Keys are stored securely, never in your application code or database.</li>
        <li><strong>Rotate keys periodically</strong> — re-encrypt data with new keys when old keys are retired</li>
        <li><strong>Separate key and data</strong> — if possible, keep encryption keys in a different system than the encrypted data</li>
        <li><strong>Use envelope encryption</strong> — encrypt data with a data key, encrypt the data key with a master key in KMS</li>
      </ul>

      <h2>Compliance Requirements</h2>
      <table>
        <thead><tr><th>Standard</th><th>In Transit</th><th>At Rest</th></tr></thead>
        <tbody>
          <tr><td>GDPR</td><td>Required (TLS)</td><td>Strongly recommended</td></tr>
          <tr><td>PCI DSS</td><td>Required (TLS 1.2+)</td><td>Required for cardholder data</td></tr>
          <tr><td>HIPAA</td><td>Required</td><td>Required</td></tr>
          <tr><td>SOC 2</td><td>Required</td><td>Required</td></tr>
          <tr><td>PDPA (Thailand)</td><td>Required</td><td>Recommended</td></tr>
        </tbody>
      </table>

      <h2>Summary</h2>
      <p>
        Encryption in transit (TLS/HTTPS) protects data as it moves between systems — always use TLS 1.2 or 1.3. Encryption at rest protects stored data — use full disk encryption as a baseline, add database encryption for regulated data, and field-level encryption for the most sensitive values. AES-256-GCM is the algorithm of choice for application-level encryption. Manage keys separately from data using a KMS.
      </p>
    </>
  )
}
