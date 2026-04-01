'use client'

import { useState, useCallback } from 'react'

interface DecodedJWT {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  isExpired: boolean
  expiryText?: string
  issuedText?: string
}

const SAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyIsIm5hbWUiOiJOYXQgVGhhaWRldiIsImVtYWlsIjoibmF0QGRldnRvb2xzLnJ1biIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwOTI1NjAwMCwiZXhwIjoxNzQwODc4MDAwfQ.signature'

function b64decode(str: string): Record<string, unknown> | null {
  try {
    const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(str.length / 4) * 4, '=')
    return JSON.parse(atob(padded))
  } catch {
    return null
  }
}

function timeAgo(ts: number): string {
  const now = Math.floor(Date.now() / 1000)
  const diff = ts - now
  const abs = Math.abs(diff)
  const past = diff < 0
  if (abs < 60) return past ? 'just expired' : 'in less than a minute'
  if (abs < 3600) return past ? `${Math.round(abs / 60)}m ago` : `in ${Math.round(abs / 60)}m`
  if (abs < 86400) return past ? `${Math.round(abs / 3600)}h ago` : `in ${Math.round(abs / 3600)}h`
  return past ? `${Math.round(abs / 86400)} days ago` : `in ${Math.round(abs / 86400)} days`
}

export default function JwtDecoder() {
  const [input, setInput] = useState('')
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const decode = useCallback((token: string) => {
    const t = token.trim()
    if (!t) { setDecoded(null); setError(''); return }

    const parts = t.split('.')
    if (parts.length !== 3) { setError('Invalid JWT — expected 3 parts separated by dots'); setDecoded(null); return }

    const header = b64decode(parts[0])
    const payload = b64decode(parts[1])
    if (!header || !payload) { setError('Could not decode — malformed base64'); setDecoded(null); return }

    const now = Math.floor(Date.now() / 1000)
    const exp = payload.exp as number | undefined
    const iat = payload.iat as number | undefined
    setError('')
    setDecoded({
      header,
      payload,
      isExpired: exp ? exp < now : false,
      expiryText: exp ? `${new Date(exp * 1000).toLocaleString()} (${timeAgo(exp)})` : undefined,
      issuedText: iat ? new Date(iat * 1000).toLocaleString() : undefined,
    })
  }, [])

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const loadSample = () => { setInput(SAMPLE); decode(SAMPLE) }
  const clear = () => { setInput(''); setDecoded(null); setError('') }

  return (
    <div className="space-y-4">

      {/* Input */}
      <div className="bg-white border border-[#c8c6c0] rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#c8c6c0]">
          <span className="font-mono text-[14px] text-[#c8c6c0] tracking-wider">input · jwt token</span>
          <button onClick={loadSample} className="font-mono text-[10px] text-[#c8c6c0] hover:text-[#1a1917] border border-[#c8c6c0] rounded px-2 py-0.5 transition-colors">
            load sample
          </button>
        </div>
        <textarea
          value={input}
          onChange={e => { setInput(e.target.value); decode(e.target.value) }}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          className="w-full h-28 px-3 py-2.5 font-mono text-[14px] text-[#1a1917] bg-transparent resize-none outline-none placeholder:text-[#d0cec8] leading-relaxed"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={clear}
          className="font-mono text-[14px] px-4 py-2 border border-[#d0cec8] rounded-md text-[#c8c6c0] hover:bg-white transition-colors"
        >
          clear
        </button>
        {decoded && (
          <button
            onClick={() => copy(JSON.stringify(decoded.payload, null, 2))}
            className="font-mono text-[14px] px-4 py-2 border border-[#d0cec8] rounded-md text-[#c8c6c0] hover:bg-white transition-colors ml-auto"
          >
            {copied ? 'copied!' : 'copy payload'}
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-[#fcebeb] border border-[#f09595] rounded-lg px-4 py-3 font-mono text-[14px] text-[#a32d2d]">
          {error}
        </div>
      )}

      {/* Result */}
      {decoded && (
        <div className="bg-white border border-[#c8c6c0] rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#c8c6c0]">
            <span className="font-mono text-[12px] text-[#4a4845] tracking-wider">decoded result</span>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${decoded.isExpired ? 'bg-[#E24B4A]' : 'bg-[#1D9E75]'}`} />
              <span className={`font-mono text-[10px] ${decoded.isExpired ? 'text-[#a32d2d]' : 'text-[#085041]'}`}>
                {decoded.isExpired ? 'token expired' : 'valid token'}
              </span>
            </div>
          </div>

          <div className="divide-y divide-[#d0cec8]">
            {/* Header section */}
            <div className="px-4 py-2">
              <p className="font-mono text-[9px] text-[#a8a69e] tracking-widest mb-2">header</p>
              {Object.entries(decoded.header).map(([k, v]) => (
                <Row key={k} label={k} value={String(v)} />
              ))}
            </div>

            {/* Payload section */}
            <div className="px-4 py-2">
              <p className="font-mono text-[9px] text-[#a8a69e] tracking-widest mb-2">payload claims</p>
              {decoded.issuedText && <Row label="issued at" value={decoded.issuedText} />}
              {decoded.expiryText && (
                <Row label="expires" value={decoded.expiryText} warn={decoded.isExpired} />
              )}
              {Object.entries(decoded.payload)
                .filter(([k]) => !['iat', 'exp', 'nbf'].includes(k))
                .map(([k, v]) => (
                  <Row key={k} label={k} value={typeof v === 'object' ? JSON.stringify(v) : String(v)} />
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Raw JSON output */}
      {decoded && (
        <div className="bg-white border border-[#c8c6c0] rounded-lg overflow-hidden">
          <div className="px-3 py-2 border-b border-[#c8c6c0]">
            <span className="font-mono text-[12px] text-[#4a4845] tracking-wider">raw payload json</span>
          </div>
          <pre className="px-3 py-2.5 font-mono text-[11px] text-[#c8c6c0] leading-relaxed overflow-x-auto">
            {JSON.stringify(decoded.payload, null, 2)}
          </pre>
        </div>
      )}

    </div>
  )
}

function Row({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="flex gap-3 py-1.5 text-[14px]">
      <span className="font-mono text-[#a8a69e] min-w-[100px] flex-shrink-0">{label}</span>
      <span className={`font-mono break-all ${warn ? 'text-[#a32d2d]' : 'text-[#1a1917]'}`}>{value}</span>
    </div>
  )
}
