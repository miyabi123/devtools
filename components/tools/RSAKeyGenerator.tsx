'use client'

import { useState } from 'react'

type KeySize = 1024 | 2048 | 4096
type KeyFormat = 'pkcs8' | 'pkcs1-like'

function arrayBufferToPem(buffer: ArrayBuffer, type: string): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
  const base64 = btoa(binary)
  const lines = base64.match(/.{1,64}/g) || []
  return `-----BEGIN ${type}-----\n${lines.join('\n')}\n-----END ${type}-----`
}

interface KeyPair {
  privateKey: string
  publicKey: string
  keySize: number
  generatedAt: string
}

export default function RSAKeyGenerator() {
  const [keySize, setKeySize] = useState<KeySize>(2048)
  const [generating, setGenerating] = useState(false)
  const [keyPair, setKeyPair] = useState<KeyPair | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<'private' | 'public' | null>(null)
  const [showPrivate, setShowPrivate] = useState(false)

  const generate = async () => {
    setError('')
    setGenerating(true)
    setKeyPair(null)
    setShowPrivate(false)

    try {
      const keyPairResult = await crypto.subtle.generateKey(
        {
          name: 'RSASSA-PKCS1-v1_5',
          modulusLength: keySize,
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
          hash: 'SHA-256',
        },
        true,
        ['sign', 'verify']
      )

      const privateDer = await crypto.subtle.exportKey('pkcs8', keyPairResult.privateKey)
      const publicDer = await crypto.subtle.exportKey('spki', keyPairResult.publicKey)

      setKeyPair({
        privateKey: arrayBufferToPem(privateDer, 'PRIVATE KEY'),
        publicKey: arrayBufferToPem(publicDer, 'PUBLIC KEY'),
        keySize,
        generatedAt: new Date().toLocaleString('th-TH'),
      })
    } catch (e) {
      setError('Failed to generate key pair. Please try again.')
      console.error(e)
    } finally {
      setGenerating(false)
    }
  }

  const copy = async (which: 'private' | 'public') => {
    if (!keyPair) return
    await navigator.clipboard.writeText(which === 'private' ? keyPair.privateKey : keyPair.publicKey)
    setCopied(which)
    setTimeout(() => setCopied(null), 1500)
  }

  const download = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  const downloadAll = () => {
    if (!keyPair) return
    download(keyPair.privateKey, 'private.key')
    setTimeout(() => download(keyPair.publicKey, 'public.key'), 300)
  }

  const btnStyle = (active: boolean, color = '#1a1917') => ({
    fontFamily: 'var(--font-mono)' as const,
    fontSize: 11, padding: '6px 16px',
    background: active ? color : '#f8f7f4',
    color: active ? '#f8f7f4' : '#6b6960',
    border: '0.5px solid #c8c6c0', borderRadius: 6, cursor: 'pointer',
  })

  const KEY_SIZES: KeySize[] = [1024, 2048, 4096]

  return (
    <div className="space-y-4">

      {/* Security notice */}
      <div style={{ background: '#e1f5ee', border: '0.5px solid #1D9E75', borderRadius: 6, padding: '10px 14px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#085041', margin: 0, lineHeight: 1.6 }}>
          🔐 Keys are generated entirely in your browser using Web Crypto API — never sent to any server. Generate and download immediately, then discard if not needed.
        </p>
      </div>

      {/* Config */}
      <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, padding: '16px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: '0 0 12px' }}>KEY SIZE</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {KEY_SIZES.map(size => (
            <button key={size} onClick={() => setKeySize(size)} style={btnStyle(keySize === size)}>
              {size}-bit
              {size === 1024 && <span style={{ fontSize: 9, marginLeft: 4, opacity: 0.7 }}>(legacy)</span>}
              {size === 2048 && <span style={{ fontSize: 9, marginLeft: 4, opacity: 0.7 }}>(standard)</span>}
              {size === 4096 && <span style={{ fontSize: 9, marginLeft: 4, opacity: 0.7 }}>(high security)</span>}
            </button>
          ))}
        </div>

        {/* Size info */}
        <div style={{ background: '#f8f7f4', borderRadius: 6, padding: '10px 12px', marginBottom: 16 }}>
          {keySize === 1024 && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a32d2d', margin: 0, lineHeight: 1.6 }}>
              ⚠️ 1024-bit is considered insecure and deprecated. Use only for legacy system compatibility.
            </p>
          )}
          {keySize === 2048 && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#085041', margin: 0, lineHeight: 1.6 }}>
              ✓ 2048-bit is the current industry standard. Recommended for most use cases including SSL/TLS, SSH, and code signing.
            </p>
          )}
          {keySize === 4096 && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#633806', margin: 0, lineHeight: 1.6 }}>
              ⏳ 4096-bit provides maximum security but generation takes 5-15 seconds and operations are slower. Use for long-lived certificates or high-security environments.
            </p>
          )}
        </div>

        {error && (
          <div style={{ background: '#fcebeb', border: '0.5px solid #f09595', borderRadius: 6, padding: '8px 12px', marginBottom: 12 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a32d2d', margin: 0 }}>⚠️ {error}</p>
          </div>
        )}

        <button onClick={generate} disabled={generating} style={{
          fontFamily: 'var(--font-mono)', fontSize: 13, padding: '10px 24px',
          background: generating ? '#a8a69e' : '#1a1917', color: '#f8f7f4',
          border: 'none', borderRadius: 8,
          cursor: generating ? 'default' : 'pointer', fontWeight: 500,
        }}>
          {generating
            ? `⏳ Generating ${keySize}-bit key pair...`
            : '🔑 Generate RSA Key Pair'}
        </button>
      </div>

      {/* Output */}
      {keyPair && (
        <div className="space-y-3">

          {/* Meta */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>
                RSA {keyPair.keySize}-bit · Generated {keyPair.generatedAt}
              </span>
            </div>
            <button onClick={downloadAll} style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, padding: '5px 14px',
              background: '#eeedfe', color: '#3c3489',
              border: '0.5px solid #c8c6c0', borderRadius: 6, cursor: 'pointer',
            }}>↓ Download Both Keys</button>
          </div>

          {/* Public Key */}
          <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #e8e6e0', background: '#f8f7f4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#085041' }}>🔓 Public Key</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#a8a69e', marginLeft: 8 }}>SPKI format · safe to share</span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => copy('public')} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px',
                  background: copied === 'public' ? '#e1f5ee' : '#ffffff',
                  color: copied === 'public' ? '#085041' : '#6b6960',
                  border: `0.5px solid ${copied === 'public' ? '#1D9E75' : '#c8c6c0'}`,
                  borderRadius: 5, cursor: 'pointer',
                }}>{copied === 'public' ? '✓ Copied' : 'Copy'}</button>
                <button onClick={() => download(keyPair.publicKey, 'public.key')} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px',
                  background: '#eeedfe', color: '#3c3489',
                  border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
                }}>↓ Download</button>
              </div>
            </div>
            <textarea readOnly value={keyPair.publicKey} rows={7} style={{
              width: '100%', padding: '12px', border: 'none', outline: 'none', resize: 'none',
              fontFamily: 'var(--font-mono)', fontSize: 11, color: '#1a1917',
              background: '#fafaf9', lineHeight: 1.5, boxSizing: 'border-box',
            }} />
          </div>

          {/* Private Key */}
          <div style={{ background: '#ffffff', border: '1px solid #f09595', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #f09595', background: '#fcebeb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a32d2d' }}>🔐 Private Key</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#a32d2d', marginLeft: 8, opacity: 0.7 }}>PKCS#8 format · keep secret!</span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => setShowPrivate(p => !p)} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px',
                  background: '#ffffff', color: '#6b6960',
                  border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
                }}>{showPrivate ? '🙈 Hide' : '👁 Show'}</button>
                <button onClick={() => copy('private')} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px',
                  background: copied === 'private' ? '#e1f5ee' : '#ffffff',
                  color: copied === 'private' ? '#085041' : '#6b6960',
                  border: `0.5px solid ${copied === 'private' ? '#1D9E75' : '#c8c6c0'}`,
                  borderRadius: 5, cursor: 'pointer',
                }}>{copied === 'private' ? '✓ Copied' : 'Copy'}</button>
                <button onClick={() => download(keyPair.privateKey, 'private.key')} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px',
                  background: '#fcebeb', color: '#a32d2d',
                  border: '0.5px solid #f09595', borderRadius: 5, cursor: 'pointer',
                }}>↓ Download</button>
              </div>
            </div>
            {showPrivate ? (
              <textarea readOnly value={keyPair.privateKey} rows={10} style={{
                width: '100%', padding: '12px', border: 'none', outline: 'none', resize: 'none',
                fontFamily: 'var(--font-mono)', fontSize: 11, color: '#1a1917',
                background: '#fefafa', lineHeight: 1.5, boxSizing: 'border-box',
              }} />
            ) : (
              <div style={{ padding: '20px 14px', textAlign: 'center', background: '#fefafa', cursor: 'pointer' }}
                onClick={() => setShowPrivate(true)}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e', margin: 0 }}>
                  🔒 Private key hidden — click Show to reveal or Download to save
                </p>
              </div>
            )}
          </div>

          {/* Usage examples */}
          <div style={{ background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 8, padding: '12px 14px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: '0 0 10px' }}>USAGE EXAMPLES</p>
            {[
              { label: 'Verify key info', code: `openssl rsa -in private.key -text -noout` },
              { label: 'Extract public key from private', code: `openssl rsa -in private.key -pubout -out public.key` },
              { label: 'Generate CSR from this key', code: `openssl req -new -key private.key -out server.csr -subj "/CN=example.com/C=TH"` },
              { label: 'Node.js — sign with private key', code: `const { createSign } = require('crypto')\nconst sign = createSign('SHA256')\nsign.update('message')\nconst sig = sign.sign(privateKeyPem, 'base64')` },
            ].map(ex => (
              <div key={ex.label} style={{ marginBottom: 10 }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#3c3489', margin: '0 0 4px', fontWeight: 600 }}>{ex.label}</p>
                <pre style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, color: '#1a1917',
                  background: '#ffffff', border: '0.5px solid #e8e6e0',
                  borderRadius: 5, padding: '8px 10px', margin: 0,
                  overflowX: 'auto', lineHeight: 1.6,
                }}>{ex.code}</pre>
              </div>
            ))}
          </div>

          {/* Regenerate */}
          <button onClick={generate} style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, padding: '8px 16px',
            background: '#f8f7f4', color: '#6b6960',
            border: '0.5px solid #c8c6c0', borderRadius: 6, cursor: 'pointer',
          }}>↺ Generate New Key Pair</button>

        </div>
      )}
    </div>
  )
}