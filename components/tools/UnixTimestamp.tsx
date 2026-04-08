'use client'

import { useState, useEffect } from 'react'

const TIMEZONES = [
  { label: 'UTC', value: 'UTC' },
  { label: 'Bangkok (UTC+7)', value: 'Asia/Bangkok' },
  { label: 'Tokyo (UTC+9)', value: 'Asia/Tokyo' },
  { label: 'London (UTC+0)', value: 'Europe/London' },
  { label: 'New York (UTC-5)', value: 'America/New_York' },
  { label: 'Los Angeles (UTC-8)', value: 'America/Los_Angeles' },
]

type Unit = 'seconds' | 'milliseconds' | 'microseconds'

function tsToSeconds(ts: number, unit: Unit): number {
  if (unit === 'milliseconds') return ts / 1000
  if (unit === 'microseconds') return ts / 1000000
  return ts
}

function secondsToUnit(s: number, unit: Unit): number {
  if (unit === 'milliseconds') return Math.floor(s * 1000)
  if (unit === 'microseconds') return Math.floor(s * 1000000)
  return Math.floor(s)
}

function formatDate(date: Date, tz: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  }).format(date)
}

function formatISO(date: Date): string {
  return date.toISOString()
}

function formatRelative(date: Date): string {
  const now = Date.now()
  const diff = Math.round((date.getTime() - now) / 1000)
  const abs = Math.abs(diff)
  const past = diff < 0
  if (abs < 60) return past ? `${abs} seconds ago` : `in ${abs} seconds`
  if (abs < 3600) return past ? `${Math.round(abs / 60)} minutes ago` : `in ${Math.round(abs / 60)} minutes`
  if (abs < 86400) return past ? `${Math.round(abs / 3600)} hours ago` : `in ${Math.round(abs / 3600)} hours`
  if (abs < 2592000) return past ? `${Math.round(abs / 86400)} days ago` : `in ${Math.round(abs / 86400)} days`
  return past ? `${Math.round(abs / 2592000)} months ago` : `in ${Math.round(abs / 2592000)} months`
}

