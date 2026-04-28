'use client'

export default function InvalidJsonFix() {
  return (
    <article className="prose-freeutil">
      <p>Invalid JSON errors happen to everyone — a misplaced comma, a missing bracket, or a stray comment can break an entire JSON file. Here's how to find and fix the most common JSON syntax errors quickly.</p>

      <h2>Reading the Error Message</h2>
      <p>JSON parsers typically report the position of the error. In JavaScript:</p>
      <pre><code>{`JSON.parse('{"name": "Alice",}')
// SyntaxError: Unexpected token } in JSON at position 18`}</code></pre>
      <p>The position number points to the character where parsing failed — not always where the mistake actually is, but close to it.</p>

      <h2>Most Common JSON Errors</h2>

      <h3>1. Trailing Comma</h3>
      <pre><code>{`// ❌ Invalid — trailing comma after last item
{ "a": 1, "b": 2, }
["x", "y", "z",]

// ✅ Valid
{ "a": 1, "b": 2 }
["x", "y", "z"]`}</code></pre>

      <h3>2. Single Quotes Instead of Double Quotes</h3>
      <pre><code>{`// ❌ Invalid — single quotes not allowed
{ 'name': 'Alice' }

// ✅ Valid
{ "name": "Alice" }`}</code></pre>

      <h3>3. Unquoted Keys</h3>
      <pre><code>{`// ❌ Invalid — keys must be quoted strings
{ name: "Alice", age: 30 }

// ✅ Valid
{ "name": "Alice", "age": 30 }`}</code></pre>

      <h3>4. Comments</h3>
      <pre><code>{`// ❌ Invalid — comments not allowed in JSON
{
  // User data
  "name": "Alice" /* primary user */
}

// ✅ Valid — remove comments, or use JSONC format`}</code></pre>

      <h3>5. Undefined and NaN</h3>
      <pre><code>{`// ❌ Invalid — undefined and NaN are not JSON values
{ "value": undefined }
{ "ratio": NaN }

// ✅ Valid — use null or omit the key
{ "value": null }
{ }`}</code></pre>

      <h3>6. Missing or Extra Brackets</h3>
      <pre><code>{`// ❌ Missing closing brace
{ "name": "Alice", "scores": [1, 2, 3]

// ✅ Valid
{ "name": "Alice", "scores": [1, 2, 3] }`}</code></pre>

      <h3>7. Unescaped Special Characters in Strings</h3>
      <pre><code>{`// ❌ Invalid — unescaped double quote and backslash
{ "path": "C:\\Users\\Alice", "quote": "She said "hello"" }

// ✅ Valid — escape with backslash
{ "path": "C:\\\\Users\\\\Alice", "quote": "She said \\"hello\\"" }`}</code></pre>

      <h2>Tools for Finding JSON Errors</h2>
      <p>When you can't spot the issue manually, use a JSON formatter/validator that reports the exact line and column of the error. In the terminal:</p>
      <pre><code>{`# Python — reports line and column
python3 -m json.tool broken.json

# Node.js
node -e "JSON.parse(require('fs').readFileSync('broken.json','utf8'))"

# jq
cat broken.json | jq .`}</code></pre>
    </article>
  )
}
