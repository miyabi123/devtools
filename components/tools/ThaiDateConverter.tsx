'use client'

import { useState } from 'react'

const THAI_MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม']
const THAI_MONTHS_SHORT = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.']
const THAI_DAYS = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์']
const EN_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const EN_MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const EN_DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

const BE_OFFSET = 543

interface ConvertResult {
  be: { year: number; month: number; day: number }
  ce: { year: number; month: number; day: number }
  dayOfWeek: number
  formats: {
    label: string
    value: string
    lang: 'th' | 'en'
  }[]
}

function convertBEtoCE(year: number, month: number, day: number): ConvertResult {
  const ceYear = year - BE_OFFSET
  const date = new Date(ceYear, month - 1, day)
  const dow = date.getDay()
  return {
    be: { year, month, day },
    ce: { year: ceYear, month, day },
    dayOfWeek: dow,
    formats: [
      { label: 'วันที่แบบยาว (ไทย)', value: `วัน${THAI_DAYS[dow]}ที่ ${day} ${THAI_MONTHS[month - 1]} พ.ศ. ${year}`, lang: 'th' },
      { label: 'แบบย่อ (ไทย)', value: `${day} ${THAI_MONTHS_SHORT[month - 1]} ${year}`, lang: 'th' },
      { label: 'ตัวเลข (ไทย)', value: `${String(day).padStart(2,'0')}/${String(month).padStart(2,'0')}/${year}`, lang: 'th' },
      { label: 'Long format (EN)', value: `${EN_DAYS[dow]}, ${day} ${EN_MONTHS[month - 1]} ${ceYear}`, lang: 'en' },
      { label: 'Short format (EN)', value: `${day} ${EN_MONTHS_SHORT[month - 1]} ${ceYear}`, lang: 'en' },
      { label: 'ISO 8601', value: `${ceYear}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`, lang: 'en' },
      { label: 'DD/MM/YYYY (CE)', value: `${String(day).padStart(2,'0')}/${String(month).padStart(2,'0')}/${ceYear}`, lang: 'en' },
    ]
  }
}

function convertCEtoBE(year: number, month: number, day: number): ConvertResult {
  const beYear = year + BE_OFFSET
  const date = new Date(year, month - 1, day)
  const dow = date.getDay()
  return {
    be: { year: beYear, month, day },
    ce: { year, month, day },
    dayOfWeek: dow,
    formats: [
      { label: 'วันที่แบบยาว (ไทย)', value: `วัน${THAI_DAYS[dow]}ที่ ${day} ${THAI_MONTHS[month - 1]} พ.ศ. ${beYear}`, lang: 'th' },
      { label: 'แบบย่อ (ไทย)', value: `${day} ${THAI_MONTHS_SHORT[month - 1]} ${beYear}`, lang: 'th' },
      { label: 'ตัวเลข (ไทย)', value: `${String(day).padStart(2,'0')}/${String(month).padStart(2,'0')}/${beYear}`, lang: 'th' },
      { label: 'Long format (EN)', value: `${EN_DAYS[dow]}, ${day} ${EN_MONTHS[month - 1]} ${year}`, lang: 'en' },
      { label: 'Short format (EN)', value: `${day} ${EN_MONTHS_SHORT[month - 1]} ${year}`, lang: 'en' },
      { label: 'ISO 8601', value: `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`, lang: 'en' },
      { label: 'DD/MM/YYYY (CE)', value: `${String(day).padStart(2,'0')}/${String(month).padStart(2,'0')}/${year}`, lang: 'en' },
    ]
  }
}

