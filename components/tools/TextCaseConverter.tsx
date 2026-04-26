'use client'

import { useState, useCallback } from 'react'

// ── Tokenizer — splits any input format into words ──────────────
function tokenize(text: string): string[] {
  // handle camelCase / PascalCase splits first
  const spaced = text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
  // then split on any non-alphanumeric (spaces, underscores, hyphens, dots)
  return spaced
    .split(/[\s\-_./\\|]+/)
    .map(w => w.trim())
    .filter(Boolean)
}

// ── Converters ──────────────────────────────────────────────────
function toCamel(words: string[]): string {
  return words
    .map((w, i) => i === 0
      ? w.toLowerCase()
      : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    ).join('')
}

function toPascal(words: string[]): string {
  return words
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('')
}

function toSnake(words: string[]): string {
  return words.map(w => w.toLowerCase()).join('_')
}

function toKebab(words: string[]): string {
  return words.map(w => w.toLowerCase()).join('-')
}

function toScreaming(words: string[]): string {
  return words.map(w => w.toUpperCase()).join('_')
}

function toTitle(words: string[]): string {
  const minors = new Set(['a','an','the','and','but','or','for','nor','on','at','to','by','in','of','up','as'])
  return words
    .map((w, i) =>
      i === 0 || !minors.has(w.toLowerCase())
        ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        : w.toLowerCase()
    ).join(' ')
}

function toSentence(words: string[]): string {
  if (!words.length) return ''
  const joined = words.map(w => w.toLowerCase()).join(' ')
  return joined.charAt(0).toUpperCase() + joined.slice(1)
}

function toLower(words: string[]): string {
  return words.map(w => w.toLowerCase()).join(' ')
}

function toUpper(words: string[]): string {
  return words.map(w => w.toUpperCase()).join(' ')
}

function toDot(words: string[]): string {
  return words.map(w => w.toLowerCase()).join('.')
}

function toPath(words: string[]): string {
  return words.map(w => w.toLowerCase()).join('/')
}

// ── Case definitions ─────────────────────────────────────────────
const CASES = [
  { key: 'camel',     label: 'camelCase',           fn: toCamel,     example: 'myVariableName'   },
  { key: 'pascal',    label: 'PascalCase',           fn: toPascal,    example: 'MyClassName'       },
  { key: 'snake',     label: 'snake_case',           fn: toSnake,     example: 'my_variable_name'  },
  { key: 'kebab',     label: 'kebab-case',           fn: toKebab,     example: 'my-variable-name'  },
  { key: 'screaming', label: 'SCREAMING_SNAKE_CASE', fn: toScreaming, example: 'MY_VARIABLE_NAME'  },
  { key: 'title',     label: 'Title Case',           fn: toTitle,     example: 'My Variable Name'  },
  { key: 'sentence',  label: 'Sentence case',        fn: toSentence,  example: 'My variable name'  },
  { key: 'lower',     label: 'lowercase',            fn: toLower,     example: 'my variable name'  },
  { key: 'upper',     label: 'UPPERCASE',            fn: toUpper,     example: 'MY VARIABLE NAME'  },
  { key: 'dot',       label: 'dot.case',             fn: toDot,       example: 'my.variable.name'  },
  { key: 'path',      label: 'path/case',            fn: toPath,      example: 'my/variable/name'  },
]

