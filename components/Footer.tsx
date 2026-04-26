import Link from 'next/link'

const footerLinks = [
  { href: '/tools',   label: 'tools'   },
  { href: '/blog',    label: 'blog'    },
  { href: '/about',   label: 'about'   },
  { href: '/privacy', label: 'privacy' },
]

export default function Footer() {
  return (
    <footer style={{
      borderTop: '0.5px solid #c8c6c0',
      background: '#ffffff',
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: '#a8a69e',
      }}>
        freeutil.app · free tools, no login required
      </span>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        {footerLinks.map(({ href, label }) => (
          <Link key={href} href={href} style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: '#a8a69e',
            textDecoration: 'none',
          }}>
            {label}
          </Link>
        ))}
      </div>
    </footer>
  )
}