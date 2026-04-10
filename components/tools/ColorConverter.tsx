'use client'

import { useState, useCallback } from 'react'

interface Color {
  hex: string
  r: number; g: number; b: number
  h: number; s: number; l: number
  hv: number; sv: number; v: number
}

// ── Converters ──────────────────────────────────────────

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '')
  const full = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean
  if (!/^[0-9A-Fa-f]{6}$/.test(full)) return null
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('')
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  switch (max) {
    case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break
    case gn: h = ((bn - rn) / d + 2) / 6; break
    case bn: h = ((rn - gn) / d + 4) / 6; break
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const hn = h / 360, sn = s / 100, ln = l / 100
  if (sn === 0) {
    const v = Math.round(ln * 255)
    return { r: v, g: v, b: v }
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn
  const p = 2 * ln - q
  return {
    r: Math.round(hue2rgb(p, q, hn + 1/3) * 255),
    g: Math.round(hue2rgb(p, q, hn) * 255),
    b: Math.round(hue2rgb(p, q, hn - 1/3) * 255),
  }
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const v = max
  const s = max === 0 ? 0 : (max - min) / max
  let h = 0
  if (max !== min) {
    const d = max - min
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break
      case gn: h = ((bn - rn) / d + 2) / 6; break
      case bn: h = ((rn - gn) / d + 4) / 6; break
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) }
}

function buildColor(r: number, g: number, b: number): Color {
  const hsl = rgbToHsl(r, g, b)
  const hsv = rgbToHsv(r, g, b)
  return {
    hex: rgbToHex(r, g, b),
    r, g, b,
    h: hsl.h, s: hsl.s, l: hsl.l,
    hv: hsv.h, sv: hsv.s, v: hsv.v,
  }
}

// ── Presets ─────────────────────────────────────────────
const PRESETS = [
  { label: 'Red',     hex: '#ef4444' },
  { label: 'Orange',  hex: '#f97316' },
  { label: 'Yellow',  hex: '#eab308' },
  { label: 'Green',   hex: '#22c55e' },
  { label: 'Teal',    hex: '#14b8a6' },
  { label: 'Blue',    hex: '#3b82f6' },
  { label: 'Purple',  hex: '#a855f7' },
  { label: 'Pink',    hex: '#ec4899' },
  { label: 'White',   hex: '#ffffff' },
  { label: 'Black',   hex: '#000000' },
  { label: 'freeutil bg',   hex: '#f8f7f4' },
  { label: 'freeutil dark', hex: '#1a1917' },
]

