export default function UUIDGuide() {
  return (
    <>
      <h2>What is a UUID?</h2>
      <p>A UUID (Universally Unique Identifier), also called a GUID (Globally Unique Identifier), is a 128-bit label used to uniquely identify information. UUIDs are formatted as 32 hexadecimal digits in five groups separated by hyphens: <code>xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</code>.</p>
      <pre><code>550e8400-e29b-41d4-a716-446655440000</code></pre>

      <h2>UUID Versions</h2>
      <h3>UUID v1 — Time-based</h3>
      <p>UUID v1 is generated from the current timestamp and the MAC address of the generating machine. It is sortable chronologically but reveals information about when and where it was generated.</p>
      <ul>
        <li>Contains timestamp — sortable by creation time</li>
        <li>Contains MAC address — privacy concern</li>
        <li>Good for: distributed systems needing temporal ordering</li>
      </ul>

      <h3>UUID v4 — Random</h3>
      <p>UUID v4 is generated from random or pseudo-random numbers. It is the most widely used version due to its simplicity and privacy properties.</p>
      <ul>
        <li>122 random bits — collision probability is negligible</li>
        <li>No information about when/where it was generated</li>
        <li>Good for: most use cases — database IDs, session tokens, API keys</li>
      </ul>

      <h3>UUID v5 — Name-based (SHA-1)</h3>
      <p>UUID v5 generates a deterministic UUID from a namespace UUID and a name using SHA-1 hashing. The same inputs always produce the same UUID.</p>
      <ul>
        <li>Deterministic — same name + namespace = same UUID</li>
        <li>Good for: converting existing identifiers to UUIDs consistently</li>
      </ul>

      <h2>Comparison</h2>
      <table>
        <thead><tr><th></th><th>v1</th><th>v4</th><th>v5</th></tr></thead>
        <tbody>
          <tr><td>Source</td><td>Timestamp + MAC</td><td>Random</td><td>Name + Namespace</td></tr>
          <tr><td>Sortable</td><td>Yes</td><td>No</td><td>No</td></tr>
          <tr><td>Deterministic</td><td>No</td><td>No</td><td>Yes</td></tr>
          <tr><td>Privacy</td><td>Low (leaks MAC)</td><td>High</td><td>Medium</td></tr>
          <tr><td>Most common</td><td>No</td><td>Yes ✅</td><td>Sometimes</td></tr>
        </tbody>
      </table>

      <h2>UUID in Databases</h2>
      <p>UUIDs are popular as database primary keys, especially in distributed systems where auto-increment IDs would conflict across multiple database nodes.</p>
      <pre><code>{`-- PostgreSQL
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100)
);`}</code></pre>

      <div className="callout callout-blue">
        <p>💡 For database performance, consider UUID v7 (time-ordered random UUID) which is sortable like v1 but uses random data instead of MAC address. It provides better index performance in most databases.</p>
      </div>
    </>
  )
}
