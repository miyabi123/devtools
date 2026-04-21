import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About FreeUtil — Free Online Developer Tools, No Login Required',
  description: 'FreeUtil is a free collection of 33+ online tools for developers, IT professionals, and everyday users. All tools run 100% in your browser — no server, no login, no tracking. Built for speed and privacy.',
  keywords: [
    'freeutil', 'free online tools', 'developer tools online', 'free developer utilities',
    'online tools no login', 'browser tools privacy', 'free it tools', 'thai developer tools',
  ],
  alternates: { canonical: 'https://freeutil.app/about' },
  openGraph: {
    title: 'About FreeUtil — Free Online Developer Tools',
    description: 'FreeUtil is a free collection of 33+ online tools for developers and everyday users. No login, no tracking, 100% client-side.',
    url: 'https://freeutil.app/about',
  },
}

const TOOL_CATEGORIES = [
  {
    name: 'Developer & IT Tools',
    color: '#eeedfe',
    textColor: '#3c3489',
    count: 17,
    tools: ['JWT Decoder', 'JSON Formatter', 'Base64 Encode/Decode', 'URL Encode/Decode', 'Hash Generator', 'Regex Tester', 'CIDR Calculator', 'Cron Builder', 'Unix Timestamp', 'UUID Generator', 'Password Generator', 'JSON ↔ CSV', 'JSON ↔ YAML', 'Color Converter', 'Word Counter', 'Markdown Preview', 'Diff Checker'],
    desc: 'Essential utilities for software developers, system administrators, and IT professionals. From JWT token inspection to subnet calculation, these tools handle daily development tasks instantly in your browser.',
  },
  {
    name: 'Thai Language Tools',
    color: '#e1f5ee',
    textColor: '#085041',
    count: 4,
    tools: ['Thai Date Converter (พ.ศ. ↔ ค.ศ.)', 'Thai Number to Text', 'Thai Baht to Words', 'Thai Tax Calculator 2568'],
    desc: 'Specialized tools for Thai users and developers. Convert Buddhist Era dates, write numbers in Thai words for cheque writing, and calculate personal income tax with 2025 deductions — all in Thai.',
  },
  {
    name: 'File & Image Tools',
    color: '#faeeda',
    textColor: '#633806',
    count: 5,
    tools: ['PDF ↔ Base64', 'QR Code Generator', 'Image Resize', 'Favicon Generator', 'Image Compressor'],
    desc: 'Handle files, images, and media directly in your browser. Compress images without quality loss, generate QR codes, create favicons, and convert PDFs to Base64 — all without uploading to any server.',
  },
  {
    name: 'OpenSSL & Certificate Tools',
    color: '#eef6ff',
    textColor: '#1D4ED8',
    count: 7,
    tools: ['CSR Generator', 'Self-signed Cert Generator', 'PEM ↔ DER Converter', 'Certificate Decoder', 'OpenSSL Command Builder', 'RSA Key Generator', 'Lorem Ipsum Generator'],
    desc: 'Professional SSL/TLS certificate tools for developers and sysadmins. Generate CSRs, create self-signed certificates for development, decode certificate details, and build OpenSSL commands visually — no OpenSSL installation required for generation tasks.',
  },
]

