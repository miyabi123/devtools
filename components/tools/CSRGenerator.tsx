'use client'

import { useState } from 'react'

interface CSRFields {
  commonName: string
  organization: string
  organizationUnit: string
  locality: string
  state: string
  country: string
  email: string
  keySize: 2048 | 4096
}

const defaultFields: CSRFields = {
  commonName: '',
  organization: '',
  organizationUnit: '',
  locality: '',
  state: '',
  country: 'TH',
  email: '',
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

// Build DER-encoded CSR manually using ASN.1
function buildCSR(
  publicKeyDer: ArrayBuffer,
  privateKey: CryptoKey,
  fields: CSRFields
): Promise<ArrayBuffer> {
  // We'll use a simplified approach with SubtleCrypto
  // Build the subject as a sequence of RDN sets
  function encodeOID(oid: string): Uint8Array {
    const parts = oid.split('.').map(Number)
    const bytes: number[] = []
    bytes.push(parts[0] * 40 + parts[1])
    for (let i = 2; i < parts.length; i++) {
      let val = parts[i]
      const tmp: number[] = []
      tmp.push(val & 0x7f)
      val >>= 7
      while (val > 0) {
        tmp.push((val & 0x7f) | 0x80)
        val >>= 7
      }
      bytes.push(...tmp.reverse())
    }
    return new Uint8Array([0x06, bytes.length, ...bytes])
  }

  function encodeUTF8String(str: string): Uint8Array {
    const encoded = new TextEncoder().encode(str)
    return new Uint8Array([0x0c, encoded.length, ...encoded])
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

  function makeRDN(oid: string, value: string): Uint8Array {
    if (!value) return new Uint8Array(0)
    const oidBytes = encodeOID(oid)
    const valueBytes = encodeUTF8String(value)
    const seq = wrapTLV(0x30, new Uint8Array([...oidBytes, ...valueBytes]))
    return wrapTLV(0x31, seq)
  }

  const rdns: Uint8Array[] = []
  if (fields.country) {
    // Country uses PrintableString
    const oidBytes = encodeOID('2.5.4.6')
    const val = new TextEncoder().encode(fields.country.toUpperCase().slice(0, 2))
    const valTlv = new Uint8Array([0x13, val.length, ...val])
    const seq = wrapTLV(0x30, new Uint8Array([...oidBytes, ...valTlv]))
    rdns.push(wrapTLV(0x31, seq))
  }
  if (fields.state) rdns.push(makeRDN('2.5.4.8', fields.state))
  if (fields.locality) rdns.push(makeRDN('2.5.4.7', fields.locality))
  if (fields.organization) rdns.push(makeRDN('2.5.4.10', fields.organization))
  if (fields.organizationUnit) rdns.push(makeRDN('2.5.4.11', fields.organizationUnit))
  if (fields.commonName) rdns.push(makeRDN('2.5.4.3', fields.commonName))
  if (fields.email) rdns.push(makeRDN('1.2.840.113549.1.9.1', fields.email))

  const subjectBytes = rdns.reduce((acc, rdn) => new Uint8Array([...acc, ...rdn]), new Uint8Array(0))
  const subject = wrapTLV(0x30, subjectBytes)

  // SubjectPublicKeyInfo from exported key
  const spki = new Uint8Array(publicKeyDer)

  // CertificationRequestInfo version=0
  const version = new Uint8Array([0x02, 0x01, 0x00])
  const attributes = new Uint8Array([0xa0, 0x00]) // empty attributes

  const certReqInfo = wrapTLV(0x30, new Uint8Array([
    ...version, ...subject, ...spki, ...attributes
  ]))

  // Sign it — slice() guarantees plain ArrayBuffer (not SharedArrayBuffer)
  const certReqInfoBuffer = certReqInfo.buffer.slice(
    certReqInfo.byteOffset, certReqInfo.byteOffset + certReqInfo.byteLength
  ) as ArrayBuffer
  return crypto.subtle.sign(
   { name: 'RSASSA-PKCS1-v1_5' },
   privateKey,
   certReqInfoBuffer
  ).then(signature => {
    // SHA-256 with RSA OID
    const sigAlgOID = new Uint8Array([
      0x30, 0x0d,
      0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x0b,
      0x05, 0x00
    ])
    const sigBytes = new Uint8Array(signature)
    const bitString = wrapTLV(0x03, new Uint8Array([0x00, ...sigBytes]))
    const csr = wrapTLV(0x30, new Uint8Array([
      ...certReqInfo, ...sigAlgOID, ...bitString
    ]))
    return csr.buffer.slice(csr.byteOffset, csr.byteOffset + csr.byteLength) as ArrayBuffer
  })
}

export default function CSRGenerator() {
  const [fields, setFields] = useState<CSRFields>(defaultFields)
  const [generating, setGenerating] = useState(false)
  const [csrPem, setCsrPem] = useState('')
  const [keyPem, setKeyPem] = useState('')
  const [error, setError] = useState('')
  const [copiedCsr, setCopiedCsr] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)

  const set = (k: keyof CSRFields) => (v: string | number) =>
    setFields(prev => ({ ...prev, [k]: v }))

  const generate = async () => {
    if (!fields.commonName) { setError('Common Name (CN) is required'); return }
    if (!fields.country || fields.country.length !== 2) { setError('Country must be 2 letters (e.g. TH, US)'); return }

    setError('')
    setGenerating(true)
    setCsrPem('')
    setKeyPem('')

    try {
      // Generate RSA key pair
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

      // Export keys
      const publicKeyDer = await crypto.subtle.exportKey('spki', keyPair.publicKey)
      const privateKeyDer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey)

      // Build CSR
      const csrDer = await buildCSR(publicKeyDer, keyPair.privateKey, fields)

      setCsrPem(arrayBufferToPem(csrDer, 'CERTIFICATE REQUEST'))
      setKeyPem(arrayBufferToPem(privateKeyDer, 'PRIVATE KEY'))
    } catch (e) {
      setError('Failed to generate CSR. Please try again.')
      console.error(e)
    } finally {
      setGenerating(false)
    }
  }

  const copy = async (text: string, which: 'csr' | 'key') => {
    await navigator.clipboard.writeText(text)
    if (which === 'csr') { setCopiedCsr(true); setTimeout(() => setCopiedCsr(false), 1500) }
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

  const LabelRow = ({ label, sub }: { label: string; sub?: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
      <label style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: '#1a1917' }}>{label}</label>
      {sub && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>{sub}</span>}
    </div>
  )

  return (
    <div className="space-y-4">

      {/* Warning */}
      <div style={{ background: '#faeeda', border: '0.5px solid #e8c97a', borderRadius: 6, padding: '10px 14px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#633806', margin: 0, lineHeight: 1.6 }}>
          🔐 Private key is generated entirely in your browser — never sent to any server. Save it securely and never share it.
        </p>
      </div>

      {/* Form */}
      <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, padding: '16px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: '0 0 14px' }}>CERTIFICATE INFORMATION</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {/* Common Name */}
          <div style={{ gridColumn: '1 / -1' }}>
            <LabelRow label="Common Name (CN) *" sub="domain.com or *.domain.com" />
            <input style={inputStyle} value={fields.commonName}
              onChange={e => set('commonName')(e.target.value)}
              placeholder="example.com" />
          </div>

          {/* Organization */}
          <div>
            <LabelRow label="Organization (O)" sub="Company name" />
            <input style={inputStyle} value={fields.organization}
              onChange={e => set('organization')(e.target.value)}
              placeholder="My Company Ltd" />
          </div>

          {/* OU */}
          <div>
            <LabelRow label="Org Unit (OU)" sub="Department" />
            <input style={inputStyle} value={fields.organizationUnit}
              onChange={e => set('organizationUnit')(e.target.value)}
              placeholder="IT Department" />
          </div>

          {/* City */}
          <div>
            <LabelRow label="City / Locality (L)" />
            <input style={inputStyle} value={fields.locality}
              onChange={e => set('locality')(e.target.value)}
              placeholder="Bangkok" />
          </div>

          {/* State */}
          <div>
            <LabelRow label="State / Province (ST)" />
            <input style={inputStyle} value={fields.state}
              onChange={e => set('state')(e.target.value)}
              placeholder="Bangkok" />
          </div>

          {/* Country */}
          <div>
            <LabelRow label="Country (C) *" sub="2-letter ISO code" />
            <input style={inputStyle} value={fields.country}
              onChange={e => set('country')(e.target.value.toUpperCase().slice(0, 2))}
              placeholder="TH" maxLength={2} />
          </div>

          {/* Email */}
          <div>
            <LabelRow label="Email Address" sub="optional" />
            <input style={inputStyle} value={fields.email}
              onChange={e => set('email')(e.target.value)}
              placeholder="admin@example.com" type="email" />
          </div>
        </div>

        {/* Key size */}
        <div style={{ marginTop: 14 }}>
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
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: '6px 0 0' }}>
            {fields.keySize === 4096 ? '⚠️ 4096-bit may take 10-30 seconds to generate' : '2048-bit is standard and recommended for most use cases'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#fcebeb', border: '0.5px solid #f09595', borderRadius: 6, padding: '8px 12px', marginTop: 12 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a32d2d', margin: 0 }}>⚠️ {error}</p>
          </div>
        )}

        {/* Generate button */}
        <button onClick={generate} disabled={generating} style={{
          marginTop: 16, fontFamily: 'var(--font-mono)', fontSize: 13,
          padding: '10px 24px', background: generating ? '#a8a69e' : '#1a1917',
          color: '#f8f7f4', border: 'none', borderRadius: 8,
          cursor: generating ? 'default' : 'pointer', fontWeight: 500,
        }}>
          {generating ? `⏳ Generating ${fields.keySize}-bit key...` : '🔑 Generate CSR & Private Key'}
        </button>
      </div>

      {/* Output */}
      {csrPem && (
        <div className="space-y-3">
          {/* CSR */}
          <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #e8e6e0', background: '#f8f7f4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>📄 Certificate Signing Request (CSR)</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => copy(csrPem, 'csr')} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px',
                  background: copiedCsr ? '#e1f5ee' : '#ffffff', color: copiedCsr ? '#085041' : '#6b6960',
                  border: `0.5px solid ${copiedCsr ? '#1D9E75' : '#c8c6c0'}`, borderRadius: 5, cursor: 'pointer',
                }}>{copiedCsr ? '✓ Copied' : 'Copy'}</button>
                <button onClick={() => download(csrPem, `${fields.commonName || 'csr'}.csr`)} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px',
                  background: '#eeedfe', color: '#3c3489',
                  border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
                }}>↓ Download</button>
              </div>
            </div>
            <textarea readOnly value={csrPem} rows={8} style={{
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

          {/* Next steps */}
          <div style={{ background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 8, padding: '12px 14px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: '0 0 8px' }}>NEXT STEPS</p>
            {[
              { n: '1', text: 'Download and save both files securely' },
              { n: '2', text: 'Submit the .csr file to your Certificate Authority (CA) such as Let\'s Encrypt, DigiCert, or Sectigo' },
              { n: '3', text: 'Install the issued certificate + private key on your server' },
              { n: '4', text: 'Never share the private key — anyone with it can impersonate your domain' },
            ].map(s => (
              <div key={s.n} style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#3c3489', minWidth: 16 }}>{s.n}.</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6b6960', lineHeight: 1.6 }}>{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}