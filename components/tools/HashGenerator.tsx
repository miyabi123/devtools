'use client'

import { useState } from 'react'

type Algorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'

const ALGOS: Algorithm[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']

// MD5 implementation (no WebCrypto support)
function md5(input: string): string {
  function safeAdd(x: number, y: number) { const lsw = (x & 0xffff) + (y & 0xffff); return (((x >> 16) + (y >> 16) + (lsw >> 16)) << 16) | (lsw & 0xffff) }
  function bitRotateLeft(num: number, cnt: number) { return (num << cnt) | (num >>> (32 - cnt)) }
  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number) { return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b) }
  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn((b & c) | (~b & d), a, b, x, s, t) }
  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn((b & d) | (c & ~d), a, b, x, s, t) }
  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn(b ^ c ^ d, a, b, x, s, t) }
  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn(c ^ (b | ~d), a, b, x, s, t) }

  const str = unescape(encodeURIComponent(input))
  const x: number[] = []
  for (let i = 0; i < str.length * 8; i += 8) x[i >> 5] = (x[i >> 5] || 0) | ((str.charCodeAt(i / 8) & 0xff) << (i % 32))
  x[((str.length * 8 + 64) >>> 9 << 4) + 14] = str.length * 8
  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878
  for (let i = 0; i < x.length; i += 16) {
    const [oa, ob, oc, od] = [a, b, c, d]
    a = md5ff(a,b,c,d,x[i+0],7,-680876936); d = md5ff(d,a,b,c,x[i+1],12,-389564586); c = md5ff(c,d,a,b,x[i+2],17,606105819); b = md5ff(b,c,d,a,x[i+3],22,-1044525330)
    a = md5ff(a,b,c,d,x[i+4],7,-176418897); d = md5ff(d,a,b,c,x[i+5],12,1200080426); c = md5ff(c,d,a,b,x[i+6],17,-1473231341); b = md5ff(b,c,d,a,x[i+7],22,-45705983)
    a = md5ff(a,b,c,d,x[i+8],7,1770035416); d = md5ff(d,a,b,c,x[i+9],12,-1958414417); c = md5ff(c,d,a,b,x[i+10],17,-42063); b = md5ff(b,c,d,a,x[i+11],22,-1990404162)
    a = md5ff(a,b,c,d,x[i+12],7,1804603682); d = md5ff(d,a,b,c,x[i+13],12,-40341101); c = md5ff(c,d,a,b,x[i+14],17,-1502002290); b = md5ff(b,c,d,a,x[i+15],22,1236535329)
    a = md5gg(a,b,c,d,x[i+1],5,-165796510); d = md5gg(d,a,b,c,x[i+6],9,-1069501632); c = md5gg(c,d,a,b,x[i+11],14,643717713); b = md5gg(b,c,d,a,x[i+0],20,-373897302)
    a = md5gg(a,b,c,d,x[i+5],5,-701558691); d = md5gg(d,a,b,c,x[i+10],9,38016083); c = md5gg(c,d,a,b,x[i+15],14,-660478335); b = md5gg(b,c,d,a,x[i+4],20,-405537848)
    a = md5gg(a,b,c,d,x[i+9],5,568446438); d = md5gg(d,a,b,c,x[i+14],9,-1019803690); c = md5gg(c,d,a,b,x[i+3],14,-187363961); b = md5gg(b,c,d,a,x[i+8],20,1163531501)
    a = md5gg(a,b,c,d,x[i+13],5,-1444681467); d = md5gg(d,a,b,c,x[i+2],9,-51403784); c = md5gg(c,d,a,b,x[i+7],14,1735328473); b = md5gg(b,c,d,a,x[i+12],20,-1926607734)
    a = md5hh(a,b,c,d,x[i+5],4,-378558); d = md5hh(d,a,b,c,x[i+8],11,-2022574463); c = md5hh(c,d,a,b,x[i+11],16,1839030562); b = md5hh(b,c,d,a,x[i+14],23,-35309556)
    a = md5hh(a,b,c,d,x[i+1],4,-1530992060); d = md5hh(d,a,b,c,x[i+4],11,1272893353); c = md5hh(c,d,a,b,x[i+7],16,-155497632); b = md5hh(b,c,d,a,x[i+10],23,-1094730640)
    a = md5hh(a,b,c,d,x[i+13],4,681279174); d = md5hh(d,a,b,c,x[i+0],11,-358537222); c = md5hh(c,d,a,b,x[i+3],16,-722521979); b = md5hh(b,c,d,a,x[i+6],23,76029189)
    a = md5hh(a,b,c,d,x[i+9],4,-640364487); d = md5hh(d,a,b,c,x[i+12],11,-421815835); c = md5hh(c,d,a,b,x[i+15],16,530742520); b = md5hh(b,c,d,a,x[i+2],23,-995338651)
    a = md5ii(a,b,c,d,x[i+0],6,-198630844); d = md5ii(d,a,b,c,x[i+7],10,1126891415); c = md5ii(c,d,a,b,x[i+14],15,-1416354905); b = md5ii(b,c,d,a,x[i+5],21,-57434055)
    a = md5ii(a,b,c,d,x[i+12],6,1700485571); d = md5ii(d,a,b,c,x[i+3],10,-1894986606); c = md5ii(c,d,a,b,x[i+10],15,-1051523); b = md5ii(b,c,d,a,x[i+1],21,-2054922799)
    a = md5ii(a,b,c,d,x[i+8],6,1873313359); d = md5ii(d,a,b,c,x[i+15],10,-30611744); c = md5ii(c,d,a,b,x[i+6],15,-1560198380); b = md5ii(b,c,d,a,x[i+13],21,1309151649)
    a = md5ii(a,b,c,d,x[i+4],6,-145523070); d = md5ii(d,a,b,c,x[i+11],10,-1120210379); c = md5ii(c,d,a,b,x[i+2],15,718787259); b = md5ii(b,c,d,a,x[i+9],21,-343485551)
    a = safeAdd(a, oa); b = safeAdd(b, ob); c = safeAdd(c, oc); d = safeAdd(d, od)
  }
  const output = [a, b, c, d]
  let hex = ''
  for (let i = 0; i < output.length * 32; i += 8) {
    hex += ('0' + ((output[i >> 5] >>> (i % 32)) & 0xff).toString(16)).slice(-2)
  }
  return hex
}

