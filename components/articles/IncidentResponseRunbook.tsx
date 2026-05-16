'use client'

export default function IncidentResponseRunbook() {
  return (
    <article className="prose-freeutil">
      <p>Production incidents are stressful. Having a documented process means you don't have to think about procedure while you're simultaneously trying to fix a problem and communicate with stakeholders. This runbook is a template — adapt it to your team.</p>

      <h2>Severity Levels</h2>
      <table>
        <thead><tr><th>Level</th><th>Definition</th><th>Response time</th></tr></thead>
        <tbody>
          <tr><td>SEV-1</td><td>Production down, all users affected, revenue impact</td><td>Immediate, 24/7</td></tr>
          <tr><td>SEV-2</td><td>Major feature broken, many users affected</td><td>Within 30 min</td></tr>
          <tr><td>SEV-3</td><td>Minor feature degraded, some users affected</td><td>Within business hours</td></tr>
          <tr><td>SEV-4</td><td>Minor issue, minimal user impact</td><td>Next sprint</td></tr>
        </tbody>
      </table>

      <h2>Phase 1: Detection & Triage (first 5 minutes)</h2>
      <pre><code>{`□ Acknowledge the alert / confirm the incident is real
□ Determine severity level
□ Assign an Incident Commander (IC) — one person in charge
□ Open an incident channel (#incident-YYYY-MM-DD-short-desc)
□ Post initial update: "We are investigating reports of [X]. More info in 10 min."
□ Check status page — update if SEV-1 or SEV-2`}</code></pre>

      <h2>Phase 2: Investigation (ongoing)</h2>
      <pre><code>{`□ What changed recently? (recent deploys, config changes, external services)
   git log --since="2 hours ago" --oneline
   Check deployment logs

□ Check dashboards and logs
   Error rate spike? When did it start?
   Which specific requests are failing?
   Is it all users or a subset?

□ Hypothesis: what might be causing this?
□ Test hypothesis: can you reproduce it?
□ Share findings in incident channel — narrate what you're doing`}</code></pre>

      <h2>Phase 3: Mitigation (ASAP)</h2>
      <pre><code>{`□ Can we rollback? (fastest path to recovery)
   git revert HEAD && git push
   Feature flag to disable the affected feature
   Revert config change

□ Can we route around it?
   Disable a failing external service integration
   Scale up servers to handle load
   Serve cached responses while DB is slow

□ Is the fix safe to deploy right now, or riskier than the current issue?`}</code></pre>

      <h2>Phase 4: Resolution & Communication</h2>
      <pre><code>{`□ Confirm the issue is resolved (monitor for 10-15 min)
□ Post resolution: "The issue has been resolved. [Brief description of fix]."
□ Update status page to "Resolved"
□ Notify stakeholders
□ Schedule postmortem within 48 hours (SEV-1/SEV-2)`}</code></pre>

      <h2>Status Page Update Templates</h2>
      <pre><code>{`# Investigating
We are aware of reports of [issue description] and are currently investigating.
Next update: [time].

# Identified
We have identified the cause of [issue description] and are working on a fix.
Affected: [scope of impact]. Next update: [time].

# Resolved
The [issue] has been resolved as of [time]. 
The root cause was [brief explanation].
We are conducting a post-incident review to prevent recurrence.`}</code></pre>

      <h2>Blameless Postmortem Template</h2>
      <pre><code>{`# Incident Postmortem: [Title]
Date: YYYY-MM-DD | Severity: SEV-X | Duration: X hours

## Summary
[2-3 sentence description of what happened and impact]

## Timeline
- HH:MM — [what happened]
- HH:MM — [who was alerted, what action was taken]
- HH:MM — [mitigation applied]
- HH:MM — [resolved]

## Root Cause
[Technical description of the actual cause]

## Contributing Factors
[What conditions made this possible / made it worse]

## What Went Well
- [Thing that helped]

## What Could Have Gone Better
- [Gap identified]

## Action Items
| Action | Owner | Due |
|--------|-------|-----|
| Add monitoring for X | @alice | 2025-08-15 |
| Write runbook for Y  | @bob   | 2025-08-20 |`}</code></pre>
    </article>
  )
}