const PRINCIPLES = [
  {
    icon: '🔒',
    title: '100% Client-side Processing',
    desc: 'Every tool on FreeUtil runs entirely in your browser using JavaScript and the Web Crypto API. Your data — whether it\'s a JWT token, a private key, an image, or a tax calculation — is never sent to any server. It stays on your device.',
  },
  {
    icon: '🚫',
    title: 'No Login. No Account. No Tracking.',
    desc: 'We believe useful tools should be accessible without friction. FreeUtil requires no registration, no email address, and no account creation. We do not track your tool usage, store your inputs, or sell any data to third parties.',
  },
  {
    icon: '⚡',
    title: 'Fast and Always Available',
    desc: 'FreeUtil is built with Next.js and deployed on Cloudflare\'s global CDN. Pages load in under a second from anywhere in the world. Because all processing is client-side, tools work even with a slow internet connection after the initial page load.',
  },
  {
    icon: '🌐',
    title: 'Built for Developers and Everyday Users',
    desc: 'While many tools target developers (JSON formatters, regex testers, hash generators), FreeUtil also includes tools for non-technical users — especially Thai users who need date converters, tax calculators, and Baht-to-words converters for everyday tasks.',
  },
  {
    icon: '🆓',
    title: 'Free Forever',
    desc: 'All tools on FreeUtil are completely free to use with no limits. The site is supported by non-intrusive display advertising. We never use paywalls, rate limits, or premium tiers. Every feature shown is accessible to every visitor.',
  },
  {
    icon: '🇹🇭',
    title: 'Made in Thailand',
    desc: 'FreeUtil is built and maintained by an independent Thai developer with a passion for making useful tools accessible to everyone. We are particularly focused on building tools that serve Thai developers and businesses — an underserved niche in the global tools market.',
  },
]

const USECASES = [
  { role: 'Software Developers', uses: 'Decode JWT tokens during API debugging, format and validate JSON responses, test regular expressions, generate UUIDs for database records, convert between JSON and YAML for Kubernetes configs.' },
  { role: 'System Administrators', uses: 'Calculate CIDR subnets for network planning, build cron expressions for scheduled tasks, generate CSR files for SSL certificate requests, decode existing certificates to check expiry dates.' },
  { role: 'Thai Accountants & HR', uses: 'Convert Buddhist Era (พ.ศ.) dates to Christian Era (ค.ศ.) for international documents, calculate personal income tax with current year deductions, convert amounts to Thai words for cheque writing.' },
  { role: 'Security Professionals', uses: 'Generate RSA key pairs for encryption, create self-signed certificates for internal services, check SSL certificate chain and TLS version support, verify certificate fingerprints.' },
  { role: 'Web Designers', uses: 'Convert colors between HEX, RGB, and HSL formats, generate Lorem Ipsum placeholder text in English and Thai, compress images before uploading to websites, generate favicons from logo images.' },
  { role: 'Students & Learners', uses: 'Learn how JWT tokens are structured, understand Base64 encoding, practice with regular expressions, see how Unix timestamps work — all with instant visual feedback without any setup.' },
]

