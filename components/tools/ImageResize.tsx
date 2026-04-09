'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp'
type ResizeMode = 'pixels' | 'percentage'

const FORMATS: { value: OutputFormat; label: string; ext: string }[] = [
  { value: 'image/jpeg', label: 'JPG', ext: 'jpg' },
  { value: 'image/png',  label: 'PNG', ext: 'png' },
  { value: 'image/webp', label: 'WebP', ext: 'webp' },
]

const PRESETS = [
  { label: 'HD 1280×720',   w: 1280, h: 720 },
  { label: 'FHD 1920×1080', w: 1920, h: 1080 },
  { label: 'Square 512',    w: 512,  h: 512 },
  { label: 'Square 1024',   w: 1024, h: 1024 },
  { label: 'Thumbnail 150', w: 150,  h: 150 },
  { label: 'Social 1200×630', w: 1200, h: 630 },
]

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function ImageResize() {
  const [original, setOriginal] = useState<{ url: string; width: number; height: number; size: number; name: string } | null>(null)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [lockAspect, setLockAspect] = useState(true)
  const [mode, setMode] = useState<ResizeMode>('pixels')
  const [percentage, setPercentage] = useState(100)
  const [format, setFormat] = useState<OutputFormat>('image/png')
  const [quality, setQuality] = useState(92)
  const [outputUrl, setOutputUrl] = useState('')
  const [outputSize, setOutputSize] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const aspectRatio = useRef(1)
  const originalUrlRef = useRef('')
  const outputUrlRef = useRef('')

  useEffect(() => {
    return () => {
      if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current)
      if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current)
    }
  }, [])

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current)
    if (outputUrlRef.current) { URL.revokeObjectURL(outputUrlRef.current); outputUrlRef.current = '' }
    const url = URL.createObjectURL(file)
    originalUrlRef.current = url
    const img = new Image()
    img.onload = () => {
      aspectRatio.current = img.width / img.height
      setOriginal({ url, width: img.width, height: img.height, size: file.size, name: file.name })
      setWidth(img.width)
      setHeight(img.height)
      setPercentage(100)
      setOutputUrl('')
    }
    img.src = url
  }, [])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) loadImage(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) loadImage(file)
  }

  const handleWidthChange = (val: number) => {
    setWidth(val)
    if (lockAspect && val > 0) setHeight(Math.round(val / aspectRatio.current))
  }

  const handleHeightChange = (val: number) => {
    setHeight(val)
    if (lockAspect && val > 0) setWidth(Math.round(val * aspectRatio.current))
  }

  const handlePercentage = (val: number) => {
    setPercentage(val)
    if (original) {
      setWidth(Math.round(original.width * val / 100))
      setHeight(Math.round(original.height * val / 100))
    }
  }

  const applyPreset = (w: number, h: number) => {
    setMode('pixels')
    setWidth(w)
    if (lockAspect) setHeight(Math.round(w / aspectRatio.current))
    else setHeight(h)
  }

  const resize = useCallback(async () => {
    if (!original || !width || !height) return
    setProcessing(true)
    try {
      const img = new Image()
      img.src = original.url
      await new Promise(res => { img.onload = res })
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(blob => {
        if (!blob) return
        if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current)
        const url = URL.createObjectURL(blob)
        outputUrlRef.current = url
        setOutputUrl(url)
        setOutputSize(blob.size)
        setProcessing(false)
      }, format, format === 'image/png' ? undefined : quality / 100)
    } catch { setProcessing(false) }
  }, [original, width, height, format, quality])

  const download = () => {
    if (!outputUrl || !original) return
    const ext = FORMATS.find(f => f.value === format)?.ext || 'jpg'
    const name = original.name.replace(/\.[^.]+$/, '') + `_${width}x${height}.${ext}`
    const a = document.createElement('a')
    a.href = outputUrl; a.download = name; a.click()
  }

  const reset = () => {
    if (originalUrlRef.current) { URL.revokeObjectURL(originalUrlRef.current); originalUrlRef.current = '' }
    if (outputUrlRef.current) { URL.revokeObjectURL(outputUrlRef.current); outputUrlRef.current = '' }
    setOriginal(null); setOutputUrl(''); setWidth(0); setHeight(0)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="space-y-4">

      {/* Upload zone */}
      {!original ? (
        <div
          onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? '#1a1917' : '#c8c6c0'}`,
            borderRadius: 12, padding: '48px 24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
            cursor: 'pointer', background: isDragging ? '#f0ede8' : '#ffffff',
            transition: 'all .15s',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#a8a69e" strokeWidth="1.5">
            <rect x="2" y="6" width="28" height="20" rx="3"/>
            <circle cx="11" cy="13" r="2.5"/>
            <path d="M2 22l7-6 5 5 4-4 8 7"/>
          </svg>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1a1917', margin: 0 }}>
            Drop image here or click to upload
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e', margin: 0 }}>
            JPG, PNG, WebP, GIF, BMP supported
          </p>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
        </div>
      ) : (
        <>
          {/* Image info */}
          <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', borderBottom: '0.5px solid #c8c6c0' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>original image</span>
              <button onClick={reset} style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 8px',
                background: 'transparent', color: '#a8a69e',
                border: '0.5px solid #e8e6e0', borderRadius: 4, cursor: 'pointer',
              }}>change image</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 12, padding: '12px 14px', alignItems: 'center' }}>
              <img src={original.url} alt="original" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6, border: '0.5px solid #c8c6c0' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#1a1917', margin: 0 }}>{original.name}</p>
                <div style={{ display: 'flex', gap: 12 }}>
                  {[
                    { label: 'dimensions', value: `${original.width} × ${original.height}px` },
                    { label: 'size', value: formatBytes(original.size) },
                  ].map(item => (
                    <div key={item.label}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#a8a69e' }}>{item.label} </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#1a1917' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Resize options */}
          <div style={{ background: '#ffffff', border: '1.5px solid #1a1917', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #e8e6e0', display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>resize to</span>
              <div style={{ display: 'flex', background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 5, overflow: 'hidden' }}>
                {(['pixels', 'percentage'] as const).map(m => (
                  <button key={m} onClick={() => setMode(m)} style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10, padding: '4px 10px',
                    background: mode === m ? '#1a1917' : 'transparent',
                    color: mode === m ? '#f8f7f4' : '#6b6960',
                    border: 'none', cursor: 'pointer',
                  }}>{m}</button>
                ))}
              </div>
            </div>

            <div style={{ padding: '14px' }}>
              {mode === 'percentage' ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960' }}>scale</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 500, color: '#1a1917' }}>{percentage}%</span>
                  </div>
                  <input type="range" min={1} max={200} value={percentage} onChange={e => handlePercentage(Number(e.target.value))}
                    style={{ width: '100%', marginBottom: 6 }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#a8a69e' }}>1%</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960' }}>→ {width} × {height}px</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#a8a69e' }}>200%</span>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#a8a69e', margin: '0 0 4px' }}>WIDTH (px)</p>
                    <input type="number" value={width} onChange={e => handleWidthChange(Number(e.target.value))} min={1}
                      style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 500, padding: '8px 10px', border: '0.5px solid #c8c6c0', borderRadius: 6, outline: 'none', color: '#1a1917' }} />
                  </div>
                  <button onClick={() => setLockAspect(!lockAspect)} title={lockAspect ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
                    style={{ marginTop: 16, padding: '8px', background: lockAspect ? '#1a1917' : '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 6, cursor: 'pointer' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={lockAspect ? '#f8f7f4' : '#6b6960'} strokeWidth="1.5">
                      {lockAspect
                        ? <><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5 7V5a3 3 0 016 0v2"/></>
                        : <><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5 7V5a3 3 0 016 0" opacity="0.3"/></>
                      }
                    </svg>
                  </button>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#a8a69e', margin: '0 0 4px' }}>HEIGHT (px)</p>
                    <input type="number" value={height} onChange={e => handleHeightChange(Number(e.target.value))} min={1}
                      style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 500, padding: '8px 10px', border: '0.5px solid #c8c6c0', borderRadius: 6, outline: 'none', color: '#1a1917' }} />
                  </div>
                </div>
              )}

              {/* Presets */}
              <div style={{ marginTop: 12 }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: '0 0 6px' }}>PRESETS</p>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {PRESETS.map(p => (
                    <button key={p.label} onClick={() => applyPreset(p.w, p.h)} style={{
                      fontFamily: 'var(--font-mono)', fontSize: 9, padding: '3px 8px',
                      background: width === p.w && height === p.h ? '#1a1917' : '#f8f7f4',
                      color: width === p.w && height === p.h ? '#f8f7f4' : '#6b6960',
                      border: '0.5px solid #c8c6c0', borderRadius: 4, cursor: 'pointer',
                    }}>{p.label}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Output format + quality */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e' }}>format:</span>
              <div style={{ display: 'flex', background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 5, overflow: 'hidden' }}>
                {FORMATS.map(f => (
                  <button key={f.value} onClick={() => setFormat(f.value)} style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10, padding: '5px 12px',
                    background: format === f.value ? '#1a1917' : 'transparent',
                    color: format === f.value ? '#f8f7f4' : '#6b6960',
                    border: 'none', cursor: 'pointer',
                  }}>{f.label}</button>
                ))}
              </div>
            </div>
            {format !== 'image/png' && (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e' }}>quality:</span>
                <input type="range" min={10} max={100} value={quality} onChange={e => setQuality(Number(e.target.value))} style={{ width: 80 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#1a1917', minWidth: 30 }}>{quality}%</span>
              </div>
            )}
          </div>

          {/* Resize button */}
          <button onClick={resize} disabled={processing || !width || !height} style={{
            fontFamily: 'var(--font-mono)', fontSize: 13, padding: '10px 28px',
            background: processing ? '#6b6960' : '#1a1917', color: '#f8f7f4',
            border: 'none', borderRadius: 7, cursor: processing ? 'wait' : 'pointer',
          }}>
            {processing ? 'processing...' : `Resize to ${width} × ${height}px`}
          </button>

          {/* Output preview */}
          {outputUrl && (
            <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', borderBottom: '0.5px solid #c8c6c0' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>resized output</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#085041', background: '#e1f5ee', padding: '1px 8px', borderRadius: 99 }}>
                    {width} × {height}px · {formatBytes(outputSize)}
                  </span>
                  {outputSize < original.size && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#3c3489' }}>
                      {Math.round((1 - outputSize / original.size) * 100)}% smaller
                    </span>
                  )}
                </div>
                <button onClick={download} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 16px',
                  background: '#1a1917', color: '#f8f7f4',
                  border: 'none', borderRadius: 5, cursor: 'pointer',
                }}>download</button>
              </div>
              <div style={{ padding: 12, display: 'flex', justifyContent: 'center', background: '#f8f7f4' }}>
                <img src={outputUrl} alt="resized" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 6, border: '0.5px solid #c8c6c0' }} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}