async function hashText(text: string, algo: Algorithm): Promise<string> {
  if (algo === 'MD5') return md5(text)
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const algoMap: Record<string, string> = { 'SHA-1': 'SHA-1', 'SHA-256': 'SHA-256', 'SHA-384': 'SHA-384', 'SHA-512': 'SHA-512' }
  const hashBuffer = await crypto.subtle.digest(algoMap[algo], data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function HashGenerator() {
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState<Record<Algorithm, string>>({} as Record<Algorithm, string>)
  const [selectedAlgo, setSelectedAlgo] = useState<Algorithm>('SHA-256')
  const [uppercase, setUppercase] = useState(false)
  const [copied, setCopied] = useState<Algorithm | null>(null)

  const SAMPLE = 'Hello, FreeUtil! 🔐'

  const processAll = async (text: string) => {
    if (!text) { setHashes({} as Record<Algorithm, string>); return }
    const results = await Promise.all(ALGOS.map(async algo => [algo, await hashText(text, algo)]))
    setHashes(Object.fromEntries(results) as Record<Algorithm, string>)
  }

  const handleInput = (val: string) => {
    setInput(val)
    processAll(val)
  }

  const copy = async (algo: Algorithm) => {
    const hash = hashes[algo]
    if (!hash) return
    await navigator.clipboard.writeText(uppercase ? hash.toUpperCase() : hash)
    setCopied(algo)
    setTimeout(() => setCopied(null), 1500)
  }

  const loadSample = () => { handleInput(SAMPLE) }
  const clear = () => { setInput(''); setHashes({} as Record<Algorithm, string>) }

  const formatHash = (h: string) => uppercase ? h.toUpperCase() : h

  return (
    <div className="space-y-4">

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)} style={{ cursor: 'pointer' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960' }}>UPPERCASE</span>
        </label>
        <button onClick={loadSample} style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 12px',
          background: 'transparent', color: '#6b6960',
          border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
        }}>load sample</button>
        <button onClick={clear} style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, padding: '6px 12px',
          background: 'transparent', color: '#6b6960',
          border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
        }}>clear</button>
      </div>

      {/* Input */}
      <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '0.5px solid #c8c6c0' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>input · text to hash</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>
            {input.length > 0 ? `${input.length} chars` : ''}
          </span>
        </div>
        <textarea
          value={input}
          onChange={e => handleInput(e.target.value)}
          placeholder="Enter text to generate hash..."
          style={{
            width: '100%', height: 120, padding: '12px',
            fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1a1917',
            background: 'transparent', border: 'none', outline: 'none',
            resize: 'none', lineHeight: 1.7,
          }}
        />
      </div>

      {/* Hash results */}
      {Object.keys(hashes).length > 0 && (
        <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '8px 12px', borderBottom: '0.5px solid #c8c6c0' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>hash results</span>
          </div>
          {ALGOS.map((algo, i) => (
            <div key={algo} style={{
              padding: '12px 14px',
              borderBottom: i < ALGOS.length - 1 ? '0.5px solid #e8e6e0' : 'none',
              background: selectedAlgo === algo ? '#f8f7f4' : '#ffffff',
              cursor: 'pointer',
            }} onClick={() => setSelectedAlgo(algo)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {selectedAlgo === algo && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#1D9E75' }} />}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, color: '#1a1917' }}>{algo}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#a8a69e' }}>
                    {hashes[algo]?.length * 4} bits
                  </span>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); copy(algo) }}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 8px',
                    background: 'transparent', color: '#6b6960',
                    border: '0.5px solid #c8c6c0', borderRadius: 4, cursor: 'pointer',
                  }}
                >
                  {copied === algo ? 'copied!' : 'copy'}
                </button>
              </div>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: 12, color: '#6b6960',
                margin: 0, wordBreak: 'break-all', lineHeight: 1.6,
              }}>
                {formatHash(hashes[algo] || '')}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Security note */}
      {Object.keys(hashes).length > 0 && (
        <div style={{ background: '#faeeda', border: '0.5px solid #EF9F27', borderRadius: 6, padding: '10px 14px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#633806', margin: 0 }}>
            MD5 and SHA-1 are cryptographically broken — use SHA-256 or higher for security purposes.
          </p>
        </div>
      )}

    </div>
  )
}
