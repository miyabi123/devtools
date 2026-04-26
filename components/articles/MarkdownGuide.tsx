'use client'

export default function MarkdownGuide() {
  return (
    <article className="prose-article">
      <p>
        Markdown is a lightweight markup language that converts plain text to formatted HTML. Created
        by John Gruber in 2004, it's now the standard for README files, documentation, blog posts,
        and developer notes. This reference covers everything from basic syntax to GitHub Flavored
        Markdown (GFM) extensions.
      </p>

      <h2>Headings</h2>
      <p>Use hash symbols to create headings. The number of hashes determines the heading level:</p>
      <pre><code>{`# Heading 1       → <h1>
## Heading 2      → <h2>
### Heading 3     → <h3>
#### Heading 4    → <h4>
##### Heading 5   → <h5>
###### Heading 6  → <h6>`}</code></pre>
      <p>
        Always add a space after the hash. Many parsers require it. Heading 1 should appear only
        once per document — it becomes the page title.
      </p>

      <h2>Text Formatting</h2>
      <pre><code>{`**bold**           → bold
*italic*           → italic
***bold italic***  → bold italic
~~strikethrough~~  → strikethrough (GFM)
\`inline code\`     → inline code`}</code></pre>
      <p>
        Use <code>_underscores_</code> as an alternative to asterisks for bold/italic — both work,
        but asterisks are more widely supported in all Markdown parsers.
      </p>

      <h2>Paragraphs and Line Breaks</h2>
      <p>
        A blank line between text creates a new paragraph. A single newline without a blank line is
        ignored and rendered as a space — this is intentional, making it easy to wrap long lines in
        source code.
      </p>
      <pre><code>{`Paragraph one.

Paragraph two.

Line one  ← two trailing spaces force a line break
Line two`}</code></pre>

      <h2>Lists</h2>
      <h3>Unordered Lists</h3>
      <pre><code>{`- Item one
- Item two
  - Nested item (2 spaces indent)
  - Another nested item
- Item three

* Also works with asterisks
+ Or plus signs`}</code></pre>

      <h3>Ordered Lists</h3>
      <pre><code>{`1. First
2. Second
3. Third

1. Markdown auto-numbers these
1. So all can be "1."
1. And it still renders correctly`}</code></pre>

      <h3>Task Lists (GFM)</h3>
      <pre><code>{`- [x] Completed task
- [ ] Incomplete task
- [ ] Another incomplete task`}</code></pre>

      <h2>Links and Images</h2>
      <pre><code>{`[Link text](https://example.com)
[Link with title](https://example.com "Hover text")

![Alt text](image.png)
![Alt text](image.png "Image title")

<!-- Reference-style links -->
[Link text][ref]
[ref]: https://example.com`}</code></pre>

      <h2>Code</h2>
      <h3>Inline Code</h3>
      <pre><code>{'Use backticks for `inline code`'}</code></pre>

      <h3>Code Blocks</h3>
      <pre><code>{`\`\`\`javascript
const greeting = 'Hello, world!'
console.log(greeting)
\`\`\`

\`\`\`python
def greet(name):
    return f"Hello, {name}!"
\`\`\`

\`\`\`bash
npm install && npm run build
\`\`\``}</code></pre>
      <p>
        Specifying the language after the opening backticks enables syntax highlighting in GitHub,
        VS Code, and most Markdown renderers. Common language identifiers: <code>js</code>,{' '}
        <code>ts</code>, <code>python</code>, <code>bash</code>, <code>sql</code>,{' '}
        <code>json</code>, <code>yaml</code>, <code>css</code>, <code>html</code>.
      </p>

      <h2>Blockquotes</h2>
      <pre><code>{`> This is a blockquote.
> It can span multiple lines.
>
> And multiple paragraphs.

> Nested blockquote:
>> Inner level
>>> Three levels deep`}</code></pre>

      <h2>Tables (GFM)</h2>
      <pre><code>{`| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

<!-- Alignment with colons -->
| Left     | Center   | Right    |
|:---------|:--------:|---------:|
| text     | text     | text     |`}</code></pre>
      <p>
        Table columns don't need to be perfectly aligned — Markdown only requires the pipe and dash
        structure. Alignment is optional and cosmetic in source code.
      </p>

      <h2>Horizontal Rules</h2>
      <pre><code>{`---
***
___`}</code></pre>
      <p>Three or more dashes, asterisks, or underscores create a horizontal rule.</p>

      <h2>HTML in Markdown</h2>
      <p>
        Most Markdown parsers allow raw HTML inline. This is useful for features Markdown doesn't
        support natively:
      </p>
      <pre><code>{`<details>
  <summary>Click to expand</summary>
  Hidden content here.
</details>

<kbd>Ctrl</kbd> + <kbd>C</kbd>

<mark>highlighted text</mark>`}</code></pre>

      <h2>Escaping Characters</h2>
      <p>
        Prefix a Markdown character with a backslash to render it literally:
      </p>
      <pre><code>{`\\*not italic\\*   → *not italic*
\\## not a heading → ## not a heading
\\[not a link\\]   → [not a link]`}</code></pre>

      <h2>GitHub Flavored Markdown (GFM) Extensions</h2>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Syntax</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Strikethrough</td>
            <td><code>~~text~~</code></td>
          </tr>
          <tr>
            <td>Task lists</td>
            <td><code>- [x] done</code></td>
          </tr>
          <tr>
            <td>Tables</td>
            <td><code>| col | col |</code></td>
          </tr>
          <tr>
            <td>Fenced code blocks</td>
            <td>Triple backticks with language</td>
          </tr>
          <tr>
            <td>Autolinks</td>
            <td>URLs are clickable without brackets</td>
          </tr>
          <tr>
            <td>Footnotes</td>
            <td><code>[^1]</code> and <code>[^1]: text</code></td>
          </tr>
        </tbody>
      </table>

      <h2>README Best Practices</h2>
      <p>A good README file typically includes:</p>
      <ol>
        <li><strong>Project title</strong> with a one-line description</li>
        <li><strong>Badges</strong> (build status, license, npm version)</li>
        <li><strong>Quick start</strong> — installation and a minimal working example</li>
        <li><strong>Usage</strong> — more complete examples and API reference</li>
        <li><strong>Configuration</strong> — options, environment variables</li>
        <li><strong>Contributing</strong> — how to file issues and submit PRs</li>
        <li><strong>License</strong> — always include</li>
      </ol>
    </article>
  )
}
