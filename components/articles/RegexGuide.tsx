export default function RegexGuide() {
  return (
    <>
      <h2>What is a Regular Expression?</h2>
      <p>A regular expression (regex or regexp) is a sequence of characters that defines a search pattern. Regex is used to find, match, validate, and replace text based on patterns rather than exact strings. It is supported in virtually every programming language and is one of the most powerful tools in a developer's toolkit.</p>

      <h2>Basic Syntax</h2>
      <h3>Literal Characters</h3>
      <p>The simplest regex matches exact characters. The pattern <code>hello</code> matches the string "hello" anywhere in the text.</p>

      <h3>Anchors</h3>
      <table>
        <thead><tr><th>Symbol</th><th>Meaning</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td><code>^</code></td><td>Start of string</td><td><code>^hello</code> matches "hello world" but not "say hello"</td></tr>
          <tr><td><code>$</code></td><td>End of string</td><td><code>world$</code> matches "hello world" but not "world peace"</td></tr>
          <tr><td><code>\b</code></td><td>Word boundary</td><td><code>\bcat\b</code> matches "cat" but not "category"</td></tr>
        </tbody>
      </table>

      <h3>Character Classes</h3>
      <table>
        <thead><tr><th>Pattern</th><th>Matches</th></tr></thead>
        <tbody>
          <tr><td><code>[abc]</code></td><td>Any one of: a, b, or c</td></tr>
          <tr><td><code>[a-z]</code></td><td>Any lowercase letter</td></tr>
          <tr><td><code>[A-Z]</code></td><td>Any uppercase letter</td></tr>
          <tr><td><code>[0-9]</code></td><td>Any digit</td></tr>
          <tr><td><code>[^abc]</code></td><td>Any character except a, b, c</td></tr>
          <tr><td><code>\d</code></td><td>Any digit (same as [0-9])</td></tr>
          <tr><td><code>\w</code></td><td>Any word character [a-zA-Z0-9_]</td></tr>
          <tr><td><code>\s</code></td><td>Any whitespace (space, tab, newline)</td></tr>
          <tr><td><code>.</code></td><td>Any character except newline</td></tr>
        </tbody>
      </table>

      <h3>Quantifiers</h3>
      <table>
        <thead><tr><th>Symbol</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>*</code></td><td>0 or more times</td></tr>
          <tr><td><code>+</code></td><td>1 or more times</td></tr>
          <tr><td><code>?</code></td><td>0 or 1 time (optional)</td></tr>
          <tr><td><code>{`{3}`}</code></td><td>Exactly 3 times</td></tr>
          <tr><td><code>{`{3,}`}</code></td><td>3 or more times</td></tr>
          <tr><td><code>{`{3,6}`}</code></td><td>Between 3 and 6 times</td></tr>
        </tbody>
      </table>

      <h2>Groups and Capturing</h2>
      <p>Parentheses create capturing groups that extract specific parts of a match:</p>
      <pre><code>{`Pattern: (\d{4})-(\d{2})-(\d{2})
Input:   "Date: 2024-01-15"
Group 1: "2024"
Group 2: "01"
Group 3: "15"`}</code></pre>

      <h3>Non-capturing Groups</h3>
      <p>Use <code>(?:...)</code> to group without capturing:</p>
      <pre><code>{`(?:https?|ftp)://  // matches http://, https://, or ftp://`}</code></pre>

      <h2>Common Regex Patterns</h2>
      <table>
        <thead><tr><th>Pattern</th><th>Regex</th></tr></thead>
        <tbody>
          <tr><td>Email address</td><td><code>[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{'{2,}'}</code></td></tr>
          <tr><td>URL</td><td><code>https?://[^\s/$.?#].[^\s]*</code></td></tr>
          <tr><td>IPv4 address</td><td><code>(\d{'{1,3}'}\.){'{3}'}\d{'{1,3}'}</code></td></tr>
          <tr><td>Phone (US)</td><td><code>\+?1?[-.\s]?\(?\d{'{3}'}\)?[-.\s]?\d{'{3}'}[-.\s]?\d{'{4}'}</code></td></tr>
          <tr><td>Thai phone</td><td><code>0[689]\d{'{8}'}</code></td></tr>
          <tr><td>Hex color</td><td><code>#[0-9a-fA-F]{'{3,6}'}</code></td></tr>
          <tr><td>Date (YYYY-MM-DD)</td><td><code>\d{'{4}'}-\d{'{2}'}-\d{'{2}'}</code></td></tr>
          <tr><td>Positive integer</td><td><code>^[1-9]\d*$</code></td></tr>
        </tbody>
      </table>

      <h2>Flags</h2>
      <table>
        <thead><tr><th>Flag</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>g</code></td><td>Global — find all matches, not just the first</td></tr>
          <tr><td><code>i</code></td><td>Case-insensitive matching</td></tr>
          <tr><td><code>m</code></td><td>Multiline — ^ and $ match start/end of each line</td></tr>
          <tr><td><code>s</code></td><td>Dot-all — . matches newlines too</td></tr>
        </tbody>
      </table>

      <div className="callout callout-green">
        <p>✓ Tip: Test your regex patterns incrementally. Start with the simplest possible pattern and add complexity step by step. Always test with both matching and non-matching examples.</p>
      </div>
    </>
  )
}
