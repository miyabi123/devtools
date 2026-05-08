'use client'

export default function RegexCheatsheet() {
  return (
    <article className="prose-freeutil">
      <p>A quick reference for regular expression syntax. Examples use JavaScript regex, compatible with most modern languages.</p>

      <h2>Anchors</h2>
      <table>
        <thead><tr><th>Pattern</th><th>Matches</th></tr></thead>
        <tbody>
          <tr><td><code>^</code></td><td>Start of string (or line with <code>m</code> flag)</td></tr>
          <tr><td><code>$</code></td><td>End of string (or line with <code>m</code> flag)</td></tr>
          <tr><td><code>\b</code></td><td>Word boundary</td></tr>
          <tr><td><code>\B</code></td><td>Non-word boundary</td></tr>
        </tbody>
      </table>

      <h2>Character Classes</h2>
      <table>
        <thead><tr><th>Pattern</th><th>Matches</th></tr></thead>
        <tbody>
          <tr><td><code>.</code></td><td>Any character except newline</td></tr>
          <tr><td><code>\d</code></td><td>Digit [0-9]</td></tr>
          <tr><td><code>\D</code></td><td>Non-digit</td></tr>
          <tr><td><code>\w</code></td><td>Word char [a-zA-Z0-9_]</td></tr>
          <tr><td><code>\W</code></td><td>Non-word char</td></tr>
          <tr><td><code>\s</code></td><td>Whitespace (space, tab, newline)</td></tr>
          <tr><td><code>\S</code></td><td>Non-whitespace</td></tr>
          <tr><td><code>[abc]</code></td><td>Any of a, b, or c</td></tr>
          <tr><td><code>[^abc]</code></td><td>Not a, b, or c</td></tr>
          <tr><td><code>[a-z]</code></td><td>Any lowercase letter</td></tr>
          <tr><td><code>[a-zA-Z0-9]</code></td><td>Any alphanumeric</td></tr>
        </tbody>
      </table>

      <h2>Quantifiers</h2>
      <table>
        <thead><tr><th>Pattern</th><th>Matches</th></tr></thead>
        <tbody>
          <tr><td><code>*</code></td><td>0 or more (greedy)</td></tr>
          <tr><td><code>+</code></td><td>1 or more (greedy)</td></tr>
          <tr><td><code>?</code></td><td>0 or 1 (optional)</td></tr>
          <tr><td><code>{'{3}'}</code></td><td>Exactly 3</td></tr>
          <tr><td><code>{'{3,}'}</code></td><td>3 or more</td></tr>
          <tr><td><code>{'{3,6}'}</code></td><td>Between 3 and 6</td></tr>
          <tr><td><code>*?</code></td><td>0 or more (lazy — as few as possible)</td></tr>
          <tr><td><code>+?</code></td><td>1 or more (lazy)</td></tr>
        </tbody>
      </table>

      <h2>Groups & Alternation</h2>
      <table>
        <thead><tr><th>Pattern</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>(abc)</code></td><td>Capture group — accessible as $1, $2…</td></tr>
          <tr><td><code>(?:abc)</code></td><td>Non-capturing group</td></tr>
          <tr><td><code>(?{'<'}name{'>'}abc)</code></td><td>Named capture group</td></tr>
          <tr><td><code>a|b</code></td><td>Alternation — matches a or b</td></tr>
          <tr><td><code>\1</code></td><td>Backreference to group 1</td></tr>
        </tbody>
      </table>

      <h2>Lookaheads & Lookbehinds</h2>
      <table>
        <thead><tr><th>Pattern</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>(?=abc)</code></td><td>Positive lookahead — followed by abc</td></tr>
          <tr><td><code>(?!abc)</code></td><td>Negative lookahead — not followed by abc</td></tr>
          <tr><td><code>(?{'<'}=abc)</code></td><td>Positive lookbehind — preceded by abc</td></tr>
          <tr><td><code>(?{'<!'}abc)</code></td><td>Negative lookbehind — not preceded by abc</td></tr>
        </tbody>
      </table>

      <h2>Flags</h2>
      <table>
        <thead><tr><th>Flag</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>g</code></td><td>Global — find all matches, not just first</td></tr>
          <tr><td><code>i</code></td><td>Case-insensitive</td></tr>
          <tr><td><code>m</code></td><td>Multiline — <code>^</code> and <code>$</code> match line boundaries</td></tr>
          <tr><td><code>s</code></td><td>DotAll — <code>.</code> matches newlines too</td></tr>
          <tr><td><code>u</code></td><td>Unicode mode</td></tr>
        </tbody>
      </table>

      <h2>Common Patterns</h2>
      <pre><code>{`// Email
/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/

// URL
/https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b/

// IPv4
/^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$/

// Thai ID (13 digits)
/^[1-9]\\d{12}$/

// Thai phone number
/^(0[689]\\d{8}|0[2-5]\\d{7})$/

// Date (YYYY-MM-DD)
/^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$/

// Hex color
/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

// JWT
/^[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]*$/

// Semantic version (1.2.3)
/^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)$/

// UUID v4
/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

// IP CIDR notation
/^(\\d{1,3}\\.){3}\\d{1,3}\\/(\\d|[1-2]\\d|3[0-2])$/`}</code></pre>
    </article>
  )
}