export default function AboutPage() {
  return (
    <main style={{ maxWidth: 860, margin: '0 auto', padding: '40px 20px 80px', fontFamily: 'var(--font-sans)' }}>

      {/* Hero */}
      <section style={{ marginBottom: 56 }}>
        <div style={{ display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px', borderRadius: 99, background: '#eeedfe', color: '#3c3489', marginBottom: 16, letterSpacing: '0.06em' }}>
          ABOUT FREEUTIL
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: '#1a1917', lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}>
          Free online tools that respect your privacy
        </h1>
        <p style={{ fontSize: 16, color: '#6b6960', lineHeight: 1.8, maxWidth: 640, marginBottom: 24 }}>
          FreeUtil is a growing collection of free online utilities for developers, IT professionals, and everyday users. Every tool runs entirely in your browser — no data is ever sent to a server, no login required, completely free.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/" style={{
            fontFamily: 'var(--font-mono)', fontSize: 12, padding: '10px 20px',
            background: '#1a1917', color: '#f8f7f4', borderRadius: 8,
            textDecoration: 'none', display: 'inline-block',
          }}>Browse All Tools →</Link>
          <Link href="/privacy" style={{
            fontFamily: 'var(--font-mono)', fontSize: 12, padding: '10px 20px',
            background: '#ffffff', color: '#1a1917',
            border: '0.5px solid #c8c6c0', borderRadius: 8,
            textDecoration: 'none', display: 'inline-block',
          }}>Privacy Policy</Link>
        </div>
      </section>

      {/* Stats */}
      <section style={{ marginBottom: 56 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          {[
            { num: '33+', label: 'Free Tools' },
            { num: '100%', label: 'Client-side' },
            { num: '0', label: 'Login Required' },
            { num: '0', label: 'Data Collected' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: '#ffffff', border: '1px solid #c8c6c0',
              borderRadius: 10, padding: '20px 16px', textAlign: 'center',
            }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: '#1a1917', margin: '0 0 4px' }}>{stat.num}</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', margin: 0, letterSpacing: '0.06em' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What is FreeUtil */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#1a1917', marginBottom: 16 }}>What is FreeUtil?</h2>
        <div style={{ fontSize: 15, color: '#4a4845', lineHeight: 1.85 }}>
          <p style={{ marginBottom: 16 }}>
            FreeUtil (freeutil.app) is a free, browser-based toolkit designed to solve the everyday problems that developers, sysadmins, designers, and business users face. Instead of searching Google for an online tool, downloading software, or writing a script from scratch, FreeUtil provides instant access to 33+ utilities from a single, fast-loading website.
          </p>
          <p style={{ marginBottom: 16 }}>
            The project was started by an independent developer in Thailand who was frustrated by existing online tool sites — many require accounts, show intrusive ads, log your input data, or are cluttered with low-quality tools. FreeUtil was built with a clear philosophy: every tool should be fast, privacy-respecting, and genuinely useful.
          </p>
          <p style={{ marginBottom: 0 }}>
            Unlike many SaaS tools that process your data on their servers, FreeUtil uses modern browser APIs (Web Crypto API, Canvas API, File API) to run all computations locally. This means a JWT decoder that never logs your tokens, a hash generator that never sees your plaintext, and an image compressor that never uploads your photos.
          </p>
        </div>
      </section>

      {/* Tool Categories */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#1a1917', marginBottom: 8 }}>Tool Categories</h2>
        <p style={{ fontSize: 14, color: '#6b6960', marginBottom: 24, lineHeight: 1.7 }}>
          FreeUtil organizes its tools into focused categories. New tools are added regularly based on user feedback and common developer needs.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {TOOL_CATEGORIES.map(cat => (
            <div key={cat.name} style={{
              background: '#ffffff', border: '1px solid #c8c6c0',
              borderRadius: 10, overflow: 'hidden',
            }}>
              <div style={{ padding: '14px 18px', borderBottom: '0.5px solid #e8e6e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500,
                    padding: '3px 10px', borderRadius: 99,
                    background: cat.color, color: cat.textColor,
                  }}>{cat.name}</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e' }}>{cat.count} tools</span>
              </div>
              <div style={{ padding: '14px 18px' }}>
                <p style={{ fontSize: 13, color: '#4a4845', lineHeight: 1.7, marginBottom: 10 }}>{cat.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {cat.tools.map(tool => (
                    <span key={tool} style={{
                      fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 8px',
                      background: cat.color, color: cat.textColor,
                      borderRadius: 4,
                    }}>{tool}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Principles */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#1a1917', marginBottom: 8 }}>Our Principles</h2>
        <p style={{ fontSize: 14, color: '#6b6960', marginBottom: 24, lineHeight: 1.7 }}>
          FreeUtil is built around a set of principles that guide every tool and design decision.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          {PRINCIPLES.map(p => (
            <div key={p.title} style={{
              background: '#ffffff', border: '1px solid #c8c6c0',
              borderRadius: 10, padding: '18px',
            }}>
              <div style={{ fontSize: 22, marginBottom: 10 }}>{p.icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1a1917', marginBottom: 8 }}>{p.title}</h3>
              <p style={{ fontSize: 12, color: '#6b6960', lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who uses FreeUtil */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#1a1917', marginBottom: 8 }}>Who Uses FreeUtil?</h2>
        <p style={{ fontSize: 14, color: '#6b6960', marginBottom: 24, lineHeight: 1.7 }}>
          FreeUtil serves a diverse audience — from senior software engineers to students learning to code, and from Thai accountants to international security professionals.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: '#c8c6c0', border: '1px solid #c8c6c0', borderRadius: 10, overflow: 'hidden' }}>
          {USECASES.map((uc, i) => (
            <div key={uc.role} style={{ background: '#ffffff', padding: '16px 18px', display: 'grid', gridTemplateColumns: '180px 1fr', gap: 16, alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, color: '#1a1917', paddingTop: 2 }}>{uc.role}</span>
              <span style={{ fontSize: 13, color: '#4a4845', lineHeight: 1.7 }}>{uc.uses}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy commitment */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#1a1917', marginBottom: 16 }}>Privacy Commitment</h2>
        <div style={{ background: '#e1f5ee', border: '1px solid #1D9E75', borderRadius: 10, padding: '24px' }}>
          <p style={{ fontSize: 15, color: '#085041', lineHeight: 1.85, marginBottom: 16 }}>
            FreeUtil is designed with privacy as a core feature, not an afterthought. Here is exactly what we do and do not do with your data:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              'We do NOT send your tool inputs to any server — all processing happens in your browser',
              'We do NOT require an account, email address, or any personal information',
              'We do NOT store your JWT tokens, private keys, passwords, images, or any other tool inputs',
              'We do NOT sell data to advertisers or third parties',
              'We DO use Google Analytics to understand aggregate traffic (pages visited, not content)',
              'We DO display non-intrusive Google AdSense advertisements to fund the project',
            ].map(item => (
              <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: item.startsWith('We DO') ? '#633806' : '#085041', fontWeight: 600, fontSize: 14, flexShrink: 0, marginTop: 1 }}>
                  {item.startsWith('We DO') ? '●' : '✓'}
                </span>
                <span style={{ fontSize: 13, color: '#085041', lineHeight: 1.7 }}>{item}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#085041', marginTop: 16, marginBottom: 0, opacity: 0.8 }}>
            For the full privacy policy, see <Link href="/privacy" style={{ color: '#085041' }}>freeutil.app/privacy</Link>
          </p>
        </div>
      </section>

      {/* Technology */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#1a1917', marginBottom: 16 }}>Technology Stack</h2>
        <p style={{ fontSize: 14, color: '#6b6960', lineHeight: 1.7, marginBottom: 20 }}>
          FreeUtil is built with modern, open-source technology chosen for performance, reliability, and developer experience.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
          {[
            { tech: 'Next.js 16', role: 'React framework with static export' },
            { tech: 'TypeScript', role: 'Type-safe JavaScript throughout' },
            { tech: 'Tailwind CSS', role: 'Utility-first CSS framework' },
            { tech: 'Cloudflare Pages', role: 'Global CDN hosting' },
            { tech: 'Web Crypto API', role: 'Browser-native cryptography' },
            { tech: 'Canvas API', role: 'Client-side image processing' },
          ].map(item => (
            <div key={item.tech} style={{
              background: '#f8f7f4', border: '0.5px solid #c8c6c0',
              borderRadius: 8, padding: '12px 14px',
            }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: '#1a1917', margin: '0 0 4px' }}>{item.tech}</p>
              <p style={{ fontSize: 11, color: '#6b6960', margin: 0, lineHeight: 1.5 }}>{item.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section>
        <div style={{
          background: '#1a1917', borderRadius: 12,
          padding: '32px 28px', textAlign: 'center',
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f8f7f4', marginBottom: 10 }}>
            Start using FreeUtil today
          </h2>
          <p style={{ fontSize: 14, color: '#a8a69e', marginBottom: 24, lineHeight: 1.7 }}>
            33+ tools. 100% free. No login. No tracking. Works in any browser.
          </p>
          <Link href="/" style={{
            fontFamily: 'var(--font-mono)', fontSize: 13, padding: '12px 28px',
            background: '#f8f7f4', color: '#1a1917',
            borderRadius: 8, textDecoration: 'none',
            display: 'inline-block', fontWeight: 500,
          }}>Browse All Tools →</Link>
        </div>
      </section>

    </main>
  )
}