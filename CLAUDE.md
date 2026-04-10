# freeutil.app — Project Documentation for Claude

## Project Overview

**freeutil.app** is a free online utility tool site targeting developers, IT professionals, and Thai users.
Built as a passive income project with Google AdSense monetization.

- **Domain:** https://freeutil.app
- **Stack:** Next.js 16, TypeScript, Tailwind CSS, Cloudflare Pages
- **Fonts:** DM Sans (`--font-sans`), DM Mono (`--font-mono`)
- **Package manager:** pnpm
- **CI/CD:** GitHub → Cloudflare Pages (auto-deploy on push)

---

## Repository Structure

```
devtools/
├── app/
│   ├── layout.tsx          # Root layout — GA + AdSense scripts via next/script
│   ├── page.tsx            # Homepage — search + tool grid
│   ├── privacy/page.tsx    # Privacy policy page
│   └── tools/
│       └── [slug]/
│           └── page.tsx    # Tool page — generateMetadata + JSON-LD + toolComponents map
├── components/
│   ├── AdSense.tsx         # AdLeaderboard, AdSidebar, AdInArticle components
│   ├── HomeAdSlot.tsx      # Client wrapper for AdSense on homepage
│   ├── SearchInput.tsx     # Search input component
│   ├── ToolLayout.tsx      # Shared layout for all tool pages
│   └── tools/              # Individual tool components (one file per tool)
├── lib/
│   └── tools.ts            # Central tool registry — all tool metadata
├── public/
│   ├── ads.txt             # AdSense verification
│   ├── icon-192.png
│   └── icon-512.png
├── app/
│   ├── favicon.ico
│   ├── apple-icon.png
│   └── icon.svg
└── next-sitemap.config.js  # Sitemap + robots.txt generation
```

---

## Design System

### Colors
```
Background:  #f8f7f4  (warm off-white)
Text:        #1a1917  (near-black)
Border:      #c8c6c0  (warm gray)
Muted text:  #6b6960  #a8a69e
White:       #ffffff

Categories:
  Dev / IT:       bg #eeedfe  text #3c3489  (purple)
  Thai Tools:     bg #e1f5ee  text #085041  (teal)
  PDF & Image:    bg #faeeda  text #633806  (amber)
  Finance:        bg #faece7  text #712b13  (coral)
  Linux & DevOps: bg #f0f0f0  text #444441  (gray)
  OpenSSL & Cert: bg #eef6ff  text #1D4ED8  (blue)
  Network:        bg #eff6ff  text #1E40AF  (blue)
  Text & Content: bg #f0f0f0  text #444441  (gray)

Status colors:
  Success:  bg #e1f5ee  text #085041
  Error:    bg #fcebeb  text #a32d2d
  Warning:  bg #faeeda  text #633806
  Info:     bg #eeedfe  text #3c3489
```

### Typography
```tsx
// Mono — used for all technical content, labels, tags, code
style={{ fontFamily: 'var(--font-mono)' }}

// Sans — used for body text, descriptions
style={{ fontFamily: 'var(--font-sans)' }}
```

### Common patterns
```tsx
// Section header label
<p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em' }}>LABEL</p>

// Input box
<div style={{ background: '#ffffff', border: '1.5px solid #1a1917', borderRadius: 10, overflow: 'hidden' }}>

// Card / result box
<div style={{ background: '#ffffff', border: '1px solid #c8c6c0', borderRadius: 8, overflow: 'hidden' }}>

// Info box
<div style={{ background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 8, padding: '12px 14px' }}>

// Error box
<div style={{ background: '#fcebeb', border: '0.5px solid #f09595', borderRadius: 6, padding: '10px 14px' }}>

// Mode toggle (pill tabs)
<div style={{ display: 'flex', background: '#f8f7f4', border: '0.5px solid #c8c6c0', borderRadius: 6, overflow: 'hidden' }}>
  <button style={{ background: active ? '#1a1917' : 'transparent', color: active ? '#f8f7f4' : '#6b6960' }}>

// Copy button
<button style={{ fontFamily: 'var(--font-mono)', fontSize: 9, padding: '1px 7px',
  background: copied ? '#e1f5ee' : 'transparent', color: copied ? '#085041' : '#a8a69e',
  border: `0.5px solid ${copied ? '#1D9E75' : '#e8e6e0'}`, borderRadius: 3 }}>
  {copied ? '✓' : 'copy'}
</button>
```

---

## Adding a New Tool — Checklist

### Step 1 — Register in `lib/tools.ts`

