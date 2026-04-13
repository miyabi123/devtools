'use client'

import { useState, useMemo } from 'react'

function countStats(text: string) {
  const chars = text.length
  const charsNoSpace = text.replace(/\s/g, '').length
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
  const sentences = text.trim() === '' ? 0 : (text.match(/[^.!?]*[.!?]+/g) || []).length
  const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim()).length
  const readingTime = Math.ceil(words / 200)
  return { chars, charsNoSpace, words, sentences, paragraphs, readingTime }
}

const SAMPLES = [
  { label: 'ภาษาอังกฤษ', text: 'The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet. It is often used for testing fonts and keyboards.' },
  { label: 'ภาษาไทย', text: 'ภาษาไทยเป็นภาษาที่มีความสวยงามและมีเอกลักษณ์เฉพาะตัว มีการใช้วรรณยุกต์ที่ทำให้ความหมายของคำเปลี่ยนไป ภาษาไทยมีพยัญชนะ 44 ตัว และสระจำนวนมาก' },
  { label: 'Mixed', text: 'Hello สวัสดี! This is a mixed text ข้อความภาษาผสม. Word counter works with any language รองรับทุกภาษา.' },
]

interface StatCardProps {
  label: string
  value: number | string
  sub?: string
  highlight?: boolean
}

function StatCard({ label, value, sub, highlight }: StatCardProps) {
  return (
    <div style={{
      background: highlight ? '#eeedfe' : '#f8f7f4',
      border: `0.5px solid ${highlight ? '#8b7fd4' : '#c8c6c0'}`,
      borderRadius: 8, padding: '12px 14px', textAlign: 'center',
    }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: highlight ? '#3c3489' : '#1a1917', margin: 0 }}>
        {typeof value === 'number' ? value.toLocaleString('th-TH') : value}
      </p>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: highlight ? '#3c3489' : '#6b6960', margin: '4px 0 0', letterSpacing: '0.04em' }}>{label}</p>
      {sub && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#a8a69e', margin: '2px 0 0' }}>{sub}</p>}
    </div>
  )
}

export default function WordCounter() {
  const [text, setText] = useState('')
  const stats = useMemo(() => countStats(text), [text])

  return (
    <div className="space-y-4">

      {/* Textarea */}
      <div style={{ background: '#ffffff', border: '1.5px solid #1a1917', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #e8e6e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>พิมพ์หรือวางข้อความ</span>
          {text && (
            <button onClick={() => setText('')} style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 8px',
              background: '#fcebeb', color: '#a32d2d',
              border: '0.5px solid #f09595', borderRadius: 4, cursor: 'pointer',
            }}>ล้าง</button>
          )}
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="พิมพ์หรือวางข้อความที่นี่... Type or paste your text here..."
          rows={10}
          style={{
            width: '100%', padding: '14px', border: 'none', outline: 'none', resize: 'vertical',
            fontFamily: 'var(--font-sans)', fontSize: 14, color: '#1a1917',
            background: 'transparent', lineHeight: 1.7, boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        <StatCard label="WORDS" value={stats.words} highlight />
        <StatCard label="CHARACTERS" value={stats.chars} />
        <StatCard label="NO SPACES" value={stats.charsNoSpace} />
        <StatCard label="SENTENCES" value={stats.sentences} />
        <StatCard label="PARAGRAPHS" value={stats.paragraphs} />
        <StatCard
          label="READING TIME"
          value={stats.readingTime < 1 ? '< 1' : stats.readingTime}
          sub="minutes @ 200 wpm"
        />
      </div>

      {/* Density bar */}
      {text.length > 0 && (
        <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, padding: '14px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: '0 0 10px' }}>CHARACTER BREAKDOWN</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Letters', count: (text.match(/[a-zA-Zก-๙]/g) || []).length, color: '#3c3489', bg: '#eeedfe' },
              { label: 'Spaces', count: (text.match(/\s/g) || []).length, color: '#085041', bg: '#e1f5ee' },
              { label: 'Numbers', count: (text.match(/[0-9]/g) || []).length, color: '#633806', bg: '#faeeda' },
              { label: 'Punctuation', count: (text.match(/[^\w\sก-๙]/g) || []).length, color: '#712b13', bg: '#faece7' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960', minWidth: 90 }}>{item.label}</span>
                <div style={{ flex: 1, background: '#f8f7f4', borderRadius: 99, height: 6, overflow: 'hidden' }}>
                  <div style={{
                    width: `${text.length > 0 ? (item.count / text.length) * 100 : 0}%`,
                    background: item.color, height: '100%', borderRadius: 99,
                    transition: 'width 0.3s ease',
                  }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#1a1917', minWidth: 36, textAlign: 'right' }}>
                  {item.count.toLocaleString('th-TH')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Samples */}
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: '0 0 6px' }}>ตัวอย่างข้อความ</p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SAMPLES.map(s => (
            <button key={s.label} onClick={() => setText(s.text)} style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 12px',
              background: '#ffffff', color: '#6b6960',
              border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
            }}>{s.label}</button>
          ))}
        </div>
      </div>

    </div>
  )
}