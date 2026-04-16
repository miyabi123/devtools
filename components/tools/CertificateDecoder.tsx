'use client'

import { useState } from 'react'

// ── ASN.1 DER Parser ─────────────────────────────────────────────
function pemToDer(pem: string): Uint8Array {
  const b64 = pem.trim().split('\n').filter(l => !l.startsWith('-----')).join('').replace(/\s/g, '')
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

interface ASN1Node {
  tag: number
  length: number
  value: Uint8Array
  children?: ASN1Node[]
  offset: number
}

function parseASN1(data: Uint8Array, offset = 0): ASN1Node {
  const tag = data[offset]
  let lenOffset = offset + 1
  let length = data[lenOffset]
  if (length & 0x80) {
    const numBytes = length & 0x7f
    length = 0
    for (let i = 0; i < numBytes; i++) length = (length << 8) | data[++lenOffset]
  }
  const valueOffset = lenOffset + 1
  const value = data.slice(valueOffset, valueOffset + length)
  const node: ASN1Node = { tag, length, value, offset }
  if ((tag & 0x20) || tag === 0xa0 || tag === 0xa3) {
    const children: ASN1Node[] = []
    let childOffset = 0
    while (childOffset < value.length) {
      try {
        const child = parseASN1(value, childOffset)
        children.push(child)
        let skip = 2
        let cl = value[childOffset + 1]
        if (cl & 0x80) { const nb = cl & 0x7f; cl = 0; for (let i = 0; i < nb; i++) cl = (cl << 8) | value[childOffset + 2 + i]; skip = 2 + (value[childOffset + 1] & 0x7f) }
        childOffset += skip + child.length
      } catch { break }
    }
    node.children = children
  }
  return node
}

function decodeOID(bytes: Uint8Array): string {
  const parts: number[] = []
  parts.push(Math.floor(bytes[0] / 40))
  parts.push(bytes[0] % 40)
  let val = 0
  for (let i = 1; i < bytes.length; i++) {
    val = (val << 7) | (bytes[i] & 0x7f)
    if (!(bytes[i] & 0x80)) { parts.push(val); val = 0 }
  }
  return parts.join('.')
}

function decodeUTF8(bytes: Uint8Array): string {
  try { return new TextDecoder().decode(bytes) } catch { return '' }
}

function decodeDate(bytes: Uint8Array): string {
  const s = decodeUTF8(bytes)
  if (s.length === 13) {
    const yr = parseInt(s.slice(0, 2))
    const year = yr >= 50 ? 1900 + yr : 2000 + yr
    return `${year}-${s.slice(2, 4)}-${s.slice(4, 6)} ${s.slice(6, 8)}:${s.slice(8, 10)}:${s.slice(10, 12)} UTC`
  }
  if (s.length === 15) {
    return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)} ${s.slice(8, 10)}:${s.slice(10, 12)}:${s.slice(12, 14)} UTC`
  }
  return s
}

const OID_MAP: Record<string, string> = {
  '2.5.4.3': 'CN', '2.5.4.6': 'C', '2.5.4.7': 'L', '2.5.4.8': 'ST',
  '2.5.4.10': 'O', '2.5.4.11': 'OU', '1.2.840.113549.1.9.1': 'Email',
  '1.2.840.113549.1.1.1': 'RSA', '1.2.840.113549.1.1.11': 'SHA256withRSA',
  '1.2.840.113549.1.1.5': 'SHA1withRSA', '1.2.840.113549.1.1.12': 'SHA384withRSA',
  '1.2.840.113549.1.1.13': 'SHA512withRSA', '1.2.840.10045.4.3.2': 'SHA256withECDSA',
  '1.2.840.10045.4.3.3': 'SHA384withECDSA', '2.5.29.17': 'SAN',
  '2.5.29.19': 'Basic Constraints', '2.5.29.15': 'Key Usage',
  '2.5.29.37': 'Extended Key Usage', '2.5.29.14': 'Subject Key ID',
  '2.5.29.35': 'Authority Key ID', '1.3.6.1.5.5.7.1.1': 'Authority Info Access',
}

function parseRDN(seq: ASN1Node): Record<string, string> {
  const result: Record<string, string> = {}
  if (!seq.children) return result
  for (const set of seq.children) {
    if (!set.children) continue
    for (const attr of set.children) {
      if (!attr.children || attr.children.length < 2) continue
      const oid = decodeOID(attr.children[0].value)
      const name = OID_MAP[oid] || oid
      const val = decodeUTF8(attr.children[1].value)
      result[name] = val
    }
  }
  return result
}

function formatFingerprint(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(':')
}

interface CertInfo {
  subject: Record<string, string>
  issuer: Record<string, string>
  notBefore: string
  notAfter: string
  serialNumber: string
  signatureAlgorithm: string
  keyAlgorithm: string
  keySize: string
  sans: string[]
  fingerprint256: string
  fingerprint1: string
  isExpired: boolean
  daysLeft: number
  version: string
}

async function decodeCertificate(pem: string): Promise<CertInfo> {
  const der = pemToDer(pem)
  const root = parseASN1(der)

  if (!root.children || root.children.length < 3) throw new Error('Invalid certificate structure')

  const tbs = root.children[0]
  if (!tbs.children) throw new Error('Invalid TBS certificate')

  let idx = 0
  let version = 'v1'
  if (tbs.children[0].tag === 0xa0) {
    const vNode = tbs.children[0].children?.[0]
    if (vNode) version = `v${(vNode.value[0] || 0) + 1}`
    idx = 1
  }

  const serial = Array.from(tbs.children[idx].value).map(b => b.toString(16).padStart(2, '0')).join(':').toUpperCase()
  idx++

  const sigAlgOID = decodeOID(tbs.children[idx].children?.[0]?.value || new Uint8Array())
  const signatureAlgorithm = OID_MAP[sigAlgOID] || sigAlgOID
  idx++

  const issuer = parseRDN(tbs.children[idx]); idx++
  const validity = tbs.children[idx]; idx++
  const notBefore = decodeDate(validity.children?.[0]?.value || new Uint8Array())
  const notAfter = decodeDate(validity.children?.[1]?.value || new Uint8Array())

  const subject = parseRDN(tbs.children[idx]); idx++

  // Key info
  const spki = tbs.children[idx]; idx++
  const keyAlgOID = decodeOID(spki.children?.[0]?.children?.[0]?.value || new Uint8Array())
  const keyAlgorithm = OID_MAP[keyAlgOID] || keyAlgOID
  const keyBitString = spki.children?.[1]?.value
  let keySize = 'Unknown'
  if (keyBitString && keyBitString.length > 4) {
    const keyBytes = keyBitString.slice(1)
    if (keyAlgorithm === 'RSA') {
      try {
        const inner = parseASN1(keyBytes)
        if (inner.children?.[0]) keySize = `${(inner.children[0].value.length - 1) * 8}-bit`
      } catch { keySize = `~${keyBytes.length * 8}-bit` }
    } else {
      keySize = `${(keyBytes.length - 1) * 4}-bit`
    }
  }

  // Extensions
  const sans: string[] = []
  for (let i = idx; i < tbs.children.length; i++) {
    const ext = tbs.children[i]
    if (ext.tag !== 0xa3 || !ext.children) continue
    const extsSeq = ext.children[0]
    if (!extsSeq.children) continue
    for (const extItem of extsSeq.children) {
      if (!extItem.children || extItem.children.length < 2) continue
      const oid = decodeOID(extItem.children[0].value)
      if (oid === '2.5.29.17') {
        const sanData = extItem.children[extItem.children.length - 1].value
        try {
          const sanSeq = parseASN1(sanData)
          if (sanSeq.children) {
            for (const sanEntry of sanSeq.children) {
              if (sanEntry.tag === 0x82) sans.push(decodeUTF8(sanEntry.value))
              else if (sanEntry.tag === 0x87) {
                sans.push(Array.from(sanEntry.value).join('.'))
              }
            }
          }
        } catch { /* ignore */ }
      }
    }
  }

  // Fingerprints
  const sha256 = await crypto.subtle.digest('SHA-256', der.buffer as ArrayBuffer)
  const sha1 = await crypto.subtle.digest('SHA-1', der.buffer as ArrayBuffer)

  // Expiry
  const notAfterDate = new Date(notAfter.replace(' UTC', 'Z').replace(' ', 'T'))
  const now = new Date()
  const daysLeft = Math.floor((notAfterDate.getTime() - now.getTime()) / 86400000)

  return {
    subject, issuer, notBefore, notAfter, serialNumber: serial,
    signatureAlgorithm, keyAlgorithm, keySize, sans,
    fingerprint256: formatFingerprint(new Uint8Array(sha256)),
    fingerprint1: formatFingerprint(new Uint8Array(sha1)),
    isExpired: daysLeft < 0,
    daysLeft,
    version,
  }
}

const SAMPLE_CERT = `-----BEGIN CERTIFICATE-----
MIIFazCCA1OgAwIBAgIRAIIQz7DSQONZRGPgu2OCiwAwDQYJKoZIhvcNAQELBQAw
TzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh
cmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwHhcNMTUwNjA0MTEwNDM4
WhcNMzUwNjA0MTEwNDM4WjBPMQswCQYDVQQGEwJVUzEpMCcGA1UEChMgSW50ZXJu
ZXQgU2VjdXJpdHkgUmVzZWFyY2ggR3JvdXAxFTATBgNVBAMTDElTUkcgUm9vdCBY
MTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoBggIBAK3oJHP0FDfzm54rVygc
h77ct984kIxuPOZXoHj3dcKi/vVqbvYATyjb3miGbESTtrFj/RQSa78f0uoxmyF+
0TM8ukj13Xnfs7j/EvEhmkvBioZxaUpmZmyPfjxwv60pIgbz5MDmgK7iS4+3mX6U
A5/TR5d8mUgjU+g4rk8Kb4Mu0UlXjIB0ttov0DiNewNwIRt18jA8+o+u3dpjq+sW
T8KOEUt+zwvo/7V3LvSye0rgTBIlDHCNAymg4VMk7BPZ7hm/ELNKjD+Jo2FR3qyH
B5T0Y3HsLuJvW5iB4YlcNHlsdu87kGJ55tukmi8mxdAQ4Q7e2RCOFvu396j3x+UC
B5iPNgiV5+I3lg02dZ77DnKxHZu8A/lJBdiB3QW0KtZB6awBdpUKD9jf1b0SHzUv
KBds0pjBqAlkd25HN7rOrFleaJ1/ctaJxQZBKT5ZPt0m9STJEadao0xAH0ahmbWn
OlFuhjuefXKnEgV4We0+UXgVCwOPjdAvBbI+e0ocS3MFEvzG6uBQE3xDk3SzynTn
jh8BCNAw1FtxNrQHusEwMFxIt4I7mKZ9YIqioymCzLq9gwQbooMDQaHWBfEbwrbw
qHyGO0aoSCqI3Haadr8faqU9GY/rOPNk3sgrDQoo//fb4hVC1CLQJ13hef4Y53CI
rU7m2Ys6xt0nUW7/vGT1M0AgMBAAGjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNVHRMB
Af8EBTADAQH/MB0GA1UdDgQWBBR5tFnme7bl5AFzgAiIyBpY9umbbjANBgkqhkiG
9w0BAQsFAAOCAgEAVR9YqbyyqFDQDLHYGmkgJykIrGF1XIpu+ILlaS/V9lZLubhz
EFnTIZd+50xx+7LSYK05qAvqFyFWhfFQDlnrzuBZ6brJFe+GnY+EgPbk6ZGQ3Beb
YrnkWSfCNiKmU/u1kRMFM8UHff1mhXgRgLHBMGLs+n3aCT72q4yEk0HsXQqEWWaY
tODEfMnDzFqMCFGkFpNGnvYqBbRMfnVPE+RgfRWKiSTcbBRk5zRyAMC4Bb3M5/BM
ZHBWFYEM6Uf3fRfRvPBfHCniNk68M3AZJQMmVE3U1+tQ6nxSsHwN04GEBpb5gYYX
5OkI48VvDRm/AoULEwfJcGYIiwz2jRfFLWaFLlIjI+DJkH8PQPP5fQmJWYL7W9cC
jL8p5EV8GAkGwDpZFsktLYkzEAFNK2tGVOLpGMKHNvEiCYHTdJ1TMIKuL1Wv+D3a
2YP0h6pDhYSWkwfzfq5kZBK7N4I9q4MNk4VkAJ7E4lIkB3R+9PtcXCNP0MXQZ7oc
-----END CERTIFICATE-----`

function rdnToString(rdn: Record<string, string>): string {
  const order = ['CN', 'O', 'OU', 'L', 'ST', 'C']
  return order.filter(k => rdn[k]).map(k => `${k}=${rdn[k]}`).join(', ') ||
    Object.entries(rdn).map(([k, v]) => `${k}=${v}`).join(', ')
}

export default function CertificateDecoder() {
  const [pem, setPem] = useState('')
  const [cert, setCert] = useState<CertInfo | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const decode = async () => {
    if (!pem.trim()) { setError('Please paste a PEM certificate'); return }
    if (!pem.includes('-----BEGIN')) { setError('Invalid PEM — must contain -----BEGIN CERTIFICATE-----'); return }
    setError(''); setLoading(true); setCert(null)
    try {
      const info = await decodeCertificate(pem)
      setCert(info)
    } catch (e) {
      setError('Failed to decode certificate — please check the PEM format')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  const InfoRow = ({ label, value, mono = false, copyKey }: { label: string; value: string; mono?: boolean; copyKey?: string }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '7px 0', borderBottom: '0.5px solid #e8e6e0', gap: 12 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', minWidth: 140, flexShrink: 0, paddingTop: 1 }}>{label}</span>
      <span style={{ fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)', fontSize: 12, color: '#1a1917', flex: 1, wordBreak: 'break-all', lineHeight: 1.5 }}>{value}</span>
      {copyKey && (
        <button onClick={() => copy(value, copyKey)} style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, padding: '2px 7px', flexShrink: 0,
          background: copied === copyKey ? '#e1f5ee' : '#f8f7f4',
          color: copied === copyKey ? '#085041' : '#6b6960',
          border: `0.5px solid ${copied === copyKey ? '#1D9E75' : '#c8c6c0'}`,
          borderRadius: 4, cursor: 'pointer',
        }}>{copied === copyKey ? '✓' : 'copy'}</button>
      )}
    </div>
  )

  const SectionHeader = ({ title }: { title: string }) => (
    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em', margin: '16px 0 8px' }}>{title}</p>
  )

  return (
    <div className="space-y-4">

      {/* Input */}
      <div style={{ background: '#ffffff', border: '1.5px solid #1a1917', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '8px 14px', borderBottom: '0.5px solid #e8e6e0', background: '#f8f7f4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>Paste PEM Certificate</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => { setPem(SAMPLE_CERT); setCert(null); setError('') }} style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 8px',
              background: '#eeedfe', color: '#3c3489',
              border: '0.5px solid #c8c6c0', borderRadius: 4, cursor: 'pointer',
            }}>Sample</button>
            {pem && <button onClick={() => { setPem(''); setCert(null); setError('') }} style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 8px',
              background: '#fcebeb', color: '#a32d2d',
              border: '0.5px solid #f09595', borderRadius: 4, cursor: 'pointer',
            }}>Clear</button>}
          </div>
        </div>
        <textarea
          value={pem}
          onChange={e => { setPem(e.target.value); setCert(null); setError('') }}
          placeholder="-----BEGIN CERTIFICATE-----&#10;MIIDzTCCArWgAwIBAgIQCjeHZ...&#10;-----END CERTIFICATE-----"
          rows={7}
          style={{
            width: '100%', padding: '12px 14px', border: 'none', outline: 'none',
            resize: 'none', fontFamily: 'var(--font-mono)', fontSize: 12,
            color: '#1a1917', background: '#ffffff', lineHeight: 1.6,
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: '#fcebeb', border: '0.5px solid #f09595', borderRadius: 6, padding: '8px 14px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a32d2d', margin: 0 }}>⚠️ {error}</p>
        </div>
      )}

      {/* Decode button */}
      <button onClick={decode} disabled={loading} style={{
        fontFamily: 'var(--font-mono)', fontSize: 13, padding: '10px 24px',
        background: loading ? '#a8a69e' : '#1a1917', color: '#f8f7f4',
        border: 'none', borderRadius: 8, cursor: loading ? 'default' : 'pointer', fontWeight: 500,
      }}>
        {loading ? '⏳ Decoding...' : '🔍 Decode Certificate'}
      </button>

      {/* Result */}
      {cert && (
        <div className="space-y-3">

          {/* Status banner */}
          <div style={{
            background: cert.isExpired ? '#fcebeb' : cert.daysLeft < 30 ? '#faeeda' : '#e1f5ee',
            border: `1px solid ${cert.isExpired ? '#f09595' : cert.daysLeft < 30 ? '#e8c97a' : '#1D9E75'}`,
            borderRadius: 10, padding: '14px 16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8,
          }}>
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: cert.isExpired ? '#a32d2d' : cert.daysLeft < 30 ? '#633806' : '#085041', margin: '0 0 2px', letterSpacing: '0.06em' }}>
                {cert.isExpired ? 'EXPIRED' : cert.daysLeft < 30 ? 'EXPIRING SOON' : 'VALID CERTIFICATE'}
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500, color: '#1a1917', margin: 0 }}>
                {cert.subject['CN'] || 'Unknown CN'}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: cert.isExpired ? '#a32d2d' : cert.daysLeft < 30 ? '#633806' : '#085041', margin: 0 }}>
                {cert.isExpired ? 'Expired' : `${cert.daysLeft}d`}
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6b6960', margin: '2px 0 0' }}>
                {cert.isExpired ? `${Math.abs(cert.daysLeft)} days ago` : 'days remaining'}
              </p>
            </div>
          </div>

          {/* Details */}
          <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, padding: '14px 16px' }}>
            <SectionHeader title="SUBJECT" />
            <InfoRow label="Common Name (CN)" value={cert.subject['CN'] || '—'} />
            <InfoRow label="Organization (O)" value={cert.subject['O'] || '—'} />
            <InfoRow label="Org Unit (OU)" value={cert.subject['OU'] || '—'} />
            <InfoRow label="Country (C)" value={cert.subject['C'] || '—'} />
            <InfoRow label="Full DN" value={rdnToString(cert.subject)} mono />

            <SectionHeader title="ISSUER" />
            <InfoRow label="Common Name (CN)" value={cert.issuer['CN'] || '—'} />
            <InfoRow label="Organization (O)" value={cert.issuer['O'] || '—'} />
            <InfoRow label="Full DN" value={rdnToString(cert.issuer)} mono />

            <SectionHeader title="VALIDITY" />
            <InfoRow label="Not Before" value={cert.notBefore} mono />
            <InfoRow label="Not After" value={cert.notAfter} mono />
            <InfoRow label="Status" value={cert.isExpired ? `Expired ${Math.abs(cert.daysLeft)} days ago` : `Valid — ${cert.daysLeft} days remaining`} />

            <SectionHeader title="KEY & ALGORITHM" />
            <InfoRow label="Version" value={cert.version} />
            <InfoRow label="Key Algorithm" value={cert.keyAlgorithm} />
            <InfoRow label="Key Size" value={cert.keySize} />
            <InfoRow label="Signature Algorithm" value={cert.signatureAlgorithm} />
            <InfoRow label="Serial Number" value={cert.serialNumber} mono copyKey="serial" />

            {cert.sans.length > 0 && (
              <>
                <SectionHeader title={`SUBJECT ALTERNATIVE NAMES (${cert.sans.length})`} />
                {cert.sans.map((san, i) => (
                  <InfoRow key={i} label={`DNS ${i + 1}`} value={san} mono />
                ))}
              </>
            )}

            <SectionHeader title="FINGERPRINTS" />
            <InfoRow label="SHA-256" value={cert.fingerprint256} mono copyKey="sha256" />
            <InfoRow label="SHA-1" value={cert.fingerprint1} mono copyKey="sha1" />
          </div>

        </div>
      )}
    </div>
  )
}