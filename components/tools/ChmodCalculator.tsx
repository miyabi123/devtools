'use client'

import { useState, useCallback } from 'react'

// ── Types ───────────────────────────────────────────────────────
type PermSet = { r: boolean; w: boolean; x: boolean }
type Perms = { owner: PermSet; group: PermSet; others: PermSet }

// ── Helpers ─────────────────────────────────────────────────────
function permToOctal(p: PermSet): number {
  return (p.r ? 4 : 0) + (p.w ? 2 : 0) + (p.x ? 1 : 0)
}

function octalToStr(n: number): string {
  return [
    n >= 4 ? 'r' : '-',
    n >= 2 && n % 4 >= 2 ? 'w' : '-',
    n % 2 === 1 ? 'x' : '-',
  ].join('')
}

function octalDigitToPerm(n: number): PermSet {
  return { r: n >= 4, w: n % 4 >= 2, x: n % 2 === 1 }
}

function permsToOctalStr(p: Perms): string {
  return `${permToOctal(p.owner)}${permToOctal(p.group)}${permToOctal(p.others)}`
}

function permsToSymbolic(p: Perms): string {
  return (
    octalToStr(permToOctal(p.owner)) +
    octalToStr(permToOctal(p.group)) +
    octalToStr(permToOctal(p.others))
  )
}

function octalStrToPerms(s: string): Perms | null {
  if (!/^[0-7]{3}$/.test(s)) return null
  return {
    owner:  octalDigitToPerm(parseInt(s[0])),
    group:  octalDigitToPerm(parseInt(s[1])),
    others: octalDigitToPerm(parseInt(s[2])),
  }
}

function symbolicToPerms(s: string): Perms | null {
  if (!/^[r\-][w\-][x\-][r\-][w\-][x\-][r\-][w\-][x\-]$/.test(s)) return null
  const p = (i: number): PermSet => ({
    r: s[i] === 'r',
    w: s[i + 1] === 'w',
    x: s[i + 2] === 'x',
  })
  return { owner: p(0), group: p(3), others: p(6) }
}

// ── Presets ─────────────────────────────────────────────────────
const PRESETS: { label: string; octal: string; desc: string }[] = [
  { label: '755', octal: '755', desc: 'Web directory / scripts' },
  { label: '644', octal: '644', desc: 'Web files / HTML / CSS' },
  { label: '777', octal: '777', desc: 'Full access (avoid in prod)' },
  { label: '700', octal: '700', desc: 'Owner only — private dir' },
  { label: '600', octal: '600', desc: 'SSH key / private file' },
  { label: '666', octal: '666', desc: 'Read/write all, no execute' },
  { label: '444', octal: '444', desc: 'Read-only for everyone' },
  { label: '400', octal: '400', desc: 'Owner read-only (cert file)' },
  { label: '775', octal: '775', desc: 'Shared group directory' },
  { label: '750', octal: '750', desc: 'Owner full, group read' },
]

const DEFAULT_PERMS: Perms = octalStrToPerms('644')!

// ── Sub-components (top-level — never inside main component) ────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [text])
  return (
    <button
      onClick={handleCopy}
      style={{
        fontFamily: 'var(--font-sans)', fontSize: 11,
        padding: '3px 10px', borderRadius: 5, cursor: 'pointer',
        background: copied ? '#e1f5ee' : '#ffffff',
        color: copied ? '#085041' : '#6b6960',
        border: copied ? '0.5px solid #1D9E75' : '0.5px solid #c8c6c0',
        transition: 'all 0.15s', whiteSpace: 'nowrap', flexShrink: 0,
      }}
    >
      {copied ? 'Copied ✓' : 'Copy'}
    </button>
  )
}

function PermCheckbox({
  label, checked, color, onChange,
}: {
  label: string; checked: boolean; color: string; onChange: (v: boolean) => void
}) {
  return (
    <label style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 6, cursor: 'pointer', userSelect: 'none',
    }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 36, height: 36, borderRadius: 8, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: checked ? color : '#f8f7f4',
          border: checked ? `2px solid ${color}` : '1.5px solid #c8c6c0',
          transition: 'all 0.15s', fontSize: 16,
        }}
      >
        {checked ? '✓' : ''}
      </div>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 11,
        color: checked ? '#1a1917' : '#a8a69e', fontWeight: checked ? 600 : 400,
      }}>
        {label}
      </span>
    </label>
  )
}

