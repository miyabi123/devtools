'use client'

import { useState, useRef, useCallback } from 'react'

const SIZES = [16, 32, 48, 64, 128, 192, 512]

const REQUIRED = [
  { size: 16,  label: 'Browser tab',       required: true },
  { size: 32,  label: 'Taskbar / Retina',  required: true },
  { size: 48,  label: 'Windows site icon', required: false },
  { size: 64,  label: 'Safari pinned',     required: false },
  { size: 128, label: 'Chrome Web Store',  required: false },
  { size: 192, label: 'Android / PWA',     required: true },
  { size: 512, label: 'PWA splash screen', required: false },
]

function generateCanvas(img: HTMLImageElement, size: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.clearRect(0, 0, size, size)
  ctx.drawImage(img, 0, 0, size, size)
  return canvas
}

async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((res, rej) => {
    canvas.toBlob(blob => blob ? res(blob) : rej(new Error('Failed')), 'image/png')
  })
}

export default function FaviconGenerator() {
  const [original, setOriginal] = useState<{ url: string; name: string; width: number; height: number } | null>(null)
  const [previews, setPreviews] = useState<Record<number, string>>({})
  const [selected, setSelected] = useState<number[]>([16, 32, 192])
  const [isDragging, setIsDragging] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [rounded, setRounded] = useState(false)
  const [padding, setPadding] = useState(0)
  const [bgColor, setBgColor] = useState('#ffffff')
  const [transparent, setTransparent] = useState(true)
  const fileRef = useRef<HTMLInputElement>(null)

  const loadImage = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = async () => {
      setOriginal({ url, name: file.name, width: img.width, height: img.height })
      // Generate previews for all sizes
      const newPreviews: Record<number, string> = {}
      for (const size of SIZES) {
        const canvas = document.createElement('canvas')
        canvas.width = size; canvas.height = size
        const ctx = canvas.getContext('2d')!
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        if (!transparent) {
          ctx.fillStyle = bgColor
          ctx.fillRect(0, 0, size, size)
        }
        if (rounded) {
          const r = size * 0.2
          ctx.beginPath()
          ctx.moveTo(r, 0)
          ctx.lineTo(size - r, 0)
          ctx.quadraticCurveTo(size, 0, size, r)
          ctx.lineTo(size, size - r)
          ctx.quadraticCurveTo(size, size, size - r, size)
          ctx.lineTo(r, size)
          ctx.quadraticCurveTo(0, size, 0, size - r)
          ctx.lineTo(0, r)
          ctx.quadraticCurveTo(0, 0, r, 0)
          ctx.closePath()
          ctx.clip()
        }
        const pad = size * padding / 100
        ctx.drawImage(img, pad, pad, size - pad * 2, size - pad * 2)
        newPreviews[size] = canvas.toDataURL('image/png')
      }
      setPreviews(newPreviews)
    }
    img.src = url
  }, [transparent, bgColor, rounded, padding])

  const regenerate = useCallback(async () => {
    if (!original) return
    setGenerating(true)
    const img = new Image()
    img.src = original.url
    await new Promise(res => { img.onload = res })
    const newPreviews: Record<number, string> = {}
    for (const size of SIZES) {
      const canvas = document.createElement('canvas')
      canvas.width = size; canvas.height = size
      const ctx = canvas.getContext('2d')!
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      if (!transparent) {
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, size, size)
      }
      if (rounded) {
        const r = size * 0.2
        ctx.beginPath()
        ctx.moveTo(r, 0); ctx.lineTo(size - r, 0)
        ctx.quadraticCurveTo(size, 0, size, r)
        ctx.lineTo(size, size - r)
        ctx.quadraticCurveTo(size, size, size - r, size)
        ctx.lineTo(r, size)
        ctx.quadraticCurveTo(0, size, 0, size - r)
        ctx.lineTo(0, r)
        ctx.quadraticCurveTo(0, 0, r, 0)
        ctx.closePath()
        ctx.clip()
      }
      const pad = size * padding / 100
      ctx.drawImage(img, pad, pad, size - pad * 2, size - pad * 2)
      newPreviews[size] = canvas.toDataURL('image/png')
    }
    setPreviews(newPreviews)
    setGenerating(false)
  }, [original, transparent, bgColor, rounded, padding])

  const downloadSingle = (size: number) => {
    if (!previews[size]) return
    const a = document.createElement('a')
    a.href = previews[size]
    a.download = `favicon-${size}x${size}.png`
    a.click()
  }

  const downloadAll = async () => {
    if (!original) return
    setGenerating(true)
    const img = new Image()
    img.src = original.url
    await new Promise(res => { img.onload = res })

    // Download selected sizes one by one
    for (const size of selected) {
      if (!previews[size]) continue
      const a = document.createElement('a')
      a.href = previews[size]
      a.download = size === 32 ? 'favicon.ico' : `favicon-${size}x${size}.png`
      a.click()
      await new Promise(res => setTimeout(res, 200))
    }
    setGenerating(false)
  }

  const toggleSize = (size: number) => {
    setSelected(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) loadImage(file)
  }

  const reset = () => {
    setOriginal(null); setPreviews({})
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="space-y-4">

      {/* Upload */}
      {!original ? (
        <div
          onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? '#1a1917' : '#c8c6c0'}`,
            borderRadius: 12, padding: '48px 24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            cursor: 'pointer', background: isDragging ? '#f0ede8' : '#ffffff',
            transition: 'all .15s',
          }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#a8a69e" strokeWidth="1.5">
            <rect x="4" y="4" width="32" height="32" rx="8"/>
            <rect x="12" y="12" width="16" height="16" rx="3"/>
            <circle cx="16" cy="16" r="2"/>
          </svg>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1a1917', margin: 0 }}>
            Drop image here or click to upload
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e', margin: 0 }}>
            PNG with transparent background recommended · min 512×512px
          </p>
          <input ref={fileRef} type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) loadImage(f) }} style={{ display: 'none' }} />
        </div>
      ) : (
        <>
          {/* Source info */}
          <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src={original.url} alt="source" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, border: '0.5px solid #c8c6c0' }} />
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#1a1917', margin: 0 }}>{original.name}</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: 0 }}>{original.width} × {original.height}px</p>
              </div>
            </div>
            <button onClick={reset} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 10px', background: 'transparent', color: '#a8a69e', border: '0.5px solid #e8e6e0', borderRadius: 4, cursor: 'pointer' }}>
              change
            </button>
          </div>

          {/* Options */}
          <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #c8c6c0' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>style options</span>
            </div>
            <div style={{ padding: '12px 14px', display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>

              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="checkbox" checked={rounded} onChange={e => setRounded(e.target.checked)} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960' }}>rounded corners</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="checkbox" checked={transparent} onChange={e => setTransparent(e.target.checked)} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960' }}>transparent background</span>
              </label>

              {!transparent && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e' }}>bg color:</span>
                  <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                    style={{ width: 28, height: 28, borderRadius: 4, border: '0.5px solid #c8c6c0', cursor: 'pointer', padding: 2 }} />
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e' }}>padding:</span>
                <input type="range" min={0} max={30} value={padding} onChange={e => setPadding(Number(e.target.value))} style={{ width: 70 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#1a1917' }}>{padding}%</span>
              </div>

              <button onClick={regenerate} disabled={generating} style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, padding: '5px 14px',
                background: '#1a1917', color: '#f8f7f4',
                border: 'none', borderRadius: 5, cursor: 'pointer',
              }}>apply</button>

            </div>
          </div>

          {/* Preview grid */}
          {Object.keys(previews).length > 0 && (
            <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #c8c6c0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>favicon sizes</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>click checkbox to select · click icon to download</span>
              </div>
              <div style={{ padding: '14px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
                {REQUIRED.map(({ size, label, required }) => (
                  <div key={size} style={{
                    background: selected.includes(size) ? '#e1f5ee' : '#f8f7f4',
                    border: `0.5px solid ${selected.includes(size) ? '#1D9E75' : '#c8c6c0'}`,
                    borderRadius: 8, padding: '10px',
                    transition: 'all .15s',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                        <input type="checkbox" checked={selected.includes(size)} onChange={() => toggleSize(size)} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6b6960' }}>{size}×{size}</span>
                        {required && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, background: '#eeedfe', color: '#3c3489', padding: '0 4px', borderRadius: 3 }}>required</span>}
                      </label>
                    </div>

                    {/* Preview */}
                    <div
                      onClick={() => downloadSingle(size)}
                      style={{
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        height: 60, cursor: 'pointer',
                        background: 'repeating-conic-gradient(#e8e6e0 0% 25%, #ffffff 0% 50%) 0 0 / 10px 10px',
                        borderRadius: 6, overflow: 'hidden',
                      }}
                      title={`Download ${size}×${size}`}
                    >
                      {previews[size] && (
                        <img src={previews[size]} alt={`${size}px`}
                          style={{ width: Math.min(size, 48), height: Math.min(size, 48), imageRendering: size <= 32 ? 'pixelated' : 'auto' }} />
                      )}
                    </div>

                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#a8a69e', margin: '6px 0 0', textAlign: 'center' }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Download */}
          {Object.keys(previews).length > 0 && (
            <>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button onClick={downloadAll} disabled={generating || selected.length === 0} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 13, padding: '10px 24px',
                  background: '#1a1917', color: '#f8f7f4',
                  border: 'none', borderRadius: 7, cursor: 'pointer',
                }}>
                  {generating ? 'downloading...' : `Download ${selected.length} files`}
                </button>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e' }}>
                  selected: {selected.sort((a,b) => a-b).join(', ')}px
                </span>
              </div>

              {/* HTML snippet */}
              <div style={{ background: '#1a1917', borderRadius: 8, padding: '12px 16px' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6b6960', margin: '0 0 8px', letterSpacing: '0.06em' }}>HTML — paste in {'<head>'}</p>
                <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#f8f7f4', margin: 0, whiteSpace: 'pre-wrap' }}>{`<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" href="/favicon.ico">`}</pre>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}