export default function ColorConverter() {
  const [color, setColor] = useState<Color>(buildColor(59, 130, 246)) // blue default
  const [hexInput, setHexInput] = useState('#3b82f6')
  const [copied, setCopied] = useState<string | null>(null)

  const updateFromHex = useCallback((hex: string) => {
    setHexInput(hex)
    const rgb = hexToRgb(hex)
    if (rgb) setColor(buildColor(rgb.r, rgb.g, rgb.b))
  }, [])

  const updateFromRgb = useCallback((r: number, g: number, b: number) => {
    const c = buildColor(r, g, b)
    setColor(c)
    setHexInput(c.hex)
  }, [])

  const updateFromHsl = useCallback((h: number, s: number, l: number) => {
    const rgb = hslToRgb(h, s, l)
    const c = buildColor(rgb.r, rgb.g, rgb.b)
    setColor(c)
    setHexInput(c.hex)
  }, [])

  const updateFromPicker = useCallback((hex: string) => {
    updateFromHex(hex)
  }, [updateFromHex])

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

  const numInput = (val: number, onChange: (v: number) => void, max: number) => (
    <input type="number" value={val} min={0} max={max}
      onChange={e => onChange(Math.min(max, Math.max(0, Number(e.target.value))))}
      style={{ width: 56, fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500, padding: '6px 8px', border: '0.5px solid #c8c6c0', borderRadius: 5, outline: 'none', color: '#1a1917', textAlign: 'center' }} />
  )

  const textContrast = color.l > 55 ? '#1a1917' : '#ffffff'

  return (
    <div className="space-y-4">

      {/* Color preview + picker */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}>
        {/* Big preview */}
        <div style={{
          background: color.hex, borderRadius: 12, minHeight: 120,
          border: '1px solid #c8c6c0', display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end', padding: '12px 16px', transition: 'background .1s',
        }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 500, color: textContrast, margin: 0, letterSpacing: '0.02em' }}>
            {color.hex.toUpperCase()}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: textContrast, opacity: 0.7, margin: '2px 0 0' }}>
            rgb({color.r}, {color.g}, {color.b})
          </p>
        </div>

        {/* Color picker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
          <input type="color" value={color.hex} onChange={e => updateFromPicker(e.target.value)}
            style={{ width: 56, height: 56, borderRadius: 10, border: '1px solid #c8c6c0', cursor: 'pointer', padding: 3 }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#a8a69e', textAlign: 'center' }}>color<br/>picker</span>
        </div>
      </div>

      {/* Presets */}
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: '0 0 6px' }}>PRESETS</p>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {PRESETS.map(p => (
            <button key={p.hex} onClick={() => updateFromHex(p.hex)} title={p.label} style={{
              width: 28, height: 28, borderRadius: 6, border: `2px solid ${color.hex === p.hex ? '#1a1917' : '#c8c6c0'}`,
              background: p.hex, cursor: 'pointer', flexShrink: 0, transition: 'border .1s',
            }} />
          ))}
        </div>
      </div>

      {/* HEX */}
      <div style={{ background: '#ffffff', border: '1.5px solid #1a1917', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #e8e6e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>HEX</span>
          <CopyBtn text={color.hex.toUpperCase()} k="hex" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: '#a8a69e' }}>#</span>
          <input type="text" value={hexInput.replace('#', '')}
            onChange={e => updateFromHex('#' + e.target.value)}
            maxLength={6}
            style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 500, color: '#1a1917', border: 'none', outline: 'none', background: 'transparent', letterSpacing: '0.08em' }} />
          <div style={{ width: 28, height: 28, borderRadius: 5, background: color.hex, border: '0.5px solid #c8c6c0' }} />
        </div>
      </div>

      {/* RGB */}
      <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #c8c6c0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>RGB</span>
          <CopyBtn text={`rgb(${color.r}, ${color.g}, ${color.b})`} k="rgb" />
        </div>
        <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'R', value: color.r, onChange: (v: number) => updateFromRgb(v, color.g, color.b), color: '#ef4444' },
            { label: 'G', value: color.g, onChange: (v: number) => updateFromRgb(color.r, v, color.b), color: '#22c55e' },
            { label: 'B', value: color.b, onChange: (v: number) => updateFromRgb(color.r, color.g, v), color: '#3b82f6' },
          ].map(ch => (
            <div key={ch.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, color: ch.color, minWidth: 14 }}>{ch.label}</span>
              <input type="range" min={0} max={255} value={ch.value} onChange={e => ch.onChange(Number(e.target.value))} style={{ flex: 1 }} />
              {numInput(ch.value, ch.onChange, 255)}
            </div>
          ))}
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            <CopyBtn text={`${color.r}, ${color.g}, ${color.b}`} k="rgb-raw" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e' }}>rgb({color.r}, {color.g}, {color.b})</span>
          </div>
        </div>
      </div>

      {/* HSL */}
      <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #c8c6c0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>HSL</span>
          <CopyBtn text={`hsl(${color.h}, ${color.s}%, ${color.l}%)`} k="hsl" />
        </div>
        <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'H', value: color.h, max: 360, unit: '°', onChange: (v: number) => updateFromHsl(v, color.s, color.l) },
            { label: 'S', value: color.s, max: 100, unit: '%', onChange: (v: number) => updateFromHsl(color.h, v, color.l) },
            { label: 'L', value: color.l, max: 100, unit: '%', onChange: (v: number) => updateFromHsl(color.h, color.s, v) },
          ].map(ch => (
            <div key={ch.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, color: '#6b6960', minWidth: 14 }}>{ch.label}</span>
              <input type="range" min={0} max={ch.max} value={ch.value} onChange={e => ch.onChange(Number(e.target.value))} style={{ flex: 1 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {numInput(ch.value, ch.onChange, ch.max)}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e' }}>{ch.unit}</span>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            <CopyBtn text={`hsl(${color.h}deg ${color.s}% ${color.l}%)`} k="hsl-css4" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e' }}>hsl({color.h}deg {color.s}% {color.l}%) — CSS4</span>
          </div>
        </div>
      </div>

      {/* HSV */}
      <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #c8c6c0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>HSV / HSB</span>
          <CopyBtn text={`hsv(${color.hv}, ${color.sv}%, ${color.v}%)`} k="hsv" />
        </div>
        <div style={{ padding: '10px 14px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1a1917' }}>
            hsv({color.hv}°, {color.sv}%, {color.v}%)
          </span>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: '4px 0 0' }}>
            used in Photoshop, Figma, and design tools
          </p>
        </div>
      </div>

      {/* All formats summary */}
      <div style={{ background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 8, padding: '12px 14px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: '0 0 8px' }}>ALL FORMATS</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[
            { label: 'HEX',      value: color.hex.toUpperCase(),                         k: 'all-hex' },
            { label: 'RGB',      value: `rgb(${color.r}, ${color.g}, ${color.b})`,       k: 'all-rgb' },
            { label: 'RGBA',     value: `rgba(${color.r}, ${color.g}, ${color.b}, 1)`,   k: 'all-rgba' },
            { label: 'HSL',      value: `hsl(${color.h}, ${color.s}%, ${color.l}%)`,     k: 'all-hsl' },
            { label: 'HSV',      value: `hsv(${color.hv}, ${color.sv}%, ${color.v}%)`,   k: 'all-hsv' },
            { label: 'CSS var',  value: `--color: ${color.hex};`,                        k: 'all-css' },
            { label: 'Tailwind', value: `[${color.hex}]`,                                k: 'all-tw' },
          ].map(row => (
            <div key={row.k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', minWidth: 70 }}>{row.label}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#1a1917', flex: 1 }}>{row.value}</span>
              <CopyBtn text={row.value} k={row.k} />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}