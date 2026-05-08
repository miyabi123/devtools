'use client'

export default function ApiAuthenticationMethods() {
  return (
    <article className="prose-freeutil">
      <p>API authentication proves who is making a request. The three most common mechanisms — API keys, OAuth 2.0, and JWT — have different security models and use cases. Choosing the wrong one creates either unnecessary complexity or security gaps.</p>

      <h2>API Keys</h2>
      <p>A static secret string sent with every request. The simplest form of API authentication.</p>
      <pre><code>{`# Common ways to send API keys:
GET /api/data
Authorization: Bearer sk_live_abc123def456

GET /api/data?api_key=sk_live_abc123def456

GET /api/data
X-API-Key: sk_live_abc123def456`}</code></pre>
      <p><strong>Pros:</strong> Simple to implement and use, easy to generate and revoke, stateless.</p>
      <p><strong>Cons:</strong> Static — if leaked, attacker has full access until revoked. No built-in expiry or user identity. Difficult to scope to specific permissions without complexity.</p>
      <p><strong>Best for:</strong> Server-to-server communication, developer tools, internal APIs, scenarios where the client is a trusted server (not a browser or mobile app).</p>

      <h2>OAuth 2.0</h2>
      <p>A delegated authorization framework — allows users to grant your app access to their data in another service without sharing their password. "Login with Google" is OAuth 2.0.</p>
      <pre><code>{`// Authorization Code Flow (for web apps)
1. Redirect user to: https://accounts.google.com/o/oauth2/auth
   ?client_id=YOUR_CLIENT_ID
   &redirect_uri=https://yourapp.com/callback
   &scope=email profile
   &response_type=code

2. User logs in and approves → Google redirects to:
   https://yourapp.com/callback?code=AUTH_CODE

3. Your server exchanges code for tokens:
   POST https://oauth2.googleapis.com/token
   { code, client_id, client_secret, grant_type: "authorization_code" }
   → { access_token, refresh_token, expires_in }

4. Use access_token to call Google APIs on user's behalf`}</code></pre>
      <p><strong>Best for:</strong> Third-party access (let users connect their Spotify, Google, GitHub accounts), delegating specific scoped permissions, apps that need refresh token lifecycle management.</p>

      <h2>JWT (JSON Web Token)</h2>
      <p>A signed token containing claims about a user. Stateless — the server verifies the signature without a database lookup.</p>
      <pre><code>{`// After login, server issues a JWT:
{
  "header": { "alg": "HS256", "typ": "JWT" },
  "payload": { "sub": "user_42", "role": "admin", "exp": 1714003600 },
  "signature": "HMAC-SHA256(header + payload + secret)"
}
// Encoded: eyJhbGc...eyJzdWI...signature

// Client sends with every request:
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...

// Server verifies signature — no DB lookup needed`}</code></pre>
      <p><strong>Best for:</strong> Authentication in your own apps, stateless microservices, mobile APIs, anywhere you want to avoid session storage.</p>

      <h2>Comparison</h2>
      <table>
        <thead><tr><th>Factor</th><th>API Key</th><th>OAuth 2.0</th><th>JWT</th></tr></thead>
        <tbody>
          <tr><td>Complexity</td><td>Low</td><td>High</td><td>Medium</td></tr>
          <tr><td>Expiry</td><td>Never (until revoked)</td><td>Short-lived + refresh</td><td>Configurable (exp claim)</td></tr>
          <tr><td>Revocation</td><td>Immediate</td><td>Immediate</td><td>Difficult (until expiry)</td></tr>
          <tr><td>User identity</td><td>No</td><td>Yes</td><td>Yes (in payload)</td></tr>
          <tr><td>Third-party access</td><td>No</td><td>Yes ✅</td><td>No</td></tr>
          <tr><td>Stateless</td><td>Yes</td><td>No (auth server needed)</td><td>Yes</td></tr>
          <tr><td>Best for</td><td>Server-to-server</td><td>Delegated access</td><td>Your own auth system</td></tr>
        </tbody>
      </table>
    </article>
  )
}
