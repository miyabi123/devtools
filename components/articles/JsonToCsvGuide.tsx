'use client'

export default function JsonToCsvGuide() {
  return (
    <article className="prose-article">
      <p>
        APIs return JSON. Business teams work in Excel. Bridging that gap — converting JSON arrays
        to CSV — is one of the most common data tasks in web development. This guide covers how the
        conversion works, how to handle tricky cases, and how to convert CSV back to JSON for APIs.
      </p>

      <h2>How JSON to CSV Conversion Works</h2>
      <p>
        CSV (Comma-Separated Values) is a flat tabular format. JSON arrays of objects map
        naturally to CSV: each object becomes a row, and the object keys become column headers.
      </p>
      <pre><code>{`// JSON input
[
  { "name": "Alice", "age": 30, "city": "Bangkok" },
  { "name": "Bob",   "age": 25, "city": "Chiang Mai" }
]

// CSV output
name,age,city
Alice,30,Bangkok
Bob,25,Chiang Mai`}</code></pre>
      <p>
        The conversion is straightforward when all objects have the same keys. Real-world data
        rarely cooperates — different objects have different fields, values contain commas and
        newlines, and some fields are nested objects.
      </p>

      <h2>Handling Missing Fields</h2>
      <p>
        When objects in the array have different keys, the converter must build a union of all keys
        as the header row, then fill in empty strings for missing values:
      </p>
      <pre><code>{`// Input with inconsistent keys
[
  { "name": "Alice", "email": "alice@example.com" },
  { "name": "Bob",   "phone": "081-234-5678" }
]

// Correct CSV output
name,email,phone
Alice,alice@example.com,
Bob,,081-234-5678`}</code></pre>

      <h2>Escaping Special Characters</h2>
      <p>
        CSV has a simple escaping rule: if a field contains a comma, double-quote, or newline, wrap
        the entire field in double quotes. If the field contains a double-quote, escape it as two
        double-quotes (<code>""</code>):
      </p>
      <pre><code>{`// Value: She said "hello", world
// CSV:   "She said ""hello"", world"

// Value: Line 1\nLine 2
// CSV:   "Line 1\nLine 2"`}</code></pre>
      <p>
        Most converters handle this automatically. The problem arises when using a naive
        implementation that just joins values with commas — it will produce invalid CSV for any
        value containing a comma.
      </p>

      <h2>Nested Objects and Arrays</h2>
      <p>
        CSV is flat; JSON can be deeply nested. There is no single correct way to handle nested
        data — the right approach depends on your use case:
      </p>
      <ul>
        <li>
          <strong>Flatten with dot notation:</strong> <code>{`address.city`}</code>,{' '}
          <code>{`address.country`}</code> — best for one level of nesting.
        </li>
        <li>
          <strong>Serialize nested objects as JSON strings:</strong> the cell value becomes{' '}
          <code>{`"{'city':'Bangkok'}"`}</code> — preserves data but is not easily usable in
          Excel.
        </li>
        <li>
          <strong>Expand arrays into multiple rows:</strong> if a user has multiple orders, create
          one row per order — requires knowing your data structure.
        </li>
      </ul>
      <pre><code>{`// Input
{ "name": "Alice", "address": { "city": "Bangkok", "zip": "10110" } }

// Flattened output
name,address.city,address.zip
Alice,Bangkok,10110`}</code></pre>

      <h2>Choosing a Delimiter</h2>
      <p>
        While "CSV" stands for comma-separated, many tools and regional settings use different
        delimiters. In Europe, the comma is the decimal separator, so semicolons are used for CSV.
        Tab-separated values (TSV) are common in bioinformatics and some database exports.
      </p>
      <ul>
        <li><strong>Comma (,)</strong> — universal default, use for most cases</li>
        <li><strong>Semicolon (;)</strong> — use if values contain commas or for European Excel</li>
        <li><strong>Tab (\t)</strong> — use for data with many commas (e.g. addresses, prose)</li>
        <li><strong>Pipe (|)</strong> — use in legacy systems or when other delimiters appear in data</li>
      </ul>

      <h2>Opening CSV in Excel Correctly</h2>
      <p>
        Double-clicking a CSV in Excel often causes encoding problems with Thai characters and
        numbers being misformatted. The safe approach:
      </p>
      <ol>
        <li>Open Excel → Data → From Text/CSV</li>
        <li>Select your file</li>
        <li>Set encoding to <strong>UTF-8</strong></li>
        <li>Set delimiter correctly</li>
        <li>Set number columns to "Text" format if they contain leading zeros</li>
      </ol>
      <p>
        Alternatively, save the CSV with a UTF-8 BOM (Byte Order Mark) — Excel detects the BOM and
        opens UTF-8 files correctly by default on Windows.
      </p>

      <h2>Converting CSV Back to JSON</h2>
      <p>
        CSV to JSON reverses the process: parse the header row as keys, then map each subsequent
        row to an object. The main challenge is type inference — all CSV values are strings, but
        JSON has numbers, booleans, and null.
      </p>
      <pre><code>{`// CSV input
name,age,active
Alice,30,true
Bob,25,false

// Naive JSON (all strings)
[
  { "name": "Alice", "age": "30", "active": "true" },
  { "name": "Bob",   "age": "25", "active": "false" }
]

// With type inference
[
  { "name": "Alice", "age": 30, "active": true },
  { "name": "Bob",   "age": 25, "active": false }
]`}</code></pre>
      <p>
        Whether to infer types depends on your use case. For APIs expecting specific types, type
        inference is essential. For display-only uses, strings are safe.
      </p>

      <h2>JavaScript Implementation</h2>
      <pre><code>{`function jsonToCsv(data, delimiter = ',') {
  if (!data.length) return ''
  const keys = [...new Set(data.flatMap(Object.keys))]
  const escape = val => {
    const str = val === null || val === undefined ? '' : String(val)
    return /[,"\\n]/.test(str) ? \`"\${str.replace(/"/g, '""')}"\` : str
  }
  const header = keys.map(escape).join(delimiter)
  const rows = data.map(row => keys.map(k => escape(row[k])).join(delimiter))
  return [header, ...rows].join('\\n')
}`}</code></pre>
    </article>
  )
}
