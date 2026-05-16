'use client'

export default function GitCommitMessageGuide() {
  return (
    <article className="prose-freeutil">
      <p>A git history is a log of your project's reasoning. Good commit messages let you understand why code changed, not just what changed — and <code>git blame</code> becomes a useful tool instead of a source of frustration.</p>

      <h2>The Golden Rule</h2>
      <p>The commit message should complete this sentence: <em>"If applied, this commit will ___________"</em></p>
      <pre><code>{`✅ "If applied, this commit will: fix the login redirect for OAuth users"
✅ "If applied, this commit will: add rate limiting to the auth endpoints"
❌ "If applied, this commit will: fix stuff"
❌ "If applied, this commit will: wip"
❌ "If applied, this commit will: asdfgh"`}</code></pre>

      <h2>The 50/72 Rule</h2>
      <ul>
        <li><strong>Subject line: ≤ 50 characters</strong> — fits in GitHub's commit list, git log --oneline</li>
        <li><strong>Body lines: ≤ 72 characters</strong> — readable in terminals and email clients</li>
        <li><strong>Blank line between subject and body</strong> — many tools depend on this</li>
      </ul>

      <h2>Imperative Mood for the Subject</h2>
      <pre><code>{`# Use the imperative (command) form — like git itself does
✅ Add user authentication
✅ Fix memory leak in image processor
✅ Update dependencies to latest versions
✅ Remove deprecated API endpoints

❌ Added user authentication    (past tense)
❌ Fixing memory leak           (present participle)
❌ Updates                      (too vague)
❌ auth stuff                   (too vague)`}</code></pre>

      <h2>When to Write a Body</h2>
      <p>Add a body when the "what" is obvious but the "why" is not:</p>
      <pre><code>{`Fix login redirect after OAuth callback

Previously, users were redirected to /dashboard after OAuth login
regardless of where they were trying to go. Now we store the intended
URL in the session before the OAuth flow and redirect there on success.

Closes #247`}</code></pre>

      <h2>Conventional Commits Format</h2>
      <p>A popular convention used with semantic versioning tools:</p>
      <pre><code>{`type(scope): subject

Types:
feat:     New feature → triggers minor version bump
fix:      Bug fix → triggers patch version bump
docs:     Documentation only
style:    Formatting, whitespace (no logic change)
refactor: Code change that neither fixes a bug nor adds a feature
perf:     Performance improvement
test:     Adding or updating tests
chore:    Build process, tooling, dependencies

Examples:
feat(auth): add OAuth2 Google login
fix(payments): handle Stripe webhook retry correctly
docs(api): add rate limiting documentation
perf(images): lazy load below-the-fold images
chore(deps): update all dependencies to latest`}</code></pre>

      <h2>Bad vs Good: Real Examples</h2>
      <table>
        <thead><tr><th>❌ Bad</th><th>✅ Good</th></tr></thead>
        <tbody>
          <tr><td>fix bug</td><td>Fix null pointer on user profile when avatar is unset</td></tr>
          <tr><td>update code</td><td>Refactor payment service to use strategy pattern</td></tr>
          <tr><td>WIP</td><td>feat(checkout): add Apple Pay support (WIP — not ready)</td></tr>
          <tr><td>asdf</td><td>(This shouldn't exist — squash before pushing)</td></tr>
          <tr><td>changes</td><td>Update Nginx config to enable HTTP/2</td></tr>
          <tr><td>fixed the thing</td><td>Fix session expiry not resetting after re-login</td></tr>
        </tbody>
      </table>

      <h2>Practical Tips</h2>
      <ul>
        <li>Write the commit message before you start coding — it clarifies what you're about to do</li>
        <li>One commit = one logical change. Don't combine unrelated changes.</li>
        <li>Reference issue numbers: <code>Closes #123</code>, <code>Fixes #456</code></li>
        <li>Squash cleanup commits before merging a PR: <code>git rebase -i HEAD~5</code></li>
        <li>Use <code>git commit --amend</code> to fix the last commit before pushing</li>
      </ul>
    </article>
  )
}
