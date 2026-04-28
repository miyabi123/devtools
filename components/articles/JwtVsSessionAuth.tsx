'use client'

export default function JwtVsSessionAuth() {
  return (
    <article className="prose-freeutil">
      <p>
        Authentication is one of the most consequential architectural decisions in a web application. The choice between JWT and session-based authentication affects your scalability, security model, logout behavior, and operational complexity. Here's a practical breakdown to help you choose.
      </p>

      <h2>How Session-based Authentication Works</h2>
      <p>
        In session-based auth, the server is stateful. When a user logs in, the server creates a session record in storage (memory, Redis, or a database) and returns a session ID in a cookie. On every subsequent request, the browser sends the cookie, the server looks up the session ID, and retrieves the user's state.
      </p>
      <pre><code>{`// Session-based flow
1. POST /login → server creates session in Redis → returns Set-Cookie: sessionId=abc123
2. GET /profile → browser sends Cookie: sessionId=abc123 → server looks up abc123 in Redis → returns user data
3. POST /logout → server deletes session from Redis → cookie cleared`}</code></pre>

      <h2>How JWT Authentication Works</h2>
      <p>
        JWT (JSON Web Token) auth is stateless. When a user logs in, the server creates a signed token containing user claims and returns it. On subsequent requests, the client sends the token (usually in an Authorization header), and the server verifies the signature — no database lookup required.
      </p>
      <pre><code>{`// JWT flow
1. POST /login → server creates signed JWT → returns { token: "eyJhb..." }
2. GET /profile → client sends Authorization: Bearer eyJhb... → server verifies signature → returns user data
3. POST /logout → client deletes token locally (server can't invalidate it)`}</code></pre>

      <h2>Side-by-Side Comparison</h2>
      <table>
        <thead>
          <tr><th>Factor</th><th>Session-based</th><th>JWT</th></tr>
        </thead>
        <tbody>
          <tr><td>Server state</td><td>Stateful (requires storage)</td><td>Stateless</td></tr>
          <tr><td>Scalability</td><td>Needs shared session store (Redis)</td><td>Scales horizontally easily</td></tr>
          <tr><td>Logout</td><td>Immediate — delete server session</td><td>Difficult — token valid until expiry</td></tr>
          <tr><td>Token revocation</td><td>Instant</td><td>Requires blocklist (adds state)</td></tr>
          <tr><td>Storage (client)</td><td>Cookie (httpOnly)</td><td>localStorage or cookie</td></tr>
          <tr><td>CSRF risk</td><td>Yes (cookie-based)</td><td>Lower (if stored in memory/header)</td></tr>
          <tr><td>XSS risk</td><td>Lower (httpOnly cookie)</td><td>Higher (if in localStorage)</td></tr>
          <tr><td>Cross-domain / API</td><td>Complex (CORS, cookies)</td><td>Simple (Authorization header)</td></tr>
          <tr><td>Microservices</td><td>Each service needs session store access</td><td>Each service verifies independently</td></tr>
        </tbody>
      </table>

      <h2>The Logout Problem with JWT</h2>
      <p>
        This is the most significant practical downside of JWT. Because the server has no state, it cannot invalidate a token before it expires. If a user logs out, changes their password, or gets their account suspended, their JWT remains valid until expiry.
      </p>
      <p>
        Solutions exist but all add complexity: a token blocklist (stored in Redis — now you're stateful again), short expiry times combined with refresh tokens, or rotating refresh tokens with single-use enforcement.
      </p>

      <h2>Refresh Token Pattern</h2>
      <p>
        The most common JWT production pattern uses two tokens: a short-lived access token (15 minutes) and a long-lived refresh token (7–30 days). The refresh token is stored as an httpOnly cookie and used only to obtain new access tokens.
      </p>
      <pre><code>{`Access token:  expires in 15 min, stored in memory
Refresh token: expires in 7 days, stored in httpOnly cookie

When access token expires:
→ POST /auth/refresh with refresh token cookie
→ Server validates refresh token, issues new access token
→ If refresh token is invalid/revoked → force re-login`}</code></pre>
      <p>
        This pattern gives you most of the statelessness benefits of JWT while keeping token revocation manageable — you only store refresh tokens, not every access token.
      </p>

      <h2>Security: Where to Store Tokens</h2>
      <p>
        Never store JWTs in <code>localStorage</code> if security matters. localStorage is accessible to any JavaScript on the page — an XSS vulnerability exposes all stored tokens.
      </p>
      <ul>
        <li><strong>httpOnly cookie</strong> — not accessible to JavaScript, protected against XSS. Add <code>SameSite=Strict</code> or <code>SameSite=Lax</code> to mitigate CSRF.</li>
        <li><strong>Memory (JS variable)</strong> — lost on page refresh, requires silent refresh, but completely immune to XSS and CSRF.</li>
        <li><strong>localStorage</strong> — easy to implement, but vulnerable to XSS. Acceptable only for low-sensitivity apps.</li>
      </ul>

      <h2>When to Use Each</h2>
      <p>Use <strong>session-based auth</strong> when:</p>
      <ul>
        <li>You need instant logout and token revocation</li>
        <li>You're building a traditional server-rendered web app</li>
        <li>You already have Redis or a session store</li>
        <li>Your users are high-value and security is paramount</li>
      </ul>
      <p>Use <strong>JWT</strong> when:</p>
      <ul>
        <li>You're building a stateless API consumed by mobile apps or SPAs</li>
        <li>You need to scale horizontally across many servers without a shared session store</li>
        <li>You're working with microservices where each service needs to verify auth independently</li>
        <li>You need cross-domain authentication</li>
      </ul>
    </article>
  )
}
