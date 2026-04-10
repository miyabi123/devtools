# freeutil.app — Project Documentation for Claude

## Project Overview

**freeutil.app** is a free online utility tool site targeting developers, IT professionals, and Thai users.
Built as a passive income project with Google AdSense monetization.

- **Domain:** https://freeutil.app
- **Stack:** Next.js 16, TypeScript, Tailwind CSS, Cloudflare Pages
- **Fonts:** DM Sans (`--font-sans`), DM Mono (`--font-mono`)
- **Package manager:** pnpm
- **CI/CD:** GitHub → Cloudflare Pages (auto-deploy on push)
- **Output mode:** `output: 'export'` (Static HTML — no server/Workers)

---

## Architecture — Static Export (Important!)

Since April 2026, the project uses `output: 'export'` in `next.config.ts`.

```ts
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
}
```

### What this means:
- Next.js generates **pure static HTML/CSS/JS** files
- Cloudflare Pages serves files directly from CDN — **no Workers involved**
- Solved Error 1101 (Worker exceeded resource limits)
- Faster page load, better Core Web Vitals, better SEO
- **No API routes** (`/api/*`) — cannot use server-side code

### Rules when adding new files:
- Any dynamic route file (e.g. `opengraph-image.tsx`) **must have** `generateStaticParams()`
- Any special route file must have `export const dynamic = 'force-static'`
- **Never** use `export const runtime = 'nodejs'` — incompatible with static export

### Files that needed fixing for static export:
- `app/opengraph-image.tsx` — added `export const dynamic = 'force-static'`
- `app/manifest.ts` — added `export const dynamic = 'force-static'`
- `app/tools/[slug]/opengraph-image.tsx` — added both `dynamic = 'force-static'` + `generateStaticParams()`

---

## Phase 2 Architecture — Cloudflare Workers (Separate)

Since the main site is static export, **Phase 2 server-side tools cannot use Next.js API routes**.
Instead, deploy a **separate Cloudflare Worker** at `api.freeutil.app`.

### Plan:
```
freeutil.app          → Static site (Cloudflare Pages)
api.freeutil.app      → Cloudflare Worker (Phase 2 tools)
```

### Worker setup:
```js
// wrangler.toml
name = "freeutil-api"
main = "src/worker.js"
compatibility_date = "2026-01-01"

[route]
pattern = "api.freeutil.app/*"
zone_name = "freeutil.app"
```

### Phase 2 tools → Worker endpoints:
```
GET /api/dns?domain=example.com&type=A    → DNS Record Lookup (DoH 1.1.1.1)
GET /api/myip                             → My IP (CF-Connecting-IP header)
GET /api/geoip?ip=1.2.3.4                → IP Geolocation (CF-IPCountry/City)
GET /api/ssl?domain=example.com          → SSL Certificate info
GET /api/currency?from=THB&to=USD        → Currency rates (external API)
```

### Client-side fetch from Worker:
```tsx
const res = await fetch('https://api.freeutil.app/dns?domain=google.com&type=A')
const data = await res.json()
```

### CF Workers free tier: 100,000 req/day — sufficient until significant traffic

---

## Repository Structure

```
devtools/
├── app/
│   ├── layout.tsx                    # Root layout — GA + AdSense via next/script
│   ├── page.tsx                      # Homepage — search + tool grid
│   ├── manifest.ts                   # PWA manifest (force-static)
│   ├── opengraph-image.tsx           # Homepage OG image (force-static)
│   ├── privacy/page.tsx              # Privacy policy
│   ├── favicon.ico
│   ├── apple-icon.png
│   ├── icon.svg
│   └── tools/
│       └── [slug]/
│           ├── page.tsx              # Tool page — metadata + JSON-LD + toolComponents
│           └── opengraph-image.tsx   # Per-tool OG image (force-static + generateStaticParams)
├── components/
│   ├── AdSense.tsx                   # AdLeaderboard, AdSidebar, AdInArticle
│   ├── HomeAdSlot.tsx                # Client wrapper for AdSense on homepage
│   ├── SearchInput.tsx               # Search input
│   ├── ToolLayout.tsx                # Shared layout for all tool pages
│   └── tools/                       # Individual tool components (one file per tool)
├── lib/
│   └── tools.ts                     # Central tool registry
├── public/
│   ├── ads.txt                      # AdSense: google.com, pub-2562848751614063, DIRECT, f08c47fec0942fa0
│   ├── icon-192.png
│   └── icon-512.png
├── next.config.ts                   # output: 'export', trailingSlash, images unoptimized
└── next-sitemap.config.js           # Sitemap + robots.txt (runs postbuild)
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
// Mono — technical content, labels, tags, code
style={{ fontFamily: 'var(--font-mono)' }}

// Sans — body text, descriptions
style={{ fontFamily: 'var(--font-sans)' }}
```

