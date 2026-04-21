export default function WhatIsJWT() {
  return (
    <>
      <h2>What is a JSON Web Token?</h2>
      <p>A <strong>JSON Web Token (JWT)</strong> is a compact, URL-safe way to represent claims between two parties. It is widely used for authentication and authorization in web applications and APIs. When a user logs in, the server creates a JWT and sends it to the client. The client then includes this token in subsequent requests to prove its identity.</p>
      <p>JWT is defined in <a href="https://datatracker.ietf.org/doc/html/rfc7519" target="_blank" rel="noopener">RFC 7519</a> and has become the de facto standard for stateless authentication in REST APIs, microservices, and single-page applications.</p>

      <h2>The Structure of a JWT</h2>
      <p>A JWT consists of three parts separated by dots (<code>.</code>):</p>
      <pre><code>xxxxx.yyyyy.zzzzz
Header.Payload.Signature</code></pre>

      <h3>1. Header</h3>
      <p>The header typically contains two fields: the token type (<code>typ</code>) and the signing algorithm (<code>alg</code>). It is Base64URL encoded.</p>
      <pre><code>{`{
  "alg": "HS256",
  "typ": "JWT"
}`}</code></pre>

      <h3>2. Payload</h3>
      <p>The payload contains <strong>claims</strong> — statements about the user and additional metadata. There are three types of claims:</p>
      <ul>
        <li><strong>Registered claims</strong>: Predefined fields like <code>iss</code> (issuer), <code>exp</code> (expiration), <code>sub</code> (subject), <code>aud</code> (audience)</li>
        <li><strong>Public claims</strong>: Custom fields you define, like <code>name</code>, <code>email</code>, <code>role</code></li>
        <li><strong>Private claims</strong>: Custom claims agreed upon between parties</li>
      </ul>
      <pre><code>{`{
  "sub": "1234567890",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin",
  "iat": 1516239022,
  "exp": 1516325422
}`}</code></pre>

      <h3>3. Signature</h3>
      <p>The signature verifies that the token has not been tampered with. It is created by combining the encoded header, encoded payload, and a secret key:</p>
      <pre><code>HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)</code></pre>

      <div className="callout callout-blue">
        <p>💡 Important: The payload is only Base64URL <em>encoded</em>, not encrypted. Anyone can decode and read the payload. Never store sensitive data like passwords in a JWT unless you use JWE (JSON Web Encryption).</p>
      </div>

      <h2>Common JWT Claims Explained</h2>
      <table>
        <thead><tr><th>Claim</th><th>Name</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><code>iss</code></td><td>Issuer</td><td>Who issued the token (e.g. your auth server)</td></tr>
          <tr><td><code>sub</code></td><td>Subject</td><td>Who the token is about (usually user ID)</td></tr>
          <tr><td><code>aud</code></td><td>Audience</td><td>Who the token is intended for</td></tr>
          <tr><td><code>exp</code></td><td>Expiration</td><td>Unix timestamp when token expires</td></tr>
          <tr><td><code>iat</code></td><td>Issued At</td><td>Unix timestamp when token was issued</td></tr>
          <tr><td><code>nbf</code></td><td>Not Before</td><td>Token is invalid before this timestamp</td></tr>
          <tr><td><code>jti</code></td><td>JWT ID</td><td>Unique identifier to prevent replay attacks</td></tr>
        </tbody>
      </table>

      <h2>JWT Signing Algorithms</h2>
      <p>JWTs can be signed using symmetric or asymmetric algorithms:</p>
      <table>
        <thead><tr><th>Algorithm</th><th>Type</th><th>Use Case</th></tr></thead>
        <tbody>
          <tr><td>HS256, HS384, HS512</td><td>Symmetric (HMAC)</td><td>Single server, shared secret</td></tr>
          <tr><td>RS256, RS384, RS512</td><td>Asymmetric (RSA)</td><td>Multiple services, public key verification</td></tr>
          <tr><td>ES256, ES384, ES512</td><td>Asymmetric (ECDSA)</td><td>High performance, smaller keys</td></tr>
        </tbody>
      </table>

      <h2>How JWT Authentication Works</h2>
      <p>The typical JWT authentication flow looks like this:</p>
      <ol>
        <li>User submits username and password to the login endpoint</li>
        <li>Server validates credentials, creates a JWT signed with a secret key</li>
        <li>Server returns the JWT to the client</li>
        <li>Client stores the JWT (typically in memory or localStorage)</li>
        <li>Client includes the JWT in the <code>Authorization</code> header for protected requests: <code>Authorization: Bearer &lt;token&gt;</code></li>
        <li>Server validates the JWT signature and checks expiration before processing the request</li>
      </ol>

      <h2>JWT Security Best Practices</h2>
      <ul>
        <li>Always set an expiration (<code>exp</code>) — short-lived tokens (15 minutes to 1 hour) reduce risk</li>
        <li>Use HTTPS — never transmit JWTs over unencrypted connections</li>
        <li>Store tokens securely — prefer memory storage over localStorage to prevent XSS attacks</li>
        <li>Use RS256 over HS256 for multi-service architectures — no need to share secret keys</li>
        <li>Validate all claims — check <code>iss</code>, <code>aud</code>, and <code>exp</code> on every request</li>
        <li>Implement token revocation with a refresh token pattern for sensitive applications</li>
      </ul>

      <div className="callout">
        <p>⚠️ The "alg: none" attack: Always explicitly specify which algorithms are valid on your server. Never accept tokens with <code>alg: none</code> as this bypasses signature verification entirely.</p>
      </div>

      <h2>JWT vs Session Tokens</h2>
      <table>
        <thead><tr><th></th><th>JWT</th><th>Session Token</th></tr></thead>
        <tbody>
          <tr><td>Storage</td><td>Client-side</td><td>Server-side</td></tr>
          <tr><td>Scalability</td><td>Excellent (stateless)</td><td>Requires session store</td></tr>
          <tr><td>Revocation</td><td>Difficult (until expiry)</td><td>Instant</td></tr>
          <tr><td>Size</td><td>Larger (100-500 bytes)</td><td>Tiny (32-128 bytes)</td></tr>
          <tr><td>Best for</td><td>APIs, microservices</td><td>Traditional web apps</td></tr>
        </tbody>
      </table>
    </>
  )
}