export default function UnixTimestamp() {
  const [now, setNow] = useState(Date.now())
  const [tsInput, setTsInput] = useState('')
  const [dateInput, setDateInput] = useState('')
  const [unit, setUnit] = useState<Unit>('seconds')
  const [tz, setTz] = useState('UTC')
  const [copied, setCopied] = useState<string | null>(null)
  const [mode, setMode] = useState<'ts-to-date' | 'date-to-ts'>('ts-to-date')

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const currentTs = secondsToUnit(now / 1000, unit)

  // Parse timestamp input
  const parsedDate = (() => {
    if (!tsInput.trim()) return null
    const n = parseFloat(tsInput.trim())
    if (isNaN(n)) return null
    const secs = tsToSeconds(n, unit)
    if (secs < -62135596800 || secs > 32503680000) return null
    return new Date(secs * 1000)
  })()

  // Parse date input to timestamp
  const dateToTs = (() => {
    if (!dateInput) return null
    const d = new Date(dateInput)
    if (isNaN(d.getTime())) return null
    return secondsToUnit(d.getTime() / 1000, unit)
  })()

  const copy = async (text: string, k: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(k); setTimeout(() => setCopied(null), 1500)
  }

  const CopyBtn = ({ text, k }: { text: string; k: string }) => (
    <button onClick={() => copy(text, k)} style={{
      fontFamily: 'var(--font-mono)', fontSize: 9, padding: '1px 7px', flexShrink: 0,
      background: copied === k ? '#e1f5ee' : 'transparent',
      color: copied === k ? '#085041' : '#a8a69e',
      border: `0.5px solid ${copied === k ? '#1D9E75' : '#e8e6e0'}`,
      borderRadius: 3, cursor: 'pointer', transition: 'all .15s',
    }}>{copied === k ? '✓' : 'copy'}</button>
  )

  const useNow = () => {
    const ts = secondsToUnit(Date.now() / 1000, unit)
    setTsInput(String(ts))
    setMode('ts-to-date')
  }

  return (
    <div className="space-y-4">

      {/* Live clock */}
      <div style={{ background: '#1a1917', borderRadius: 10, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6b6960', letterSpacing: '0.08em', margin: '0 0 6px' }}>CURRENT UNIX TIMESTAMP</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 500, color: '#f8f7f4', margin: 0, letterSpacing: '0.02em' }}>
            {currentTs.toLocaleString()}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#444441', margin: '4px 0 0' }}>
            {new Date(now).toUTCString()}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6, flexDirection: 'column', alignItems: 'flex-end' }}>
          <CopyBtn text={String(currentTs)} k="now" />
          <button onClick={useNow} style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 12px',
            background: 'transparent', color: '#888780',
            border: '0.5px solid #444441', borderRadius: 5, cursor: 'pointer',
          }}>use now →</button>
        </div>
      </div>

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ display: 'flex', background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 6, overflow: 'hidden' }}>
          {(['ts-to-date', 'date-to-ts'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 14px',
              background: mode === m ? '#1a1917' : 'transparent',
              color: mode === m ? '#f8f7f4' : '#6b6960',
              border: 'none', cursor: 'pointer', transition: 'all .15s',
            }}>{m === 'ts-to-date' ? 'timestamp → date' : 'date → timestamp'}</button>
          ))}
        </div>

        {/* Unit selector */}
        <div style={{ display: 'flex', background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 6, overflow: 'hidden' }}>
          {(['seconds', 'milliseconds', 'microseconds'] as const).map(u => (
            <button key={u} onClick={() => setUnit(u)} style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, padding: '6px 10px',
              background: unit === u ? '#1a1917' : 'transparent',
              color: unit === u ? '#f8f7f4' : '#6b6960',
              border: 'none', cursor: 'pointer', transition: 'all .15s',
            }}>{u === 'seconds' ? 'sec' : u === 'milliseconds' ? 'ms' : 'μs'}</button>
          ))}
        </div>
      </div>

      {/* Timestamp → Date */}
      {mode === 'ts-to-date' && (
        <div className="space-y-4">
          <div style={{ background: '#ffffff', border: '1.5px solid #1a1917', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #e8e6e0' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>
                input · unix timestamp ({unit})
              </span>
            </div>
            <input
              type="number"
              value={tsInput}
              onChange={e => setTsInput(e.target.value)}
              placeholder={String(secondsToUnit(Date.now() / 1000, unit))}
              style={{
                width: '100%', padding: '14px 16px', border: 'none', outline: 'none',
                fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 500,
                color: '#1a1917', background: 'transparent', letterSpacing: '0.02em',
              }}
            />
          </div>

          {parsedDate && (
            <>
              {/* Timezone selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e' }}>timezone</span>
                <select
                  value={tz}
                  onChange={e => setTz(e.target.value)}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11, padding: '5px 10px',
                    background: '#ffffff', color: '#1a1917',
                    border: '0.5px solid #c8c6c0', borderRadius: 6, outline: 'none', cursor: 'pointer',
                  }}
                >
                  {TIMEZONES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              {/* Result */}
              <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #c8c6c0' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>converted result</span>
                </div>

                {[
                  { label: 'Local time', value: formatDate(parsedDate, tz) },
                  { label: 'UTC time', value: formatDate(parsedDate, 'UTC') },
                  { label: 'ISO 8601', value: formatISO(parsedDate) },
                  { label: 'Relative', value: formatRelative(parsedDate) },
                  { label: 'Day of week', value: parsedDate.toLocaleDateString('en-US', { weekday: 'long', timeZone: tz }) },
                  { label: 'Unix (sec)', value: String(Math.floor(parsedDate.getTime() / 1000)) },
                  { label: 'Unix (ms)', value: String(parsedDate.getTime()) },
                ].map((row, i, arr) => (
                  <div key={row.label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '9px 14px', borderBottom: i < arr.length - 1 ? '0.5px solid #f0ede8' : 'none',
                  }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960', minWidth: 110 }}>{row.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#1a1917' }}>{row.value}</span>
                      <CopyBtn text={row.value} k={`r${i}`} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tsInput && !parsedDate && (
            <div style={{ background: '#fcebeb', border: '0.5px solid #f09595', borderRadius: 6, padding: '10px 14px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a32d2d', margin: 0 }}>
                Invalid timestamp — check the value and unit
              </p>
            </div>
          )}
        </div>
      )}

      {/* Date → Timestamp */}
      {mode === 'date-to-ts' && (
        <div className="space-y-4">
          <div style={{ background: '#ffffff', border: '1.5px solid #1a1917', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #e8e6e0' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>input · date & time</span>
            </div>
            <input
              type="datetime-local"
              value={dateInput}
              onChange={e => setDateInput(e.target.value)}
              style={{
                width: '100%', padding: '14px 16px', border: 'none', outline: 'none',
                fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 500,
                color: '#1a1917', background: 'transparent',
              }}
            />
          </div>

          {dateToTs !== null && (
            <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #c8c6c0' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>unix timestamp</span>
              </div>
              {[
                { label: `${unit}`, value: String(dateToTs) },
                { label: 'seconds', value: String(Math.floor(new Date(dateInput).getTime() / 1000)) },
                { label: 'milliseconds', value: String(new Date(dateInput).getTime()) },
                { label: 'ISO 8601', value: new Date(dateInput).toISOString() },
                { label: 'Relative', value: formatRelative(new Date(dateInput)) },
              ].map((row, i, arr) => (
                <div key={row.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '9px 14px', borderBottom: i < arr.length - 1 ? '0.5px solid #f0ede8' : 'none',
                }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960', minWidth: 110 }}>{row.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#1a1917' }}>{row.value}</span>
                    <CopyBtn text={row.value} k={`d${i}`} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick reference */}
      <div style={{ background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 8, padding: '12px 14px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: '0 0 8px' }}>QUICK REFERENCE</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          {[
            { label: '10 digits', desc: 'Unix seconds' },
            { label: '13 digits', desc: 'Unix milliseconds (JS)' },
            { label: '0', desc: 'Jan 1, 1970 00:00 UTC' },
            { label: '2147483647', desc: 'Jan 19, 2038 (Y2K38)' },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#3c3489', minWidth: 80 }}>{r.label}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6b6960' }}>{r.desc}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
