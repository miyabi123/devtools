'use client'

import { useState } from 'react'

interface SubnetInfo {
  ip: string
  cidr: number
  networkAddress: string
  broadcastAddress: string
  firstHost: string
  lastHost: string
  subnetMask: string
  wildcardMask: string
  totalHosts: number
  usableHosts: number
  ipClass: string
  isPrivate: boolean
  binary: { ip: string; subnet: string; network: string; broadcast: string }
  possibleNetworks: { network: string; broadcast: string; first: string; last: string }[]
}

function ipToLong(ip: string): number {
  return ip.split('.').reduce((acc, oct) => (acc << 8) + parseInt(oct), 0) >>> 0
}
function longToIp(long: number): string {
  return [24, 16, 8, 0].map(s => (long >>> s) & 255).join('.')
}
function toBinary(ip: string): string {
  return ip.split('.').map(o => parseInt(o).toString(2).padStart(8, '0')).join('.')
}
function maskToCidr(mask: string): number {
  return mask.split('.').reduce((acc, oct) => acc + parseInt(oct).toString(2).split('').filter(b => b === '1').length, 0)
}
function isValidIp(ip: string): boolean {
  const parts = ip.trim().split('.')
  return parts.length === 4 && parts.every(p => !isNaN(parseInt(p)) && parseInt(p) >= 0 && parseInt(p) <= 255)
}
function getIpClass(ip: string): string {
  const f = parseInt(ip.split('.')[0])
  if (f >= 1 && f <= 126) return 'A'
  if (f >= 128 && f <= 191) return 'B'
  if (f >= 192 && f <= 223) return 'C'
  if (f >= 224 && f <= 239) return 'D'
  return 'E'
}
function isPrivateIp(ip: string): boolean {
  const l = ipToLong(ip)
  return (l >= ipToLong('10.0.0.0') && l <= ipToLong('10.255.255.255')) ||
    (l >= ipToLong('172.16.0.0') && l <= ipToLong('172.31.255.255')) ||
    (l >= ipToLong('192.168.0.0') && l <= ipToLong('192.168.255.255'))
}

function parseInput(raw: string): { ip: string; cidr: number } | null {
  const s = raw.trim()
  if (s.includes('/') && !s.includes(' - ')) {
    const [ip, prefix] = s.split('/')
    const cidr = parseInt(prefix)
    if (isValidIp(ip) && !isNaN(cidr) && cidr >= 0 && cidr <= 32) return { ip: ip.trim(), cidr }
    if (isValidIp(ip) && isValidIp(prefix.trim())) return { ip: ip.trim(), cidr: maskToCidr(prefix.trim()) }
    return null
  }
  if (s.includes(' - ') || s.includes('-')) {
    const sep = s.includes(' - ') ? ' - ' : '-'
    const parts = s.split(sep).map(p => p.trim())
    if (parts.length === 2 && isValidIp(parts[0]) && isValidIp(parts[1])) {
      const count = ipToLong(parts[1]) - ipToLong(parts[0]) + 1
      const cidr = 32 - Math.floor(Math.log2(Math.max(count, 1)))
      return { ip: parts[0], cidr: Math.max(0, Math.min(32, cidr)) }
    }
    return null
  }
  if (isValidIp(s)) return { ip: s, cidr: 32 }
  return null
}

function calcSubnet(raw: string): SubnetInfo | null {
  const parsed = parseInput(raw)
  if (!parsed) return null
  const { ip, cidr } = parsed
  const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0
  const wildcard = (~mask) >>> 0
  const network = (ipToLong(ip) & mask) >>> 0
  const broadcast = (network | wildcard) >>> 0
  const totalHosts = Math.pow(2, 32 - cidr)
  const usableHosts = cidr >= 31 ? totalHosts : Math.max(0, totalHosts - 2)
  const possibleNetworks: SubnetInfo['possibleNetworks'] = []
  if (cidr > 8 && cidr <= 30) {
    const parentCidr = cidr <= 24 ? Math.min(cidr - 1, 24) : 24
    const parentMask = (~0 << (32 - parentCidr)) >>> 0
    const parentNet = (ipToLong(ip) & parentMask) >>> 0
    const subSize = Math.pow(2, 32 - cidr)
    const numSubs = Math.pow(2, cidr - parentCidr)
    const show = Math.min(numSubs, 16)
    for (let i = 0; i < show; i++) {
      const n = (parentNet + i * subSize) >>> 0
      const b = (n + subSize - 1) >>> 0
      possibleNetworks.push({ network: longToIp(n), broadcast: longToIp(b), first: longToIp(n + 1), last: longToIp(b - 1) })
    }
  }
  return {
    ip, cidr,
    networkAddress: longToIp(network),
    broadcastAddress: longToIp(broadcast),
    firstHost: longToIp(cidr === 32 ? network : network + 1),
    lastHost: longToIp(cidr === 32 ? broadcast : broadcast - 1),
    subnetMask: longToIp(mask), wildcardMask: longToIp(wildcard),
    totalHosts, usableHosts,
    ipClass: getIpClass(ip), isPrivate: isPrivateIp(ip),
    binary: { ip: toBinary(ip), subnet: toBinary(longToIp(mask)), network: toBinary(longToIp(network)), broadcast: toBinary(longToIp(broadcast)) },
    possibleNetworks,
  }
}

