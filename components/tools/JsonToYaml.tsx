'use client'

import { useState, useMemo } from 'react'

// Simple YAML serializer
function jsonToYaml(obj: unknown, indent = 0): string {
  const pad = '  '.repeat(indent)
  if (obj === null) return 'null'
  if (obj === undefined) return 'null'
  if (typeof obj === 'boolean') return obj ? 'true' : 'false'
  if (typeof obj === 'number') return String(obj)
  if (typeof obj === 'string') {
    if (obj === '') return "''"
    if (/[\n\r:#{}\[\],&*?|<>=!%@`]/.test(obj) || obj.trim() !== obj || /^(true|false|null|yes|no|on|off)$/i.test(obj)) {
      return `'${obj.replace(/'/g, "''")}'`
    }
    return obj
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]'
    return obj.map(item => {
      const val = jsonToYaml(item, indent + 1)
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        const lines = val.split('\n')
        return `${pad}- ${lines[0]}\n${lines.slice(1).map(l => `${pad}  ${l}`).join('\n')}`
      }
      return `${pad}- ${val}`
    }).join('\n')
  }
  if (typeof obj === 'object') {
    const entries = Object.entries(obj as Record<string, unknown>)
    if (entries.length === 0) return '{}'
    return entries.map(([k, v]) => {
      const key = /[:#{}[\],&*?|<>=!%@`\s]/.test(k) ? `'${k}'` : k
      if (v !== null && typeof v === 'object') {
        return `${pad}${key}:\n${jsonToYaml(v, indent + 1)}`
      }
      return `${pad}${key}: ${jsonToYaml(v, indent)}`
    }).join('\n')
  }
  return String(obj)
}

// Simple YAML parser
function yamlToJson(yaml: string): unknown {
  const lines = yaml.split('\n')
  return parseBlock(lines, 0, 0).value
}

function getIndent(line: string): number {
  return line.length - line.trimStart().length
}

function parseValue(val: string): unknown {
  const v = val.trim()
  if (v === 'null' || v === '~') return null
  if (v === 'true' || v === 'yes' || v === 'on') return true
  if (v === 'false' || v === 'no' || v === 'off') return false
  if (v === '{}') return {}
  if (v === '[]') return []
  if (!isNaN(Number(v)) && v !== '') return Number(v)
  if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) {
    return v.slice(1, -1).replace(/''/g, "'")
  }
  return v
}

