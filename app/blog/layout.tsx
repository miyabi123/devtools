// app/blog/layout.tsx  ← สร้างไฟล์นี้ใหม่
import type { Metadata } from 'next'
import { articles } from '@/lib/articles'

export const metadata: Metadata = {
  title: 'Developer Guides & Tutorials | FreeUtil Blog',
  description: `${articles.length} in-depth articles on web development, networking, SSL/TLS, Linux, and Thai developer topics. Written for developers and IT professionals.`,
  openGraph: {
    title: 'Developer Guides & Tutorials | FreeUtil Blog',
    description: 'In-depth guides on JWT, CIDR, SSL, regex, cron jobs, and more.',
    url: 'https://freeutil.app/blog',
  },
  alternates: {
    canonical: 'https://freeutil.app/blog',
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}