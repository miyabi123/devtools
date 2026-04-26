'use client'

import { useState, useCallback } from 'react'

// ── Thai ID checksum algorithm (กรมการปกครอง) ──────────────────
function validateThaiId(id: string): boolean {
  const digits = id.replace(/\D/g, '')
  if (digits.length !== 13) return false
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += parseInt(digits[i]) * (13 - i)
  }
  const checkDigit = (11 - (sum % 11)) % 10
  return checkDigit === parseInt(digits[12])
}

function getIdCategory(id: string): { label: string; desc: string } | null {
  const digits = id.replace(/\D/g, '')
  if (digits.length < 1) return null
  const first = digits[0]
  const map: Record<string, { label: string; desc: string }> = {
    '1': { label: 'หมวด 1', desc: 'บุคคลที่มีสัญชาติไทย เกิดและแจ้งเกิดในเวลาที่กำหนด' },
    '2': { label: 'หมวด 2', desc: 'บุคคลที่มีสัญชาติไทย แจ้งเกิดเกินกำหนด' },
    '3': { label: 'หมวด 3', desc: 'คนไทยหรือคนต่างด้าวที่มีใบสำคัญประจำตัวคนต่างด้าว' },
    '4': { label: 'หมวด 4', desc: 'คนไทยหรือคนต่างด้าวที่เข้าเมืองชั่วคราว' },
    '5': { label: 'หมวด 5', desc: 'คนไทยที่ไม่มีสัญชาติไทย (ชาวเขา)' },
    '6': { label: 'หมวด 6', desc: 'คนต่างด้าวที่เข้าเมืองโดยไม่ชอบด้วยกฎหมาย' },
    '7': { label: 'หมวด 7', desc: 'บุตรของบุคคลหมวด 6 ที่เกิดในประเทศไทย' },
    '8': { label: 'หมวด 8', desc: 'คนต่างด้าวที่ได้รับอนุญาตให้อยู่ชั่วคราว' },
    '0': { label: 'หมวด 0', desc: 'บุคคลพิเศษ (บริษัท นิติบุคคล หรือบุคคลต่างด้าว)' },
  }
  return map[first] ?? null
}

function formatId(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 13)
  if (d.length <= 1) return d
  if (d.length <= 5) return `${d[0]}-${d.slice(1)}`
  if (d.length <= 10) return `${d[0]}-${d.slice(1, 5)}-${d.slice(5)}`
  if (d.length <= 12) return `${d[0]}-${d.slice(1, 5)}-${d.slice(5, 10)}-${d.slice(10)}`
  return `${d[0]}-${d.slice(1, 5)}-${d.slice(5, 10)}-${d.slice(10, 12)}-${d[12]}`
}

// ── Status box ──────────────────────────────────────────────────
function StatusBox({ valid, digits }: { valid: boolean; digits: string }) {
  if (valid) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 16px', borderRadius: 8,
        background: '#e1f5ee', border: '1px solid #1D9E75',
      }}>
        <span style={{ fontSize: 20 }}>✓</span>
        <div>
          <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: '#085041', margin: 0 }}>
            เลขบัตรประชาชนถูกต้อง
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#085041', margin: '2px 0 0', opacity: 0.8 }}>
            checksum ผ่าน · {formatId(digits)}
          </p>
        </div>
      </div>
    )
  }
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 16px', borderRadius: 8,
      background: '#fcebeb', border: '1px solid #f09595',
    }}>
      <span style={{ fontSize: 20 }}>✗</span>
      <div>
        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: '#a32d2d', margin: 0 }}>
          เลขบัตรประชาชนไม่ถูกต้อง
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#a32d2d', margin: '2px 0 0', opacity: 0.8 }}>
          checksum ไม่ผ่าน · ตรวจสอบเลขอีกครั้ง
        </p>
      </div>
    </div>
  )
}