function PermGroup({
  title, perm, onChange,
}: {
  title: string; perm: PermSet; onChange: (p: PermSet) => void
}) {
  const octal = permToOctal(perm)
  return (
    <div style={{
      flex: 1, minWidth: 0,
      background: '#ffffff', border: '1px solid #c8c6c0',
      borderRadius: 10, overflow: 'hidden',
    }}>
      {/* header */}
      <div style={{
        padding: '10px 14px', borderBottom: '1px solid #f0efec',
        background: '#fafaf8', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: '#1a1917', margin: 0 }}>
          {title}
        </p>
        <code style={{
          fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700,
          color: octal > 0 ? '#166534' : '#c8c6c0',
          background: octal > 0 ? '#f0fdf4' : '#f8f7f4',
          padding: '1px 8px', borderRadius: 6,
        }}>
          {octal}
        </code>
      </div>

      {/* checkboxes */}
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-around' }}>
        <PermCheckbox
          label="Read (4)"
          checked={perm.r}
          color="#3c3489"
          onChange={v => onChange({ ...perm, r: v })}
        />
        <PermCheckbox
          label="Write (2)"
          checked={perm.w}
          color="#712b13"
          onChange={v => onChange({ ...perm, w: v })}
        />
        <PermCheckbox
          label="Execute (1)"
          checked={perm.x}
          color="#085041"
          onChange={v => onChange({ ...perm, x: v })}
        />
      </div>

      {/* symbolic row */}
      <div style={{
        padding: '8px 14px', borderTop: '1px solid #f0efec',
        background: '#fafaf8', display: 'flex', justifyContent: 'center',
      }}>
        <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#6b6960' }}>
          {(perm.r ? 'r' : '-') + (perm.w ? 'w' : '-') + (perm.x ? 'x' : '-')}
        </code>
      </div>
    </div>
  )
}

function ResultRow({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 12, padding: '10px 14px', borderBottom: '1px solid #f0efec',
    }}>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: '#6b6960', flexShrink: 0 }}>
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <code style={{
          fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
          fontSize: 13, color: '#1a1917', wordBreak: 'break-all',
        }}>
          {value}
        </code>
        <CopyButton text={value} />
      </div>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────
