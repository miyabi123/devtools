'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/tools', label: 'tools' },
  { href: '/blog',  label: 'blog'  },
  { href: '/about', label: 'about' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <nav style={{
      background: '#ffffff',
      borderBottom: '0.5px solid #c8c6c0',
      padding: '0 24px',
      height: 52,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* Logo */}
      <Link href="/" style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 20,
        fontWeight: 500,
        color: '#1a1917',
        textDecoration: 'none',
        letterSpacing: '-0.02em',
      }}>
        free<span style={{ opacity: 0.35 }}>util</span>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {navLinks.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: active ? '#1a1917' : '#a8a69e',
              textDecoration: 'none',
              padding: '5px 10px',
              borderRadius: 6,
              background: active ? '#f8f7f4' : 'transparent',
              border: active ? '0.5px solid #c8c6c0' : '0.5px solid transparent',
              transition: 'color 0.15s, background 0.15s',
            }}>
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}