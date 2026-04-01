'use client'

import { useState, useEffect } from 'react'

interface CronPart {
  value: string
  label: string
  min: number
  max: number
  placeholder: string
}

const PARTS: CronPart[] = [
  { value: '*', label: 'minute', min: 0, max: 59, placeholder: '0-59' },
  { value: '*', label: 'hour', min: 0, max: 23, placeholder: '0-23' },
  { value: '*', label: 'day of month', min: 1, max: 31, placeholder: '1-31' },
  { value: '*', label: 'month', min: 1, max: 12, placeholder: '1-12' },
  { value: '*', label: 'day of week', min: 0, max: 6, placeholder: '0-6' },
]

const PRESETS = [
  { label: 'Every minute', cron: '* * * * *' },
  { label: 'Every hour', cron: '0 * * * *' },
  { label: 'Every day at midnight', cron: '0 0 * * *' },
  { label: 'Every day at noon', cron: '0 12 * * *' },
  { label: 'Every Monday at 9am', cron: '0 9 * * 1' },
  { label: 'Every weekday at 8am', cron: '0 8 * * 1-5' },
  { label: 'Every Sunday at midnight', cron: '0 0 * * 0' },
  { label: 'Every 1st of month', cron: '0 0 1 * *' },
  { label: 'Every 15 minutes', cron: '*/15 * * * *' },
  { label: 'Twice a day', cron: '0 9,18 * * *' },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function parseCronPart(part: string, min: number, max: number): number[] {
  const values: number[] = []
  if (part === '*') {
    for (let i = min; i <= max; i++) values.push(i)
    return values
  }
  for (const segment of part.split(',')) {
    if (segment.includes('/')) {
      const [range, step] = segment.split('/')
      const stepNum = parseInt(step)
      const [start, end] = range === '*' ? [min, max] : range.split('-').map(Number)
      for (let i = start; i <= (end ?? max); i += stepNum) values.push(i)
    } else if (segment.includes('-')) {
      const [start, end] = segment.split('-').map(Number)
      for (let i = start; i <= end; i++) values.push(i)
    } else {
      const n = parseInt(segment)
      if (!isNaN(n)) values.push(n)
    }
  }
  return [...new Set(values)].filter(v => v >= min && v <= max).sort((a, b) => a - b)
}

function getNextRuns(cron: string, count: number): Date[] {
  const parts = cron.trim().split(/\s+/)
  if (parts.length !== 5) return []
  try {
    const [minPart, hourPart, domPart, monPart, dowPart] = parts
    const minutes = parseCronPart(minPart, 0, 59)
    const hours = parseCronPart(hourPart, 0, 23)
    const doms = parseCronPart(domPart, 1, 31)
    const months = parseCronPart(monPart, 1, 12)
    const dows = parseCronPart(dowPart, 0, 6)
    const results: Date[] = []
    const now = new Date()
    const d = new Date(now)
    d.setSeconds(0, 0)
    d.setMinutes(d.getMinutes() + 1)
    for (let i = 0; i < 50000 && results.length < count; i++) {
      if (months.includes(d.getMonth() + 1) &&
          doms.includes(d.getDate()) &&
          dows.includes(d.getDay()) &&
          hours.includes(d.getHours()) &&
          minutes.includes(d.getMinutes())) {
        results.push(new Date(d))
      }
      d.setMinutes(d.getMinutes() + 1)
    }
    return results
  } catch { return [] }
}

function describeCron(cron: string): string {
  const parts = cron.trim().split(/\s+/)
  if (parts.length !== 5) return 'Invalid cron expression'
  const [min, hour, dom, mon, dow] = parts
  if (cron === '* * * * *') return 'Every minute'
  if (min === '0' && hour === '*' && dom === '*' && mon === '*' && dow === '*') return 'Every hour at minute 0'
  if (min === '0' && hour === '0' && dom === '*' && mon === '*' && dow === '*') return 'Every day at midnight'
  if (min.startsWith('*/')) return `Every ${min.slice(2)} minutes`
  const parts2 = []
  if (min !== '*') parts2.push(`at minute ${min}`)
  if (hour !== '*') parts2.push(`hour ${hour}`)
  if (dom !== '*') parts2.push(`on day ${dom} of month`)
  if (mon !== '*') {
    const m = parseInt(mon)
    parts2.push(`in ${!isNaN(m) ? MONTHS[m - 1] : mon}`)
  }
  if (dow !== '*') {
    const d = parseInt(dow)
    parts2.push(`on ${!isNaN(d) ? DAYS[d] : dow}`)
  }
  return parts2.length ? `Runs ${parts2.join(', ')}` : 'Custom schedule'
}

export default function CronBuilder() {
  const [parts, setParts] = useState(['*', '*', '*', '*', '*'])
  const [manualInput, setManualInput] = useState('* * * * *')
  const [nextRuns, setNextRuns] = useState<Date[]>([])
  const [copied, setCopied] = useState(false)
  const [inputMode, setInputMode] = useState<'visual' | 'manual'>('visual')

  const cron = parts.join(' ')

  useEffect(() => {
    const runs = getNextRuns(inputMode === 'visual' ? cron : manualInput, 8)
    setNextRuns(runs)
  }, [cron, manualInput, inputMode])

  const setPart = (index: number, value: string) => {
    const next = [...parts]
    next[index] = value || '*'
    setParts(next)
    setManualInput(next.join(' '))
  }

  const applyPreset = (cronStr: string) => {
    const p = cronStr.split(' ')
    setParts(p)
    setManualInput(cronStr)
  }

  const applyManual = (val: string) => {
    setManualInput(val)
    const p = val.trim().split(/\s+/)
    if (p.length === 5) setParts(p)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(inputMode === 'visual' ? cron : manualInput)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const activeCron = inputMode === 'visual' ? cron : manualInput
  const description = describeCron(activeCron)

  return (
    <div className="space-y-4">

      {/* Mode toggle */}
      <div className="flex items-center gap-2">
        <div style={{ display: 'flex', background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 6, overflow: 'hidden' }}>
          {(['visual', 'manual'] as const).map(m => (
            <button key={m} onClick={() => setInputMode(m)} style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 14px',
              background: inputMode === m ? '#1a1917' : 'transparent',
              color: inputMode === m ? '#f8f7f4' : '#6b6960',
              border: 'none', cursor: 'pointer', transition: 'all .15s',
            }}>{m}</button>
          ))}
        </div>
      </div>

      {/* Presets */}
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', marginBottom: 8 }}>PRESETS</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {PRESETS.map(p => (
            <button key={p.cron} onClick={() => applyPreset(p.cron)} style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 10px',
              background: activeCron === p.cron ? '#1a1917' : '#ffffff',
              color: activeCron === p.cron ? '#f8f7f4' : '#6b6960',
              border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
              transition: 'all .15s',
            }}>{p.label}</button>
          ))}
        </div>
      </div>

      {/* Visual builder */}
      {inputMode === 'visual' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {PARTS.map((part, i) => (
            <div key={part.label} style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: '6px 10px', borderBottom: '0.5px solid #c8c6c0', background: '#f8f7f4' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#6b6960', letterSpacing: '0.04em' }}>{part.label}</span>
              </div>
              <input
                type="text"
                value={parts[i]}
                onChange={e => setPart(i, e.target.value)}
                placeholder={part.placeholder}
                style={{
                  width: '100%', padding: '10px', border: 'none', outline: 'none',
                  fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 500,
                  color: '#1a1917', background: 'transparent', textAlign: 'center',
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Manual input */}
      {inputMode === 'manual' && (
        <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '8px 12px', borderBottom: '0.5px solid #c8c6c0' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>cron expression</span>
          </div>
          <input
            type="text"
            value={manualInput}
            onChange={e => applyManual(e.target.value)}
            placeholder="* * * * *"
            style={{
              width: '100%', padding: '14px 16px', border: 'none', outline: 'none',
              fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 500,
              color: '#1a1917', background: 'transparent', letterSpacing: '0.1em',
            }}
          />
        </div>
      )}

      {/* Expression display + copy */}
      <div style={{ background: '#f8f7f4', border: '1px solid #c8c6c0', borderRadius: 8, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 500, color: '#1a1917', margin: '0 0 4px', letterSpacing: '0.08em' }}>
            {activeCron}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960', margin: 0 }}>{description}</p>
        </div>
        <button onClick={copy} style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, padding: '8px 16px',
          background: '#1a1917', color: '#f8f7f4',
          border: 'none', borderRadius: 6, cursor: 'pointer', flexShrink: 0,
        }}>{copied ? 'copied!' : 'copy'}</button>
      </div>

      {/* Next runs */}
      {nextRuns.length > 0 && (
        <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '8px 12px', borderBottom: '0.5px solid #c8c6c0' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>next 8 run times</span>
          </div>
          {nextRuns.map((date, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '9px 14px',
              borderBottom: i < nextRuns.length - 1 ? '0.5px solid #f0ede8' : 'none',
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', minWidth: 16 }}>
                {i + 1}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1a1917' }}>
                {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#6b6960', marginLeft: 'auto' }}>
                {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </span>
            </div>
          ))}
        </div>
      )}

      {nextRuns.length === 0 && activeCron.trim().split(/\s+/).length === 5 && (
        <div style={{ background: '#fcebeb', border: '0.5px solid #f09595', borderRadius: 6, padding: '10px 14px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a32d2d', margin: 0 }}>
            Invalid or no upcoming runs found for this expression
          </p>
        </div>
      )}

    </div>
  )
}
