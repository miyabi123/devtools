'use client'

import { useState, useRef, useCallback } from 'react'

type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp'
type CompressMode = 'quality' | 'target'

const FORMATS: { value: OutputFormat; label: string; ext: string }[] = [
  { value: 'image/jpeg', label: 'JPG', ext: 'jpg' },
  { value: 'image/png',  label: 'PNG', ext: 'png' },
  { value: 'image/webp', label: 'WebP', ext: 'webp' },
]

interface ImageFile {
  id: string
  file: File
  originalUrl: string
  originalSize: number
  width: number
  height: number
  compressedUrl: string
  compressedSize: number
  status: 'pending' | 'processing' | 'done' | 'error'
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function savings(original: number, compressed: number): string {
  const pct = Math.round((1 - compressed / original) * 100)
  return pct > 0 ? `−${pct}%` : `+${Math.abs(pct)}%`
}

async function compressImage(file: File, format: OutputFormat, quality: number): Promise<{ url: string; size: number; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      ctx.drawImage(img, 0, 0)
      canvas.toBlob(blob => {
        if (!blob) return reject(new Error('Compression failed'))
        const compressedUrl = URL.createObjectURL(blob)
        resolve({ url: compressedUrl, size: blob.size, width: img.width, height: img.height })
        URL.revokeObjectURL(url)
      }, format, format === 'image/png' ? undefined : quality / 100)
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = url
  })
}