```typescript
{
  slug: 'tool-slug',              // URL: /tools/tool-slug
  name: 'Tool Name',
  shortDesc: 'One line description',
  longDesc: 'SEO-optimized long description 2-4 sentences with keywords...',
  category: 'dev',               // dev | thai | file | finance
  keywords: ['keyword 1', 'keyword 2', ...],
  howTo: [
    'Step 1',
    'Step 2',
    'Step 3',
  ],
  faq: [
    { q: 'Question?', a: 'Answer.' },
  ],
  related: ['other-slug-1', 'other-slug-2'],
  isNew: true,        // optional — shows "new" badge
  isPopular: true,    // optional — shows "popular" badge
}
```

### Step 2 — Create component `components/tools/ToolName.tsx`

```tsx
'use client'

import { useState } from 'react'

export default function ToolName() {
  return (
    <div className="space-y-4">
      {/* tool UI here */}
    </div>
  )
}
```

### Step 3 — Register in `app/tools/[slug]/page.tsx`

```tsx
const toolComponents: Record<string, React.ComponentType> = {
  // ... existing tools
  'tool-slug': dynamic(() => import('@/components/tools/ToolName')),
}
```

### Step 4 — Push and rebuild sitemap

```powershell
git add .
git commit -m "add tool-name tool"
git push
```

Sitemap auto-generates on each Cloudflare build.
After deploy, request indexing in Google Search Console.

---

## Tool Categories

| Category | color tag | Description |
|---|---|---|
| `dev` | purple | Developer & IT tools |
| `thai` | teal | Thai-specific tools |
| `file` | amber | File & image tools |
| `finance` | coral | Finance calculators |

> Future categories to add to `ToolCategory` type and `categoryLabel`/`categoryColors`:
> `linux`, `network`, `text`, `openssl`

---

## Analytics & Monetization

### Google Analytics
- ID: `G-F8CDHZEK72`
- Loaded via `<Script strategy="afterInteractive">` in `app/layout.tsx`

### Google AdSense
- Publisher ID: `ca-pub-2562848751614063`
- Loaded via `<Script strategy="afterInteractive">` in `app/layout.tsx`
- `ads.txt` at `/public/ads.txt`

**Ad slots:**
| Component | Slot ID | Format | Placement |
|---|---|---|---|
| `<AdLeaderboard />` | 4258757514 | auto horizontal | Under tool header |
| `<AdSidebar />` | 7704215914 | auto square | Right sidebar |
| `<AdInArticle />` | 9484201440 | fluid in-article | Between how-to and FAQ |

**Auto ads:** Enable in AdSense dashboard → Ads → By site → freeutil.app → Auto ads ON

---

## SEO Structure

- Per-tool metadata via `generateMetadata()` in `app/tools/[slug]/page.tsx`
- JSON-LD structured data: WebApplication, BreadcrumbList, HowTo, FAQPage
- Canonical URLs: `https://freeutil.app/tools/{slug}`
- Sitemap: auto-generated via `next-sitemap` postbuild
- All tool `longDesc` must be SEO-optimized with keywords

---

## Tools Completed ✅ (20 tools)

| Slug | Component | Category |
|---|---|---|
| jwt-decoder | JwtDecoder.tsx | dev |
| json-formatter | JsonFormatter.tsx | dev |
| base64-encode-decode | Base64Tool.tsx | dev |
| url-encode-decode | UrlEncodeDecode.tsx | dev |
| hash-generator | HashGenerator.tsx | dev |
| regex-tester | RegexTester.tsx | dev |
| cidr-calculator | CidrCalculator.tsx | dev |
| cron-builder | CronBuilder.tsx | dev |
| unix-timestamp | UnixTimestamp.tsx | dev |
| uuid-generator | UuidGenerator.tsx | dev |
| password-generator | PasswordGenerator.tsx | dev |
| json-to-csv | JsonToCsv.tsx | dev |
| json-to-yaml | JsonToYaml.tsx | dev |
| thai-date-converter | ThaiDateConverter.tsx | thai |
| pdf-base64 | PdfBase64.tsx | file |
| qr-code-generator | QrCodeGenerator.tsx | file |
| image-resize | ImageResize.tsx | file |
| favicon-generator | FaviconGenerator.tsx | file |
| image-compressor | ImageCompressor.tsx | file |

---

## Tools Roadmap

### Phase 1 — Client-side only (no server needed)

#### Dev / IT
- [ ] Color Converter — HEX ↔ RGB ↔ HSL
- [ ] Diff Checker — compare two text blocks
- [ ] Markdown Preview — render markdown live
- [ ] Word Counter — count words, chars, lines

#### Thai Tools
- [ ] Thai ID Validator — ตรวจเลขบัตรประชาชน 13 หลัก
- [ ] Thai VAT Calculator — คำนวณ VAT 7%
- [ ] Thai Tax Calculator — ภาษีเงินได้บุคคลธรรมดา
- [ ] Thai Number → Text — แปลงตัวเลขเป็นคำอ่าน
- [ ] Thai Baht to Words — จำนวนเงินเป็นตัวอักษร (สำหรับเขียนเช็ค)
- [ ] Thai Phone Formatter — จัดรูปแบบเบอร์โทร

