'use client'

import { useState, useCallback } from 'react'

// ── Constants ───────────────────────────────────────────────────
const VAT_RATE = 0.07

// ── Helpers ─────────────────────────────────────────────────────
function formatNumber(n: number): string {
  return n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function parseInput(s: string): number {
  const cleaned = s.replace(/,/g, '')
  const n = parseFloat(cleaned)
  return isNaN(n) ? 0 : Math.max(0, n)
}

// ── Sub-components (all top-level) ──────────────────────────────
function CopyButton({ text, disabled }: { text: string; disabled?: boolean }) {
  const [copied, setCopied] = useState(false)
  const handle = useCallback(() => {
    if (disabled) return
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
      {copied ? 'คัดลอกแล้ว ✓' : 'คัดลอก'}
    </button>
  )
}

function ResultRow({
  label, sublabel, value, highlight,
}: {
  label: string; sublabel?: string; value: string; highlight?: boolean
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 12, padding: '12px 16px',
      borderBottom: '1px solid #f0efec',
      background: highlight ? '#fafffe' : '#ffffff',
    }}>
      <div>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: 13,
          fontWeight: highlight ? 600 : 400,
          color: highlight ? '#085041' : '#1a1917', margin: 0,
        }}>
          {label}
        </p>
        {sublabel && (
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: '#a8a69e', margin: '2px 0 0',
          }}>
            {sublabel}
          </p>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: highlight ? 18 : 15,
          fontWeight: highlight ? 700 : 400,
          color: highlight ? '#085041' : '#1a1917',
          whiteSpace: 'nowrap',
        }}>
          {value}
        </span>
        <CopyButton text={value.replace(/[^\d.]/g, '')} disabled={value === '0.00'} />
      </div>
    </div>
  )
}

function ModeButton({
  label, sublabel, active, onClick,
}: {
  label: string; sublabel: string; active: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '10px 12px', borderRadius: 8,
        cursor: 'pointer', textAlign: 'left',
        background: active ? '#e1f5ee' : '#f8f7f4',
        border: active ? '1.5px solid #1D9E75' : '1.5px solid #c8c6c0',
        transition: 'all 0.15s',
      }}
    >
      <p style={{
        fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
        color: active ? '#085041' : '#1a1917', margin: 0,
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: 10,
        color: active ? '#085041' : '#a8a69e', margin: '3px 0 0',
        opacity: active ? 0.8 : 1,
      }}>
        {sublabel}
      </p>
    </button>
  )
}

