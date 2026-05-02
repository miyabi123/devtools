'use client'

export default function WhatIsSslTls() {
  return (
    <>
      <h2>SSL, TLS, and HTTPS — What's the Difference?</h2>
      <p>
        You've probably seen the padlock icon in your browser's address bar and heard that a site "has SSL." But what does that actually mean, and how does it protect you? SSL, TLS, and HTTPS are closely related — and often confused — terms that together describe how secure connections work on the internet.
      </p>
      <p>
        Here's the short version: <strong>SSL</strong> (Secure Sockets Layer) is the original protocol, now deprecated. <strong>TLS</strong> (Transport Layer Security) is its modern replacement. <strong>HTTPS</strong> is simply HTTP running over TLS. When people say "SSL certificate," they almost always mean a TLS certificate — the names stuck even as the technology moved on.
      </p>

      <h2>What Problem Does TLS Solve?</h2>
      <p>
        Without TLS, data sent between your browser and a web server travels as plain text. Anyone on the same network — a coffee shop Wi-Fi, an ISP, a router in between — can read it. This includes passwords, credit card numbers, and session cookies.
      </p>
      <p>TLS solves three distinct problems:</p>
      <ul>
        <li><strong>Confidentiality</strong> — encrypts data so only the intended recipient can read it</li>
        <li><strong>Integrity</strong> — detects if data was tampered with in transit</li>
        <li><strong>Authentication</strong> — proves the server is actually who it claims to be (via certificates)</li>
      </ul>

      <h2>How the TLS Handshake Works</h2>
      <p>
        Before any application data is exchanged, the browser and server perform a <strong>TLS handshake</strong> — a negotiation that establishes a secure channel. Here's what happens, simplified:
      </p>

      <h3>Step 1: Client Hello</h3>
      <p>
        Your browser sends a message listing the TLS versions and cipher suites it supports, plus a random number (the "client random").
      </p>

      <h3>Step 2: Server Hello + Certificate</h3>
      <p>
        The server picks a TLS version and cipher suite, sends its own random number, and presents its <strong>SSL/TLS certificate</strong>. The certificate contains the server's public key and is signed by a trusted Certificate Authority (CA) like Let's Encrypt, DigiCert, or Sectigo.
      </p>

      <h3>Step 3: Certificate Verification</h3>
      <p>
        Your browser checks the certificate against its built-in list of trusted CAs. It verifies: (a) the certificate is signed by a trusted CA, (b) it hasn't expired, and (c) the domain name matches. If any check fails, you see a browser security warning.
      </p>

      <h3>Step 4: Key Exchange</h3>
      <p>
        The browser and server exchange enough information to independently compute a shared <strong>session key</strong>. In TLS 1.3, this uses Diffie-Hellman key exchange, meaning the session key is never actually transmitted — both sides derive it mathematically.
      </p>

      <h3>Step 5: Encrypted Communication Begins</h3>
      <p>
        Both sides confirm the handshake succeeded, then switch to symmetric encryption (typically AES) using the shared session key. Symmetric encryption is fast — asymmetric encryption (RSA) is used only during the handshake.
      </p>

      <div className="callout callout-blue">
        <p>
          <strong>Why symmetric after the handshake?</strong> Asymmetric encryption (public/private keys) is mathematically expensive. Symmetric encryption is thousands of times faster. TLS uses the best of both: asymmetric crypto to securely agree on a key, symmetric crypto to do the actual bulk encryption.
        </p>
      </div>

      <h2>What Does a TLS Certificate Actually Contain?</h2>
      <p>A TLS certificate (X.509 format) includes:</p>
      <ul>
        <li><strong>Subject</strong> — the domain name(s) the certificate covers (CN and SANs)</li>
        <li><strong>Issuer</strong> — the Certificate Authority that signed it</li>
        <li><strong>Validity period</strong> — Not Before and Not After dates</li>
        <li><strong>Public key</strong> — used during the handshake key exchange</li>
        <li><strong>Signature</strong> — the CA's digital signature proving the certificate is genuine</li>
        <li><strong>Serial number and fingerprint</strong> — for identification and revocation</li>
      </ul>

      <h2>TLS Versions: Which Should You Use?</h2>
      <table>
        <thead>
          <tr>
            <th>Version</th>
            <th>Status</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>SSL 2.0</td><td>Broken ❌</td><td>Deprecated 1996, multiple critical vulnerabilities</td></tr>
          <tr><td>SSL 3.0</td><td>Broken ❌</td><td>POODLE attack (2014), deprecated 2015</td></tr>
          <tr><td>TLS 1.0</td><td>Deprecated ⚠️</td><td>PCI DSS banned since 2018</td></tr>
          <tr><td>TLS 1.1</td><td>Deprecated ⚠️</td><td>Removed from major browsers in 2020</td></tr>
          <tr><td>TLS 1.2</td><td>Acceptable ✓</td><td>Widely supported, still considered secure with proper configuration</td></tr>
          <tr><td>TLS 1.3</td><td>Recommended ✅</td><td>Faster handshake, stronger security, forward secrecy by default</td></tr>
        </tbody>
      </table>

      <h2>What is Forward Secrecy?</h2>
      <p>
        Forward secrecy (also called Perfect Forward Secrecy, PFS) means that if an attacker records your encrypted traffic today and later obtains the server's private key, they <em>still cannot decrypt</em> the old traffic. Each session uses a unique ephemeral key that is discarded after use.
      </p>
      <p>
        TLS 1.3 requires forward secrecy. TLS 1.2 supports it optionally via ECDHE cipher suites. This is one reason TLS 1.3 is strongly preferred.
      </p>

      <h2>How Certificates Are Validated</h2>
      <p>Certificate Authorities issue three types of certificates with different validation levels:</p>
      <ul>
        <li><strong>DV (Domain Validated)</strong> — CA verifies you control the domain. Fast and free (Let's Encrypt). Shows the padlock.</li>
        <li><strong>OV (Organization Validated)</strong> — CA verifies your organization exists. Takes days. Shows company name in certificate details.</li>
        <li><strong>EV (Extended Validation)</strong> — Strictest checks. Previously showed a green bar; modern browsers removed the visual distinction but EV info is still in the cert.</li>
      </ul>

      <div className="callout">
        <p>
          <strong>For most sites:</strong> DV certificates from Let's Encrypt are free, auto-renewing, and completely sufficient. The padlock looks identical to OV or EV certificates to end users.
        </p>
      </div>

      <h2>HTTPS vs HTTP: What's Actually Different</h2>
      <p>
        HTTP transfers data as plain text on port 80. HTTPS wraps HTTP inside TLS on port 443. From the application layer's perspective, HTTPS is invisible — your browser and server just send HTTP requests and responses, but the TLS layer underneath handles encryption, integrity checks, and authentication transparently.
      </p>

      <h2>Common SSL/TLS Errors and What They Mean</h2>
      <ul>
        <li><strong>ERR_CERT_AUTHORITY_INVALID</strong> — certificate signed by an untrusted CA (common with self-signed certs in development)</li>
        <li><strong>ERR_CERT_DATE_INVALID</strong> — certificate has expired or isn't valid yet</li>
        <li><strong>ERR_SSL_PROTOCOL_ERROR</strong> — TLS version mismatch or misconfigured server</li>
        <li><strong>NET::ERR_CERT_COMMON_NAME_INVALID</strong> — certificate domain doesn't match the URL</li>
        <li><strong>Mixed Content Warning</strong> — page loaded over HTTPS but contains HTTP resources (images, scripts)</li>
      </ul>

      <h2>Summary</h2>
      <p>
        TLS is the foundation of secure communication on the web. It provides encryption (so data can't be read in transit), integrity (so data can't be tampered with), and authentication (so you know you're talking to the right server). HTTPS is simply HTTP running over TLS. Use TLS 1.2 or 1.3, get a free certificate from Let's Encrypt, and let Cloudflare or your web server handle the rest.
      </p>
    </>
  )
}