const SAMPLES = ['192.168.1.0/24', '10.0.0.0/8', '172.16.0.0/25', '192.168.1.0/255.255.255.0', '10.0.0.1 - 10.0.0.62']

export default function CidrCalculator() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<SubnetInfo | null>(null)
  const [error, setError] = useState('')
  const [showBinary, setShowBinary] = useState(false)
  const [showNetworks, setShowNetworks] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)
  const [highlightNet, setHighlightNet] = useState<number | null>(null)

  const run = (val: string) => {
    setInput(val)
    if (!val.trim()) { setResult(null); setError(''); return }
    const r = calcSubnet(val)
    if (r) { setResult(r); setError('') }
    else setError('Invalid input — try: 192.168.1.0/24 · or /255.255.255.0 mask · or IP range (x.x.x.x - x.x.x.x)')
  }

  const copy = async (text: string, k: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(k); setTimeout(() => setCopied(null), 1500)
  }

  const CopyBtn = ({ text, k }: { text: string; k: string }) => (
    <button onClick={() => copy(text, k)} style={{
      fontFamily: 'var(--font-mono)', fontSize: 9, padding: '1px 7px', flexShrink: 0,
      background: copied === k ? '#e1f5ee' : 'transparent',
      color: copied === k ? '#085041' : '#a8a69e',
      border: `0.5px solid ${copied === k ? '#1D9E75' : '#e8e6e0'}`,
      borderRadius: 3, cursor: 'pointer', transition: 'all .15s',
    }}>{copied === k ? '✓' : 'copy'}</button>
  )

  const Row = ({ label, value, k }: { label: string; value: string; k: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 16px', borderBottom: '0.5px solid #f0ede8' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960', minWidth: 170 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1a1917' }}>{value}</span>
        <CopyBtn text={value} k={k} />
      </div>
    </div>
  )

  return (
    <div className="space-y-4">

      {/* Input */}
      <div style={{ background: '#ffffff', border: '1.5px solid #1a1917', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ padding: '0 14px', color: '#a8a69e' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1" y="3" width="14" height="10" rx="2"/><path d="M4 8h8M4 6h3M4 10h5"/>
            </svg>
          </div>
          <input type="text" value={input} onChange={e => run(e.target.value)}
            placeholder="192.168.1.0/24  ·  /255.255.255.0  ·  10.0.0.1 - 10.0.0.62"
            style={{ flex: 1, padding: '14px 0', border: 'none', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: 14, color: '#1a1917', background: 'transparent' }}
          />
          {input && <button onClick={() => run('')} style={{ padding: '0 14px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#a8a69e', fontSize: 18 }}>×</button>}
        </div>
      </div>

      {/* Format badges */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>accepts:</span>
        {[
          { label: 'CIDR', ex: '192.168.1.0/24' },
          { label: 'IP/Mask', ex: '192.168.1.0/255.255.255.0' },
          { label: 'IP Range', ex: '10.0.0.1 - 10.0.0.62' },
        ].map(f => (
          <button key={f.label} onClick={() => run(f.ex)} style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px',
            background: '#ffffff', color: '#6b6960', border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
          }}>
            <span style={{ color: '#a8a69e', marginRight: 5 }}>{f.label}</span>{f.ex}
          </button>
        ))}
      </div>

      {/* Samples */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>samples:</span>
        {SAMPLES.map(s => (
          <button key={s} onClick={() => run(s)} style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px',
            background: input === s ? '#1a1917' : '#ffffff', color: input === s ? '#f8f7f4' : '#6b6960',
            border: '0.5px solid #c8c6c0', borderRadius: 5, cursor: 'pointer',
          }}>{s}</button>
        ))}
      </div>

      {error && (
        <div style={{ background: '#fcebeb', border: '0.5px solid #f09595', borderRadius: 6, padding: '10px 14px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a32d2d', margin: 0 }}>{error}</p>
        </div>
      )}

      {result && (<>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8 }}>
          {[
            { label: 'Total hosts', value: result.totalHosts.toLocaleString() },
            { label: 'Usable hosts', value: result.usableHosts.toLocaleString() },
            { label: 'CIDR prefix', value: `/${result.cidr}` },
            { label: 'IP class', value: `Class ${result.ipClass}` },
          ].map(c => (
            <div key={c.label} style={{ background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 8, padding: '12px 14px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: '0 0 4px' }}>{c.label}</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 500, color: '#1a1917', margin: 0 }}>{c.value}</p>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {result.isPrivate && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px', borderRadius: 99, background: '#e1f5ee', color: '#085041' }}>private (RFC 1918)</span>}
          {result.cidr === 32 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px', borderRadius: 99, background: '#eeedfe', color: '#3c3489' }}>host route /32</span>}
          {result.cidr <= 8 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px', borderRadius: 99, background: '#faeeda', color: '#633806' }}>supernet — large range</span>}
        </div>

        {/* Detail table */}
        <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '8px 16px', borderBottom: '0.5px solid #c8c6c0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>subnet details</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
              <input type="checkbox" checked={showBinary} onChange={e => setShowBinary(e.target.checked)} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6b6960' }}>show binary</span>
            </label>
          </div>
          <Row label="IP address" value={result.ip} k="ip" />
          <Row label="Network address" value={result.networkAddress} k="net" />
          <Row label="Broadcast address" value={result.broadcastAddress} k="bc" />
          <Row label="First usable host" value={result.firstHost} k="first" />
          <Row label="Last usable host" value={result.lastHost} k="last" />
          <Row label="Subnet mask" value={result.subnetMask} k="mask" />
          <Row label="Wildcard mask" value={result.wildcardMask} k="wild" />
          <div style={{ padding: '9px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960' }}>Host range</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#1a1917' }}>{result.firstHost} — {result.lastHost}</span>
          </div>
        </div>

        {/* Binary */}
        {showBinary && (
          <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '8px 16px', borderBottom: '0.5px solid #c8c6c0' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>binary</span>
            </div>
            {[
              { label: 'IP address', value: result.binary.ip },
              { label: 'Subnet mask', value: result.binary.subnet },
              { label: 'Network address', value: result.binary.network },
              { label: 'Broadcast address', value: result.binary.broadcast },
            ].map((row, i, arr) => (
              <div key={row.label} style={{ padding: '9px 16px', borderBottom: i < arr.length - 1 ? '0.5px solid #f0ede8' : 'none' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: '0 0 3px' }}>{row.label}</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#1a1917', margin: 0, letterSpacing: '0.04em' }}>{row.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Possible networks */}
        {result.possibleNetworks.length > 0 && (
          <div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '8px 16px', borderBottom: '0.5px solid #c8c6c0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a4845' }}>possible /{result.cidr} networks</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, padding: '1px 8px', borderRadius: 99, background: '#eeedfe', color: '#3c3489' }}>
                  {result.possibleNetworks.length} subnets
                </span>
              </div>
              <button onClick={() => setShowNetworks(v => !v)} style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 8px',
                background: 'transparent', color: '#6b6960', border: '0.5px solid #c8c6c0', borderRadius: 4, cursor: 'pointer',
              }}>{showNetworks ? 'hide' : 'show'}</button>
            </div>

            {showNetworks && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 1fr 1fr', padding: '6px 16px', background: '#f8f7f4', borderBottom: '0.5px solid #e8e6e0' }}>
                  {['', 'Network', 'Broadcast', 'First host', 'Last host'].map((h, i) => (
                    <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#a8a69e', letterSpacing: '0.05em' }}>{h}</span>
                  ))}
                </div>
                {result.possibleNetworks.map((net, i) => {
                  const isCurrent = net.network === result.networkAddress
                  return (
                    <div key={i}
                      onMouseEnter={() => setHighlightNet(i)}
                      onMouseLeave={() => setHighlightNet(null)}
                      style={{
                        display: 'grid', gridTemplateColumns: '28px 1fr 1fr 1fr 1fr',
                        padding: '8px 16px', borderBottom: '0.5px solid #f0ede8',
                        background: isCurrent ? '#e1f5ee' : highlightNet === i ? '#f8f7f4' : '#ffffff',
                        transition: 'background .1s',
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: isCurrent ? '#085041' : '#c8c6c0', alignSelf: 'center' }}>
                        {isCurrent ? '▶' : i + 1}
                      </span>
                      {[net.network, net.broadcast, net.first, net.last].map((val, j) => (
                        <span key={j} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: isCurrent ? '#085041' : '#1a1917' }}>{val}</span>
                      ))}
                    </div>
                  )
                })}
              </>
            )}
          </div>
        )}

      </>)}
    </div>
  )
}
