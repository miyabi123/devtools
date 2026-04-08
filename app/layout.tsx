import type { Metadata } from 'next'
import { DM_Mono, DM_Sans } from 'next/font/google'
import Script from 'next/script'
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
  metadataBase: new URL('https://freeutil.app'),
  title: {
    default: 'FreeUtil — Free Online Tools for Everyone',
    template: '%s | FreeUtil',
  },
  description:
    'Free online utility tools for developers, IT professionals, and everyday users. JWT decoder, JSON formatter, Base64, regex tester, CIDR calculator, Thai date converter and 50+ more. 100% client-side, no login required.',
  keywords: [
    'free online tools', 'developer tools', 'utility tools',
    'jwt decoder', 'json formatter', 'base64 encoder', 'regex tester',
    'cidr calculator', 'subnet calculator', 'thai date converter',
    'hash generator', 'url encoder', 'cron builder', 'pdf base64',
  ],
  authors: [{ name: 'FreeUtil', url: 'https://freeutil.app' }],
  creator: 'FreeUtil',
  publisher: 'FreeUtil',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'th_TH',
    url: 'https://freeutil.app',
    siteName: 'FreeUtil',
    title: 'FreeUtil — Free Online Tools for Everyone',
    description: 'JWT decoder, JSON formatter, Base64, regex tester, CIDR calculator and 50+ free tools. No login required.',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'FreeUtil — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FreeUtil — Free Online Tools for Everyone',
    description: 'JWT decoder, JSON formatter, Base64 and 50+ free tools. 100% client-side.',
    images: ['/og-default.png'],
  },
  alternates: {
    canonical: 'https://freeutil.app',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`}>
      <body className="bg-[#f8f7f4] text-[#1a1917] font-sans antialiased">
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-F8CDHZEK72"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-F8CDHZEK72');
          `}
        </Script>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2562848751614063"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  )
}