'use client'

export default function CodeReviewChecklist() {
  return (
    <article className="prose-freeutil">
      <p>A good code review catches real problems, improves the codebase, and transfers knowledge — without being adversarial or slowing the team down. Use this checklist to be thorough without being exhaustive.</p>

      <h2>Before You Start</h2>
      <ul>
        <li>Read the PR description — understand what it's trying to accomplish and why</li>
        <li>Check if there's a linked ticket or specification to reference</li>
        <li>Pull the branch and run it locally for non-trivial changes</li>
      </ul>

      <h2>Correctness</h2>
      <ul>
        <li>Does the code actually do what the PR description says it does?</li>
        <li>Are there edge cases that aren't handled? (null values, empty arrays, large inputs, concurrent requests)</li>
        <li>Do the tests cover the happy path AND failure paths?</li>
        <li>If tests are missing, are the untested parts trivial or risky?</li>
        <li>Does the logic handle race conditions if the code is async?</li>
        <li>Are error messages clear and actionable?</li>
      </ul>

      <h2>Security</h2>
      <ul>
        <li>Is user input validated and sanitized before use?</li>
        <li>Are database queries parameterized (no string concatenation)?</li>
        <li>Is any sensitive data (passwords, tokens, PII) logged or exposed?</li>
        <li>Are new API endpoints protected with authentication and authorization?</li>
        <li>Are file uploads validated for type and size?</li>
        <li>Are any new secrets hardcoded? (Should be in env vars)</li>
      </ul>

      <h2>Performance</h2>
      <ul>
        <li>Are there any N+1 queries? (Fetching data in a loop that could be a single query)</li>
        <li>Are expensive operations cached where appropriate?</li>
        <li>Will this work at 10x the current data volume?</li>
        <li>Are database indexes needed for any new query patterns?</li>
        <li>Are large payloads paginated?</li>
      </ul>

      <h2>Code Quality</h2>
      <ul>
        <li>Is the code readable — would a new team member understand it in 6 months?</li>
        <li>Are function and variable names descriptive and accurate?</li>
        <li>Is there duplicated code that should be extracted to a shared function?</li>
        <li>Are there any TODO comments that should be tickets instead?</li>
        <li>Is the code consistent with the patterns used elsewhere in the codebase?</li>
        <li>Is dead code removed, not commented out?</li>
      </ul>

      <h2>Error Handling</h2>
      <ul>
        <li>Are errors handled explicitly — no swallowed exceptions (<code>catch {}</code>)?</li>
        <li>Do errors bubble up correctly or are they handled at the right level?</li>
        <li>Do external calls (APIs, DB) have timeouts?</li>
        <li>Is there appropriate retry logic for transient failures?</li>
      </ul>

      <h2>Documentation</h2>
      <ul>
        <li>Is complex business logic explained with comments?</li>
        <li>Are public APIs and function signatures documented?</li>
        <li>Is the README or wiki updated if behavior has changed?</li>
        <li>Are breaking changes documented in a changelog?</li>
      </ul>

      <h2>How to Give Feedback</h2>
      <ul>
        <li>Prefix comments by type: <strong>nit:</strong> (minor, optional), <strong>question:</strong> (seeking understanding), <strong>blocker:</strong> (must fix before merge)</li>
        <li>Suggest, don't demand: "What do you think about extracting this to a helper?" not "Extract this."</li>
        <li>Explain the why: "This could cause a SQL injection — use parameterized queries instead"</li>
        <li>Leave positive comments too — acknowledge good solutions</li>
        <li>Be responsive — don't leave PRs waiting more than 1 business day</li>
      </ul>
    </article>
  )
}
