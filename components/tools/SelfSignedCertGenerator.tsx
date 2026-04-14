'use client'

import { useState } from 'react'

interface CertFields {
  commonName: string
  organization: string
  organizationUnit: string
  locality: string
  state: string
  country: string
  email: string
  validDays: number
  keySize: 2048 | 4096
}

const defaultFields: CertFields = {
  commonName: 'localhost',
  organization: '',
  organizationUnit: '',
  locality: '',
  state: '',
  country: 'TH',
  email: '',
  validDays: 365,
  keySize: 2048,
}

function arrayBufferToPem(buffer: ArrayBuffer, type: string): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  const base64 = btoa(binary)
  const lines = base64.match(/.{1,64}/g) || []
  return `-----BEGIN ${type}-----\n${lines.join('\n')}\n-----END ${type}-----`
}

function encodeOID(oid: string): Uint8Array {
  const parts = oid.split('.').map(Number)
  const bytes: number[] = []
  bytes.push(parts[0] * 40 + parts[1])
  for (let i = 2; i < parts.length; i++) {
    let val = parts[i]
    const tmp: number[] = []
    tmp.push(val & 0x7f)
    val >>= 7
    while (val > 0) { tmp.push((val & 0x7f) | 0x80); val >>= 7 }
    bytes.push(...tmp.reverse())
  }
  return new Uint8Array([0x06, bytes.length, ...bytes])
}

function encodeLengthBytes(len: number): number[] {
  if (len < 128) return [len]
  if (len < 256) return [0x81, len]
  return [0x82, (len >> 8) & 0xff, len & 0xff]
}

function wrapTLV(tag: number, content: Uint8Array): Uint8Array {
  const lenBytes = encodeLengthBytes(content.length)
  return new Uint8Array([tag, ...lenBytes, ...content])
}

function encodeUTF8String(str: string): Uint8Array {
  const encoded = new TextEncoder().encode(str)
  return new Uint8Array([0x0c, encoded.length, ...encoded])
}

function makePrintableString(str: string): Uint8Array {
  const encoded = new TextEncoder().encode(str)
  return new Uint8Array([0x13, encoded.length, ...encoded])
}

function makeRDN(oid: string, value: string, printable = false): Uint8Array {
  if (!value) return new Uint8Array(0)
  const oidBytes = encodeOID(oid)
  const valueBytes = printable ? makePrintableString(value) : encodeUTF8String(value)
  const seq = wrapTLV(0x30, new Uint8Array([...oidBytes, ...valueBytes]))
  return wrapTLV(0x31, seq)
}

function buildSubject(fields: CertFields): Uint8Array {
  const rdns: Uint8Array[] = []
  if (fields.country) rdns.push(makeRDN('2.5.4.6', fields.country.toUpperCase().slice(0, 2), true))
  if (fields.state) rdns.push(makeRDN('2.5.4.8', fields.state))
  if (fields.locality) rdns.push(makeRDN('2.5.4.7', fields.locality))
  if (fields.organization) rdns.push(makeRDN('2.5.4.10', fields.organization))
  if (fields.organizationUnit) rdns.push(makeRDN('2.5.4.11', fields.organizationUnit))
  if (fields.commonName) rdns.push(makeRDN('2.5.4.3', fields.commonName))
  if (fields.email) rdns.push(makeRDN('1.2.840.113549.1.9.1', fields.email))
  const content = rdns.reduce((acc, r) => new Uint8Array([...acc, ...r]), new Uint8Array(0))
  return wrapTLV(0x30, content)
}

