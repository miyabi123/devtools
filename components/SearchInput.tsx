'use client'

export default function SearchInput() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', maxWidth: 480,
      background: '#ffffff', border: '1.5px solid #1a1917',
      borderRadius: 8, overflow: 'hidden',
    }}>
      <div style={{ padding: '0 12px', color: '#a8a69e' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="6.5" cy="6.5" r="4" /><path d="M11 11l2.5 2.5" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search tools... e.g. jwt, base64, thai date"
        style={{
          flex: 1, border: 'none', outline: 'none', background: 'transparent',
          fontSize: 14, color: '#1a1917', padding: '11px 0',
        }}
        onChange={(e) => {
          const q = e.target.value.toLowerCase()
          document.querySelectorAll<HTMLElement>('.tool-card').forEach(card => {
            card.style.display = !q || card.innerText.toLowerCase().includes(q) ? '' : 'none'
          })
        }}
      />
    </div>
  )
}