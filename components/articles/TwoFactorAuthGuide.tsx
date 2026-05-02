'use client'

export default function TwoFactorAuthGuide() {
  return (
    <>
      <h2>What is Two-Factor Authentication?</h2>
      <p>
        Two-factor authentication (2FA) adds a second verification step beyond your password. Even if an attacker steals your password, they can't log in without also having the second factor. The three categories of factors are something you <strong>know</strong> (password), something you <strong>have</strong> (phone, hardware key), and something you <strong>are</strong> (biometric). 2FA combines any two.
      </p>
      <p>
        With password breaches and credential stuffing attacks routine, 2FA is no longer optional for any account that matters — email, banking, cloud infrastructure, developer tools.
      </p>

      <h2>Types of 2FA</h2>

      <h3>TOTP — Authenticator Apps (Recommended)</h3>
      <p>
        TOTP (Time-based One-Time Password, RFC 6238) generates a 6-digit code that changes every 30 seconds using a shared secret between your authenticator app and the service.
      </p>
      <ul>
        <li>Works offline — no SMS required</li>
        <li>Not vulnerable to SIM swapping</li>
        <li>Not vulnerable to SS7 attacks (phone network interception)</li>
        <li>Codes expire in 30 seconds — captured codes quickly become useless</li>
      </ul>
      <p>Popular authenticator apps: <strong>Authy</strong>, <strong>Google Authenticator</strong>, <strong>1Password</strong>, <strong>Bitwarden Authenticator</strong>, <strong>Aegis</strong> (Android, open source)</p>
      <div className="callout callout-green">
        <p><strong>Recommendation:</strong> Use Authy or 1Password for TOTP — they support encrypted cloud backup, so you don't lose access if you lose your phone. Plain Google Authenticator has no backup.</p>
      </div>

      <h3>SMS / Text Message (Weak — Use With Caution)</h3>
      <p>
        A code is sent to your phone via SMS. It's better than no 2FA, but it's the weakest form:
      </p>
      <ul>
        <li><strong>SIM swapping</strong> — attacker social-engineers your carrier to transfer your number to their SIM</li>
        <li><strong>SS7 vulnerabilities</strong> — SMS can be intercepted through telecom protocol weaknesses</li>
        <li><strong>Phishing</strong> — SMS codes can be phished in real-time with sophisticated attacks</li>
        <li>Doesn't work without cell service</li>
      </ul>
      <p><strong>Still use SMS 2FA if it's the only option</strong> — it's significantly better than nothing. But upgrade to TOTP or hardware keys when available.</p>

      <h3>Email Codes (Similar to SMS, Slightly Better)</h3>
      <p>
        A code sent to your email. As secure as your email account. Better than SMS in that email isn't vulnerable to SIM swapping, but adds a dependency on your email provider's security.
      </p>

      <h3>FIDO2 / WebAuthn / Hardware Keys (Strongest)</h3>
      <p>
        Hardware security keys (YubiKey, Google Titan Key) use public key cryptography. The key generates a unique cryptographic response to each login challenge — no code to enter, no code to phish.
      </p>
      <ul>
        <li>Phishing-resistant by design — the key verifies the domain before signing</li>
        <li>No shared secrets to steal from the server</li>
        <li>Works even if the service's database is compromised</li>
        <li>Supported by Google, GitHub, Microsoft, Apple, 1Password</li>
      </ul>
      <p>
        Modern browsers and phones support <strong>passkeys</strong> (FIDO2 without a hardware key), which store the cryptographic key in your device's secure enclave (TouchID/FaceID/Windows Hello).
      </p>

      <h3>Push Notifications (Duo, Microsoft Authenticator)</h3>
      <p>
        A push notification appears on your registered phone asking you to approve the login. Convenient but vulnerable to "MFA fatigue" attacks — attackers spam approval requests until you accidentally approve one.
      </p>

      <h2>Comparison Table</h2>
      <table>
        <thead><tr><th>Method</th><th>Phishing Resistant</th><th>SIM Swap Resistant</th><th>Works Offline</th><th>Convenience</th></tr></thead>
        <tbody>
          <tr><td>Hardware Key (FIDO2)</td><td>✅ Yes</td><td>✅ Yes</td><td>✅ Yes</td><td>High</td></tr>
          <tr><td>Passkeys</td><td>✅ Yes</td><td>✅ Yes</td><td>✅ Yes</td><td>Very High</td></tr>
          <tr><td>TOTP (Authenticator App)</td><td>⚠️ Partially</td><td>✅ Yes</td><td>✅ Yes</td><td>Medium</td></tr>
          <tr><td>Push Notification</td><td>⚠️ Vulnerable to fatigue</td><td>✅ Yes</td><td>❌ No</td><td>Very High</td></tr>
          <tr><td>SMS</td><td>❌ No</td><td>❌ No</td><td>❌ No</td><td>High</td></tr>
          <tr><td>Email Code</td><td>⚠️ Depends on email security</td><td>✅ Yes</td><td>❌ No</td><td>Medium</td></tr>
        </tbody>
      </table>

      <h2>Backup Codes</h2>
      <p>
        Most services generate 8–10 one-time backup codes when you enable 2FA. These are essential — without them, losing your authenticator app or phone can lock you out permanently.
      </p>
      <ul>
        <li>Print them or save them in a password manager</li>
        <li>Store them somewhere physically separate from your devices</li>
        <li>Never store them in the same place as your passwords</li>
        <li>Generate new ones if you use any</li>
      </ul>

      <h2>Implementing TOTP in Your Application</h2>
      <pre><code>{`// Node.js with otplib
import { authenticator } from 'otplib'

// When user enables 2FA: generate and store secret
const secret = authenticator.generateSecret()
await db.user.update({ where: { id }, data: { totpSecret: encrypt(secret) } })

// Generate QR code URL for authenticator app setup
const otpauth = authenticator.keyuri(user.email, 'YourApp', secret)
// → otpauth://totp/YourApp:user@example.com?secret=BASE32SECRET&issuer=YourApp

// When user logs in: verify the code they entered
const secret = decrypt(user.totpSecret)
const isValid = authenticator.verify({ token: userEnteredCode, secret })
if (!isValid) return res.status(401).json({ error: 'Invalid 2FA code' })`}</code></pre>

      <h3>Important implementation details</h3>
      <ul>
        <li><strong>Allow 1 window drift</strong> — accept codes from ±30 seconds to handle clock skew</li>
        <li><strong>Rate limit verification attempts</strong> — prevent brute-forcing the 6-digit code (1M possibilities)</li>
        <li><strong>Store backup codes</strong> — hash them like passwords (bcrypt), allow each only once</li>
        <li><strong>Encrypt the TOTP secret</strong> — don't store it in plaintext in the database</li>
        <li><strong>Don't cache the current code</strong> — verify against the current time window</li>
      </ul>

      <h2>WebAuthn (Passkeys) Implementation</h2>
      <pre><code>{`// Server-side with @simplewebauthn/server
import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server'

// Registration: generate challenge
const options = await generateRegistrationOptions({
  rpName: 'Your App',
  rpID: 'yourapp.com',
  userID: user.id,
  userName: user.email,
})

// Verification: verify credential
const verification = await verifyRegistrationResponse({
  response: body,
  expectedChallenge: session.challenge,
  expectedOrigin: 'https://yourapp.com',
  expectedRPID: 'yourapp.com',
})`}</code></pre>

      <h2>2FA Recommendations by Account Type</h2>
      <table>
        <thead><tr><th>Account Type</th><th>Recommended 2FA</th></tr></thead>
        <tbody>
          <tr><td>Google / Microsoft account</td><td>Passkey or Hardware Key</td></tr>
          <tr><td>GitHub / GitLab</td><td>Hardware Key or TOTP</td></tr>
          <tr><td>AWS root account</td><td>Hardware Key (mandatory)</td></tr>
          <tr><td>Password manager</td><td>Hardware Key or TOTP</td></tr>
          <tr><td>Banking / Financial</td><td>Whatever the bank offers — push or TOTP if available</td></tr>
          <tr><td>Social media</td><td>TOTP over SMS</td></tr>
          <tr><td>Your app's users</td><td>TOTP + backup codes as minimum</td></tr>
        </tbody>
      </table>

      <h2>Summary</h2>
      <p>
        TOTP authenticator apps (like Authy or 1Password) are the practical sweet spot — phishing-resistant for SIM swapping, work offline, and widely supported. Hardware security keys and passkeys offer the strongest protection but require more setup. SMS 2FA is the weakest but still better than nothing. Always generate and safely store backup codes. For applications you build, implement TOTP + backup codes as a minimum, and add WebAuthn (passkeys) support as the industry moves in that direction.
      </p>
    </>
  )
}
