export default function UnixTimestamp() {
  return (
    <>
      <h2>What is a Unix Timestamp?</h2>
      <p>A Unix timestamp (also called epoch time or POSIX time) is the number of seconds that have elapsed since <strong>January 1, 1970, at 00:00:00 UTC</strong>. This reference point is called the Unix epoch.</p>
      <p>Unix timestamps are timezone-independent — they represent an absolute point in time, not a local time. This makes them ideal for storing and comparing times across different time zones.</p>

      <h2>Seconds vs Milliseconds</h2>
      <table>
        <thead><tr><th></th><th>Seconds</th><th>Milliseconds</th></tr></thead>
        <tbody>
          <tr><td>Example value</td><td>1704067200</td><td>1704067200000</td></tr>
          <tr><td>Digits</td><td>10</td><td>13</td></tr>
          <tr><td>Precision</td><td>1 second</td><td>1/1000 second</td></tr>
          <tr><td>Used in</td><td>Unix/Linux, most APIs</td><td>JavaScript, Java, high-precision timing</td></tr>
        </tbody>
      </table>

      <h2>Converting Timestamps</h2>
      <pre><code>{`// JavaScript
const now = Date.now()              // milliseconds
const seconds = Math.floor(Date.now() / 1000)  // seconds
const date = new Date(1704067200000)  // from ms timestamp

# Python
import time, datetime
now = int(time.time())              # seconds
dt = datetime.datetime.fromtimestamp(1704067200)

// PHP
$now = time();                       // seconds
$date = date('Y-m-d', 1704067200);`}</code></pre>

      <h2>The Year 2038 Problem</h2>
      <p>32-bit signed integers can store values up to 2,147,483,647. Unix timestamps will overflow this limit on <strong>January 19, 2038 at 03:14:07 UTC</strong>. Modern 64-bit systems are not affected — a 64-bit timestamp won't overflow for approximately 292 billion years.</p>

      <div className="callout callout-green">
        <p>✓ Always use 64-bit integers for timestamps in new applications. Most modern languages and databases default to 64-bit, but legacy embedded systems and older databases may still use 32-bit.</p>
      </div>
    </>
  )
}