export default function ImageCompressor() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [format, setFormat] = useState<OutputFormat>('image/jpeg')
  const [quality, setQuality] = useState(82)
  const [mode] = useState<CompressMode>('quality')
  const [isDragging, setIsDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [compareIdx, setCompareIdx] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (!validFiles.length) return

    const newImages: ImageFile[] = validFiles.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      originalUrl: URL.createObjectURL(file),
      originalSize: file.size,
      width: 0,
      height: 0,
      compressedUrl: '',
      compressedSize: 0,
      status: 'pending',
    }))

    setImages(prev => [...prev, ...newImages])
  }, [])

  const compressAll = useCallback(async () => {
    setProcessing(true)
    setImages(prev => prev.map(img => img.status === 'pending' ? { ...img, status: 'processing' } : img))

    for (const img of images.filter(i => i.status === 'pending' || i.status === 'processing')) {
      try {
        const result = await compressImage(img.file, format, quality)
        setImages(prev => prev.map(i => i.id === img.id ? {
          ...i,
          compressedUrl: result.url,
          compressedSize: result.size,
          width: result.width,
          height: result.height,
          status: 'done',
        } : i))
      } catch {
        setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: 'error' } : i))
      }
    }
    setProcessing(false)
  }, [images, format, quality])

  const downloadOne = (img: ImageFile) => {
    if (!img.compressedUrl) return
    const ext = FORMATS.find(f => f.value === format)?.ext || 'jpg'
    const name = img.file.name.replace(/\.[^.]+$/, '') + `_compressed.${ext}`
    const a = document.createElement('a')
    a.href = img.compressedUrl; a.download = name; a.click()
  }

  const downloadAll = () => {
    images.filter(i => i.status === 'done').forEach((img, idx) => {
      setTimeout(() => downloadOne(img), idx * 200)
    })
  }

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(i => i.id !== id))
    if (compareIdx === id) setCompareIdx(null)
  }

  const clearAll = () => { setImages([]); setCompareIdx(null) }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false)
    addFiles(e.dataTransfer.files)
  }

  const totalOriginal = images.reduce((sum, i) => sum + i.originalSize, 0)
  const totalCompressed = images.filter(i => i.status === 'done').reduce((sum, i) => sum + i.compressedSize, 0)
  const doneCount = images.filter(i => i.status === 'done').length

  const compareImage = images.find(i => i.id === compareIdx)

  return (
    <div className="space-y-4">

      {/* Upload zone */}
      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? '#1a1917' : '#c8c6c0'}`,
          borderRadius: 12, padding: images.length ? '20px 24px' : '48px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          cursor: 'pointer', background: isDragging ? '#f0ede8' : '#ffffff',
          transition: 'all .15s',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#a8a69e" strokeWidth="1.5">
          <path d="M14 4v14M8 10l6-6 6 6"/><path d="M4 20v2a2 2 0 002 2h16a2 2 0 002-2v-2"/>
        </svg>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1a1917', margin: 0 }}>
          {images.length ? 'Drop more images to add' : 'Drop images here or click to upload'}
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e', margin: 0 }}>
          JPG, PNG, WebP, GIF · Multiple files supported
        </p>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={e => { if (e.target.files) addFiles(e.target.files) }} style={{ display: 'none' }} />
      </div>

      {images.length > 0 && (
        <>
          {/* Options */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, padding: '12px 14px' }}>
            {/* Format */}
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e' }}>output:</span>
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

            {/* Quality */}
            {format !== 'image/png' && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1, minWidth: 200 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e' }}>quality:</span>
                <input type="range" min={10} max={100} value={quality}
                  onChange={e => setQuality(Number(e.target.value))}
                  style={{ flex: 1 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 500, color: '#1a1917', minWidth: 36 }}>{quality}%</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>
                  {quality >= 90 ? 'lossless' : quality >= 75 ? 'high' : quality >= 60 ? 'medium' : 'low'}
                </span>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
              {doneCount > 0 && (
                <button onClick={downloadAll} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 14px',
                  background: 'transparent', color: '#6b6960',
                  border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
                }}>download all ({doneCount})</button>
              )}
              <button onClick={compressAll} disabled={processing || images.every(i => i.status === 'done')} style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 16px',
                background: '#1a1917', color: '#f8f7f4',
                border: 'none', borderRadius: 5, cursor: 'pointer',
                opacity: processing ? 0.6 : 1,
              }}>{processing ? 'compressing...' : 'compress all'}</button>
            </div>
          </div>

          {/* Summary */}
          {doneCount > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                { label: 'Original size', value: formatBytes(totalOriginal), color: '#1a1917' },
                { label: 'Compressed size', value: formatBytes(totalCompressed), color: '#085041' },
                { label: 'Space saved', value: `${formatBytes(totalOriginal - totalCompressed)} (${Math.round((1 - totalCompressed / totalOriginal) * 100)}%)`, color: '#3c3489' },
              ].map(c => (
                <div key={c.label} style={{ background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 8, padding: '10px 14px' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: '0 0 4px' }}>{c.label}</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 500, color: c.color, margin: 0 }}>{c.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Image list */}
          <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #c8c6c0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>
                {images.length} image{images.length > 1 ? 's' : ''}
              </span>
              <button onClick={clearAll} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 8px', background: 'transparent', color: '#a8a69e', border: '0.5px solid #e8e6e0', borderRadius: 4, cursor: 'pointer' }}>
                clear all
              </button>
            </div>

            {images.map((img, i) => (
              <div key={img.id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                borderBottom: i < images.length - 1 ? '0.5px solid #f0ede8' : 'none',
              }}>
                {/* Thumbnail */}
                <img src={img.originalUrl} alt={img.file.name}
                  style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: '0.5px solid #c8c6c0', flexShrink: 0 }} />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#1a1917', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {img.file.name}
                  </p>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>{formatBytes(img.originalSize)}</span>
                    {img.status === 'done' && (
                      <>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>→</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#085041' }}>{formatBytes(img.compressedSize)}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '1px 6px', borderRadius: 99, background: '#e1f5ee', color: '#085041' }}>
                          {savings(img.originalSize, img.compressedSize)}
                        </span>
                      </>
                    )}
                    {img.status === 'processing' && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>compressing...</span>
                    )}
                    {img.status === 'error' && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a32d2d' }}>failed</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                  {img.status === 'done' && (
                    <>
                      <button onClick={() => setCompareIdx(compareIdx === img.id ? null : img.id)} style={{
                        fontFamily: 'var(--font-mono)', fontSize: 9, padding: '3px 8px',
                        background: compareIdx === img.id ? '#1a1917' : 'transparent',
                        color: compareIdx === img.id ? '#f8f7f4' : '#6b6960',
                        border: '0.5px solid #c8c6c0', borderRadius: 4, cursor: 'pointer',
                      }}>compare</button>
                      <button onClick={() => downloadOne(img)} style={{
                        fontFamily: 'var(--font-mono)', fontSize: 9, padding: '3px 8px',
                        background: '#1a1917', color: '#f8f7f4',
                        border: 'none', borderRadius: 4, cursor: 'pointer',
                      }}>download</button>
                    </>
                  )}
                  {img.status === 'pending' && (
                    <button onClick={async () => {
                      setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: 'processing' } : i))
                      try {
                        const result = await compressImage(img.file, format, quality)
                        setImages(prev => prev.map(i => i.id === img.id ? { ...i, ...result, status: 'done' } : i))
                      } catch {
                        setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: 'error' } : i))
                      }
                    }} style={{
                      fontFamily: 'var(--font-mono)', fontSize: 9, padding: '3px 8px',
                      background: '#eeedfe', color: '#3c3489',
                      border: 'none', borderRadius: 4, cursor: 'pointer',
                    }}>compress</button>
                  )}
                  <button onClick={() => removeImage(img.id)} style={{
                    fontFamily: 'var(--font-mono)', fontSize: 12, padding: '2px 6px',
                    background: 'transparent', color: '#a8a69e',
                    border: 'none', cursor: 'pointer',
                  }}>×</button>
                </div>
              </div>
            ))}
          </div>

          {/* Compare view */}
          {compareImage && compareImage.status === 'done' && (
            <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #c8c6c0', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>before / after comparison</span>
                <button onClick={() => setCompareIdx(null)} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', background: 'none', border: 'none', cursor: 'pointer' }}>close</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#c8c6c0' }}>
                <div style={{ padding: 12, background: '#f8f7f4' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: '0 0 8px' }}>
                    ORIGINAL · {formatBytes(compareImage.originalSize)}
                  </p>
                  <img src={compareImage.originalUrl} alt="original" style={{ width: '100%', borderRadius: 6 }} />
                </div>
                <div style={{ padding: 12, background: '#f8f7f4' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#085041', margin: '0 0 8px' }}>
                    COMPRESSED · {formatBytes(compareImage.compressedSize)} · {savings(compareImage.originalSize, compareImage.compressedSize)}
                  </p>
                  <img src={compareImage.compressedUrl} alt="compressed" style={{ width: '100%', borderRadius: 6 }} />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}