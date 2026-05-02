'use client'

export default function ApiAuthenticationMethods() {
  return (
    <>
      <h2>Why API Authentication Matters</h2>
      <p>
        When you expose an API, you need to answer two questions: <em>Who is making this request?</em> (authentication) and <em>Are they allowed to do this?</em> (authorization). Authentication is the foundation — get it wrong and your data is exposed to anyone.
      </p>
      <p>
        There are three dominant approaches: <strong>API Keys</strong>, <strong>OAuth 2.0</strong>, and <strong>JWT (JSON Web Tokens)</strong>. Each solves a different problem and has distinct tradeoffs.
      </p>

      <h2>API Keys</h2>
      <h3>How they work</h3>
      <p>
        An API key is a long random string your server generates and shares with a client. The client sends it with every request — typically in a header or query parameter.
      </p>
      <pre><code>{`# Common placements
Authorization: Bearer sk-abc123xyz789...
X-API-Key: sk-abc123xyz789...
GET /v1/data?api_key=sk-abc123xyz789...   # Less secure`}</code></pre>

      <h3>Strengths</h3>
      <ul>
        <li>Simple to implement and use — one string, include it in requests</li>
        <li>Easy to revoke — delete the key from the database</li>
        <li>Good for server-to-server communication where the key can be kept secret</li>
        <li>Easy to scope (read-only key, write key, admin key)</li>
      </ul>

      <h3>Weaknesses</h3>
      <ul>
        <li>Static — if leaked, it stays valid until manually revoked</li>
        <li>No expiry by default — can be valid indefinitely</li>
        <li>No standard format — every API does it differently</li>
        <li>Unsuitable for client-side use (browsers, mobile) — easily extracted</li>
        <li>No user identity built in — just "this client is authorized"</li>
      </ul>

      <div className="callout">
        <p><strong>Best for:</strong> Server-to-server integrations, internal microservices, developer APIs (Stripe, OpenAI, Anthropic). Never embed API keys in client-side JavaScript or mobile apps.</p>
      </div>

      <h2>OAuth 2.0</h2>
      <h3>How it works</h3>
      <p>
        OAuth 2.0 is an authorization framework — not just authentication — that lets users grant third-party apps limited access to their accounts without sharing passwords. You've seen it as "Login with Google" or "Connect with GitHub."
      </p>
      <p>
        OAuth 2.0 defines four flows (grant types). The most important for web apps is the <strong>Authorization Code flow</strong>:
      </p>
      <ol>
        <li>Your app redirects the user to the authorization server (e.g., Google)</li>
        <li>User logs in and grants permissions to your app</li>
        <li>Authorization server redirects back to your app with a short-lived <strong>authorization code</strong></li>
        <li>Your server exchanges the code for an <strong>access token</strong> (and optionally a refresh token) — server-to-server, keeping the client secret safe</li>
        <li>Your server uses the access token to call the resource server (e.g., Google APIs) on behalf of the user</li>
      </ol>

      <h3>OAuth 2.0 Grant Types</h3>
      <table>
        <thead><tr><th>Grant Type</th><th>Use Case</th><th>Security</th></tr></thead>
        <tbody>
          <tr><td>Authorization Code</td><td>Web apps with server side</td><td>✅ Best</td></tr>
          <tr><td>Authorization Code + PKCE</td><td>SPAs, mobile apps</td><td>✅ Best for public clients</td></tr>
          <tr><td>Client Credentials</td><td>Machine-to-machine</td><td>✅ Good</td></tr>
          <tr><td>Device Code</td><td>Smart TVs, CLI tools</td><td>✅ Good</td></tr>
          <tr><td>Implicit</td><td>Deprecated</td><td>❌ Don't use</td></tr>
          <tr><td>Resource Owner Password</td><td>Deprecated</td><td>❌ Avoid</td></tr>
        </tbody>
      </table>

      <h3>Strengths</h3>
      <ul>
        <li>Delegated authorization — users grant scoped access without sharing passwords</li>
        <li>Access tokens are short-lived; refresh tokens enable long sessions without re-auth</li>
        <li>Industry standard — works with any identity provider</li>
        <li>Supports fine-grained scopes (read:email, write:calendar)</li>
      </ul>

      <h3>Weaknesses</h3>
      <ul>
        <li>Complex to implement correctly — many ways to get it wrong</li>
        <li>Multiple round-trips and redirects</li>
        <li>OAuth 2.0 is authorization, not authentication — use OpenID Connect (OIDC) on top for identity</li>
        <li>Token storage on clients is a security concern</li>
      </ul>

      <div className="callout callout-blue">
        <p><strong>Best for:</strong> Any flow involving user consent and third-party access. "Login with Google/GitHub/Apple." Accessing user data on their behalf. B2C applications.</p>
      </div>

      <h2>JWT (JSON Web Tokens)</h2>
      <h3>How they work</h3>
      <p>
        A JWT is a self-contained token that carries claims (data) and a cryptographic signature. The server signs the token when issuing it; any server that knows the secret (or public key) can verify it without a database lookup.
      </p>
      <pre><code>{`// JWT structure: header.payload.signature
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9  // header (base64)
.eyJzdWIiOiJ1c2VyXzEyMyIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTc0ODAwMDAwMH0  // payload
.HMAC_SHA256_signature  // signature`}</code></pre>
      <p>
        The payload typically contains: user ID (<code>sub</code>), expiry (<code>exp</code>), issued-at (<code>iat</code>), and custom claims like roles or permissions.
      </p>

      <h3>Stateless vs Stateful</h3>
      <p>
        This is the core difference between JWTs and traditional sessions:
      </p>
      <table>
        <thead><tr><th>Property</th><th>JWT (Stateless)</th><th>Session (Stateful)</th></tr></thead>
        <tbody>
          <tr><td>Server storage</td><td>None — token is self-contained</td><td>Session data in Redis/DB</td></tr>
          <tr><td>Revocation</td><td>Hard — must blacklist or wait for expiry</td><td>Easy — delete session</td></tr>
          <tr><td>Horizontal scaling</td><td>Any server verifies token</td><td>Requires shared session store</td></tr>
          <tr><td>Token size</td><td>Larger (payload is in token)</td><td>Small (just a session ID)</td></tr>
          <tr><td>Database lookup per request</td><td>No</td><td>Yes</td></tr>
        </tbody>
      </table>

      <h3>JWT Signing Algorithms</h3>
      <ul>
        <li><strong>HS256</strong> — HMAC with SHA-256. Symmetric — same secret signs and verifies. Simple but all services must share the secret.</li>
        <li><strong>RS256</strong> — RSA with SHA-256. Asymmetric — private key signs, public key verifies. Auth server can sign; API servers only need the public key.</li>
        <li><strong>ES256</strong> — ECDSA with P-256. Asymmetric like RS256 but smaller, faster. Modern choice.</li>
      </ul>

      <h3>Strengths</h3>
      <ul>
        <li>Stateless — no database lookup per request</li>
        <li>Self-contained — payload carries user info and permissions</li>
        <li>Cross-domain/cross-service — works across microservices with RS256/ES256</li>
        <li>Standard format with rich ecosystem (libraries for every language)</li>
      </ul>

      <h3>Weaknesses</h3>
      <ul>
        <li>Revocation is hard — once issued, a JWT is valid until expiry</li>
        <li>Sensitive data in payload is visible (just base64-encoded, not encrypted)</li>
        <li>Tokens grow large with many claims</li>
        <li>Client storage is a security concern (localStorage is vulnerable to XSS)</li>
      </ul>

      <div className="callout">
        <p><strong>Best for:</strong> Stateless API authentication, microservices, mobile app backends. Short expiry (15–60 min) + refresh tokens is the standard pattern.</p>
      </div>

      <h2>Comparison Summary</h2>
      <table>
        <thead><tr><th>Factor</th><th>API Key</th><th>OAuth 2.0</th><th>JWT</th></tr></thead>
        <tbody>
          <tr><td>Complexity</td><td>Low</td><td>High</td><td>Medium</td></tr>
          <tr><td>User identity</td><td>No</td><td>Yes (with OIDC)</td><td>Yes (in payload)</td></tr>
          <tr><td>Revocation</td><td>Easy</td><td>Easy</td><td>Hard</td></tr>
          <tr><td>Expiry</td><td>Manual</td><td>Built-in</td><td>Built-in</td></tr>
          <tr><td>Scales horizontally</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
          <tr><td>Client-side safe</td><td>No</td><td>Yes (PKCE)</td><td>Partial</td></tr>
          <tr><td>Best for</td><td>Server-to-server</td><td>User delegation</td><td>Stateless sessions</td></tr>
        </tbody>
      </table>

      <h2>Which Should You Choose?</h2>
      <ul>
        <li><strong>Building an internal API or developer tool?</strong> — API Keys. Simple, auditable, revocable.</li>
        <li><strong>Need "Login with Google/GitHub"?</strong> — OAuth 2.0 + OpenID Connect.</li>
        <li><strong>Building a REST API with your own user accounts?</strong> — JWT for access tokens, refresh tokens for longevity.</li>
        <li><strong>Microservices communicating with each other?</strong> — JWT (RS256/ES256) or OAuth 2.0 Client Credentials.</li>
        <li><strong>SPA or mobile app authenticating users?</strong> — OAuth 2.0 with PKCE + JWT access tokens.</li>
      </ul>

      <h2>Summary</h2>
      <p>
        API Keys are simple and great for server-to-server integrations. OAuth 2.0 handles delegated user authorization and is the standard for "Login with X" flows. JWT provides self-contained, stateless tokens ideal for microservices and REST APIs. In practice, most modern applications combine all three: OAuth 2.0 to authenticate users, JWTs as the issued access tokens, and API keys for server integrations.
      </p>
    </>
  )
}
