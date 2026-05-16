'use client'

export default function HowHttpsWorks() {
  return (
    <article className="prose-freeutil">
      <p>Every time your browser connects to an HTTPS site, a complex cryptographic ceremony happens in milliseconds. Here's exactly what occurs, step by step.</p>

      <h2>The TLS Handshake</h2>
      <p>Before any data is exchanged, browser and server negotiate how to communicate securely:</p>

      <h3>Step 1: ClientHello</h3>
      <p>Browser sends to server:</p>
      <ul>
        <li>TLS versions it supports (e.g., TLS 1.2, TLS 1.3)</li>
        <li>Cipher suites it supports (encryption + hash algorithms)</li>
        <li>A random number (client random)</li>
      </ul>

      <h3>Step 2: ServerHello</h3>
      <p>Server responds with:</p>
      <ul>
        <li>Chosen TLS version</li>
        <li>Chosen cipher suite (e.g., TLS_AES_256_GCM_SHA384)</li>
        <li>Its SSL certificate (containing public key + domain info)</li>
        <li>A random number (server random)</li>
      </ul>

      <h3>Step 3: Certificate Verification</h3>
      <p>Browser checks the server's certificate:</p>
      <ul>
        <li>Is it signed by a trusted CA? (CA's signature verified with CA's public key)</li>
        <li>Does the domain match? (CN or SANs include the current domain)</li>
        <li>Is it still valid? (current date within notBefore and notAfter)</li>
        <li>Has it been revoked? (OCSP check)</li>
      </ul>

      <h3>Step 4: Key Exchange</h3>
      <p>In TLS 1.3, browser and server use ECDH (Elliptic-curve Diffie-Hellman) to agree on a shared secret without ever transmitting it. The shared secret + client random + server random are combined to derive session keys.</p>

      <h3>Step 5: Session Keys and Encrypted Communication</h3>
      <p>Both sides derive identical AES session keys from the shared secret. All subsequent communication is encrypted with AES-256-GCM. The handshake is complete — the browser shows the padlock.</p>

      <h2>TLS 1.3: Faster Handshake</h2>
      <pre><code>{`TLS 1.2 handshake: 2 round trips before data
Client → ClientHello → Server
Client ← ServerHello, Certificate, ServerHelloDone ←
Client → ClientKeyExchange, ChangeCipherSpec, Finished →
Client ← ChangeCipherSpec, Finished ←
→ Connection established (2 round trips = ~200ms added)

TLS 1.3 handshake: 1 round trip
Client → ClientHello + key_share →
Client ← ServerHello + key_share, Certificate, Finished ←
→ Connection established (1 round trip = ~100ms added)

TLS 1.3 resumption: 0 round trips (0-RTT)
Client → ClientHello + early data → Server processes immediately`}</code></pre>

      <h2>Why HTTPS Isn't Slower</h2>
      <p>Modern hardware has dedicated AES-NI instructions that make AES encryption essentially free in terms of CPU time. The overhead of TLS 1.3 is about one additional round trip on first connection — negligible compared to the time spent loading page content. HTTP/2 (which requires HTTPS) often makes HTTPS pages faster than their HTTP equivalents.</p>
    </article>
  )
}
