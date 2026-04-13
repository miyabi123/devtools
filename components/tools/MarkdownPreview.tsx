'use client'

import { useState, useMemo } from 'react'

// ── Simple Markdown Parser ───────────────────────────────────────
function parseMarkdown(md: string): string {
  let html = md

  // Escape HTML first
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // Code blocks (``` ... ```)
  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
    `<pre><code class="lang-${lang}">${code.trim()}</code></pre>`)

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  // Headings
  html = html.replace(/^###### (.+)$/gm, '<h6>$1</h6>')
  html = html.replace(/^##### (.+)$/gm, '<h5>$1</h5>')
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>')
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>')

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr />')

  // Bold + Italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>')

  // Tables
  html = html.replace(/(\|.+\|\n\|[-| :]+\|\n(?:\|.+\|\n?)+)/g, (table) => {
    const rows = table.trim().split('\n')
    const headers = rows[0].split('|').filter(c => c.trim()).map(c => `<th>${c.trim()}</th>`).join('')
    const bodyRows = rows.slice(2).map(row => {
      const cells = row.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('')
      return `<tr>${cells}</tr>`
    }).join('')
    return `<table><thead><tr>${headers}</tr></thead><tbody>${bodyRows}</tbody></table>`
  })

  // Unordered lists
  html = html.replace(/(^[-*+] .+(\n|$))+/gm, (block) => {
    const items = block.trim().split('\n').map(l => `<li>${l.replace(/^[-*+] /, '')}</li>`).join('')
    return `<ul>${items}</ul>`
  })

  // Ordered lists
  html = html.replace(/(^\d+\. .+(\n|$))+/gm, (block) => {
    const items = block.trim().split('\n').map(l => `<li>${l.replace(/^\d+\. /, '')}</li>`).join('')
    return `<ol>${items}</ol>`
  })

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')

  // Paragraphs — wrap lines not already wrapped
  html = html.replace(/^(?!<[a-z]|$)(.+)$/gm, '<p>$1</p>')

  // Clean up extra newlines
  html = html.replace(/\n{2,}/g, '\n')

  return html
}

const SAMPLE = `# Welcome to Markdown Preview

Write **Markdown** on the left, see the *rendered* preview here.

## Features

- Real-time preview
- Supports **bold**, *italic*, ~~strikethrough~~
- Code blocks and \`inline code\`
- Tables, lists, blockquotes

## Code Example

\`\`\`javascript
function hello(name) {
  return \`Hello, \${name}!\`
}
\`\`\`

## Table

| Tool | Category | Status |
|------|----------|--------|
| JWT Decoder | Dev | ✅ Ready |
| Markdown Preview | Dev | ✅ Ready |
| Thai Tax Calculator | Thai | ✅ Ready |

## Blockquote

> The best tool is the one you actually use.

---

[freeutil.app](https://freeutil.app) — Free tools for everyone.
`

type ViewMode = 'split' | 'edit' | 'preview'

export default function MarkdownPreview() {
  const [md, setMd] = useState(SAMPLE)
  const [mode, setMode] = useState<ViewMode>('split')
  const [copied, setCopied] = useState(false)

  const html = useMemo(() => parseMarkdown(md), [md])

  const copyHtml = async () => {
    await navigator.clipboard.writeText(html)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const wordCount = md.trim() === '' ? 0 : md.trim().split(/\s+/).length
  const charCount = md.length

  const btnStyle = (active: boolean) => ({
    fontFamily: 'var(--font-mono)' as const,
    fontSize: 11,
    padding: '5px 12px',
    background: active ? '#1a1917' : 'transparent',
    color: active ? '#f8f7f4' : '#6b6960',
    border: 'none',
    cursor: 'pointer',
  })

  return (
    <div className="space-y-3">

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        {/* Mode toggle */}
        <div style={{ display: 'flex', background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 6, overflow: 'hidden' }}>
          <button style={btnStyle(mode === 'edit')} onClick={() => setMode('edit')}>✏️ Edit</button>
          <button style={btnStyle(mode === 'split')} onClick={() => setMode('split')}>⬛ Split</button>
          <button style={btnStyle(mode === 'preview')} onClick={() => setMode('preview')}>👁 Preview</button>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>
            {wordCount.toLocaleString()} words · {charCount.toLocaleString()} chars
          </span>
          <button onClick={copyHtml} style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 10px',
            background: copied ? '#e1f5ee' : '#ffffff',
            color: copied ? '#085041' : '#6b6960',
            border: `0.5px solid ${copied ? '#1D9E75' : '#c8c6c0'}`,
            borderRadius: 5, cursor: 'pointer',
          }}>{copied ? '✓ Copied HTML' : 'Copy HTML'}</button>
          <button onClick={() => setMd('')} style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 10px',
            background: '#ffffff', color: '#a32d2d',
            border: '0.5px solid #f09595', borderRadius: 5, cursor: 'pointer',
          }}>Clear</button>
          <button onClick={() => setMd(SAMPLE)} style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 10px',
            background: '#ffffff', color: '#6b6960',
            border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
          }}>Sample</button>
        </div>
      </div>

      {/* Editor / Preview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: mode === 'split' ? '1fr 1fr' : '1fr',
        gap: 8,
        minHeight: 480,
      }}>
        {/* Editor */}
        {(mode === 'edit' || mode === 'split') && (
          <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '6px 12px', background: '#f8f7f4', borderBottom: '0.5px solid #e8e6e0' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em' }}>MARKDOWN</span>
            </div>
            <textarea
              value={md}
              onChange={e => setMd(e.target.value)}
              placeholder="# Start writing Markdown here..."
              style={{
                flex: 1, padding: '14px', border: 'none', outline: 'none',
                resize: 'none', fontFamily: 'var(--font-mono)', fontSize: 13,
                color: '#1a1917', background: '#ffffff', lineHeight: 1.7,
                minHeight: 440,
              }}
            />
          </div>
        )}

        {/* Preview */}
        {(mode === 'preview' || mode === 'split') && (
          <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '6px 12px', background: '#f8f7f4', borderBottom: '0.5px solid #e8e6e0' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em' }}>PREVIEW</span>
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: html }}
              style={{
                flex: 1, padding: '16px', overflowY: 'auto', background: '#ffffff',
                fontFamily: 'var(--font-sans)', fontSize: 14, color: '#1a1917',
                lineHeight: 1.7, minHeight: 440,
              }}
              className="markdown-preview"
            />
          </div>
        )}
      </div>

      {/* CSS for markdown preview */}
      <style>{`
        .markdown-preview h1 { font-size: 24px; font-weight: 700; margin: 16px 0 8px; color: #1a1917; border-bottom: 1.5px solid #e8e6e0; padding-bottom: 6px; }
        .markdown-preview h2 { font-size: 20px; font-weight: 600; margin: 14px 0 6px; color: #1a1917; border-bottom: 0.5px solid #e8e6e0; padding-bottom: 4px; }
        .markdown-preview h3 { font-size: 17px; font-weight: 600; margin: 12px 0 6px; color: #1a1917; }
        .markdown-preview h4, .markdown-preview h5, .markdown-preview h6 { font-size: 14px; font-weight: 600; margin: 10px 0 4px; color: #1a1917; }
        .markdown-preview p { margin: 0 0 10px; }
        .markdown-preview strong { font-weight: 700; color: #1a1917; }
        .markdown-preview em { font-style: italic; }
        .markdown-preview del { text-decoration: line-through; color: #a8a69e; }
        .markdown-preview code { font-family: var(--font-mono); font-size: 12px; background: #f0eefd; color: #3c3489; padding: 2px 5px; border-radius: 4px; }
        .markdown-preview pre { background: #1a1917; color: #f8f7f4; padding: 14px; border-radius: 8px; overflow-x: auto; margin: 10px 0; }
        .markdown-preview pre code { background: transparent; color: inherit; padding: 0; font-size: 13px; }
        .markdown-preview ul { padding-left: 20px; margin: 0 0 10px; }
        .markdown-preview ol { padding-left: 20px; margin: 0 0 10px; }
        .markdown-preview li { margin: 3px 0; }
        .markdown-preview blockquote { border-left: 3px solid #8b7fd4; margin: 10px 0; padding: 8px 14px; background: #eeedfe; color: #3c3489; border-radius: 0 6px 6px 0; }
        .markdown-preview table { border-collapse: collapse; width: 100%; margin: 10px 0; font-size: 13px; }
        .markdown-preview th { background: #f8f7f4; padding: 8px 12px; text-align: left; border: 0.5px solid #c8c6c0; font-weight: 600; }
        .markdown-preview td { padding: 7px 12px; border: 0.5px solid #e8e6e0; }
        .markdown-preview tr:nth-child(even) td { background: #fafaf9; }
        .markdown-preview a { color: #3c3489; text-decoration: underline; }
        .markdown-preview hr { border: none; border-top: 1px solid #e8e6e0; margin: 16px 0; }
        .markdown-preview img { max-width: 100%; border-radius: 6px; }
      `}</style>
    </div>
  )
}