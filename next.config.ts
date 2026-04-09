import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare handles compression (brotli/gzip) — disable Next.js duplicate compression
  compress: false,

  // Don't expose x-powered-by: Next.js header
  poweredByHeader: false,

  reactStrictMode: true,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Allow browser DNS prefetch for faster external resource loading
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          // Prevent MIME type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Prevent clickjacking
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Control referrer info sent to external sites
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Disable browser features the site doesn't use
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
};

export default nextConfig;
