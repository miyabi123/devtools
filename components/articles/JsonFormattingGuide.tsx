'use client'

export default function JsonFormattingGuide() {
  return (
    <article className="prose-article">
      <p>
        JSON (JavaScript Object Notation) is the lingua franca of modern APIs and configuration files.
        But raw JSON from an API response or a log file is often a single unreadable line. Knowing how
        to format, validate, and minify JSON correctly is a daily skill for developers.
      </p>

      <h2>What is JSON Formatting?</h2>
      <p>
        JSON formatting — also called pretty-printing or beautifying — adds consistent indentation and
        line breaks so nested objects and arrays are visually readable. A formatter takes this:
      </p>
      <pre><code>{`{"name":"Alice","age":30,"roles":["admin","user"]}`}</code></pre>
      <p>And turns it into this:</p>
      <pre><code>{`{
  "name": "Alice",
  "age": 30,
  "roles": [
    "admin",
    "user"
  ]
}`}</code></pre>
      <p>
        The two-space indent is the most common convention, but four spaces is also widely used —
        especially in Python communities and some linters. The data itself is identical; only the
        whitespace changes.
      </p>

      <h2>JSON Syntax Rules</h2>
      <p>
        JSON has strict syntax rules. Break any of them and the entire document is invalid. The most
        common mistakes:
      </p>
      <ul>
        <li>
          <strong>Trailing commas are not allowed.</strong> <code>{`{"a":1,"b":2,}`}</code> is
          invalid JSON even though JavaScript allows it. JSONC (JSON with Comments) is a separate
          format supported by VS Code and TypeScript configs.
        </li>
        <li>
          <strong>Keys must be double-quoted strings.</strong> <code>{`{name:"Alice"}`}</code> is
          JavaScript object syntax, not JSON.
        </li>
        <li>
          <strong>Comments are not allowed.</strong> <code>{`// this is invalid`}</code> will cause
          a parse error in standard JSON parsers.
        </li>
        <li>
          <strong>String values must use double quotes.</strong> Single quotes like{' '}
          <code>{`{'name':'Alice'}`}</code> are invalid.
        </li>
        <li>
          <strong>Numbers cannot have leading zeros.</strong> <code>007</code> is invalid; use{' '}
          <code>7</code>.
        </li>
      </ul>

      <h2>How to Validate JSON</h2>
      <p>
        Validation checks whether your JSON is syntactically correct. In JavaScript, the simplest
        approach is wrapping <code>JSON.parse()</code> in a try/catch:
      </p>
      <pre><code>{`try {
  const data = JSON.parse(input)
  console.log('Valid JSON', data)
} catch (err) {
  console.error('Invalid JSON:', err.message)
}`}</code></pre>
      <p>
        Good JSON validators go further — they report the exact line and column where the error
        occurred, making it much faster to locate a missing bracket or a trailing comma buried in a
        500-line config file.
      </p>

      <h2>When to Minify JSON</h2>
      <p>
        Minification removes all whitespace, reducing file size. For a large JSON payload with
        thousands of keys, this can cut size by 20–40%. Use minified JSON for:
      </p>
      <ul>
        <li>
          <strong>API responses</strong> — less data transferred means faster load times,
          especially on mobile networks.
        </li>
        <li>
          <strong>Storing JSON in databases</strong> — text columns hold more records when
          whitespace is removed.
        </li>
        <li>
          <strong>JavaScript bundles</strong> — JSON imported into a bundle is automatically
          minified by webpack and esbuild.
        </li>
      </ul>
      <p>
        Keep formatted JSON in your source files and config templates so humans can read and review
        diffs. Minify only at build time or transmission time.
      </p>

      <h2>Indentation: 2 Spaces vs 4 Spaces</h2>
      <p>
        There is no technical difference — it is purely a style preference. Two spaces is more
        common in JavaScript and Node.js projects. Four spaces appears in Python and some enterprise
        tooling. The important thing is consistency within a project. Use a linter or{' '}
        <code>.editorconfig</code> to enforce it:
      </p>
      <pre><code>{`# .editorconfig
[*.json]
indent_style = space
indent_size = 2`}</code></pre>

      <h2>Pretty-Printing JSON in the Terminal</h2>
      <p>
        <code>jq</code> is the go-to command-line tool for formatting and querying JSON:
      </p>
      <pre><code>{`# Format a JSON file
cat data.json | jq .

# Format API response
curl -s https://api.example.com/data | jq .

# Extract a field
cat data.json | jq '.users[0].name'`}</code></pre>
      <p>
        Python also works without installing anything:
      </p>
      <pre><code>{`cat data.json | python3 -m json.tool`}</code></pre>

      <h2>JSON vs JSON5 vs JSONC</h2>
      <p>
        Standard JSON is strict by design — easy to parse, no ambiguity. But config files benefit
        from comments and trailing commas. Two extensions address this:
      </p>
      <ul>
        <li>
          <strong>JSONC</strong> (JSON with Comments) — used by VS Code (<code>settings.json</code>
          ) and TypeScript (<code>tsconfig.json</code>). Supports <code>// comments</code> and{' '}
          <code>/* block comments */</code>.
        </li>
        <li>
          <strong>JSON5</strong> — a more permissive superset that also allows trailing commas,
          single-quoted strings, and unquoted keys. Less common in practice.
        </li>
      </ul>
      <p>
        Standard <code>JSON.parse()</code> cannot parse either format — you need a dedicated parser
        library.
      </p>

      <h2>Common JSON Errors and How to Fix Them</h2>
      <table>
        <thead>
          <tr>
            <th>Error</th>
            <th>Cause</th>
            <th>Fix</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Unexpected token ','</td>
            <td>Trailing comma</td>
            <td>Remove the last comma before <code>{'}'}</code> or <code>]</code></td>
          </tr>
          <tr>
            <td>Unexpected token '''</td>
            <td>Single-quoted string</td>
            <td>Replace with double quotes</td>
          </tr>
          <tr>
            <td>Unexpected token 'u'</td>
            <td><code>undefined</code> value</td>
            <td>Use <code>null</code> instead — <code>undefined</code> is not valid JSON</td>
          </tr>
          <tr>
            <td>Unexpected end of JSON input</td>
            <td>Missing closing bracket</td>
            <td>Check bracket count — every <code>{'{'}</code> needs a <code>{'}'}</code></td>
          </tr>
        </tbody>
      </table>

      <h2>Formatting JSON in Code</h2>
      <p>
        In JavaScript, <code>JSON.stringify()</code> accepts a third argument for indentation:
      </p>
      <pre><code>{`// Minified (default)
JSON.stringify(data)

// Pretty-printed with 2 spaces
JSON.stringify(data, null, 2)

// Pretty-printed with 4 spaces
JSON.stringify(data, null, 4)

// Pretty-printed with tab characters
JSON.stringify(data, null, '\\t')`}</code></pre>
      <p>
        In Python, use <code>json.dumps()</code> with the <code>indent</code> parameter:
      </p>
      <pre><code>{`import json

# Pretty-printed
print(json.dumps(data, indent=2))

# Minified
print(json.dumps(data, separators=(',', ':')))`}</code></pre>
    </article>
  )
}