function encodeUTCTime(date: Date): Uint8Array {
  const pad = (n: number) => n.toString().padStart(2, '0')
  const str = `${date.getUTCFullYear().toString().slice(2)}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  const encoded = new TextEncoder().encode(str)
  return new Uint8Array([0x17, encoded.length, ...encoded])
}

function encodeInteger(n: number): Uint8Array {
  const bytes: number[] = []
  while (n > 0) { bytes.unshift(n & 0xff); n >>= 8 }
  if (bytes[0] & 0x80) bytes.unshift(0)
  return new Uint8Array([0x02, bytes.length, ...bytes])
}

async function buildSelfSignedCert(
  publicKeyDer: ArrayBuffer,
  privateKey: CryptoKey,
  fields: CertFields
): Promise<ArrayBuffer> {
  const subject = buildSubject(fields)

  const now = new Date()
  const notBefore = encodeUTCTime(now)
  const notAfter = encodeUTCTime(new Date(now.getTime() + fields.validDays * 86400000))
  const validity = wrapTLV(0x30, new Uint8Array([...notBefore, ...notAfter]))

  const serial = encodeInteger(Math.floor(Math.random() * 0xffffff) + 1)
  const version = new Uint8Array([0xa0, 0x03, 0x02, 0x01, 0x02]) // v3

  const sigAlgOID = new Uint8Array([
    0x30, 0x0d,
    0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x0b,
    0x05, 0x00
  ])

  const spki = new Uint8Array(publicKeyDer)

  // Extensions: Basic Constraints + Subject Alt Name for localhost
  const isLocalhost = fields.commonName === 'localhost' || fields.commonName.startsWith('*.')
  let extensions = new Uint8Array(0)

  if (isLocalhost) {
    // Basic Constraints: CA:FALSE
    const bcOID = encodeOID('2.5.29.19')
    const bcValue = new Uint8Array([0x30, 0x00])
    const bcValueWrapped = wrapTLV(0x04, wrapTLV(0x30, bcValue))
    const bcExt = wrapTLV(0x30, new Uint8Array([...bcOID, ...bcValueWrapped]))

    // SAN: DNS name
    const dnsName = new TextEncoder().encode(fields.commonName)
    const sanDNS = new Uint8Array([0x82, dnsName.length, ...dnsName])
    const sanSeq = wrapTLV(0x30, sanDNS)
    const sanOID = encodeOID('2.5.29.17')
    const sanValueWrapped = wrapTLV(0x04, sanSeq)
    const sanExt = wrapTLV(0x30, new Uint8Array([...sanOID, ...sanValueWrapped]))

    const extsContent = new Uint8Array([...bcExt, ...sanExt])
    const extsSeq = wrapTLV(0x30, extsContent)
    extensions = new Uint8Array([0xa3, ...encodeLengthBytes(extsSeq.length), ...extsSeq])
  }

  // TBSCertificate
  const tbsCert = wrapTLV(0x30, new Uint8Array([
    ...version,
    ...serial,
    ...sigAlgOID,
    ...subject, // issuer = subject (self-signed)
    ...validity,
    ...subject,
    ...spki,
    ...extensions,
  ]))

  // Sign — slice() guarantees plain ArrayBuffer (not SharedArrayBuffer)
  const tbsCertBuffer = tbsCert.buffer.slice(
    tbsCert.byteOffset, tbsCert.byteOffset + tbsCert.byteLength
  ) as ArrayBuffer

  const signature = await crypto.subtle.sign(
    { name: 'RSASSA-PKCS1-v1_5' },
    privateKey,
    tbsCertBuffer
  )

  const sigBytes = new Uint8Array(signature)
  const bitString = wrapTLV(0x03, new Uint8Array([0x00, ...sigBytes]))

  const cert = wrapTLV(0x30, new Uint8Array([
    ...tbsCert,
    ...sigAlgOID,
    ...bitString,
  ]))

  return cert.buffer.slice(cert.byteOffset, cert.byteOffset + cert.byteLength) as ArrayBuffer
}

export default function SelfSignedCertGenerator() {
  const [fields, setFields] = useState<CertFields>(defaultFields)
  const [generating, setGenerating] = useState(false)
  const [certPem, setCertPem] = useState('')
  const [keyPem, setKeyPem] = useState('')
  const [error, setError] = useState('')
  const [copiedCert, setCopiedCert] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)

  const set = (k: keyof CertFields) => (v: string | number) =>
    setFields(prev => ({ ...prev, [k]: v }))

  const generate = async () => {
    if (!fields.commonName) { setError('Common Name is required'); return }
    if (!fields.country || fields.country.length !== 2) { setError('Country must be 2 letters (e.g. TH, US)'); return }
    setError('')
    setGenerating(true)
    setCertPem('')
    setKeyPem('')

    try {
      const keyPair = await crypto.subtle.generateKey(
        {
          name: 'RSASSA-PKCS1-v1_5',
          modulusLength: fields.keySize,
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
          hash: 'SHA-256',
        },
        true,
        ['sign', 'verify']
      )

      const publicKeyDer = await crypto.subtle.exportKey('spki', keyPair.publicKey)
      const privateKeyDer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey)

      const certDer = await buildSelfSignedCert(publicKeyDer, keyPair.privateKey, fields)

      setCertPem(arrayBufferToPem(certDer, 'CERTIFICATE'))
      setKeyPem(arrayBufferToPem(privateKeyDer, 'PRIVATE KEY'))
    } catch (e) {
      setError('Failed to generate certificate. Please try again.')
      console.error(e)
    } finally {
      setGenerating(false)
    }
  }

  const copy = async (text: string, which: 'cert' | 'key') => {
    await navigator.clipboard.writeText(text)
    if (which === 'cert') { setCopiedCert(true); setTimeout(() => setCopiedCert(false), 1500) }
    else { setCopiedKey(true); setTimeout(() => setCopiedKey(false), 1500) }
  }

  const download = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  const inputStyle = {
    width: '100%', padding: '8px 10px', border: '0.5px solid #c8c6c0',
    borderRadius: 6, outline: 'none', fontFamily: 'var(--font-mono)',
    fontSize: 13, color: '#1a1917', background: '#ffffff',
    boxSizing: 'border-box' as const,
  }

  const VALID_PRESETS = [30, 90, 180, 365, 730]

  return (
    <div className="space-y-4">

      {/* Warning */}
      <div style={{ background: '#faeeda', border: '0.5px solid #e8c97a', borderRadius: 6, padding: '10px 14px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#633806', margin: 0, lineHeight: 1.6 }}>
          ⚠️ Self-signed certificates will show browser warnings in production. Use for development and testing only. Private key is generated entirely in your browser and never sent to any server.
        </p>
      </div>

      {/* Form */}
      <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, padding: '16px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: '0 0 14px' }}>CERTIFICATE DETAILS</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <label style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: '#1a1917' }}>Common Name (CN) *</label>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>domain or localhost</span>
            </div>
            <input style={inputStyle} value={fields.commonName}
              onChange={e => set('commonName')(e.target.value)}
              placeholder="localhost or example.com" />
          </div>

          <div>
            <label style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: '#1a1917', display: 'block', marginBottom: 4 }}>Organization (O)</label>
            <input style={inputStyle} value={fields.organization}
              onChange={e => set('organization')(e.target.value)}
              placeholder="My Company Ltd" />
          </div>

          <div>
            <label style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: '#1a1917', display: 'block', marginBottom: 4 }}>Org Unit (OU)</label>
            <input style={inputStyle} value={fields.organizationUnit}
              onChange={e => set('organizationUnit')(e.target.value)}
              placeholder="Development" />
          </div>

          <div>
            <label style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: '#1a1917', display: 'block', marginBottom: 4 }}>City (L)</label>
            <input style={inputStyle} value={fields.locality}
              onChange={e => set('locality')(e.target.value)}
              placeholder="Bangkok" />
          </div>

          <div>
            <label style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: '#1a1917', display: 'block', marginBottom: 4 }}>State (ST)</label>
            <input style={inputStyle} value={fields.state}
              onChange={e => set('state')(e.target.value)}
              placeholder="Bangkok" />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <label style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: '#1a1917' }}>Country (C) *</label>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>2-letter ISO</span>
            </div>
            <input style={inputStyle} value={fields.country}
              onChange={e => set('country')(e.target.value.toUpperCase().slice(0, 2))}
              placeholder="TH" maxLength={2} />
          </div>

          <div>
            <label style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: '#1a1917', display: 'block', marginBottom: 4 }}>Email</label>
            <input style={inputStyle} value={fields.email}
              onChange={e => set('email')(e.target.value)}
              placeholder="admin@example.com" type="email" />
          </div>
        </div>

        {/* Validity */}
        <div style={{ marginTop: 14 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: '0 0 8px' }}>VALIDITY PERIOD</p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            {VALID_PRESETS.map(d => (
              <button key={d} onClick={() => set('validDays')(d)} style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, padding: '5px 12px',
                background: fields.validDays === d ? '#1a1917' : '#f8f7f4',
                color: fields.validDays === d ? '#f8f7f4' : '#6b6960',
                border: '0.5px solid #c8c6c0', borderRadius: 6, cursor: 'pointer',
              }}>
                {d === 365 ? '1 year' : d === 730 ? '2 years' : `${d} days`}
              </button>
            ))}
          </div>
        </div>

        {/* Key size */}
        <div style={{ marginTop: 10 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: '0 0 8px' }}>KEY SIZE</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {([2048, 4096] as const).map(size => (
              <button key={size} onClick={() => set('keySize')(size)} style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, padding: '7px 16px',
                background: fields.keySize === size ? '#1a1917' : '#f8f7f4',
                color: fields.keySize === size ? '#f8f7f4' : '#6b6960',
                border: '0.5px solid #c8c6c0', borderRadius: 6, cursor: 'pointer',
              }}>
                {size}-bit {size === 2048 ? '(Standard)' : '(High Security)'}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ background: '#fcebeb', border: '0.5px solid #f09595', borderRadius: 6, padding: '8px 12px', marginTop: 12 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a32d2d', margin: 0 }}>⚠️ {error}</p>
          </div>
        )}

        <button onClick={generate} disabled={generating} style={{
          marginTop: 16, fontFamily: 'var(--font-mono)', fontSize: 13,
          padding: '10px 24px', background: generating ? '#a8a69e' : '#1a1917',
          color: '#f8f7f4', border: 'none', borderRadius: 8,
          cursor: generating ? 'default' : 'pointer', fontWeight: 500,
        }}>
          {generating ? `⏳ Generating ${fields.keySize}-bit certificate...` : '🔒 Generate Self-signed Certificate'}
        </button>
      </div>

      {/* Output */}
      {certPem && (
        <div className="space-y-3">
          {/* Certificate */}
          <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #e8e6e0', background: '#f8f7f4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>📜 Certificate (cert.pem)</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => copy(certPem, 'cert')} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px',
                  background: copiedCert ? '#e1f5ee' : '#ffffff', color: copiedCert ? '#085041' : '#6b6960',
                  border: `0.5px solid ${copiedCert ? '#1D9E75' : '#c8c6c0'}`, borderRadius: 5, cursor: 'pointer',
                }}>{copiedCert ? '✓ Copied' : 'Copy'}</button>
                <button onClick={() => download(certPem, `${fields.commonName || 'cert'}.pem`)} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px',
                  background: '#eeedfe', color: '#3c3489',
                  border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
                }}>↓ Download</button>
              </div>
            </div>
            <textarea readOnly value={certPem} rows={8} style={{
              width: '100%', padding: '12px', border: 'none', outline: 'none', resize: 'none',
              fontFamily: 'var(--font-mono)', fontSize: 11, color: '#1a1917',
              background: '#fafaf9', lineHeight: 1.5, boxSizing: 'border-box',
            }} />
          </div>

          {/* Private Key */}
          <div style={{ background: '#ffffff', border: '1px solid #f09595', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #f09595', background: '#fcebeb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a32d2d' }}>🔐 Private Key — Keep this secret!</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => copy(keyPem, 'key')} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px',
                  background: copiedKey ? '#e1f5ee' : '#ffffff', color: copiedKey ? '#085041' : '#6b6960',
                  border: `0.5px solid ${copiedKey ? '#1D9E75' : '#c8c6c0'}`, borderRadius: 5, cursor: 'pointer',
                }}>{copiedKey ? '✓ Copied' : 'Copy'}</button>
                <button onClick={() => download(keyPem, `${fields.commonName || 'private'}.key`)} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px',
                  background: '#fcebeb', color: '#a32d2d',
                  border: '0.5px solid #f09595', borderRadius: 5, cursor: 'pointer',
                }}>↓ Download</button>
              </div>
            </div>
            <textarea readOnly value={keyPem} rows={8} style={{
              width: '100%', padding: '12px', border: 'none', outline: 'none', resize: 'none',
              fontFamily: 'var(--font-mono)', fontSize: 11, color: '#1a1917',
              background: '#fefafa', lineHeight: 1.5, boxSizing: 'border-box',
            }} />
          </div>

          {/* Usage examples */}
          <div style={{ background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 8, padding: '12px 14px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: '0 0 10px' }}>USAGE EXAMPLES</p>
            {[
              { label: 'Nginx', code: `ssl_certificate     /path/to/${fields.commonName || 'cert'}.pem;\nssl_certificate_key /path/to/${fields.commonName || 'cert'}.key;` },
              { label: 'Apache', code: `SSLCertificateFile    /path/to/${fields.commonName || 'cert'}.pem\nSSLCertificateKeyFile /path/to/${fields.commonName || 'cert'}.key` },
              { label: 'Node.js', code: `https.createServer({\n  cert: fs.readFileSync('${fields.commonName || 'cert'}.pem'),\n  key: fs.readFileSync('${fields.commonName || 'cert'}.key')\n}, app)` },
            ].map(ex => (
              <div key={ex.label} style={{ marginBottom: 10 }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#3c3489', margin: '0 0 4px', fontWeight: 600 }}>{ex.label}</p>
                <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#1a1917', background: '#ffffff', border: '0.5px solid #e8e6e0', borderRadius: 5, padding: '8px 10px', margin: 0, overflowX: 'auto', lineHeight: 1.6 }}>{ex.code}</pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}