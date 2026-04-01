import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for FreeUtil — how we handle your data, cookies, and advertising.',
  robots: { index: true, follow: true },
}

const LAST_UPDATED = 'April 1, 2026'

export default function PrivacyPage() {
  return (
    <div style={{ fontFamily: 'var(--font-sans)', background: '#f8f7f4', minHeight: '100vh' }}>

      {/* Nav */}
      <nav style={{ background: '#ffffff', borderBottom: '0.5px solid #c8c6c0', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 500, color: '#1a1917', letterSpacing: '-0.02em', textDecoration: 'none' }}>
          free<span style={{ opacity: 0.4 }}>util</span>
        </Link>
        <Link href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960', textDecoration: 'none' }}>
          ← back to tools
        </Link>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e', letterSpacing: '0.08em', marginBottom: 12 }}>
          LEGAL
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 300, letterSpacing: '-0.02em', color: '#1a1917', marginBottom: 8 }}>
          Privacy Policy
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#a8a69e', marginBottom: 40 }}>
          Last updated: {LAST_UPDATED}
        </p>

        <Section title="1. Overview">
          <p>FreeUtil ("we", "us", or "our") operates the website freeutil.app (the "Service"). This Privacy Policy explains how we collect, use, and protect information when you use our Service.</p>
          <p>Our tools are designed to process data entirely within your browser. We do not collect, store, or transmit the content you enter into our tools (such as JWT tokens, JSON data, text, or files) to any server.</p>
        </Section>

        <Section title="2. Information we collect">
          <h3 style={h3Style}>2.1 Usage data (Google Analytics)</h3>
          <p>We use Google Analytics to understand how visitors use our Service. Google Analytics collects information such as:</p>
          <ul style={ulStyle}>
            <li>Pages visited and time spent on each page</li>
            <li>Browser type, operating system, and device type</li>
            <li>Approximate geographic location (country/city level)</li>
            <li>Referring website or search terms</li>
          </ul>
          <p>This data is aggregated and anonymized. We cannot identify you personally from this data. Google Analytics data is processed by Google LLC. For more information, see <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={linkStyle}>Google's Privacy Policy</a>.</p>

          <h3 style={h3Style}>2.2 Advertising data (Google AdSense)</h3>
          <p>We use Google AdSense to display advertisements on our Service. Google AdSense may use cookies and similar tracking technologies to serve ads based on your prior visits to our website and other websites on the internet. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our sites.</p>
          <p>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={linkStyle}>Google Ads Settings</a> or <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" style={linkStyle}>aboutads.info</a>.</p>

          <h3 style={h3Style}>2.3 Tool input data</h3>
          <p>All data you enter into FreeUtil tools (JWT tokens, JSON, text, files, IP addresses, etc.) is processed entirely within your browser using JavaScript. This data is never sent to our servers or any third party. We have no access to and do not store any content you process using our tools.</p>
        </Section>

        <Section title="3. Cookies">
          <p>We use the following types of cookies:</p>
          <ul style={ulStyle}>
            <li><strong>Analytics cookies</strong> — set by Google Analytics to measure site usage (e.g. _ga, _gid)</li>
            <li><strong>Advertising cookies</strong> — set by Google AdSense to serve relevant advertisements</li>
          </ul>
          <p>We do not set any first-party cookies ourselves. You can control cookies through your browser settings. Note that disabling cookies may affect the functionality of some features.</p>
        </Section>

        <Section title="4. Third-party services">
          <p>Our Service uses the following third-party services, each with their own privacy policies:</p>
          <ul style={ulStyle}>
            <li><strong>Google Analytics</strong> — website analytics. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={linkStyle}>Privacy Policy</a></li>
            <li><strong>Google AdSense</strong> — advertising. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={linkStyle}>Privacy Policy</a></li>
            <li><strong>Cloudflare</strong> — website hosting and CDN. <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" style={linkStyle}>Privacy Policy</a></li>
          </ul>
        </Section>

        <Section title="5. Data retention">
          <p>Since we do not store any tool input data, there is no user-generated content to retain or delete. Google Analytics data is retained for 26 months by default, as per Google's standard settings.</p>
        </Section>

        <Section title="6. Children's privacy">
          <p>Our Service is not directed to children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.</p>
        </Section>

        <Section title="7. Your rights">
          <p>Depending on your location, you may have the following rights regarding your personal data:</p>
          <ul style={ulStyle}>
            <li>The right to access information we hold about you</li>
            <li>The right to request deletion of your data</li>
            <li>The right to opt out of personalized advertising</li>
            <li>The right to lodge a complaint with a supervisory authority</li>
          </ul>
          <p>To exercise these rights or for any privacy-related inquiries, please contact us at the email below.</p>
        </Section>

        <Section title="8. Changes to this policy">
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top. We encourage you to review this Privacy Policy periodically.</p>
        </Section>

        <Section title="9. Contact us">
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <div style={{ background: '#ffffff', border: '0.5px solid #c8c6c0', borderRadius: 8, padding: '16px 20px', marginTop: 12 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#1a1917', margin: 0 }}>
              FreeUtil<br />
              Website: <a href="https://freeutil.app" style={linkStyle}>freeutil.app</a>
            </p>
          </div>
        </Section>

      </div>

      {/* Footer */}
      <footer style={{ borderTop: '0.5px solid #c8c6c0', background: '#ffffff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e' }}>freeutil.app</span>
        <div style={{ display: 'flex', gap: 16 }}>
          <Link href="/" style={{ fontSize: 11, color: '#a8a69e', textDecoration: 'none' }}>tools</Link>
          <Link href="/privacy" style={{ fontSize: 11, color: '#1a1917', textDecoration: 'none' }}>privacy</Link>
        </div>
      </footer>

    </div>
  )
}

const h3Style: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: '#1a1917',
  margin: '20px 0 8px',
}

const ulStyle: React.CSSProperties = {
  paddingLeft: 20,
  margin: '8px 0',
  color: '#6b6960',
  lineHeight: 1.8,
  fontSize: 14,
}

const linkStyle: React.CSSProperties = {
  color: '#3c3489',
  textDecoration: 'underline',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 16, fontWeight: 500, color: '#1a1917', marginBottom: 12, paddingBottom: 8, borderBottom: '0.5px solid #e8e6e0' }}>
        {title}
      </h2>
      <div style={{ fontSize: 14, color: '#6b6960', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {children}
      </div>
    </div>
  )
}
