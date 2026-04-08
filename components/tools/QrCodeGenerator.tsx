'use client'

import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'

type InputType = 'url' | 'text' | 'email' | 'phone' | 'wifi'
type ErrorLevel = 'L' | 'M' | 'Q' | 'H'

const INPUT_TYPES: { value: InputType; label: string; placeholder: string }[] = [
  { value: 'url',   label: 'URL',   placeholder: 'https://freeutil.app' },
  { value: 'text',  label: 'Text',  placeholder: 'Enter any text...' },
  { value: 'email', label: 'Email', placeholder: 'hello@example.com' },
  { value: 'phone', label: 'Phone', placeholder: '+66812345678' },
  { value: 'wifi',  label: 'WiFi',  placeholder: 'Network name (SSID)' },
]

const ERROR_LEVELS: { value: ErrorLevel; label: string; desc: string }[] = [
  { value: 'L', label: 'L — Low',    desc: '7% damage recovery' },
  { value: 'M', label: 'M — Medium', desc: '15% damage recovery' },
  { value: 'Q', label: 'Q — High',   desc: '25% damage recovery' },
  { value: 'H', label: 'H — Max',    desc: '30% damage recovery' },
]

const SIZES = [128, 256, 512, 1024]

function buildQrContent(type: InputType, value: string, wifi: { ssid: string; password: string; encryption: string }): string {
  switch (type) {
    case 'url':   return value.startsWith('http') ? value : `https://${value}`
    case 'email': return `mailto:${value}`
    case 'phone': return `tel:${value}`
    case 'wifi':  return `WIFI:T:${wifi.encryption};S:${wifi.ssid};P:${wifi.password};;`
    default:      return value
  }
}

