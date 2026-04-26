'use client'

export default function UrlEncodingExplained() {
  return (
    <article className="prose-article">
      <p>
        Every time you search Google, share a link, or call an API with query parameters, URL
        encoding is working silently in the background. Understanding it prevents bugs in web
        applications and APIs — especially when dealing with special characters, Thai text, and
        query strings.
      </p>

      <h2>What is URL Encoding?</h2>
      <p>
        URLs can only contain a safe subset of ASCII characters. Characters outside this safe set —
        spaces, Thai letters, symbols like <code>&amp;</code>, <code>=</code>, and <code>#</code> —
        must be encoded before being placed in a URL. This encoding is called
        <strong> percent-encoding</strong> because each unsafe character is replaced by a{' '}
        <code>%</code> sign followed by its two-digit hexadecimal ASCII code.
      </p>
      <p>For example:</p>
      <ul>
        <li>Space → <code>%20</code> (ASCII 32 = 0x20)</li>
        <li><code>&amp;</code> → <code>%26</code></li>
        <li><code>=</code> → <code>%3D</code></li>
        <li><code>#</code> → <code>%23</code></li>
        <li>Thai ก → <code>%E0%B8%81</code> (UTF-8 encoded, then percent-encoded)</li>
      </ul>

      <h2>Characters That Don't Need Encoding</h2>
      <p>
        The following characters are "unreserved" and are safe to use in URLs without encoding:
      </p>
      <pre><code>A–Z  a–z  0–9  -  _  .  ~</code></pre>
      <p>
        Everything else — including spaces, Thai characters, emoji, and most punctuation — must be
        encoded when used in a URL value.
      </p>

      <h2>encodeURI vs encodeURIComponent</h2>
      <p>
        JavaScript provides two built-in functions for URL encoding. Choosing the wrong one is one
        of the most common sources of URL-related bugs.
      </p>

      <h3>encodeURI()</h3>
      <p>
        Encodes a <strong>complete URL</strong>. It leaves characters that are legal in a URL
        structure untouched — things like <code>/</code>, <code>?</code>, <code>&amp;</code>,{' '}
        <code>#</code>, and <code>:</code> — because removing those would break the URL's meaning.
      </p>
      <pre><code>{`encodeURI('https://example.com/search?q=hello world')
// → 'https://example.com/search?q=hello%20world'

// These are NOT encoded by encodeURI:
// : / ? # [ ] @ ! $ & ' ( ) * + , ; =`}</code></pre>

      <h3>encodeURIComponent()</h3>
      <p>
        Encodes a <strong>single value</strong> to be placed inside a URL — a query parameter
        value, a path segment, or a fragment. It encodes everything except{' '}
        <code>A–Z a–z 0–9 - _ . ~</code>, including all the URL-structural characters that{' '}
        <code>encodeURI</code> skips.
      </p>
      <pre><code>{`encodeURIComponent('hello world & more')
// → 'hello%20world%20%26%20more'

encodeURIComponent('https://example.com')
// → 'https%3A%2F%2Fexample.com'
// (note: the :// are also encoded — correct for a value)`}</code></pre>

      <h3>The Rule of Thumb</h3>
      <ul>
        <li>
          Use <code>encodeURIComponent()</code> on <strong>parameter values</strong> before
          appending them to a URL.
        </li>
        <li>
          Use <code>encodeURI()</code> only if you have a complete URL string with no pre-encoded
          components.
        </li>
        <li>
          In practice, <strong>URLSearchParams</strong> handles encoding automatically and is the
          safest approach.
        </li>
      </ul>
      <pre><code>{`// Best practice — use URLSearchParams
const params = new URLSearchParams({
  q: 'hello world',
  lang: 'th',
  ref: 'https://example.com',
})
const url = \`https://api.example.com/search?\${params}\`
// → https://api.example.com/search?q=hello+world&lang=th&ref=https%3A%2F%2Fexample.com`}</code></pre>
      <p>
        Note: <code>URLSearchParams</code> encodes spaces as <code>+</code> rather than{' '}
        <code>%20</code>. Both are valid in query strings; most servers accept either.
      </p>

      <h2>Decoding URL-Encoded Strings</h2>
      <p>The corresponding decode functions are:</p>
      <pre><code>{`decodeURI('hello%20world')           // → 'hello world'
decodeURIComponent('hello%20world')  // → 'hello world'

// Decode a full URL
decodeURI('https://example.com/path?q=hello%20world')
// → 'https://example.com/path?q=hello world'`}</code></pre>

      <h2>Thai Characters and URL Encoding</h2>
      <p>
        Thai characters are multi-byte in UTF-8. The string "สวัสดี" becomes a sequence of
        percent-encoded UTF-8 bytes:
      </p>
      <pre><code>{`encodeURIComponent('สวัสดี')
// → '%E0%B8%AA%E0%B8%A7%E0%B8%B1%E0%B8%AA%E0%B8%94%E0%B8%B5'`}</code></pre>
      <p>
        Modern browsers handle this transparently — the address bar displays "สวัสดี" even though
        the underlying request uses the percent-encoded form. APIs, however, receive the encoded
        form and must decode it on the server side.
      </p>

      <h2>Common URL Encoding Mistakes</h2>
      <table>
        <thead>
          <tr>
            <th>Mistake</th>
            <th>Problem</th>
            <th>Fix</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Not encoding <code>&amp;</code> in values</td>
            <td>Server splits parameter at the <code>&amp;</code></td>
            <td>Use <code>encodeURIComponent()</code> on each value</td>
          </tr>
          <tr>
            <td>Double-encoding</td>
            <td><code>%20</code> becomes <code>%2520</code></td>
            <td>Decode first if input might already be encoded</td>
          </tr>
          <tr>
            <td>Using <code>encodeURI</code> on a value</td>
            <td><code>&amp;</code> and <code>=</code> aren't encoded, breaking params</td>
            <td>Use <code>encodeURIComponent()</code> for values</td>
          </tr>
          <tr>
            <td>Not encoding spaces in paths</td>
            <td>Some servers reject paths with literal spaces</td>
            <td>Encode spaces as <code>%20</code> in paths</td>
          </tr>
        </tbody>
      </table>

      <h2>URL Encoding in Other Languages</h2>
      <pre><code>{`# Python
from urllib.parse import quote, urlencode

quote('hello world')                    # → 'hello%20world'
urlencode({'q': 'hello world', 'n': 5}) # → 'q=hello+world&n=5'

# PHP
urlencode('hello world')  // → 'hello+world'
rawurlencode('hello world') // → 'hello%20world'

# Go
url.QueryEscape("hello world")   // → "hello+world"
url.PathEscape("hello world")    // → "hello%20world"`}</code></pre>
    </article>
  )
}
