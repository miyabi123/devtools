'use client'

export default function JwtExpiredError() {
  return (
    <article className="prose-freeutil">
      <p>JWT tokens expire by design — it's a security feature, not a bug. Understanding how expiry works and how to handle it properly prevents both security issues and frustrated users.</p>

      <h2>The exp Claim</h2>
      <p>Every JWT with an expiry contains an <code>exp</code> claim in its payload — a Unix timestamp indicating when the token becomes invalid:</p>
      <pre><code>{`// JWT payload (decoded)
{
  "sub": "user_42",
  "name": "Alice",
  "iat": 1714000000,   // issued at
  "exp": 1714003600    // expires at (1 hour later)
}`}</code></pre>
      <p>When a server receives a JWT, it checks: <code>current_time &gt; exp</code>. If true, the token is rejected regardless of the signature being valid.</p>

      <h2>TokenExpiredError in Node.js</h2>
      <pre><code>{`const jwt = require('jsonwebtoken')

try {
  const decoded = jwt.verify(token, SECRET_KEY)
  // Token is valid — use decoded data
} catch (err) {
  if (err.name === 'TokenExpiredError') {
    // Token has expired — redirect to login or refresh
    return res.status(401).json({ error: 'token_expired' })
  }
  if (err.name === 'JsonWebTokenError') {
    // Token is malformed or signature is invalid
    return res.status(401).json({ error: 'invalid_token' })
  }
  throw err
}`}</code></pre>

      <h2>Handling Expiry in Python</h2>
      <pre><code>{`import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError

try:
    payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
except ExpiredSignatureError:
    # Token has expired
    return {"error": "token_expired"}, 401
except InvalidTokenError:
    return {"error": "invalid_token"}, 401`}</code></pre>

      <h2>The Refresh Token Pattern</h2>
      <p>The standard solution to token expiry is a two-token system: a short-lived access token and a long-lived refresh token.</p>
      <pre><code>{`Access token:  15 minutes — sent with every API request
Refresh token: 7–30 days — stored in httpOnly cookie, used only to get new access tokens

When access token expires:
1. Client gets 401 response
2. Client sends refresh token to POST /auth/refresh
3. Server validates refresh token, issues new access token
4. Client retries original request with new token
5. If refresh token is invalid/expired → force re-login`}</code></pre>

      <h2>Recommended Token Lifetimes</h2>
      <table>
        <thead>
          <tr><th>Use case</th><th>Access token</th><th>Refresh token</th></tr>
        </thead>
        <tbody>
          <tr><td>Standard web app</td><td>15–60 min</td><td>7–30 days</td></tr>
          <tr><td>High-security (banking)</td><td>5–15 min</td><td>1–7 days</td></tr>
          <tr><td>Mobile app</td><td>1 hour</td><td>30–90 days</td></tr>
          <tr><td>Machine-to-machine</td><td>1–24 hours</td><td>N/A (re-authenticate)</td></tr>
        </tbody>
      </table>

      <h2>Silent Refresh (Frontend Pattern)</h2>
      <p>For SPAs, implement silent refresh — automatically renew the access token before it expires, so users never see an error:</p>
      <pre><code>{`// Refresh access token 1 minute before expiry
function scheduleTokenRefresh(expiresAt) {
  const msUntilExpiry = (expiresAt * 1000) - Date.now()
  const refreshAt = msUntilExpiry - 60_000 // 1 minute before
  setTimeout(async () => {
    const newToken = await fetch('/auth/refresh', { method: 'POST' })
    // Store new token and reschedule
  }, refreshAt)
}`}</code></pre>
    </article>
  )
}
