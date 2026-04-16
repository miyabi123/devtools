export const dynamic = 'force-static'
import type { MetadataRoute } from 'next'
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FreeUtil — Free Online Tools',
    short_name: 'FreeUtil',
    description: 'Free online tools for developers and everyone. JWT, JSON, Base64, Regex, QR Code and 50+ more. 100% client-side.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f7f4',
    theme_color: '#1a1917',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