// ── Sub-components (all top-level) ──────────────────────────────
function CopyButton({ text, disabled }: { text: string; disabled?: boolean }) {
  const [copied, setCopied] = useState(false)
  const handle = useCallback(() => {
    if (!text || disabled) return
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [text, disabled])

  return (
    <button
      onClick={handle}
      disabled={disabled}
      style={{
        fontFamily: 'var(--font-sans)', fontSize: 11,
        padding: '3px 10px', borderRadius: 5,
        cursor: disabled ? 'default' : 'pointer',
        background: copied ? '#e1f5ee' : '#ffffff',
        color: copied ? '#085041' : (disabled ? '#c8c6c0' : '#6b6960'),
        border: copied ? '0.5px solid #1D9E75' : '0.5px solid #c8c6c0',
        transition: 'all 0.15s', whiteSpace: 'nowrap', flexShrink: 0,
      }}
    >
      {copied ? 'Copied ✓' : 'Copy'}
    </button>
  )
}

function CaseRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      gap: 10, padding: '9px 14px',
      borderBottom: '1px solid #f0efec',
    }}>
      {/* label */}
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 11,
        color: '#a8a69e', flexShrink: 0, width: 150,
      }}>
        {label}
      </span>

      {/* value */}
      <code style={{
        fontFamily: 'var(--font-mono)', fontSize: 13,
        color: value ? '#1a1917' : '#c8c6c0',
        flex: 1, minWidth: 0,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {value || '—'}
      </code>

      <CopyButton text={value} disabled={!value} />
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────
export default function TextCaseConverter() {
  const [input, setInput] = useState('')
  const [copiedAll, setCopiedAll] = useState(false)

  const words   = tokenize(input)
  const isEmpty = words.length === 0

  const results = CASES.map(c => ({
    ...c,
    value: isEmpty ? '' : c.fn(words),
  }))

  const handleCopyAll = useCallback(() => {
    if (isEmpty) return
    const text = results.map(r => `${r.label}:\n${r.value}`).join('\n\n')
    navigator.clipboard.writeText(text)
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 1500)
  }, [results, isEmpty])

  const handleClear = useCallback(() => setInput(''), [])

  return (
    <div className="space-y-4">

      {/* Input */}
      <div style={{
        background: '#ffffff', border: '1.5px solid #1a1917',
        borderRadius: 10, overflow: 'hidden',
      }}>
        <div style={{
          padding: '10px 14px 6px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: '#a8a69e', letterSpacing: '0.06em', margin: 0,
          }}>
            INPUT TEXT
          </p>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e',
          }}>
            {words.length} word{words.length !== 1 ? 's' : ''}
          </span>
        </div>

        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Paste any text, camelCase, snake_case, or sentence here…"
          rows={3}
          style={{
            width: '100%', padding: '4px 14px 12px',
            border: 'none', outline: 'none', resize: 'vertical',
            fontFamily: 'var(--font-mono)', fontSize: 14,
            color: '#1a1917', background: 'transparent',
            boxSizing: 'border-box', lineHeight: 1.6,
          }}
        />

        {/* bottom bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '8px 14px', borderTop: '1px solid #f0efec', background: '#fafaf8',
        }}>
          <button
            onClick={handleClear}
            disabled={!input}
            style={{
              fontFamily: 'var(--font-sans)', fontSize: 12,
              color: input ? '#6b6960' : '#c8c6c0',
              background: 'none', border: 'none',
              cursor: input ? 'pointer' : 'default', padding: 0,
            }}
          >
            Clear
          </button>

          <button
            onClick={handleCopyAll}
            disabled={isEmpty}
            style={{
              fontFamily: 'var(--font-sans)', fontSize: 12,
              padding: '3px 12px', borderRadius: 5,
              cursor: isEmpty ? 'default' : 'pointer',
              background: copiedAll ? '#e1f5ee' : '#ffffff',
              color: copiedAll ? '#085041' : (isEmpty ? '#c8c6c0' : '#6b6960'),
              border: copiedAll ? '0.5px solid #1D9E75' : '0.5px solid #c8c6c0',
              transition: 'all 0.15s',
            }}
          >
            {copiedAll ? 'Copied all ✓' : 'Copy all'}
          </button>
        </div>
      </div>

      {/* Results */}
      <div style={{
        background: '#ffffff', border: '1px solid #c8c6c0',
        borderRadius: 10, overflow: 'hidden',
      }}>
        <div style={{
          padding: '10px 14px', borderBottom: '1px solid #f0efec', background: '#fafaf8',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: '#a8a69e', letterSpacing: '0.06em', margin: 0,
          }}>
            ALL FORMATS
          </p>
          {!isEmpty && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>
              {results.length} formats
            </span>
          )}
        </div>

        {results.map((r, i) => (
          <CaseRow
            key={r.key}
            label={r.label}
            value={r.value}
            muted={isEmpty}
          />
        ))}
      </div>

      {/* Examples tip */}
      {isEmpty && (
        <div style={{
          padding: '12px 14px', borderRadius: 8,
          background: '#eeedfe', border: '1px solid #8b7fd4',
        }}>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: 12,
            color: '#3c3489', margin: 0, lineHeight: 1.6,
          }}>
            <strong>ลองพิมพ์:</strong>{' '}
            <code style={{ fontFamily: 'var(--font-mono)' }}>my variable name</code>,{' '}
            <code style={{ fontFamily: 'var(--font-mono)' }}>myVariableName</code>,{' '}
            <code style={{ fontFamily: 'var(--font-mono)' }}>my_variable_name</code>{' '}
            — แปลงได้ทุกรูปแบบครับ
          </p>
        </div>
      )}

    </div>
  )
}