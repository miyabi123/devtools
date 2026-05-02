'use client'

export default function GitWorkflowGuide() {
  return (
    <>
      <h2>Why Git Workflow Matters</h2>
      <p>
        Git gives you unlimited flexibility in how you use branches, commits, and merges. That flexibility is a double-edged sword: without a consistent workflow, codebases become tangled, deployments break, and team collaboration creates more friction than it removes.
      </p>
      <p>
        The right workflow depends on your team size, deployment frequency, and project complexity. There's no universal answer — but there are well-understood patterns for different situations.
      </p>

      <h2>Trunk-Based Development</h2>
      <p>
        The simplest approach: everyone commits directly to <code>main</code> (trunk), or uses very short-lived branches (less than a day) that are merged immediately.
      </p>
      <h3>How it works</h3>
      <ul>
        <li>One long-lived branch: <code>main</code></li>
        <li>Feature flags control what's "live" — code is deployed even when features aren't complete</li>
        <li>CI runs on every commit; deploy on every green build</li>
        <li>No long-lived feature branches</li>
      </ul>
      <h3>Best for</h3>
      <ul>
        <li>Small teams (1–3 developers) with high trust</li>
        <li>Continuous deployment environments</li>
        <li>Teams that practice continuous integration seriously</li>
        <li>Senior developers with good judgment about breaking changes</li>
      </ul>
      <div className="callout callout-green">
        <p><strong>Used by:</strong> Google, Facebook, and many high-velocity teams. It requires strong CI, good test coverage, and team discipline — but enables the fastest iteration.</p>
      </div>

      <h2>GitHub Flow</h2>
      <p>
        The most widely-used workflow for teams. Simple, branch-based, and designed around pull requests.
      </p>
      <h3>The rules</h3>
      <ol>
        <li><code>main</code> is always deployable</li>
        <li>Work is done on descriptively-named feature branches</li>
        <li>Push to the branch early and open a pull request</li>
        <li>Review happens through PR comments</li>
        <li>Merge to <code>main</code> only after review and green CI</li>
        <li>Deploy immediately after merging</li>
      </ol>
      <pre><code>{`# GitHub Flow in practice
git switch main && git pull
git switch -c feature/user-avatar-upload

# ... do work, commit as you go ...
git push -u origin feature/user-avatar-upload
# Open PR → review → CI passes → merge → deploy`}</code></pre>

      <h3>Branch naming conventions</h3>
      <pre><code>{`feature/user-authentication
fix/login-timeout-bug
chore/update-dependencies
docs/api-authentication-guide
refactor/payment-service`}</code></pre>

      <h3>Best for</h3>
      <ul>
        <li>Web applications with continuous deployment</li>
        <li>Teams of 2–10 developers</li>
        <li>When <code>main</code> == production</li>
        <li>Most SaaS products and open source projects</li>
      </ul>

      <h2>Gitflow</h2>
      <p>
        A structured workflow with multiple long-lived branches, designed for software with versioned releases rather than continuous deployment.
      </p>
      <h3>Branch structure</h3>
      <table>
        <thead><tr><th>Branch</th><th>Purpose</th><th>Lifetime</th></tr></thead>
        <tbody>
          <tr><td><code>main</code></td><td>Production-ready releases only</td><td>Permanent</td></tr>
          <tr><td><code>develop</code></td><td>Integration branch for next release</td><td>Permanent</td></tr>
          <tr><td><code>feature/*</code></td><td>New features, branch from develop</td><td>Until merged</td></tr>
          <tr><td><code>release/*</code></td><td>Release preparation, bug fixes only</td><td>1–2 weeks</td></tr>
          <tr><td><code>hotfix/*</code></td><td>Emergency fixes on production, branch from main</td><td>Hours–days</td></tr>
        </tbody>
      </table>
      <pre><code>{`# Feature development
git switch develop && git pull
git switch -c feature/payment-gateway

# ... work ...
git switch develop && git merge --no-ff feature/payment-gateway
git branch -d feature/payment-gateway

# Release preparation
git switch -c release/2.1.0 develop
# only bug fixes on release branch
git switch main && git merge --no-ff release/2.1.0
git tag -a v2.1.0 -m "Release 2.1.0"
git switch develop && git merge --no-ff release/2.1.0`}</code></pre>

      <h3>Best for</h3>
      <ul>
        <li>Mobile apps with App Store releases</li>
        <li>Libraries with versioned releases (semver)</li>
        <li>Enterprise software with scheduled release cycles</li>
        <li>Teams that need to support multiple release versions simultaneously</li>
      </ul>
      <div className="callout">
        <p><strong>Warning:</strong> Gitflow is often overkill for web applications. Its complexity pays off only when you genuinely need version management and parallel release support. Many teams adopt it and later simplify to GitHub Flow.</p>
      </div>

      <h2>Commit Message Conventions</h2>
      <p>
        Good commit messages make <code>git log</code> readable and enable automatic changelog generation. The <strong>Conventional Commits</strong> specification is the most widely adopted standard:
      </p>
      <pre><code>{`# Format: type(scope): description
feat(auth): add Google OAuth login
fix(api): handle null response from payment gateway
docs(readme): update local development setup
refactor(db): extract query builder to separate module
test(checkout): add integration tests for coupon codes
chore(deps): update Next.js to 15.2.0
perf(images): enable WebP conversion on upload
style(button): fix hover state color inconsistency

# Breaking changes: add ! after type
feat(api)!: change response format for /users endpoint

# Body and footer for complex commits
fix(auth): prevent session fixation on login

Previous session token was reused after login, allowing
session fixation attacks if the token was leaked pre-auth.

Closes #1234
BREAKING CHANGE: session tokens are now rotated on login`}</code></pre>

      <h3>Commit types</h3>
      <table>
        <thead><tr><th>Type</th><th>When to use</th></tr></thead>
        <tbody>
          <tr><td><code>feat</code></td><td>New feature for the user</td></tr>
          <tr><td><code>fix</code></td><td>Bug fix for the user</td></tr>
          <tr><td><code>docs</code></td><td>Documentation only changes</td></tr>
          <tr><td><code>style</code></td><td>Formatting, no logic change</td></tr>
          <tr><td><code>refactor</code></td><td>Code restructure, no feature or fix</td></tr>
          <tr><td><code>perf</code></td><td>Performance improvement</td></tr>
          <tr><td><code>test</code></td><td>Adding or fixing tests</td></tr>
          <tr><td><code>chore</code></td><td>Build process, tooling, dependencies</td></tr>
          <tr><td><code>ci</code></td><td>CI configuration changes</td></tr>
        </tbody>
      </table>

      <h2>Merge vs Rebase</h2>
      <p>
        Both integrate changes from one branch into another, but they create different history.
      </p>
      <pre><code>{`# Merge: creates a merge commit, preserves all history
git switch main
git merge feature/my-feature
# Result: history shows exactly what happened, including branch point

# Rebase: replays commits on top of target, linear history
git switch feature/my-feature
git rebase main
git switch main && git merge feature/my-feature  # fast-forward
# Result: clean linear history, no merge commits`}</code></pre>
      <table>
        <thead><tr><th>Aspect</th><th>Merge</th><th>Rebase</th></tr></thead>
        <tbody>
          <tr><td>History</td><td>Preserves exact branch history</td><td>Linear, cleaner log</td></tr>
          <tr><td>Merge commits</td><td>Yes</td><td>No (unless you squash)</td></tr>
          <tr><td>Conflict resolution</td><td>Once at merge time</td><td>Potentially per-commit during rebase</td></tr>
          <tr><td>Safe to share branch?</td><td>Yes</td><td>Rebase rewrites history — never rebase shared branches</td></tr>
        </tbody>
      </table>
      <div className="callout callout-blue">
        <p><strong>The golden rule of rebase:</strong> Never rebase commits that have been pushed to a shared branch. Rebase is safe on your local feature branch before opening a PR. After others have pulled your branch, use merge.</p>
      </div>

      <h2>Tagging Releases</h2>
      <pre><code>{`# Annotated tags (recommended for releases)
git tag -a v1.4.2 -m "Release version 1.4.2"
git push origin v1.4.2
git push origin --tags  # push all tags

# List tags
git tag -l "v1.*"

# Tag old commit
git tag -a v1.0.0 abc1234 -m "Initial release"

# Delete remote tag (if needed)
git push origin --delete v1.4.2`}</code></pre>

      <h2>Pull Request Best Practices</h2>
      <ul>
        <li><strong>Keep PRs small</strong> — under 400 lines of change is a good target. Large PRs get rubber-stamped.</li>
        <li><strong>One concern per PR</strong> — don't mix refactoring, features, and bug fixes</li>
        <li><strong>PR description should explain why</strong> — reviewers can read the code; explain the reasoning</li>
        <li><strong>Self-review before requesting</strong> — read your own diff before asking others to</li>
        <li><strong>Link to the issue or ticket</strong> — provide context for why this work exists</li>
        <li><strong>Screenshots for UI changes</strong> — before/after screenshots speed up review dramatically</li>
      </ul>

      <h2>Choosing a Workflow</h2>
      <table>
        <thead><tr><th>Situation</th><th>Recommended Workflow</th></tr></thead>
        <tbody>
          <tr><td>Solo developer, web app</td><td>Trunk-based or GitHub Flow</td></tr>
          <tr><td>Small team, continuous deployment</td><td>GitHub Flow</td></tr>
          <tr><td>Team, multiple features in parallel</td><td>GitHub Flow</td></tr>
          <tr><td>Mobile app or versioned library</td><td>Gitflow</td></tr>
          <tr><td>Open source project with external contributors</td><td>GitHub Flow (fork → PR)</td></tr>
          <tr><td>Enterprise with quarterly releases</td><td>Gitflow or trunk + release branches</td></tr>
        </tbody>
      </table>

      <h2>Summary</h2>
      <p>
        GitHub Flow is the right choice for most teams — simple, effective, and designed for continuous deployment. Gitflow adds structure for versioned release cycles but is overkill for web apps. Regardless of workflow, write meaningful commit messages (Conventional Commits is the standard), keep PRs small and focused, and establish clear rules about merge vs rebase. Consistency matters more than which specific workflow you choose.
      </p>
    </>
  )
}