function parseBlock(lines: string[], startLine: number, baseIndent: number): { value: unknown; nextLine: number } {
  const nonEmpty = lines.slice(startLine).findIndex(l => l.trim() && !l.trim().startsWith('#'))
  if (nonEmpty === -1) return { value: null, nextLine: lines.length }

  const firstLineIdx = startLine + nonEmpty
  const firstLine = lines[firstLineIdx]
  const firstIndent = getIndent(firstLine)
  const trimmed = firstLine.trim()

  // Array
  if (trimmed.startsWith('- ') || trimmed === '-') {
    const arr: unknown[] = []
    let i = firstLineIdx
    while (i < lines.length) {
      const line = lines[i]
      if (!line.trim() || line.trim().startsWith('#')) { i++; continue }
      if (getIndent(line) < firstIndent) break
      if (getIndent(line) === firstIndent && line.trim().startsWith('- ')) {
        const rest = line.trim().slice(2).trim()
        if (rest) {
          if (rest.includes(': ')) {
            const result = parseBlock(lines, i, firstIndent + 2)
            arr.push(result.value)
            i = result.nextLine
          } else {
            arr.push(parseValue(rest))
            i++
          }
        } else {
          const result = parseBlock(lines, i + 1, firstIndent + 2)
          arr.push(result.value)
          i = result.nextLine
        }
      } else {
        i++
      }
    }
    return { value: arr, nextLine: i }
  }

  // Object
  if (trimmed.includes(': ') || trimmed.endsWith(':')) {
    const obj: Record<string, unknown> = {}
    let i = firstLineIdx
    while (i < lines.length) {
      const line = lines[i]
      if (!line.trim() || line.trim().startsWith('#')) { i++; continue }
      if (getIndent(line) < firstIndent) break
      if (getIndent(line) === firstIndent) {
        const colonIdx = line.indexOf(':')
        if (colonIdx === -1) { i++; continue }
        const rawKey = line.slice(firstIndent, colonIdx).trim().replace(/^['"]|['"]$/g, '')
        const rawVal = line.slice(colonIdx + 1).trim()
        if (rawVal && rawVal !== '|' && rawVal !== '>') {
          obj[rawKey] = parseValue(rawVal)
          i++
        } else {
          const result = parseBlock(lines, i + 1, firstIndent + 2)
          obj[rawKey] = result.value
          i = result.nextLine
        }
      } else {
        i++
      }
    }
    return { value: obj, nextLine: i }
  }

  return { value: parseValue(trimmed), nextLine: firstLineIdx + 1 }
}

const SAMPLE_JSON = `{
  "name": "freeutil",
  "version": "1.0.0",
  "config": {
    "port": 3000,
    "debug": true,
    "hosts": ["localhost", "freeutil.app"]
  },
  "features": ["tools", "seo", "ads"]
}`

const SAMPLE_YAML = `name: freeutil
version: 1.0.0
config:
  port: 3000
  debug: true
  hosts:
    - localhost
    - freeutil.app
features:
  - tools
  - seo
  - ads`

export default function JsonToYaml() {
  const [mode, setMode] = useState<'json-to-yaml' | 'yaml-to-json'>('json-to-yaml')
  const [input, setInput] = useState('')
  const [indent, setIndent] = useState(2)
  const [copied, setCopied] = useState(false)

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' }
    try {
      if (mode === 'json-to-yaml') {
        const parsed = JSON.parse(input)
        return { output: jsonToYaml(parsed, 0), error: '' }
      } else {
        const parsed = yamlToJson(input)
        return { output: JSON.stringify(parsed, null, indent), error: '' }
      }
    } catch (e: unknown) {
      return { output: '', error: e instanceof Error ? e.message : 'Conversion failed' }
    }
  }, [input, mode, indent])

  const loadSample = () => setInput(mode === 'json-to-yaml' ? SAMPLE_JSON : SAMPLE_YAML)
  const clear = () => setInput('')

  const copy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true); setTimeout(() => setCopied(false), 1500)
  }

  const download = () => {
    if (!output) return
    const ext = mode === 'json-to-yaml' ? 'yaml' : 'json'
    const mime = mode === 'json-to-yaml' ? 'text/yaml' : 'application/json'
    const blob = new Blob([output], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `converted.${ext}`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">

      {/* Mode + options */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 6, overflow: 'hidden' }}>
          {([
            { value: 'json-to-yaml', label: 'JSON → YAML' },
            { value: 'yaml-to-json', label: 'YAML → JSON' },
          ] as const).map(m => (
            <button key={m.value} onClick={() => { setMode(m.value); setInput('') }} style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 16px',
              background: mode === m.value ? '#1a1917' : 'transparent',
              color: mode === m.value ? '#f8f7f4' : '#6b6960',
              border: 'none', cursor: 'pointer', transition: 'all .15s',
            }}>{m.label}</button>
          ))}
        </div>

        {mode === 'yaml-to-json' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>indent:</span>
            {[2, 4].map(n => (
              <button key={n} onClick={() => setIndent(n)} style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 10px',
                background: indent === n ? '#1a1917' : '#ffffff',
                color: indent === n ? '#f8f7f4' : '#6b6960',
                border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
              }}>{n}</button>
            ))}
          </div>
        )}

        <button onClick={loadSample} style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, padding: '5px 12px',
          background: 'transparent', color: '#6b6960',
          border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
        }}>load sample</button>

        <button onClick={clear} style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, padding: '5px 12px',
          background: 'transparent', color: '#6b6960',
          border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
        }}>clear</button>
      </div>

      {/* IO Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        {/* Input */}
        <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '0.5px solid #c8c6c0' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>
              input · {mode === 'json-to-yaml' ? 'json' : 'yaml'}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>
              {input.length > 0 ? `${input.length} chars` : ''}
            </span>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={mode === 'json-to-yaml' ? '{"key": "value"}' : 'key: value'}
            style={{
              width: '100%', height: 300, padding: '12px',
              fontFamily: 'var(--font-mono)', fontSize: 12, color: '#1a1917',
              background: 'transparent', border: 'none', outline: 'none',
              resize: 'none', lineHeight: 1.7,
            }}
          />
        </div>

        {/* Output */}
        <div style={{ background: '#ffffff', border: `1px solid ${error ? '#f09595' : '#c8c6c0'}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '0.5px solid #c8c6c0' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>
              output · {mode === 'json-to-yaml' ? 'yaml' : 'json'}
            </span>
            {output && (
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={copy} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 8px',
                  background: 'transparent', color: '#6b6960',
                  border: '0.5px solid #c8c6c0', borderRadius: 4, cursor: 'pointer',
                }}>{copied ? 'copied!' : 'copy'}</button>
                <button onClick={download} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 8px',
                  background: '#1a1917', color: '#f8f7f4',
                  border: 'none', borderRadius: 4, cursor: 'pointer',
                }}>download</button>
              </div>
            )}
          </div>

          {error ? (
            <div style={{ padding: 12 }}>
              <div style={{ background: '#fcebeb', border: '0.5px solid #f09595', borderRadius: 6, padding: '10px 14px' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a32d2d', margin: 0 }}>{error}</p>
              </div>
            </div>
          ) : (
            <pre style={{
              width: '100%', height: 300, padding: '12px', margin: 0,
              fontFamily: 'var(--font-mono)', fontSize: 12,
              color: output ? '#1a1917' : '#a8a69e',
              background: 'transparent', overflow: 'auto',
              lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
            }}>
              {output || `${mode === 'json-to-yaml' ? 'YAML' : 'JSON'} output will appear here...`}
            </pre>
          )}
        </div>
      </div>

      {/* Status */}
      {output && !error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1D9E75' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#085041' }}>
            converted successfully · {output.length} chars
          </span>
        </div>
      )}

      {/* Info */}
      <div style={{ background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 8, padding: '12px 14px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: '0 0 8px' }}>YAML USE CASES</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { tool: 'Kubernetes', desc: 'Pod, Deployment, Service manifests' },
            { tool: 'Docker Compose', desc: 'docker-compose.yml configuration' },
            { tool: 'GitHub Actions', desc: '.github/workflows/*.yml pipelines' },
            { tool: 'Ansible', desc: 'Playbooks and inventory files' },
          ].map(r => (
            <div key={r.tool} style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#3c3489', minWidth: 110 }}>{r.tool}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6b6960' }}>{r.desc}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}