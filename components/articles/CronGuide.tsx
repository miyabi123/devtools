export default function CronGuide() {
  return (
    <>
      <h2>What is a Cron Expression?</h2>
      <p>A cron expression is a string of five (or six) fields that define a schedule for recurring tasks. Cron is the time-based job scheduler in Unix-like systems. The name comes from the Greek word "chronos" (time).</p>
      <pre><code>┌───── minute (0-59)
│ ┌─── hour (0-23)
│ │ ┌─ day of month (1-31)
│ │ │ ┌ month (1-12)
│ │ │ │ ┌ day of week (0-6, Sunday=0)
│ │ │ │ │
* * * * *</code></pre>

      <h2>Special Characters</h2>
      <table>
        <thead><tr><th>Character</th><th>Meaning</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td><code>*</code></td><td>Any value</td><td><code>* * * * *</code> — every minute</td></tr>
          <tr><td><code>,</code></td><td>List separator</td><td><code>1,15,30</code> — at minutes 1, 15, and 30</td></tr>
          <tr><td><code>-</code></td><td>Range</td><td><code>9-17</code> — hours 9 through 17</td></tr>
          <tr><td><code>/</code></td><td>Step values</td><td><code>*/15</code> — every 15 units</td></tr>
        </tbody>
      </table>

      <h2>Common Patterns</h2>
      <table>
        <thead><tr><th>Expression</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>* * * * *</code></td><td>Every minute</td></tr>
          <tr><td><code>0 * * * *</code></td><td>Every hour (at :00)</td></tr>
          <tr><td><code>0 0 * * *</code></td><td>Every day at midnight</td></tr>
          <tr><td><code>0 0 * * 0</code></td><td>Every Sunday at midnight</td></tr>
          <tr><td><code>0 9 * * 1-5</code></td><td>Every weekday at 9:00 AM</td></tr>
          <tr><td><code>0 0 1 * *</code></td><td>First day of every month at midnight</td></tr>
          <tr><td><code>0 0 1 1 *</code></td><td>January 1st at midnight (yearly)</td></tr>
          <tr><td><code>*/15 * * * *</code></td><td>Every 15 minutes</td></tr>
          <tr><td><code>0 9,12,18 * * *</code></td><td>At 9:00, 12:00, and 18:00 daily</td></tr>
          <tr><td><code>0 0 * * 1</code></td><td>Every Monday at midnight</td></tr>
        </tbody>
      </table>

      <h2>Cron in Different Environments</h2>
      <h3>Linux Crontab</h3>
      <pre><code>{`# Edit crontab
crontab -e

# Backup database every day at 2 AM
0 2 * * * /scripts/backup-db.sh

# Clean temp files every Sunday at 3 AM
0 3 * * 0 /scripts/cleanup.sh`}</code></pre>

      <h3>AWS EventBridge (CloudWatch Events)</h3>
      <p>AWS uses a 6-field cron with year field: <code>cron(Minutes Hours Day Month Weekday Year)</code></p>
      <pre><code>{`# Every day at 10 AM UTC
cron(0 10 * * ? *)

# Every weekday at 8 AM
cron(0 8 ? * MON-FRI *)`}</code></pre>

      <h3>Kubernetes CronJob</h3>
      <pre><code>{`apiVersion: batch/v1
kind: CronJob
spec:
  schedule: "0 2 * * *"  # Every day at 2 AM`}</code></pre>

      <div className="callout callout-green">
        <p>✓ Tip: Always test cron expressions before deploying to production. Use the FreeUtil Cron Builder to preview the next 8 run times and verify your expression does what you expect.</p>
      </div>
    </>
  )
}
