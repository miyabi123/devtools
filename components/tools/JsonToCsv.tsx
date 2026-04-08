'use client'

import { useState, useMemo } from 'react'

type Delimiter = ',' | ';' | '\t' | '|'

const DELIMITERS: { label: string; value: Delimiter }[] = [
  { label: 'Comma (,)', value: ',' },
  { label: 'Semicolon (;)', value: ';' },
  { label: 'Tab (\\t)', value: '\t' },
  { label: 'Pipe (|)', value: '|' },
]

const SAMPLE_JSON = `[
  {"name": "Alice", "age": 30, "city": "Bangkok", "active": true},
  {"name": "Bob", "age": 25, "city": "Chiang Mai", "active": false},
  {"name": "Carol", "age": 35, "city": "Phuket", "active": true}
]`

const SAMPLE_CSV = `name,age,city,active
Alice,30,Bangkok,true
Bob,25,Chiang Mai,false
Carol,35,Phuket,true`

function jsonToCsv(jsonStr: string, delimiter: Delimiter, includeHeader: boolean): string {
  const data = JSON.parse(jsonStr)
  if (!Array.isArray(data)) throw new Error('Input must be a JSON array of objects')
  if (data.length === 0) return ''
  const keys = Object.keys(data[0])
  const escape = (val: unknown) => {
    const str = val === null || val === undefined ? '' : String(val)
    if (str.includes(delimiter) || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }
  const rows = data.map(row => keys.map(k => escape(row[k])).join(delimiter))
  if (includeHeader) rows.unshift(keys.join(delimiter))
  return rows.join('\n')
}

function csvToJson(csvStr: string, delimiter: Delimiter, hasHeader: boolean): string {
  const lines = csvStr.trim().split('\n').map(l => l.trim()).filter(Boolean)
  if (lines.length === 0) return '[]'

  const parseRow = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
        else inQuotes = !inQuotes
      } else if (ch === delimiter && !inQuotes) {
        result.push(current); current = ''
      } else {
        current += ch
      }
    }
    result.push(current)
    return result
  }

  let headers: string[]
  let dataLines: string[]

  if (hasHeader) {
    headers = parseRow(lines[0])
    dataLines = lines.slice(1)
  } else {
    headers = parseRow(lines[0]).map((_, i) => `field${i + 1}`)
    dataLines = lines
  }

  const result = dataLines.map(line => {
    const values = parseRow(line)
    const obj: Record<string, unknown> = {}
    headers.forEach((h, i) => {
      const val = values[i] ?? ''
      if (val === 'true') obj[h] = true
      else if (val === 'false') obj[h] = false
      else if (val !== '' && !isNaN(Number(val))) obj[h] = Number(val)
      else obj[h] = val
    })
    return obj
  })

  return JSON.stringify(result, null, 2)
}

export default function JsonToCsv() {
  const [mode, setMode] = useState<'json-to-csv' | 'csv-to-json'>('json-to-csv')
  const [input, setInput] = useState('')
  const [delimiter, setDelimiter] = useState<Delimiter>(',')
  const [includeHeader, setIncludeHeader] = useState(true)
  const [hasHeader, setHasHeader] = useState(true)
  const [copied, setCopied] = useState(false)

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' }
    try {
      if (mode === 'json-to-csv') {
        return { output: jsonToCsv(input, delimiter, includeHeader), error: '' }
      } else {
        return { output: csvToJson(input, delimiter, hasHeader), error: '' }
      }
    } catch (e: unknown) {
      return { output: '', error: e instanceof Error ? e.message : 'Conversion failed' }
    }
  }, [input, mode, delimiter, includeHeader, hasHeader])

  const loadSample = () => {
    setInput(mode === 'json-to-csv' ? SAMPLE_JSON : SAMPLE_CSV)
  }

  const clear = () => setInput('')

  const copy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true); setTimeout(() => setCopied(false), 1500)
  }

  const download = () => {
    if (!output) return
    const ext = mode === 'json-to-csv' ? 'csv' : 'json'
    const mime = mode === 'json-to-csv' ? 'text/csv' : 'application/json'
    const blob = new Blob([output], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `converted.${ext}`; a.click()
    URL.revokeObjectURL(url)
  }

  const rowCount = output
    ? mode === 'json-to-csv'
      ? output.split('\n').length - (includeHeader ? 1 : 0)
      : JSON.parse(output).length
    : 0

  return (
    <div className="space-y-4">

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 6, overflow: 'hidden' }}>
          {([
            { value: 'json-to-csv', label: 'JSON → CSV' },
            { value: 'csv-to-json', label: 'CSV → JSON' },
          ] as const).map(m => (
            <button key={m.value} onClick={() => { setMode(m.value); setInput('') }} style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 16px',
              background: mode === m.value ? '#1a1917' : 'transparent',
              color: mode === m.value ? '#f8f7f4' : '#6b6960',
              border: 'none', cursor: 'pointer', transition: 'all .15s',
            }}>{m.label}</button>
          ))}
        </div>

        {/* Delimiter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>delimiter:</span>
          <select value={delimiter} onChange={e => setDelimiter(e.target.value as Delimiter)} style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, padding: '5px 10px',
            background: '#ffffff', color: '#1a1917',
            border: '0.5px solid #c8c6c0', borderRadius: 6, outline: 'none', cursor: 'pointer',
          }}>
            {DELIMITERS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>

        {/* Options */}
        {mode === 'json-to-csv' ? (
          <label style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
            <input type="checkbox" checked={includeHeader} onChange={e => setIncludeHeader(e.target.checked)} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960' }}>include header row</span>
          </label>
        ) : (
          <label style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
            <input type="checkbox" checked={hasHeader} onChange={e => setHasHeader(e.target.checked)} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960' }}>first row is header</span>
          </label>
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
              input · {mode === 'json-to-csv' ? 'json array' : 'csv data'}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>
              {input.length > 0 ? `${input.length} chars` : ''}
            </span>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={mode === 'json-to-csv' ? '[{"key": "value"}, ...]' : 'name,age,city\nAlice,30,Bangkok'}
            style={{
              width: '100%', height: 280, padding: '12px',
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
              output · {mode === 'json-to-csv' ? 'csv' : 'json'}
              {output && !error && <span style={{ color: '#a8a69e', marginLeft: 6 }}>{rowCount} rows</span>}
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
              width: '100%', height: 280, padding: '12px', margin: 0,
              fontFamily: 'var(--font-mono)', fontSize: 12,
              color: output ? '#1a1917' : '#a8a69e',
              background: 'transparent', overflow: 'auto',
              lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
            }}>
              {output || `${mode === 'json-to-csv' ? 'CSV' : 'JSON'} output will appear here...`}
            </pre>
          )}
        </div>
      </div>

      {/* Status */}
      {output && !error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1D9E75' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#085041' }}>
            converted {rowCount} rows successfully
          </span>
        </div>
      )}

    </div>
  )
}