### Common UI Patterns
```tsx
// Input box (primary)
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

// Section label
<p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e', letterSpacing: '0.06em' }}>LABEL</p>
```

---

## Adding a New Tool — Checklist

### Step 1 — Register in `lib/tools.ts`
```typescript
{
  slug: 'tool-slug',
  name: 'Tool Name',
  shortDesc: 'One line description',
  longDesc: 'SEO-optimized 2-4 sentences with keywords...',
  category: 'dev',   // dev | thai | file | finance
  keywords: ['keyword 1', 'keyword 2'],
  howTo: ['Step 1', 'Step 2', 'Step 3'],
  faq: [{ q: 'Question?', a: 'Answer.' }],
  related: ['other-slug-1', 'other-slug-2'],
  isNew: true,      // optional
  isPopular: true,  // optional
}
```

### Step 2 — Create `components/tools/ToolName.tsx`
```tsx
'use client'
import { useState } from 'react'

export default function ToolName() {
  return (
    <div className="space-y-4">
      {/* tool UI */}
    </div>
  )
}
```

### Step 3 — Register in `app/tools/[slug]/page.tsx`
```tsx
const toolComponents: Record<string, React.ComponentType> = {
  // existing tools...
  'tool-slug': dynamic(() => import('@/components/tools/ToolName')),
}
```

### Step 4 — Push
```powershell
git add .
git commit -m "add tool-name tool"
git push
```

Cloudflare auto-deploys → sitemap regenerates → request indexing in Search Console.

---

## Analytics & Monetization

### Google Analytics — ID: `G-F8CDHZEK72`
Loaded via `<Script strategy="afterInteractive">` in `app/layout.tsx`

### Google AdSense — Publisher: `ca-pub-2562848751614063`
- Loaded via `<Script strategy="afterInteractive">` in `app/layout.tsx`
- `ads.txt`: `google.com, pub-2562848751614063, DIRECT, f08c47fec0942fa0`
- Status: Authorized ✅ | Approval: Getting ready ⏳

**Ad slots:**
| Component | Slot ID | Format | Placement |
|---|---|---|---|
| `<AdLeaderboard />` | 4258757514 | auto horizontal | Under tool header |
| `<AdSidebar />` | 7704215914 | auto square | Right sidebar |
| `<AdInArticle />` | 9484201440 | fluid in-article | Between how-to and FAQ |

**AdSense behavior:** Hides automatically (max-height: 0) when no ads loaded — no empty white space.

---

## SEO Structure

- Per-tool metadata via `generateMetadata()` in `app/tools/[slug]/page.tsx`
- JSON-LD: WebApplication, BreadcrumbList, HowTo, FAQPage per tool
- Canonical: `https://freeutil.app/tools/{slug}`
- Sitemap: auto via `next-sitemap` postbuild
- OG images: auto-generated per tool via `app/tools/[slug]/opengraph-image.tsx`
- Static export = faster TTFB = better Core Web Vitals = better rank

---

## Tools Completed ✅ (23 tools)

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
| color-converter | ColorConverter.tsx | dev |
| thai-date-converter | ThaiDateConverter.tsx | thai |
| thai-number-to-text | ThaiNumberToText.tsx | thai |
| thai-baht-to-words | ThaiNumberToText.tsx (shared) | thai |
| pdf-base64 | PdfBase64.tsx | file |
| qr-code-generator | QrCodeGenerator.tsx | file |
| image-resize | ImageResize.tsx | file |
| favicon-generator | FaviconGenerator.tsx | file |
| image-compressor | ImageCompressor.tsx | file |

