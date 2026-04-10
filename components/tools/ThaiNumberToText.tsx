'use client'

import { useState, useMemo } from 'react'

const ONES = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า']
const ONES_BAHT = ['', 'เอ็ด', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า']
const PLACES = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน']
const LEVELS = ['', 'ล้าน']

function convertBlock(n: number, isLast: boolean): string {
  if (n === 0) return ''
  const digits = String(n).padStart(6, '0').split('').map(Number)
  let result = ''
  for (let i = 0; i < 6; i++) {
    const d = digits[i]
    const place = 5 - i
    if (d === 0) continue
    if (place === 1 && d === 1) {
      result += 'สิบ'
    } else if (place === 0 && d === 1 && n > 10 && isLast) {
      result += 'เอ็ด'
    } else if (place === 0 && d === 1 && !isLast) {
      result += 'หนึ่ง'
    } else if (place === 0 && d === 2 && result.includes('สิบ')) {
      result += 'สอง'
    } else {
      result += ONES[d] + PLACES[place]
    }
  }
  return result
}

function numberToThaiText(num: number): string {
  if (num === 0) return 'ศูนย์'
  if (!isFinite(num) || isNaN(num)) return 'ตัวเลขไม่ถูกต้อง'

  let result = ''
  const n = Math.abs(Math.floor(num))
  const str = String(n)

  if (n > 999999999999) return 'ตัวเลขมากเกินไป'

  // Split into million blocks
  const millions = Math.floor(n / 1000000)
  const remainder = n % 1000000

  if (millions > 0) {
    result += convertBlock(millions, remainder === 0) + 'ล้าน'
  }
  if (remainder > 0) {
    result += convertBlock(remainder, true)
  }

  return (num < 0 ? 'ลบ' : '') + result
}

function numberToBaht(num: number): string {
  if (isNaN(num) || !isFinite(num)) return 'ตัวเลขไม่ถูกต้อง'
  if (num < 0) return 'ไม่รองรับจำนวนลบสำหรับจำนวนเงิน'
  if (num > 999999999999.99) return 'ตัวเลขมากเกินไป'

  const rounded = Math.round(num * 100) / 100
  const baht = Math.floor(rounded)
  const satang = Math.round((rounded - baht) * 100)

  let result = ''
  if (baht === 0 && satang === 0) return 'ศูนย์บาทถ้วน'
  if (baht > 0) result += numberToThaiText(baht) + 'บาท'
  if (satang > 0) result += numberToThaiText(satang) + 'สตางค์'
  else result += 'ถ้วน'

  return result
}

const SAMPLES = [
  { label: '1', value: '1' },
  { label: '21', value: '21' },
  { label: '100', value: '100' },
  { label: '1,234', value: '1234' },
  { label: '10,000', value: '10000' },
  { label: '100,000', value: '100000' },
  { label: '1,000,000', value: '1000000' },
  { label: '1,500.50', value: '1500.50' },
  { label: '999,999,999', value: '999999999' },
]

export default function ThaiNumberToText() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'number' | 'baht'>('baht')
  const [copied, setCopied] = useState(false)

  const numValue = useMemo(() => {
    const clean = input.replace(/,/g, '').trim()
    if (!clean) return null
    const n = parseFloat(clean)
    return isNaN(n) ? null : n
  }, [input])

  const result = useMemo(() => {
    if (numValue === null) return ''
    return mode === 'baht' ? numberToBaht(numValue) : numberToThaiText(numValue)
  }, [numValue, mode])

  const isError = result.includes('ไม่ถูกต้อง') || result.includes('มากเกินไป') || result.includes('ลบ')

  const copy = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setCopied(true); setTimeout(() => setCopied(false), 1500)
  }

  const formatNumber = (n: number): string => {
    if (mode === 'baht') return n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    return n.toLocaleString('th-TH')
  }

  return (
    <div className="space-y-4">

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 6, overflow: 'hidden' }}>
          <button onClick={() => setMode('baht')} style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, padding: '7px 16px',
            background: mode === 'baht' ? '#1a1917' : 'transparent',
            color: mode === 'baht' ? '#f8f7f4' : '#6b6960',
            border: 'none', cursor: 'pointer', transition: 'all .15s',
          }}>💰 จำนวนเงินบาท</button>
          <button onClick={() => setMode('number')} style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, padding: '7px 16px',
            background: mode === 'number' ? '#1a1917' : 'transparent',
            color: mode === 'number' ? '#f8f7f4' : '#6b6960',
            border: 'none', cursor: 'pointer', transition: 'all .15s',
          }}>🔢 ตัวเลขทั่วไป</button>
        </div>
        {mode === 'baht' && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>
            รองรับทศนิยม 2 ตำแหน่ง (สตางค์)
          </span>
        )}
      </div>

      {/* Input */}
      <div style={{ background: '#ffffff', border: '1.5px solid #1a1917', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #e8e6e0', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>
            {mode === 'baht' ? 'กรอกจำนวนเงิน (บาท)' : 'กรอกตัวเลข'}
          </span>
          {numValue !== null && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e' }}>
              = {formatNumber(numValue)}
            </span>
          )}
        </div>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={mode === 'baht' ? '1500.50' : '1234567'}
          style={{
            width: '100%', padding: '14px 16px', border: 'none', outline: 'none',
            fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 500,
            color: '#1a1917', background: 'transparent', letterSpacing: '0.04em',
          }}
        />
      </div>

      {/* Samples */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>ตัวอย่าง:</span>
        {SAMPLES.map(s => (
          <button key={s.value} onClick={() => setInput(s.value)} style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px',
            background: input === s.value ? '#1a1917' : '#ffffff',
            color: input === s.value ? '#f8f7f4' : '#6b6960',
            border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
          }}>{s.label}</button>
        ))}
      </div>

      {/* Result */}
      {result && (
        <div style={{
          background: isError ? '#fcebeb' : '#ffffff',
          border: `1px solid ${isError ? '#f09595' : '#c8c6c0'}`,
          borderRadius: 8, overflow: 'hidden',
        }}>
          <div style={{ padding: '8px 14px', borderBottom: `0.5px solid ${isError ? '#f09595' : '#c8c6c0'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: isError ? '#a32d2d' : '#4a4845' }}>
              {isError ? 'ข้อผิดพลาด' : 'ผลลัพธ์'}
            </span>
            {!isError && (
              <button onClick={copy} style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px',
                background: copied ? '#e1f5ee' : 'transparent',
                color: copied ? '#085041' : '#6b6960',
                border: `0.5px solid ${copied ? '#1D9E75' : '#c8c6c0'}`,
                borderRadius: 5, cursor: 'pointer', transition: 'all .15s',
              }}>{copied ? '✓ คัดลอกแล้ว' : 'คัดลอก'}</button>
            )}
          </div>
          <div style={{ padding: '16px' }}>
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: 20, fontWeight: 500,
              color: isError ? '#a32d2d' : '#1a1917',
              margin: 0, lineHeight: 1.6,
            }}>
              {result}
            </p>
          </div>
        </div>
      )}

      {/* Use case tips */}
      <div style={{ background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 8, padding: '12px 14px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: '0 0 8px' }}>กรณีใช้งาน</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[
            { icon: '📝', label: 'เขียนเช็ค', desc: 'ใช้โหมดจำนวนเงินบาท — ได้รูปแบบมาตรฐานธนาคาร' },
            { icon: '📄', label: 'สัญญา / เอกสารกฎหมาย', desc: 'ระบุจำนวนเงินเป็นตัวอักษรในสัญญาซื้อขาย' },
            { icon: '🧾', label: 'ใบเสร็จ / ใบแจ้งหนี้', desc: 'แสดงยอดรวมเป็นตัวอักษรควบคู่กับตัวเลข' },
            { icon: '📚', label: 'การศึกษา', desc: 'แปลงตัวเลขทั่วไปสำหรับสื่อการสอน' },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 14 }}>{r.icon}</span>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#3c3489', fontWeight: 500 }}>{r.label} — </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6b6960' }}>{r.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}