// ── Structure breakdown ─────────────────────────────────────────
function StructureRow({ label, value, desc, highlight }: {
  label: string; value: string; desc: string; highlight?: boolean
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '8px 0', borderBottom: '1px solid #f0efec',
    }}>
      <code style={{
        fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
        color: highlight ? '#3c3489' : '#1a1917',
        background: highlight ? '#eeedfe' : '#f8f7f4',
        padding: '1px 6px', borderRadius: 4, minWidth: 60, textAlign: 'center',
        flexShrink: 0,
      }}>
        {value}
      </code>
      <div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: '#1a1917', margin: 0 }}>
          {label}
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: '#6b6960', margin: '1px 0 0' }}>
          {desc}
        </p>
      </div>
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────
export default function ThaiIdValidator() {
  const [raw, setRaw] = useState('')
  const [copied, setCopied] = useState(false)

  const digits = raw.replace(/\D/g, '').slice(0, 13)
  const isComplete = digits.length === 13
  const isValid = isComplete && validateThaiId(digits)
  const category = getIdCategory(digits)
  const formatted = formatId(digits)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    // allow digits and dashes only
    const cleaned = input.replace(/[^0-9-]/g, '')
    setRaw(cleaned)
  }, [])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(formatted)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [formatted])

  const handleClear = useCallback(() => {
    setRaw('')
  }, [])

  return (
    <div className="space-y-4">

      {/* Input */}
      <div style={{
        background: '#ffffff', border: '1.5px solid #1a1917',
        borderRadius: 10, overflow: 'hidden',
      }}>
        <div style={{ padding: '10px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: 0 }}>
            เลขบัตรประชาชน 13 หลัก
          </p>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: digits.length === 13 ? '#085041' : '#a8a69e',
          }}>
            {digits.length}/13
          </span>
        </div>

        <div style={{ position: 'relative' }}>
          <input
            type="text"
            inputMode="numeric"
            placeholder="1-2345-67890-12-3"
            value={raw}
            onChange={handleChange}
            autoComplete="off"
            style={{
              width: '100%', padding: '8px 14px 12px',
              border: 'none', outline: 'none',
              fontFamily: 'var(--font-mono)', fontSize: 22,
              letterSpacing: '0.08em',
              color: '#1a1917', background: 'transparent',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* bottom bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '8px 14px', borderTop: '1px solid #f0efec', background: '#fafaf8',
        }}>
          <button
            onClick={handleClear}
            disabled={!raw}
            style={{
              fontFamily: 'var(--font-sans)', fontSize: 12, color: raw ? '#6b6960' : '#c8c6c0',
              background: 'none', border: 'none', cursor: raw ? 'pointer' : 'default', padding: 0,
            }}
          >
            ล้าง
          </button>

          <button
            onClick={handleCopy}
            disabled={!isComplete}
            style={{
              fontFamily: 'var(--font-sans)', fontSize: 12,
              padding: '3px 10px', borderRadius: 5, cursor: isComplete ? 'pointer' : 'default',
              background: copied ? '#e1f5ee' : '#ffffff',
              color: copied ? '#085041' : (isComplete ? '#6b6960' : '#c8c6c0'),
              border: copied ? '0.5px solid #1D9E75' : '0.5px solid #c8c6c0',
              transition: 'all 0.15s',
            }}
          >
            {copied ? 'คัดลอกแล้ว ✓' : 'คัดลอก'}
          </button>
        </div>
      </div>

      {/* Result */}
      {isComplete && (
        <StatusBox valid={isValid} digits={digits} />
      )}

      {/* Structure breakdown — show when has enough digits */}
      {digits.length >= 1 && (
        <div style={{
          background: '#ffffff', border: '1px solid #c8c6c0',
          borderRadius: 8, overflow: 'hidden',
        }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #f0efec', background: '#fafaf8' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: 0 }}>
              โครงสร้างเลขบัตรประชาชน
            </p>
          </div>

          <div style={{ padding: '4px 14px 8px' }}>
            <StructureRow
              label="หมวดบุคคล (หลักที่ 1)"
              value={digits[0] ?? '-'}
              desc={category ? `${category.label} — ${category.desc}` : 'กรอกเลขหลักแรก'}
              highlight={!!digits[0]}
            />
            <StructureRow
              label="รหัสสำนักทะเบียน (หลักที่ 2–5)"
              value={digits.length >= 5 ? digits.slice(1, 5) : digits.slice(1) || '-'}
              desc="รหัสอำเภอ/เขตที่ออกบัตร"
            />
            <StructureRow
              label="กลุ่มของบุคคล (หลักที่ 6–10)"
              value={digits.length >= 10 ? digits.slice(5, 10) : digits.length > 5 ? digits.slice(5) : '-'}
              desc="กลุ่มที่ออกบัตรในสำนักทะเบียนนั้น"
            />
            <StructureRow
              label="ลำดับที่ (หลักที่ 11–12)"
              value={digits.length >= 12 ? digits.slice(10, 12) : digits.length > 10 ? digits.slice(10) : '-'}
              desc="ลำดับของบุคคลในกลุ่ม"
            />
            <StructureRow
              label="เลขตรวจสอบ (หลักที่ 13)"
              value={digits[12] ?? '-'}
              desc="Checksum สำหรับตรวจความถูกต้อง"
              highlight={isComplete}
            />
          </div>
        </div>
      )}

      {/* Info box */}
      <div style={{
        padding: '12px 14px', borderRadius: 8,
        background: '#eeedfe', border: '1px solid #8b7fd4',
      }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: '#3c3489', margin: 0, lineHeight: 1.6 }}>
          <strong>หมายเหตุ:</strong> เครื่องมือนี้ตรวจสอบเฉพาะโครงสร้างและ checksum ตามมาตรฐานกรมการปกครองเท่านั้น
          ไม่ได้ยืนยันว่าเลขนั้นมีตัวตนจริงในฐานข้อมูลประชากร
          ข้อมูลทั้งหมดประมวลผลในเบราว์เซอร์ ไม่มีการส่งออกไปยังเซิร์ฟเวอร์ใดๆ
        </p>
      </div>

    </div>
  )
}