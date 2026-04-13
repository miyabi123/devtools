'use client'

import { useState } from 'react'

// ── Lorem Ipsum word pool ────────────────────────────────────────
const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde',
  'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium', 'doloremque',
  'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab',
  'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta',
  'explicabo', 'nemo', 'ipsam', 'quia', 'voluptas', 'aspernatur', 'odit', 'fugit',
]

// ── Thai word pool ───────────────────────────────────────────────
const THAI_WORDS = [
  'การ', 'ที่', 'และ', 'ใน', 'มี', 'เป็น', 'ของ', 'ได้', 'จะ', 'ให้',
  'กับ', 'ไม่', 'นี้', 'ว่า', 'แต่', 'หรือ', 'โดย', 'จาก', 'ซึ่ง', 'ใช้',
  'ทำ', 'เพื่อ', 'ต้อง', 'ดัง', 'เมื่อ', 'เขา', 'เธอ', 'เรา', 'พวก', 'บาง',
  'ทุก', 'แต่ละ', 'หลาย', 'ตาม', 'ใหม่', 'เก่า', 'ดี', 'ดีมาก', 'สวย',
  'ระบบ', 'ข้อมูล', 'การทำงาน', 'ผู้ใช้', 'โปรแกรม', 'คอมพิวเตอร์', 'เทคโนโลยี',
  'นวัตกรรม', 'พัฒนา', 'ออกแบบ', 'สร้าง', 'จัดการ', 'ควบคุม', 'ตรวจสอบ',
  'รายงาน', 'ผลลัพธ์', 'เป้าหมาย', 'แผนการ', 'กลยุทธ์', 'วิธีการ', 'กระบวนการ',
  'องค์กร', 'ทีมงาน', 'บริษัท', 'หน่วยงาน', 'แผนก', 'สถาบัน', 'โครงการ',
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function generateSentence(lang: 'en' | 'th', wordCount = 0): string {
  const pool = lang === 'en' ? LOREM_WORDS : THAI_WORDS
  const count = wordCount || (lang === 'en' ? 8 + Math.floor(Math.random() * 12) : 6 + Math.floor(Math.random() * 8))
  const words = Array.from({ length: count }, () => pick(pool))
  if (lang === 'en') {
    return capitalize(words.join(' ')) + '.'
  }
  return words.join('') + '.'
}

function generateParagraph(lang: 'en' | 'th'): string {
  const sentenceCount = 3 + Math.floor(Math.random() * 3)
  const sentences = Array.from({ length: sentenceCount }, () => generateSentence(lang))
  return sentences.join(lang === 'en' ? ' ' : '')
}

function generateWords(lang: 'en' | 'th', count: number): string {
  const pool = lang === 'en' ? LOREM_WORDS : THAI_WORDS
  const words = Array.from({ length: count }, () => pick(pool))
  if (lang === 'en') return capitalize(words.join(' '))
  return words.join('')
}

const CLASSIC_START = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

type GenType = 'paragraphs' | 'sentences' | 'words'
type Lang = 'en' | 'th'

export default function LoremIpsumGenerator() {
  const [lang, setLang] = useState<Lang>('en')
  const [type, setType] = useState<GenType>('paragraphs')
  const [count, setCount] = useState(3)
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const generate = () => {
    let result = ''
    if (type === 'paragraphs') {
      const paras = Array.from({ length: count }, (_, i) => {
        if (i === 0 && startWithLorem && lang === 'en') return CLASSIC_START + ' ' + generateParagraph(lang)
        return generateParagraph(lang)
      })
      result = paras.join('\n\n')
    } else if (type === 'sentences') {
      const sentences = Array.from({ length: count }, (_, i) => {
        if (i === 0 && startWithLorem && lang === 'en') return CLASSIC_START
        return generateSentence(lang)
      })
      result = sentences.join(lang === 'en' ? ' ' : '')
    } else {
      result = generateWords(lang, count)
    }
    setOutput(result)
  }

  const copy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const typeOptions: { val: GenType; label: string }[] = [
    { val: 'paragraphs', label: 'Paragraphs' },
    { val: 'sentences', label: 'Sentences' },
    { val: 'words', label: 'Words' },
  ]

  const countOptions = type === 'paragraphs'
    ? [1, 2, 3, 5, 10]
    : type === 'sentences'
    ? [1, 3, 5, 10, 20]
    : [10, 25, 50, 100, 200]

  return (
    <div className="space-y-4">

      {/* Language toggle */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960' }}>Language:</span>
        <div style={{ display: 'flex', background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 6, overflow: 'hidden' }}>
          <button onClick={() => setLang('en')} style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 14px',
            background: lang === 'en' ? '#1a1917' : 'transparent',
            color: lang === 'en' ? '#f8f7f4' : '#6b6960',
            border: 'none', cursor: 'pointer',
          }}>🌐 Latin (Lorem Ipsum)</button>
          <button onClick={() => setLang('th')} style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 14px',
            background: lang === 'th' ? '#1a1917' : 'transparent',
            color: lang === 'th' ? '#f8f7f4' : '#6b6960',
            border: 'none', cursor: 'pointer',
          }}>🇹🇭 ภาษาไทย</button>
        </div>
      </div>

      {/* Config */}
      <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Type */}
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: '0 0 8px' }}>TYPE</p>
          <div style={{ display: 'flex', gap: 6 }}>
            {typeOptions.map(o => (
              <button key={o.val} onClick={() => setType(o.val)} style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 14px',
                background: type === o.val ? '#1a1917' : '#f8f7f4',
                color: type === o.val ? '#f8f7f4' : '#6b6960',
                border: '0.5px solid #c8c6c0', borderRadius: 6, cursor: 'pointer',
              }}>{o.val === 'paragraphs' ? '¶ Paragraphs' : o.val === 'sentences' ? '— Sentences' : 'W Words'}</button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: '0 0 8px' }}>AMOUNT</p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {countOptions.map(n => (
              <button key={n} onClick={() => setCount(n)} style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 14px',
                background: count === n ? '#1a1917' : '#f8f7f4',
                color: count === n ? '#f8f7f4' : '#6b6960',
                border: '0.5px solid #c8c6c0', borderRadius: 6, cursor: 'pointer',
              }}>{n}</button>
            ))}
          </div>
        </div>

        {/* Start with Lorem option */}
        {lang === 'en' && type !== 'words' && (
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={startWithLorem}
              onChange={e => setStartWithLorem(e.target.checked)} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: '#1a1917' }}>
              Start with "Lorem ipsum dolor sit amet..."
            </span>
          </label>
        )}

        {/* Generate button */}
        <button onClick={generate} style={{
          fontFamily: 'var(--font-mono)', fontSize: 13, padding: '10px 20px',
          background: '#1a1917', color: '#f8f7f4',
          border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500,
          alignSelf: 'flex-start',
        }}>Generate →</button>
      </div>

      {/* Output */}
      {output && (
        <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #e8e6e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>
              OUTPUT — {count} {type} · {output.split(/\s+/).filter(Boolean).length} words
            </span>
            <button onClick={copy} style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px',
              background: copied ? '#e1f5ee' : 'transparent',
              color: copied ? '#085041' : '#6b6960',
              border: `0.5px solid ${copied ? '#1D9E75' : '#c8c6c0'}`,
              borderRadius: 5, cursor: 'pointer',
            }}>{copied ? '✓ Copied!' : 'Copy'}</button>
          </div>
          <div style={{ padding: '16px', fontFamily: 'var(--font-sans)', fontSize: 14, color: '#1a1917', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {output}
          </div>
        </div>
      )}

    </div>
  )
}