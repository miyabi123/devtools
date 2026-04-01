import type { Metadata } from 'next'
import { DM_Mono, DM_Sans } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://devtools.run'),
  title: {
    default: 'DevTools — Free Online Developer Tools',
    template: '%s | DevTools',
  },
  description:
    'Free online tools for developers and IT professionals. JWT decoder, JSON formatter, Base64, regex tester, CIDR calculator, Thai date converter, and 50+ more. 100% client-side.',
  keywords: ['developer tools', 'online tools', 'jwt decoder', 'json formatter', 'base64', 'regex tester'],
  authors: [{ name: 'DevTools' }],
  creator: 'DevTools',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://devtools.run',
    siteName: 'DevTools',
    title: 'DevTools — Free Online Developer Tools',
    description: 'JWT decoder, JSON formatter, Base64, regex tester, CIDR calculator and 50+ more free tools.',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevTools — Free Online Developer Tools',
    description: 'JWT decoder, JSON formatter, Base64 and 50+ free tools. 100% client-side.',
    images: ['/og-default.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`}>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-F8CDHZEK72"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-F8CDHZEK72');
        `}} />
      </head>
      <body className="bg-[#f8f7f4] text-[#1a1917] font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