export default function ThaiDateConverter() {
  const today = new Date()
  const [mode, setMode] = useState<'be-to-ce' | 'ce-to-be'>('be-to-ce')
  const [day, setDay] = useState(String(today.getDate()))
  const [month, setMonth] = useState(String(today.getMonth() + 1))
  const [year, setYear] = useState(String(mode === 'be-to-ce' ? today.getFullYear() + BE_OFFSET : today.getFullYear()))
  const [result, setResult] = useState<ConvertResult | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const convert = (d = day, m = month, y = year, md = mode) => {
    const dNum = parseInt(d), mNum = parseInt(m), yNum = parseInt(y)
    if (!d || !m || !y) { setResult(null); setError(''); return }
    if (isNaN(dNum) || isNaN(mNum) || isNaN(yNum)) { setError('กรุณากรอกตัวเลขให้ถูกต้อง'); return }
    if (dNum < 1 || dNum > 31) { setError('วันที่ต้องอยู่ระหว่าง 1-31'); return }
    if (mNum < 1 || mNum > 12) { setError('เดือนต้องอยู่ระหว่าง 1-12'); return }
    if (yNum < 1) { setError('ปีต้องมากกว่า 0'); return }
    try {
      const r = md === 'be-to-ce' ? convertBEtoCE(yNum, mNum, dNum) : convertCEtoBE(yNum, mNum, dNum)
      setResult(r)
      setError('')
    } catch {
      setError('ไม่สามารถแปลงวันที่ได้ กรุณาตรวจสอบข้อมูล')
    }
  }

  const handleMode = (m: 'be-to-ce' | 'ce-to-be') => {
    setMode(m)
    setYear(m === 'be-to-ce' ? String(today.getFullYear() + BE_OFFSET) : String(today.getFullYear()))
    setDay(String(today.getDate()))
    setMonth(String(today.getMonth() + 1))
    setResult(null)
    setError('')
  }

  const setToday = () => {
    const d = String(today.getDate())
    const m = String(today.getMonth() + 1)
    const y = String(mode === 'be-to-ce' ? today.getFullYear() + BE_OFFSET : today.getFullYear())
    setDay(d); setMonth(m); setYear(y)
    convert(d, m, y, mode)
  }

  const copy = async (text: string, k: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(k); setTimeout(() => setCopied(null), 1500)
  }

  const inputStyle = {
    border: '1px solid #c8c6c0', borderRadius: 8, padding: '10px 14px',
    fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 500,
    color: '#1a1917', background: '#ffffff', outline: 'none',
    width: '100%', textAlign: 'center' as const,
  }

  return (
    <div className="space-y-4">

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 6, overflow: 'hidden' }}>
          <button onClick={() => handleMode('be-to-ce')} style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, padding: '7px 16px',
            background: mode === 'be-to-ce' ? '#1a1917' : 'transparent',
            color: mode === 'be-to-ce' ? '#f8f7f4' : '#6b6960',
            border: 'none', cursor: 'pointer', transition: 'all .15s',
          }}>พ.ศ. → ค.ศ.</button>
          <button onClick={() => handleMode('ce-to-be')} style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, padding: '7px 16px',
            background: mode === 'ce-to-be' ? '#1a1917' : 'transparent',
            color: mode === 'ce-to-be' ? '#f8f7f4' : '#6b6960',
            border: 'none', cursor: 'pointer', transition: 'all .15s',
          }}>ค.ศ. → พ.ศ.</button>
        </div>
        <button onClick={setToday} style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, padding: '7px 14px',
          background: 'transparent', color: '#6b6960',
          border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
        }}>วันนี้</button>
      </div>

      {/* Info banner */}
      <div style={{ background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 6, padding: '8px 14px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960', margin: 0 }}>
          พ.ศ. = ค.ศ. + 543 &nbsp;·&nbsp; ค.ศ. = พ.ศ. − 543 &nbsp;·&nbsp;
          เช่น พ.ศ. 2567 = ค.ศ. 2024
        </p>
      </div>

      {/* Date input */}
      <div style={{ background: '#ffffff', border: '1.5px solid #1a1917', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '10px 16px', borderBottom: '0.5px solid #e8e6e0' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>
            {mode === 'be-to-ce' ? 'กรอกวันที่ (พ.ศ.)' : 'Enter date (C.E.)'}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: 12, padding: '16px' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: '0 0 6px', textAlign: 'center' }}>วัน / Day</p>
            <input type="number" value={day} min={1} max={31}
              onChange={e => { setDay(e.target.value); convert(e.target.value, month, year, mode) }}
              placeholder="DD" style={inputStyle} />
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: '0 0 6px', textAlign: 'center' }}>เดือน / Month</p>
            <input type="number" value={month} min={1} max={12}
              onChange={e => { setMonth(e.target.value); convert(day, e.target.value, year, mode) }}
              placeholder="MM" style={inputStyle} />
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: '0 0 6px', textAlign: 'center' }}>
              {mode === 'be-to-ce' ? 'ปี พ.ศ.' : 'Year C.E.'}
            </p>
            <input type="number" value={year}
              onChange={e => { setYear(e.target.value); convert(day, month, e.target.value, mode) }}
              placeholder={mode === 'be-to-ce' ? '2567' : '2024'} style={{ ...inputStyle, fontSize: 20 }} />
          </div>
        </div>

        {/* Month selector */}
        <div style={{ padding: '0 16px 16px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4 }}>
          {THAI_MONTHS_SHORT.map((m, i) => (
            <button key={i} onClick={() => { setMonth(String(i + 1)); convert(day, String(i + 1), year, mode) }}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, padding: '5px 2px',
                background: parseInt(month) === i + 1 ? '#1a1917' : '#f8f7f4',
                color: parseInt(month) === i + 1 ? '#f8f7f4' : '#6b6960',
                border: '0.5px solid #c8c6c0', borderRadius: 4, cursor: 'pointer',
                transition: 'all .15s',
              }}>{m}</button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: '#fcebeb', border: '0.5px solid #f09595', borderRadius: 6, padding: '10px 14px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a32d2d', margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <>
          {/* Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: '#eeedfe', border: '0.5px solid #AFA9EC', borderRadius: 8, padding: '14px 16px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#534AB7', margin: '0 0 4px' }}>พุทธศักราช (พ.ศ.)</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 500, color: '#3c3489', margin: 0 }}>{result.be.year}</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#534AB7', margin: '4px 0 0' }}>
                {result.be.day} {THAI_MONTHS_SHORT[result.be.month - 1]} {result.be.year}
              </p>
            </div>
            <div style={{ background: '#e1f5ee', border: '0.5px solid #5DCAA5', borderRadius: 8, padding: '14px 16px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#0F6E56', margin: '0 0 4px' }}>คริสต์ศักราช (ค.ศ.)</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 500, color: '#085041', margin: 0 }}>{result.ce.year}</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#0F6E56', margin: '4px 0 0' }}>
                {result.ce.day} {EN_MONTHS_SHORT[result.ce.month - 1]} {result.ce.year}
              </p>
            </div>
          </div>

          {/* Day of week */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1D9E75' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#1a1917' }}>
              วัน{THAI_DAYS[result.dayOfWeek]} · {EN_DAYS[result.dayOfWeek]}
            </span>
          </div>

          {/* All formats */}
          <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #c8c6c0' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>รูปแบบทั้งหมด</span>
            </div>
            {result.formats.map((f, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '9px 14px', borderBottom: i < result.formats.length - 1 ? '0.5px solid #f0ede8' : 'none',
              }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', marginRight: 8 }}>{f.label}</span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 9, padding: '1px 6px', borderRadius: 99,
                    background: f.lang === 'th' ? '#faeeda' : '#eeedfe',
                    color: f.lang === 'th' ? '#633806' : '#3c3489',
                  }}>{f.lang === 'th' ? 'TH' : 'EN'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1a1917' }}>{f.value}</span>
                  <button onClick={() => copy(f.value, `f${i}`)} style={{
                    fontFamily: 'var(--font-mono)', fontSize: 9, padding: '1px 7px', flexShrink: 0,
                    background: copied === `f${i}` ? '#e1f5ee' : 'transparent',
                    color: copied === `f${i}` ? '#085041' : '#a8a69e',
                    border: `0.5px solid ${copied === `f${i}` ? '#1D9E75' : '#e8e6e0'}`,
                    borderRadius: 3, cursor: 'pointer', transition: 'all .15s',
                  }}>{copied === `f${i}` ? '✓' : 'copy'}</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  )
}