#### PDF & Image
- [ ] Image → WebP — convert images to WebP
- [ ] QR Code Reader — decode QR from image
- [ ] Image → Base64 — convert image to Base64
- [ ] SVG Optimizer — minify SVG files

#### Linux & DevOps
- [ ] Chmod Calculator — Linux file permissions (rwx ↔ octal)
- [ ] SSH Config Generator — generate ~/.ssh/config
- [ ] Nginx Config Generator — server block, reverse proxy, SSL
- [ ] iptables Rule Builder — build iptables rules visually
- [ ] Systemd Unit Generator — generate .service files
- [ ] Tar Command Builder — build tar commands visually
- [ ] Find Command Builder — build find commands visually

#### Finance
- [ ] Loan Calculator — monthly payment & amortization table
- [ ] Compound Interest — investment growth calculator
- [ ] ROI Calculator — return on investment
- [ ] Percentage Calculator — % of, % change, ratio
- [ ] Insurance Premium Calculator — ประมาณเบี้ยประกัน
- [ ] Break-even Calculator — business break-even point

#### Text & Content
- [ ] Lorem Ipsum Generator — placeholder text
- [ ] Text Case Converter — UPPER, lower, camelCase, snake_case, PascalCase
- [ ] String Escape/Unescape — escape special characters

#### OpenSSL & Certificate
- [ ] CSR Generator — Certificate Signing Request (Web Crypto API)
- [ ] Self-signed Cert Generator — for dev/test environments
- [ ] Certificate Decoder — decode & inspect PEM/CRT files
- [ ] PEM ↔ DER Converter — convert certificate formats
- [ ] RSA Key Generator — generate RSA key pairs (Web Crypto API)
- [ ] OpenSSL Command Builder — build openssl commands visually

---

### Phase 2 — Cloudflare Workers required

> Free tier: 100,000 requests/day. Paid: $5/mo for 10M requests/month.

- [ ] DNS Record Lookup — DoH API via 1.1.1.1
- [ ] My IP Address — read CF-Connecting-IP header
- [ ] IP Geolocation — read CF-IPCountry, CF-IPCity headers
- [ ] SSL Certificate Checker — fetch domain cert info
- [ ] Bandwidth Calculator — client-side calculation (no Workers needed)
- [ ] IPv6 Calculator — client-side calculation (no Workers needed)
- [ ] Port Reference Table — static data (no Workers needed)
- [ ] Currency Converter — exchange rate API (requires external API key)
- [ ] SSL Expiry Monitor — requires DB for email storage

---

### Phase 3 — Requires VPS (not possible on Cloudflare)

> These tools require ICMP or raw socket access which Cloudflare Workers don't support.

- [ ] Ping — ICMP not available in CF Workers
- [ ] Traceroute — requires raw socket
- [ ] Port Scanner — CF blocks outbound TCP scanning + ToS risk

---

## Homepage Redesign Plan (Pending)

When tools reach 30+, redesign homepage with:
- Large search bar (centered)
- Category pills filter (All, Dev, Linux, Network, PDF, Thai, Finance, Text, OpenSSL)
- Popular section — dynamic via Cloudflare KV (track tool usage, update daily)
- Tool grid filtered by selected category

**Cloudflare KV structure for popular tracking:**
```
tool:jwt-decoder     → 1842
tool:json-formatter  → 1203
...
```

---

## Known Issues & Notes

- **Error 1101 (Worker exceeded resource limits):** Add `export const runtime = 'nodejs'` to `app/tools/[slug]/page.tsx` if encountered on Cloudflare Pages free tier
- **AdSense ads not showing:** Normal for new sites — requires real organic traffic. Ads will appear once Google has enough data to match advertisers
- **next-sitemap with TypeScript:** `next-sitemap.config.js` must use plain JavaScript syntax (no TypeScript types)
- **`<Script>` component:** Always use `strategy="afterInteractive"` for GA and AdSense — never put raw `<script>` tags in `<head>`
- **crossOrigin:** Must be `crossOrigin` (capital O) in JSX, not `crossorigin`
- **Tool 404 on dev:** Run `Remove-Item -Recurse -Force .next && pnpm dev` to clear cache when adding new tools

---

## Git Workflow

```powershell
# Start of day
git pull

# Development
pnpm dev

# After adding tools
git add .
git commit -m "add [tool-name] tool"
git push

# Cloudflare auto-deploys — sitemap regenerates automatically
```

---

## Environment

- Node.js: 22.x
- Next.js: 16.2.1
- pnpm: 10.x
- TypeScript: 5.x
- Tailwind: 4.x
- Cloudflare Pages (free tier)
