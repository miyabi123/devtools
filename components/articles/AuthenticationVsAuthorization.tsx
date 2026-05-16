'use client'

export default function AuthenticationVsAuthorization() {
  return (
    <article className="prose-freeutil">
      <p>Authentication and authorization are two distinct security concepts that are often confused. Getting them mixed up is a common source of security vulnerabilities.</p>

      <h2>The One-Sentence Definitions</h2>
      <ul>
        <li><strong>Authentication (AuthN)</strong> — "Who are you?" — verifying identity</li>
        <li><strong>Authorization (AuthZ)</strong> — "What can you do?" — verifying permission</li>
      </ul>

      <h2>A Real-World Analogy</h2>
      <p>At an office building:</p>
      <ul>
        <li><strong>Authentication</strong> — showing your ID badge to the security guard. Proves you are who you say you are.</li>
        <li><strong>Authorization</strong> — your badge grants access to floors 1-3, but not the server room on floor 5. You're verified (authenticated), but restricted (authorized for limited access).</li>
      </ul>

      <h2>In Web Applications</h2>
      <pre><code>{`// Authentication: verify the user's identity
POST /auth/login
{ "email": "alice@example.com", "password": "secret" }
→ Validates credentials → Issues a JWT token

// Authorization: check what the authenticated user can do
GET /api/admin/users
Authorization: Bearer eyJhbGc...
→ Token is valid (authenticated ✅)
→ User has role "admin"? No (authorized ❌) → 403 Forbidden`}</code></pre>

      <h2>Common Mistakes</h2>
      <ul>
        <li><strong>Checking authentication but not authorization</strong> — verifying the token is valid, but not checking if the user is allowed to access THAT specific resource. An authenticated user can read other users' data.</li>
        <li><strong>Authorization only in the UI</strong> — hiding an "admin" button from non-admin users but not checking permissions on the API endpoint. The API is accessible directly.</li>
        <li><strong>Trusting the user's claimed role</strong> — if the JWT payload contains <code>"role": "admin"</code>, don't trust it without verifying the signature. Never let users set their own role.</li>
      </ul>

      <h2>The Sequence</h2>
      <p>Authentication always comes before authorization. You can't determine what someone is allowed to do if you don't know who they are. A 401 Unauthorized means "not authenticated." A 403 Forbidden means "authenticated but not authorized."</p>
      <pre><code>{`Request arrives → Authentication (who are you?) → Failed → 401 Unauthorized
                                                 → Passed
                              ↓
                 Authorization (what can you do?) → Denied → 403 Forbidden
                                                 → Granted → Process request → 200 OK`}</code></pre>
    </article>
  )
}