// ── Main component ───────────────────────────────────────────────
export default function ThaiVatCalculator() {
  const [mode, setMode]   = useState<'add' | 'extract'>('add')
  const [input, setInput] = useState('')

  const amount  = parseInput(input)
  const hasValue = amount > 0

  // add mode: input = price before VAT
  // extract mode: input = price including VAT
  const beforeVat = mode === 'add'
    ? amount
    : parseFloat((amount / (1 + VAT_RATE)).toFixed(2))

  const vatAmount = parseFloat((beforeVat * VAT_RATE).toFixed(2))
  const afterVat  = parseFloat((beforeVat + vatAmount).toFixed(2))

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // allow digits, dot, comma only
    const val = e.target.value.replace(/[^0-9.,]/g, '')
    setInput(val)
  }, [])

  const handleClear = useCallback(() => setInput(''), [])

  const handleMode = useCallback((m: 'add' | 'extract') => {
    setMode(m)
    setInput('')
  }, [])

  return (
    <div className="space-y-4">

      {/* Mode selector */}
      <div style={{ display: 'flex', gap: 10 }}>
        <ModeButton
          label="บวก VAT"
          sublabel="ราคายังไม่รวม VAT → หายอดรวม"
          active={mode === 'add'}
          onClick={() => handleMode('add')}
        />
        <ModeButton
          label="ถอด VAT"
          sublabel="ราคารวม VAT แล้ว → หาราคาก่อน VAT"
          active={mode === 'extract'}
          onClick={() => handleMode('extract')}
        />
      </div>

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
            {mode === 'add' ? 'ราคาก่อน VAT (บาท)' : 'ราคารวม VAT แล้ว (บาท)'}
          </p>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e',
          }}>
            VAT {(VAT_RATE * 100).toFixed(0)}%
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', padding: '0 14px 12px', gap: 8 }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 22, color: '#a8a69e', flexShrink: 0,
          }}>
            ฿
          </span>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={input}
            onChange={handleInput}
            autoComplete="off"
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontFamily: 'var(--font-mono)', fontSize: 28,
              letterSpacing: '0.02em',
              color: '#1a1917', background: 'transparent',
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
            disabled={!input}
            style={{
              fontFamily: 'var(--font-sans)', fontSize: 12,
              color: input ? '#6b6960' : '#c8c6c0',
              background: 'none', border: 'none',
              cursor: input ? 'pointer' : 'default', padding: 0,
            }}
          >
            ล้าง
          </button>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e',
          }}>
            {mode === 'add' ? 'ราคา × 1.07' : 'ราคา ÷ 1.07'}
          </span>
        </div>
      </div>

      {/* Results */}
      <div style={{
        background: '#ffffff', border: '1px solid #c8c6c0',
        borderRadius: 10, overflow: 'hidden',
      }}>
        <div style={{
          padding: '10px 14px', borderBottom: '1px solid #f0efec', background: '#fafaf8',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: '#a8a69e', letterSpacing: '0.06em', margin: 0,
          }}>
            ผลการคำนวณ
          </p>
        </div>

        <ResultRow
          label="ราคาก่อน VAT"
          sublabel="มูลค่าสินค้า / บริการ"
          value={`฿ ${formatNumber(hasValue ? beforeVat : 0)}`}
          highlight={mode === 'extract'}
        />
        <ResultRow
          label="VAT 7%"
          sublabel="ภาษีมูลค่าเพิ่ม"
          value={`฿ ${formatNumber(hasValue ? vatAmount : 0)}`}
        />
        <ResultRow
          label="ราคารวม VAT"
          sublabel="ยอดชำระทั้งสิ้น"
          value={`฿ ${formatNumber(hasValue ? afterVat : 0)}`}
          highlight={mode === 'add'}
        />
      </div>

      {/* Formula info */}
      <div style={{
        padding: '12px 16px', borderRadius: 8,
        background: '#e1f5ee', border: '1px solid #1D9E75',
        display: 'flex', gap: 16, flexWrap: 'wrap',
      }}>
        <div>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: '#085041', margin: '0 0 4px', letterSpacing: '0.04em',
          }}>
            สูตรที่ใช้
          </p>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 12,
            color: '#085041', margin: 0, lineHeight: 1.8,
          }}>
            {mode === 'add' ? (
              <>
                ยอด VAT = ราคา × 0.07<br />
                ราคารวม = ราคา × 1.07
              </>
            ) : (
              <>
                ราคาก่อน VAT = ราคา ÷ 1.07<br />
                ยอด VAT = ราคาก่อน VAT × 0.07
              </>
            )}
          </p>
        </div>
        {hasValue && (
          <div>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: '#085041', margin: '0 0 4px', letterSpacing: '0.04em',
            }}>
              ตัวอย่าง
            </p>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 12,
              color: '#085041', margin: 0, lineHeight: 1.8,
            }}>
              {mode === 'add' ? (
                <>
                  {formatNumber(beforeVat)} × 0.07 = {formatNumber(vatAmount)}<br />
                  {formatNumber(beforeVat)} × 1.07 = {formatNumber(afterVat)}
                </>
              ) : (
                <>
                  {formatNumber(amount)} ÷ 1.07 = {formatNumber(beforeVat)}<br />
                  {formatNumber(beforeVat)} × 0.07 = {formatNumber(vatAmount)}
                </>
              )}
            </p>
          </div>
        )}
      </div>

    </div>
  )
}