export default function QrCodeGenerator() {
  const [type, setType] = useState<InputType>('url')
  const [value, setValue] = useState('')
  const [wifiSsid, setWifiSsid] = useState('')
  const [wifiPassword, setWifiPassword] = useState('')
  const [wifiEncryption, setWifiEncryption] = useState('WPA')
  const [errorLevel, setErrorLevel] = useState<ErrorLevel>('M')
  const [size, setSize] = useState(256)
  const [fgColor, setFgColor] = useState('#1a1917')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const content = type === 'wifi'
    ? buildQrContent('wifi', '', { ssid: wifiSsid, password: wifiPassword, encryption: wifiEncryption })
    : buildQrContent(type, value, { ssid: '', password: '', encryption: '' })

  const hasContent = type === 'wifi' ? wifiSsid.trim().length > 0 : value.trim().length > 0

  useEffect(() => {
    if (!hasContent) { setQrDataUrl(''); setError(''); return }
    const generate = async () => {
      try {
        const url = await QRCode.toDataURL(content, {
          width: size,
          margin: 2,
          errorCorrectionLevel: errorLevel,
          color: { dark: fgColor, light: bgColor },
        })
        setQrDataUrl(url)
        setError('')
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to generate QR code')
        setQrDataUrl('')
      }
    }
    generate()
  }, [content, size, errorLevel, fgColor, bgColor, hasContent])

  const download = () => {
    if (!qrDataUrl) return
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = `qrcode-${type}-${Date.now()}.png`
    a.click()
  }

  const copyImage = async () => {
    if (!qrDataUrl) return
    try {
      const res = await fetch(qrDataUrl)
      const blob = await res.blob()
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setCopied(true); setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="space-y-4">

      {/* Type selector */}
      <div style={{ display: 'flex', background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 6, overflow: 'hidden', width: 'fit-content' }}>
        {INPUT_TYPES.map(t => (
          <button key={t.value} onClick={() => { setType(t.value); setValue('') }} style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 14px',
            background: type === t.value ? '#1a1917' : 'transparent',
            color: type === t.value ? '#f8f7f4' : '#6b6960',
            border: 'none', cursor: 'pointer', transition: 'all .15s',
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>

        {/* Left — inputs + options */}
        <div className="space-y-4">

          {/* Input */}
          {type !== 'wifi' ? (
            <div style={{ background: '#ffffff', border: '1.5px solid #1a1917', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #e8e6e0' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>
                  {INPUT_TYPES.find(t => t.value === type)?.label} input
                </span>
              </div>
              <input
                type={type === 'email' ? 'email' : type === 'phone' ? 'tel' : 'text'}
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder={INPUT_TYPES.find(t => t.value === type)?.placeholder}
                style={{
                  width: '100%', padding: '12px 14px', border: 'none', outline: 'none',
                  fontFamily: 'var(--font-mono)', fontSize: 14, color: '#1a1917', background: 'transparent',
                }}
              />
            </div>
          ) : (
            <div style={{ background: '#ffffff', border: '1.5px solid #1a1917', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #e8e6e0' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>WiFi credentials</span>
              </div>
              <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: '0 0 4px' }}>SSID (Network name)</p>
                  <input type="text" value={wifiSsid} onChange={e => setWifiSsid(e.target.value)}
                    placeholder="MyWiFiNetwork"
                    style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: 13, padding: '8px 10px', border: '0.5px solid #c8c6c0', borderRadius: 6, outline: 'none', color: '#1a1917' }} />
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: '0 0 4px' }}>Password</p>
                  <input type="text" value={wifiPassword} onChange={e => setWifiPassword(e.target.value)}
                    placeholder="password"
                    style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: 13, padding: '8px 10px', border: '0.5px solid #c8c6c0', borderRadius: 6, outline: 'none', color: '#1a1917' }} />
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['WPA', 'WEP', 'nopass'].map(enc => (
                    <button key={enc} onClick={() => setWifiEncryption(enc)} style={{
                      fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 12px',
                      background: wifiEncryption === enc ? '#1a1917' : '#f8f7f4',
                      color: wifiEncryption === enc ? '#f8f7f4' : '#6b6960',
                      border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
                    }}>{enc}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Options */}
          <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #c8c6c0' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>options</span>
            </div>
            <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Size */}
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: '0 0 6px' }}>SIZE (px)</p>
                <div style={{ display: 'flex', gap: 6 }}>
                  {SIZES.map(s => (
                    <button key={s} onClick={() => setSize(s)} style={{
                      fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 12px',
                      background: size === s ? '#1a1917' : '#f8f7f4',
                      color: size === s ? '#f8f7f4' : '#6b6960',
                      border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
                    }}>{s}</button>
                  ))}
                </div>
              </div>

              {/* Error correction */}
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: '0 0 6px' }}>ERROR CORRECTION</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {ERROR_LEVELS.map(el => (
                    <button key={el.value} onClick={() => setErrorLevel(el.value)} title={el.desc} style={{
                      fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 12px',
                      background: errorLevel === el.value ? '#1a1917' : '#f8f7f4',
                      color: errorLevel === el.value ? '#f8f7f4' : '#6b6960',
                      border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
                    }}>{el.label}</button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div style={{ display: 'flex', gap: 16 }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: '0 0 6px' }}>FOREGROUND</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)}
                      style={{ width: 32, height: 32, borderRadius: 6, border: '0.5px solid #c8c6c0', cursor: 'pointer', padding: 2 }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960' }}>{fgColor}</span>
                  </div>
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: '0 0 6px' }}>BACKGROUND</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                      style={{ width: 32, height: 32, borderRadius: 6, border: '0.5px solid #c8c6c0', cursor: 'pointer', padding: 2 }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960' }}>{bgColor}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button onClick={() => { setFgColor('#1a1917'); setBgColor('#ffffff') }} style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10, padding: '6px 10px',
                    background: 'transparent', color: '#a8a69e',
                    border: '0.5px solid #e8e6e0', borderRadius: 5, cursor: 'pointer',
                  }}>reset</button>
                </div>
              </div>

            </div>
          </div>

          {/* Content preview */}
          {hasContent && (
            <div style={{ background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 6, padding: '8px 14px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: '0 0 4px' }}>ENCODED CONTENT</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#1a1917', margin: 0, wordBreak: 'break-all' }}>{content}</p>
            </div>
          )}

        </div>

        {/* Right — QR preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <div style={{
            width: 240, height: 240,
            background: hasContent && qrDataUrl ? bgColor : '#f8f7f4',
            border: '1px solid #c8c6c0', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="QR Code" style={{ width: 220, height: 220, imageRendering: 'pixelated' }} />
            ) : (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: 0 }}>
                  {hasContent ? 'generating...' : 'enter content\nto generate'}
                </p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          {qrDataUrl && (
            <div style={{ display: 'flex', gap: 6, width: '100%' }}>
              <button onClick={download} style={{
                flex: 1, fontFamily: 'var(--font-mono)', fontSize: 11, padding: '8px 0',
                background: '#1a1917', color: '#f8f7f4',
                border: 'none', borderRadius: 6, cursor: 'pointer',
              }}>download PNG</button>
              <button onClick={copyImage} style={{
                flex: 1, fontFamily: 'var(--font-mono)', fontSize: 11, padding: '8px 0',
                background: 'transparent', color: '#6b6960',
                border: '0.5px solid #c8c6c0', borderRadius: 6, cursor: 'pointer',
              }}>{copied ? 'copied!' : 'copy image'}</button>
            </div>
          )}

          {qrDataUrl && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: 0, textAlign: 'center' }}>
              {size}×{size}px · Error correction {errorLevel}
            </p>
          )}
        </div>
      </div>

      {error && (
        <div style={{ background: '#fcebeb', border: '0.5px solid #f09595', borderRadius: 6, padding: '10px 14px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a32d2d', margin: 0 }}>{error}</p>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />

    </div>
  )
}