export default function ChmodCalculator() {
  const [perms, setPerms] = useState<Perms>(DEFAULT_PERMS)
  const [octalInput, setOctalInput] = useState('')
  const [symInput, setSymInput]   = useState('')
  const [octalErr, setOctalErr]   = useState('')
  const [symErr, setSymErr]       = useState('')

  const octalStr  = permsToOctalStr(perms)
  const symbolic  = permsToSymbolic(perms)
  const chmodCmd  = `chmod ${octalStr} <file>`
  const chmodRCmd = `chmod -R ${octalStr} <directory>`

  // ── handlers ──
  const setOwner  = useCallback((p: PermSet) => setPerms(prev => ({ ...prev, owner: p })),  [])
  const setGroup  = useCallback((p: PermSet) => setPerms(prev => ({ ...prev, group: p })),  [])
  const setOthers = useCallback((p: PermSet) => setPerms(prev => ({ ...prev, others: p })), [])

  const handleOctalInput = useCallback((val: string) => {
    setOctalInput(val)
    if (val === '') { setOctalErr(''); return }
    const p = octalStrToPerms(val)
    if (p) { setPerms(p); setOctalErr('') }
    else setOctalErr('ต้องเป็นตัวเลข 3 หลัก 0–7 เช่น 755')
  }, [])

  const handleSymInput = useCallback((val: string) => {
    setSymInput(val)
    if (val === '') { setSymErr(''); return }
    const p = symbolicToPerms(val)
    if (p) { setPerms(p); setSymErr('') }
    else setSymErr('ต้องเป็น 9 ตัวอักษร เช่น rwxr-xr-x')
  }, [])

  const applyPreset = useCallback((octal: string) => {
    const p = octalStrToPerms(octal)
    if (p) { setPerms(p); setOctalInput(''); setSymInput('') }
  }, [])

  return (
    <div className="space-y-4">

      {/* Presets */}
      <div style={{
        background: '#ffffff', border: '1px solid #c8c6c0',
        borderRadius: 10, overflow: 'hidden',
      }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #f0efec', background: '#fafaf8' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: 0 }}>
            COMMON PRESETS
          </p>
        </div>
        <div style={{ padding: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {PRESETS.map(pr => (
            <button
              key={pr.octal}
              onClick={() => applyPreset(pr.octal)}
              title={pr.desc}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 12,
                padding: '5px 12px', borderRadius: 6, cursor: 'pointer',
                background: octalStr === pr.octal ? '#f0fdf4' : '#f8f7f4',
                color:      octalStr === pr.octal ? '#166534' : '#1a1917',
                border:     octalStr === pr.octal ? '1px solid #4ade80' : '1px solid #c8c6c0',
                fontWeight: octalStr === pr.octal ? 700 : 400,
                transition: 'all 0.12s',
              }}
            >
              {pr.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick input row */}
      <div style={{ display: 'flex', gap: 12 }}>
        {/* Octal input */}
        <div style={{ flex: 1 }}>
          <div style={{
            background: '#ffffff', border: '1.5px solid #1a1917',
            borderRadius: 10, overflow: 'hidden',
          }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: 0, padding: '10px 14px 4px' }}>
              OCTAL
            </p>
            <input
              type="text"
              inputMode="numeric"
              maxLength={3}
              placeholder={octalStr}
              value={octalInput}
              onChange={e => handleOctalInput(e.target.value.replace(/[^0-7]/g, ''))}
              style={{
                width: '100%', padding: '4px 14px 10px', border: 'none', outline: 'none',
                fontFamily: 'var(--font-mono)', fontSize: 22, letterSpacing: '0.1em',
                color: '#1a1917', background: 'transparent', boxSizing: 'border-box',
              }}
            />
          </div>
          {octalErr && <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: '#a32d2d', margin: '4px 2px 0' }}>{octalErr}</p>}
        </div>

        {/* Symbolic input */}
        <div style={{ flex: 2 }}>
          <div style={{
            background: '#ffffff', border: '1.5px solid #1a1917',
            borderRadius: 10, overflow: 'hidden',
          }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: 0, padding: '10px 14px 4px' }}>
              SYMBOLIC
            </p>
            <input
              type="text"
              maxLength={9}
              placeholder={symbolic}
              value={symInput}
              onChange={e => handleSymInput(e.target.value.toLowerCase())}
              style={{
                width: '100%', padding: '4px 14px 10px', border: 'none', outline: 'none',
                fontFamily: 'var(--font-mono)', fontSize: 22, letterSpacing: '0.06em',
                color: '#1a1917', background: 'transparent', boxSizing: 'border-box',
              }}
            />
          </div>
          {symErr && <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: '#a32d2d', margin: '4px 2px 0' }}>{symErr}</p>}
        </div>
      </div>

      {/* Visual permission builder */}
      <div style={{ display: 'flex', gap: 10 }}>
        <PermGroup title="Owner (u)" perm={perms.owner}  onChange={setOwner}  />
        <PermGroup title="Group (g)" perm={perms.group}  onChange={setGroup}  />
        <PermGroup title="Others (o)" perm={perms.others} onChange={setOthers} />
      </div>

      {/* Results */}
      <div style={{
        background: '#ffffff', border: '1px solid #c8c6c0',
        borderRadius: 10, overflow: 'hidden',
      }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #f0efec', background: '#fafaf8' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: 0 }}>
            RESULT
          </p>
        </div>
        <ResultRow label="Octal"       value={octalStr} />
        <ResultRow label="Symbolic"    value={`-${symbolic}`} />
        <ResultRow label="chmod"       value={chmodCmd} />
        <ResultRow label="chmod -R"    value={chmodRCmd} />
      </div>

      {/* Legend */}
      <div style={{
        padding: '12px 14px', borderRadius: 8,
        background: '#f8f7f4', border: '1px solid #c8c6c0',
        display: 'flex', gap: 20, flexWrap: 'wrap',
      }}>
        {[
          { label: 'Read (r)', value: '4', color: '#3c3489', bg: '#eeedfe' },
          { label: 'Write (w)', value: '2', color: '#712b13', bg: '#faece7' },
          { label: 'Execute (x)', value: '1', color: '#085041', bg: '#e1f5ee' },
          { label: 'None (-)', value: '0', color: '#a8a69e', bg: '#f8f7f4' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <code style={{
              fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
              padding: '1px 6px', borderRadius: 4,
              background: item.bg, color: item.color,
            }}>
              {item.value}
            </code>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: '#6b6960' }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

    </div>
  )
}