---

## Tools Roadmap

### Phase 1 — Client-side only

#### Dev / IT
- [ ] Diff Checker
- [ ] Markdown Preview
- [ ] Word Counter

#### Thai Tools
- [ ] Thai ID Validator
- [ ] Thai VAT Calculator
- [ ] Thai Tax Calculator
- [ ] Thai Phone Formatter

#### PDF & Image
- [ ] Image → WebP
- [ ] QR Code Reader
- [ ] Image → Base64
- [ ] SVG Optimizer

#### Linux & DevOps
- [ ] Chmod Calculator
- [ ] SSH Config Generator
- [ ] Nginx Config Generator
- [ ] iptables Rule Builder
- [ ] Systemd Unit Generator
- [ ] Tar Command Builder
- [ ] Find Command Builder

#### Finance
- [ ] Loan Calculator
- [ ] Compound Interest
- [ ] ROI Calculator
- [ ] Percentage Calculator
- [ ] Insurance Premium Calculator
- [ ] Break-even Calculator

#### Text & Content
- [ ] Lorem Ipsum Generator
- [ ] Text Case Converter
- [ ] String Escape/Unescape

#### OpenSSL & Certificate
- [ ] CSR Generator (Web Crypto API)
- [ ] Self-signed Cert Generator
- [ ] Certificate Decoder
- [ ] PEM ↔ DER Converter
- [ ] RSA Key Generator (Web Crypto API)
- [ ] OpenSSL Command Builder

---

### Phase 2 — Cloudflare Workers at `api.freeutil.app`

> ⚠️ Cannot use Next.js API routes — site is static export.
> Must deploy separate Cloudflare Worker at `api.freeutil.app`

- [ ] DNS Record Lookup — `GET /api/dns?domain=&type=`
- [ ] My IP Address — `GET /api/myip` (CF-Connecting-IP)
- [ ] IP Geolocation — `GET /api/geoip?ip=` (CF-IPCountry/City)
- [ ] SSL Certificate Checker — `GET /api/ssl?domain=`
- [ ] Currency Converter — `GET /api/currency?from=&to=` (external API)
- [ ] Bandwidth Calculator — client-side (no Worker needed)
- [ ] IPv6 Calculator — client-side (no Worker needed)
- [ ] Port Reference Table — static data (no Worker needed)
- [ ] SSL Expiry Monitor — needs DB for email (complex)

---

### Phase 3 — Requires VPS

> Not possible on Cloudflare — needs ICMP/raw socket

- [ ] Ping
- [ ] Traceroute
- [ ] Port Scanner

---

## Homepage Redesign Plan (Pending — at 30+ tools)

- Large search bar centered
- Category pills filter
- Popular section via Cloudflare KV (real-time usage tracking)
- Tool grid filtered by category

---

## Known Issues & Notes

- **Error 1101 FIXED:** Switched to `output: 'export'` in `next.config.ts` — no more Workers
- **Static export rules:** Any dynamic route needs `generateStaticParams()` + `export const dynamic = 'force-static'`
- **No API routes:** Phase 2 tools must use separate CF Worker at `api.freeutil.app`
- **AdSense:** `ads.txt` = Authorized ✅. Status still "Getting ready" — waiting for organic traffic
- **AdSense warning** `data-nscript attribute` — cosmetic only, ignore
- **next-sitemap config:** Must be plain JS (no TypeScript types)
- **Script tags:** Always `<Script strategy="afterInteractive">` — never raw `<script>` in `<head>`
- **crossOrigin:** Capital O in JSX (`crossOrigin` not `crossorigin`)
- **Cache issues:** `Remove-Item -Recurse -Force .next && pnpm dev` when tools show 404

---

## Git Workflow

```powershell
# Start of day
git pull && pnpm dev

# After changes
git add .
git commit -m "add [tool-name] tool"
git push
# Cloudflare auto-deploys in ~2-3 min
```

---

## Environment

- Node.js: 22.x
- Next.js: 16.2.1
- pnpm: 10.x
- TypeScript: 5.x
- Tailwind: 4.x
- Cloudflare Pages (free tier) — static export, no Workers
