'use client'

export default function DeveloperSecurityChecklist() {
  return (
    <article className="prose-freeutil">
      <p>Security isn't a feature you add at the end — it's a discipline you build throughout development. This checklist covers every layer of a modern web application, organized so you can work through it systematically before shipping.</p>

      <div className="callout callout-blue">
        <p>How to use this checklist: work through each section during development and before every major release. Items marked ⚠️ are critical — skip them only with documented justification.</p>
      </div>

      <h2>1. Authentication</h2>
      <ul>
        <li>⚠️ Passwords hashed with bcrypt (cost ≥ 12) or Argon2id — never MD5, SHA-1, or plain SHA-256</li>
        <li>⚠️ No plain-text passwords stored anywhere (logs, DB, emails)</li>
        <li>⚠️ Rate limiting on login endpoint (max 5 attempts per 15 min per IP)</li>
        <li>Account lockout after repeated failures with notification to user</li>
        <li>⚠️ Multi-factor authentication available for sensitive accounts</li>
        <li>"Forgot password" tokens are single-use, expire in ≤ 1 hour, hashed in DB</li>
        <li>Username enumeration prevented (same response for invalid user vs wrong password)</li>
        <li>Session invalidated on logout (server-side invalidation, not just deleting cookie)</li>
        <li>Concurrent session limits enforced if required</li>
      </ul>

      <h2>2. Authorization</h2>
      <ul>
        <li>⚠️ Every API endpoint explicitly checks authorization — no implicit trust</li>
        <li>⚠️ Resource-level access control: user can only access their own data</li>
        <li>⚠️ Admin functions require admin role check on the server (not just hidden in UI)</li>
        <li>Principle of least privilege: services and users have minimum required permissions</li>
        <li>JWT tokens validated on every request (signature + expiry + claims)</li>
        <li>Sensitive operations (delete, transfer, admin actions) require re-authentication</li>
      </ul>

      <h2>3. Input Validation & Output Encoding</h2>
      <ul>
        <li>⚠️ All user input validated on the server side (client-side validation is UX only)</li>
        <li>⚠️ Parameterized queries used for all database operations — no string concatenation</li>
        <li>⚠️ HTML output escaped before rendering user-controlled data</li>
        <li>File uploads: validate type (not just extension), size limit, scan for malware</li>
        <li>File uploads stored outside webroot or in cloud storage, not served directly</li>
        <li>Redirects validate the destination URL against an allowlist</li>
        <li>JSON input parsed with a size limit</li>
      </ul>

      <h2>4. Secrets & Configuration</h2>
      <ul>
        <li>⚠️ No secrets in source code or git history</li>
        <li>⚠️ All secrets in environment variables or a secrets manager (Vault, AWS Secrets Manager)</li>
        <li>.env files in .gitignore; .env.example committed instead</li>
        <li>⚠️ Production and development secrets are different values</li>
        <li>API keys have minimal permissions (not root/admin keys)</li>
        <li>Secrets rotated regularly and after team member offboarding</li>
        <li><code>git log</code> checked for accidental secret commits before first push</li>
      </ul>

      <h2>5. HTTPS & Transport Security</h2>
      <ul>
        <li>⚠️ HTTPS enforced everywhere — HTTP redirects to HTTPS (301)</li>
        <li>⚠️ Valid certificate from trusted CA, not self-signed in production</li>
        <li>TLS 1.2 minimum; TLS 1.3 preferred</li>
        <li>HSTS header set with at least 1-year max-age</li>
        <li>Cookies set with Secure, HttpOnly, SameSite attributes</li>
        <li>Mixed content warnings resolved (no HTTP resources on HTTPS page)</li>
      </ul>

      <h2>6. HTTP Security Headers</h2>
      <pre><code>{`# Minimum security headers
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()`}</code></pre>
      <ul>
        <li>CSP defined and tested (no <code>unsafe-inline</code> for scripts without nonce)</li>
        <li>Server version information hidden (<code>server_tokens off</code> in Nginx)</li>
        <li>Error pages don't expose stack traces or framework information</li>
      </ul>

      <h2>7. Dependencies</h2>
      <ul>
        <li>⚠️ <code>npm audit</code> / <code>pip-audit</code> run — no known high/critical vulnerabilities</li>
        <li>Dependencies locked (<code>package-lock.json</code>, <code>requirements.txt</code> with pinned versions)</li>
        <li>Automated dependency scanning in CI (Dependabot, Snyk, or similar)</li>
        <li>Third-party scripts loaded from known CDNs with Subresource Integrity (SRI) hashes</li>
        <li>No abandoned or unmaintained packages for security-critical functions</li>
      </ul>

      <h2>8. Session Management</h2>
      <ul>
        <li>Session tokens are cryptographically random and ≥ 128 bits</li>
        <li>Session ID rotated on privilege escalation (login, role change)</li>
        <li>Session timeout after inactivity (configurable, default ≤ 30 min for sensitive apps)</li>
        <li>"Remember me" uses a separate long-lived token, not extending the session</li>
        <li>CSRF protection on all state-changing requests (SameSite cookie or CSRF token)</li>
      </ul>

      <h2>9. Logging & Monitoring</h2>
      <ul>
        <li>Authentication events logged (success, failure, lockout)</li>
        <li>⚠️ Logs don't contain sensitive data (passwords, tokens, PII)</li>
        <li>Authorization failures logged (403 responses)</li>
        <li>Alerts configured for anomalies (high error rate, unusual traffic)</li>
        <li>Log aggregation and retention policy defined</li>
        <li>Uptime monitoring with alerting</li>
      </ul>

      <h2>10. Infrastructure</h2>
      <ul>
        <li>⚠️ Firewall rules: only required ports open (typically 80, 443, and SSH from specific IPs)</li>
        <li>SSH: key-only authentication, root login disabled</li>
        <li>Automatic security updates enabled for OS</li>
        <li>Database not publicly accessible (VPC/private network only)</li>
        <li>Backups automated, tested, and stored separately</li>
        <li>Principle of least privilege for cloud IAM roles</li>
      </ul>

      <h2>11. Before Each Release</h2>
      <ul>
        <li><code>git log</code> reviewed for any debug code, test credentials, TODO security notes</li>
        <li>New endpoints have authorization checks</li>
        <li>Any new third-party integrations reviewed for data exposure</li>
        <li>Sensitive changes reviewed by a second engineer</li>
      </ul>
    </article>
  )
}
