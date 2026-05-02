# freeutil.app — Project Documentation for Claude

## Project Overview

**freeutil.app** is a free online utility tool site targeting developers, IT professionals, and Thai users.
Built as a passive income project with Google AdSense monetization.

- **Domain:** https://freeutil.app
- **Stack:** Next.js 16, TypeScript, Tailwind CSS, Cloudflare Pages
- **Fonts:** DM Sans (`--font-sans`), DM Mono (`--font-mono`)
- **Package manager:** pnpm
- **CI/CD:** GitHub (miyabi123/devtools) → Cloudflare Pages (auto-deploy on push)
- **Output mode:** `output: 'export'` (Static HTML — no server/Workers)
- **Hosting:** Cloudflare Pages (migrated from Workers April 2026)
- **Branches:** `main` (production) | `nonprod` (staging) | `worker` (old Worker backup)

---

## Architecture — Static Export (Important!)

```ts
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
}
```

### Rules when adding new files:
- Any dynamic route file **must have** `generateStaticParams()`
- Any special route file must have `export const dynamic = 'force-static'`
- **Never** use `export const runtime = 'nodejs'` — incompatible with static export
- **No API routes** (`/api/*`) — cannot use server-side code

---

## Phase 2 Architecture — Cloudflare Workers (Separate)

```
freeutil.app          → Static site (Cloudflare Pages)
api.freeutil.app      → Cloudflare Worker (Phase 2 tools)
```

### Phase 2 tools → Worker endpoints:
```
GET /api/dns?domain=example.com&type=A    → DNS Record Lookup
GET /api/myip                             → My IP
GET /api/geoip?ip=1.2.3.4                → IP Geolocation
GET /api/ssl?domain=example.com          → SSL Certificate info
GET /api/currency?from=THB&to=USD        → Currency rates
```

---

## Repository Structure

```
devtools/
├── app/
│   ├── layout.tsx                    # Root layout — Header + Footer + GA + AdSense
│   ├── page.tsx                      # Homepage — Hero + Popular Tools + Categories + Latest Blog
│   ├── manifest.ts                   # PWA manifest (force-static)
│   ├── about/page.tsx                # About page (SEO + AdSense optimized)
│   ├── blog/
│   │   ├── layout.tsx                # Blog layout — exports metadata for SEO (server component)
│   │   ├── page.tsx                  # Blog index — 'use client', category filter + article grid
│   │   └── [slug]/page.tsx           # Article page + SEO + JSON-LD
│   ├── privacy/page.tsx              # Privacy policy
│   └── tools/
│       ├── page.tsx                  # All tools page — grid by category
│       └── [slug]/
│           ├── page.tsx              # Tool page — metadata + JSON-LD + toolComponents
│           └── opengraph-image.tsx   # Per-tool OG image (force-static + generateStaticParams)
├── components/
│   ├── Header.tsx                    # Shared nav — logo + tools/blog/about links + active state
│   ├── Footer.tsx                    # Shared footer — nav links + freeutil.app tagline
│   ├── AdSense.tsx                   # AdLeaderboard, AdSidebar, AdInArticle
│   ├── HomeAdSlot.tsx                # Client wrapper for AdSense on homepage
│   ├── SearchableToolGrid.tsx        # Category filter tabs + Mobile 2-column responsive
│   ├── ToolLayout.tsx                # Shared layout for all tool pages
│   ├── articles/                     # Blog article components (TSX per article)
│   └── tools/                       # Tool components (one file per tool)
├── lib/
│   ├── tools.ts                     # Central tool registry
│   └── articles.ts                  # Blog article metadata
├── public/
│   ├── ads.txt                      # google.com, pub-2562848751614063, DIRECT, f08c47fec0942fa0
│   ├── robots.txt
│   ├── sitemap.xml
│   └── icon-192.png / icon-512.png
├── next.config.ts                   # output: 'export', trailingSlash, images unoptimized
└── next-sitemap.config.js           # Sitemap + robots.txt (runs postbuild)
```

---

## Page Designs

### Homepage — `app/page.tsx` (Server Component)

Structure (top to bottom):
1. **Hero** — tagline + subtitle + 2 CTA buttons ("Browse all tools →", "Read the blog")
2. **Popular Tools grid** — pulls `isPopular: true` from tools.ts, shows 8 tools as cards
3. **Ad slot** — `<HomeAdSlot />` between tools and categories
4. **Categories** — 6 category cards (icon + label + count + desc), links to `/tools?cat=X`
5. **From the Blog** — 3 latest articles by `publishedAt` desc, table-row style

Key patterns:
```tsx
// Popular tools — mark in tools.ts
isPopular: true  // add to high-traffic tools in lib/tools.ts

// Categories with icons
{ key: 'dev',     icon: '{ }',  desc: 'JSON, JWT, Base64, Regex, UUID' },
{ key: 'thai',    icon: 'ก ข',  desc: 'วันที่ ภาษี VAT บัตรประชาชน' },
{ key: 'file',    icon: '⇄',    desc: 'Images, QR codes, Favicons' },
{ key: 'finance', icon: '฿',    desc: 'VAT, Tax, Loan, Income calculators' },
{ key: 'openssl', icon: '🔒',   desc: 'Certs, CSR, RSA Keys, PEM/DER' },
{ key: 'linux',   icon: '$_',   desc: 'chmod, cron, permissions' },

// Latest articles — sorted by publishedAt desc, show 3
const recentArticles = [...articles]
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  .slice(0, 3)
```

No `'use client'` — this is a server component with `export const metadata`.

### Blog Index — `app/blog/page.tsx` (Client Component)

Structure (top to bottom):
1. **Header** — title + total article count
2. **Category filter tabs** — All + unique categories from articles.ts, with count per category
3. **Featured card** — first article in current filter, displayed large with full description
4. **Article grid** — remaining articles, 3-column card grid, truncated description
5. **Show all button** — initially shows 12 articles, expand on click

Key patterns:
```tsx
'use client'  // required for filter state

// Category filter — derives from articles data, no hardcoding
const allCategories = Array.from(new Set(articles.map(a => a.category))).sort()

// Page size
const PAGE_SIZE = 12
const displayed = showAll ? filtered : filtered.slice(0, PAGE_SIZE)

// Featured = first item in filtered list
const featuredArticle = filtered[0]
const restArticles = displayed.slice(1)

// Reset showAll on category change
const handleCatChange = (cat: string) => {
  setActiveCat(cat)
  setShowAll(false)
}
```

**SEO Note:** Because `app/blog/page.tsx` is `'use client'`, metadata must be exported from `app/blog/layout.tsx` (server component) instead:

```tsx
// app/blog/layout.tsx — server component, exports metadata
import type { Metadata } from 'next'
import { articles } from '@/lib/articles'

export const metadata: Metadata = {
  title: 'Developer Guides & Tutorials | FreeUtil Blog',
  description: `${articles.length} in-depth articles on web development, networking, SSL/TLS, Linux, and Thai developer topics.`,
  alternates: { canonical: 'https://freeutil.app/blog' },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

---

## Design System

### Colors
```
Background:  #f8f7f4  Text: #1a1917  Border: #c8c6c0
Muted:       #6b6960  #a8a69e  White: #ffffff

Categories:
  dev:     bg #eeedfe  text #3c3489  (purple)
  thai:    bg #e1f5ee  text #085041  (teal)
  file:    bg #faeeda  text #633806  (amber)
  finance: bg #faece7  text #712b13  (coral)
  openssl: bg #eef6ff  text #1D4ED8  (blue)
  linux:   bg #f0fdf4  text #166534  (green)

Status:
  Success: bg #e1f5ee  border #1D9E75  text #085041
  Error:   bg #fcebeb  border #f09595  text #a32d2d
  Warning: bg #faeeda  border #e8c97a  text #633806
  Info:    bg #eeedfe  border #8b7fd4  text #3c3489
```

### Header & Footer (Shared Components)

Nav and footer live in `components/Header.tsx` and `components/Footer.tsx` — injected globally via `app/layout.tsx`. **Never add a nav or footer inside individual page files.**

```tsx
// Header — sticky top nav, 52px height
// Logo: "free" + muted "util" in font-mono 20px
// Nav links: tools / blog / about
// Active state: bg #f8f7f4, border 0.5px #c8c6c0, text #1a1917
// Inactive:    text #a8a69e, transparent bg

// Footer — simple bottom bar
// Left: "freeutil.app · free tools, no login required"
// Right: tools / blog / about / privacy links
```

`layout.tsx` structure:
```tsx
<body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
  <Header />
  <main style={{ flex: 1 }}>
    {children}
  </main>
  <Footer />
  {/* GA + AdSense Scripts */}
</body>
```

### NumInput Component (Important!)
**Always define NumInput OUTSIDE the main component function** to prevent focus/cursor jumping:

```tsx
// ✅ CORRECT — top-level function
function NumInput({ value, onChange, placeholder, max }: {...}) {
  const [str, setStr] = useState(value === 0 ? '' : String(value))
  return <input type="text" inputMode="numeric" value={str} onChange={...} />
}

export default function MyTool() { ... }

// ❌ WRONG — inside component body causes re-render issues
export default function MyTool() {
  const NumInput = (...) => <input ... />  // DO NOT DO THIS
}
```

**Same rule applies to Row, Field, NavBtn** — all sub-components must be top-level functions.

---

## Adding a New Tool — Checklist

1. Register in `lib/tools.ts` with slug, name, shortDesc, longDesc, category, keywords, howTo, faq, related
2. Add `isPopular: true` if it's a high-traffic tool (shows on homepage)
3. Create `components/tools/ToolName.tsx` — `'use client'`, design system styles
4. Register in `app/tools/[slug]/page.tsx` toolComponents map
5. Push → Cloudflare auto-deploys → Request indexing in Search Console

## Adding a New Article — Checklist

1. Add entry in `lib/articles.ts` (slug, title, description, category, categoryColor, categoryText, readTime, publishedAt, relatedTool?, lang, keywords)
2. Create `components/articles/ArticleName.tsx` — `'use client'`, use `.prose-freeutil` className, write full article body
3. Add static import + map entry in `app/blog/[slug]/page.tsx`
4. If article links to a tool, add `relatedArticle` + `relatedArticleName` to that tool in `lib/tools.ts`
5. Push → Cloudflare auto-deploys → Request indexing in Search Console

---

## Analytics & Monetization

- **Google Analytics:** `G-F8CDHZEK72`
- **AdSense Publisher:** `ca-pub-2562848751614063`
- **Status:** Authorized ✅ | Getting ready ⏳ (pending organic traffic + content review)
- **ads.txt:** ✅ Authorized

**Ad slots:**
| Component | Slot ID | Placement |
|---|---|---|
| `<AdLeaderboard />` | 4258757514 | Under tool header |
| `<AdSidebar />` | 7704215914 | Right sidebar |
| `<AdInArticle />` | 9484201440 | Between how-to and FAQ |
| `<HomeAdSlot />` | — | Homepage between Popular Tools and Categories |

---

## SEO & Content Structure

- Per-tool metadata via `generateMetadata()` in `app/tools/[slug]/page.tsx`
- Blog index metadata via `app/blog/layout.tsx` (server component — required because page.tsx is client)
- JSON-LD: WebApplication, BreadcrumbList, HowTo, FAQPage per tool
- JSON-LD: Article schema per blog post
- Canonical URLs set for all pages
- Sitemap: auto via `next-sitemap` postbuild
- OG images: auto-generated per tool
- About page: 800+ word content, SEO + AdSense optimized

### Article Language Policy
- **English** — all articles except Thai Tools category
- **Thai** — Thai Tools category articles only (ภาษา, VAT, บัตรประชาชน ฯลฯ)
- Reason: English maximizes AdSense RPM; Thai reserved for content only Thai users would search

---

## Tools Completed ✅ (38 tools)

### Dev / IT (19)
| Slug | Component |
|---|---|
| jwt-decoder | JwtDecoder.tsx |
| json-formatter | JsonFormatter.tsx |
| base64-encode-decode | Base64Tool.tsx |
| url-encode-decode | UrlEncodeDecode.tsx |
| hash-generator | HashGenerator.tsx |
| regex-tester | RegexTester.tsx |
| cidr-calculator | CidrCalculator.tsx |
| cron-builder | CronBuilder.tsx |
| unix-timestamp | UnixTimestamp.tsx |
| uuid-generator | UuidGenerator.tsx |
| password-generator | PasswordGenerator.tsx |
| json-to-csv | JsonToCsv.tsx |
| json-to-yaml | JsonToYaml.tsx |
| color-converter | ColorConverter.tsx |
| word-counter | WordCounter.tsx |
| markdown-preview | MarkdownPreview.tsx |
| diff-checker | DiffChecker.tsx |
| lorem-ipsum-generator | LoremIpsumGenerator.tsx |
| text-case-converter | TextCaseConverter.tsx |

### Thai Tools (6)
| Slug | Component |
|---|---|
| thai-date-converter | ThaiDateConverter.tsx |
| thai-number-to-text | ThaiNumberToText.tsx |
| thai-baht-to-words | ThaiBahtToWords.tsx |
| thai-tax-calculator | ThaiTaxCalculator.tsx |
| thai-id-validator | ThaiIdValidator.tsx |
| thai-vat-calculator | ThaiVatCalculator.tsx |

### File & Convert (5)
| Slug | Component |
|---|---|
| pdf-base64 | PdfBase64.tsx |
| qr-code-generator | QrCodeGenerator.tsx |
| image-resize | ImageResize.tsx |
| favicon-generator | FaviconGenerator.tsx |
| image-compressor | ImageCompressor.tsx |

### OpenSSL & Cert (6)
| Slug | Component |
|---|---|
| csr-generator | CSRGenerator.tsx |
| self-signed-cert | SelfSignedCertGenerator.tsx |
| pem-der-converter | PemDerConverter.tsx |
| certificate-decoder | CertificateDecoder.tsx |
| openssl-command-builder | OpenSSLCommandBuilder.tsx |
| rsa-key-generator | RSAKeyGenerator.tsx |

### Linux & DevOps (1)
| Slug | Component |
|---|---|
| chmod-calculator | ChmodCalculator.tsx |

### Finance (1)
| Slug | Component |
|---|---|
| (coming soon) | — |

---

## Blog Articles Completed ✅ (63 articles)

### Batch 1 — Tool-linked informational (19 articles)

#### Dev / IT (9)
- `what-is-jwt` → WhatIsJWT.tsx
- `base64-encoding-explained` → Base64Explained.tsx
- `cidr-subnetting-guide` → CIDRGuide.tsx
- `regex-guide-for-developers` → RegexGuide.tsx
- `hash-functions-md5-sha256-sha512` → HashFunctions.tsx
- `cron-expression-guide` → CronGuide.tsx
- `uuid-guide` → UUIDGuide.tsx
- `unix-timestamp-explained` → UnixTimestamp.tsx
- `json-yaml-comparison` → JSONvsYAML.tsx

#### OpenSSL & Cert (5)
- `ssl-certificate-types-explained` → SSLCertTypes.tsx
- `self-signed-certificate-guide` → SelfSignedCertGuide.tsx
- `what-is-csr` → WhatIsCSR.tsx
- `tls-versions-explained` → TLSVersions.tsx
- `rsa-encryption-explained` → RSAExplained.tsx

#### Thai Tools (3 — Thai language)
- `thai-income-tax-2568-guide` → ThaiTaxGuide.tsx
- `thai-baht-to-words-guide` → ThaiBahtToWordsGuide.tsx
- `thai-date-converter-guide` → ThaiDateGuide.tsx

#### File & Image (2)
- `image-compression-guide` → ImageCompressionGuide.tsx
- `qr-code-guide` → QRCodeGuide.tsx

### Batch 2 — Tool-linked informational, new tools (10 articles)

#### Dev / IT (7)
- `json-formatting-guide` → JsonFormattingGuide.tsx
- `url-encoding-explained` → UrlEncodingExplained.tsx
- `password-security-guide` → PasswordSecurityGuide.tsx
- `json-to-csv-guide` → JsonToCsvGuide.tsx
- `css-color-formats-explained` → CssColorFormatsExplained.tsx
- `markdown-guide` → MarkdownGuide.tsx
- `content-length-seo-guide` → ContentLengthSeoGuide.tsx

#### File & Image (1)
- `favicon-guide` → FaviconGuide.tsx

#### OpenSSL & Cert (1)
- `x509-certificate-guide` → X509CertificateGuide.tsx

#### Thai Tools (1 — Thai language)
- `thai-number-writing-guide` → ThaiNumberWritingGuide.tsx

### Batch 3 — Comparison + Troubleshooting + How-to (15 articles)

#### Comparison (7)
- `https-vs-http` → HttpsVsHttp.tsx
- `jwt-vs-session-auth` → JwtVsSessionAuth.tsx
- `rsa-vs-ecdsa-vs-ed25519` → RsaVsEcdsaVsEd25519.tsx
- `json-vs-xml` → JsonVsXml.tsx
- `png-vs-jpg-vs-webp` → PngVsJpgVsWebp.tsx
- `sha256-vs-bcrypt-vs-argon2` → Sha256VsBcryptVsArgon2.tsx
- `lets-encrypt-vs-paid-ssl` → LetsEncryptVsPaidSsl.tsx

#### Error / Troubleshooting (5)
- `err-ssl-protocol-error` → ErrSslProtocolError.tsx
- `invalid-json-fix` → InvalidJsonFix.tsx
- `jwt-expired-error` → JwtExpiredError.tsx
- `cors-error-fix` → CorsErrorFix.tsx
- `413-request-entity-too-large` → RequestEntityTooLarge.tsx

#### How-to (3)
- `nginx-ssl-lets-encrypt` → NginxSslLetsEncrypt.tsx
- `linux-file-permissions-explained` → LinuxFilePermissionsExplained.tsx
- `linux-cron-job-setup` → LinuxCronJobSetup.tsx

### Batch 4 — Standalone depth + Thai-specific (10 articles)

#### Standalone informational — OpenSSL & Dev (6)
- `what-is-ssl-tls` → WhatIsSslTls.tsx
- `public-key-cryptography-explained` → PublicKeyCryptographyExplained.tsx
- `http-status-codes-guide` → HttpStatusCodesGuide.tsx
- `dns-explained` → DnsExplained.tsx
- `api-authentication-methods` → ApiAuthenticationMethods.tsx
- `linux-permissions-cheatsheet` → LinuxPermissionsCheatsheet.tsx

#### Thai-specific (4 — Thai language)
- `pdpa-thailand-developers` → PdpaThailandDevelopers.tsx
- `thai-vat-guide` → ThaiVatGuide.tsx
- `thai-company-tax-id` → ThaiCompanyTaxId.tsx
- `https-ssl-pdpa-thai-business` → HttpsSslPdpaThaiiBusiness.tsx

### Batch 5 — Broader dev topics + Thai community (12 articles)

#### Dev / IT — Broader topics (9)
- `best-free-developer-tools-2025` → BestFreeDeveloperTools2025.tsx
- `api-testing-guide` → ApiTestingGuide.tsx
- `vps-vs-shared-hosting` → VpsVsSharedHosting.tsx
- `cloudflare-free-tier-guide` → CloudflareFreeGuide.tsx
- `https-everywhere-guide` → HttpsEverywhereGuide.tsx
- `common-web-security-mistakes` → CommonWebSecurityMistakes.tsx
- `data-encryption-explained` → DataEncryptionExplained.tsx
- `two-factor-authentication-guide` → TwoFactorAuthGuide.tsx
- `open-source-license-guide` → OpenSourceLicenseGuide.tsx
- `git-workflow-guide` → GitWorkflowGuide.tsx

#### Thai community (2 — Thai language)
- `thai-developer-salary-guide` → ThaiDeveloperSalaryGuide.tsx
- `freelance-tax-thailand` → FreelanceTaxThailand.tsx

---

## Blog Articles Roadmap

---

## Tools Roadmap

### Phase 1 Remaining — Client-side only

#### PDF & Image
- [ ] Image → WebP
- [ ] QR Code Reader
- [ ] Image → Base64
- [ ] SVG Optimizer

#### Linux & DevOps
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
- [ ] String Escape/Unescape

### Phase 2 — Cloudflare Workers at `api.freeutil.app`
- [ ] DNS Record Lookup
- [ ] My IP Address
- [ ] IP Geolocation
- [ ] SSL Certificate Checker
- [ ] Currency Converter
- [ ] Bandwidth Calculator (client-side)
- [ ] IPv6 Calculator (client-side)
- [ ] Port Reference Table (client-side)

### Phase 3 — VPS Required
- [ ] Ping
- [ ] Traceroute
- [ ] Port Scanner

---

## AdSense Status & Action Items

- **Current issue:** "Low value content" — under review
- **Fix applied:**
  - ✅ About page (`app/about/page.tsx`) — 800+ word SEO content
  - ✅ Batch 1: 19 tool-linked articles
  - ✅ Batch 2: 10 tool-linked articles (new tools)
  - ✅ Batch 3: 15 Comparison + Troubleshooting + How-to articles
  - ✅ Batch 4: 10 Standalone depth + Thai-specific articles
  - ✅ Batch 5: 12 Broader dev topics + Thai community articles
  - ✅ Shared Header + Footer with /blog and /about links (all pages)
  - ✅ Homepage redesigned — Popular Tools + Categories + Blog preview
  - ✅ Blog page redesigned — category filter + featured card + grid layout
  - ⬜ Update sitemap to include /about, /blog, /blog/*
  - ⬜ Deploy and request indexing in Search Console
  - ⬜ Wait 5-7 days then submit AdSense review

---

## Known Issues & Notes

- **NumInput cursor bug:** Fixed — always define NumInput as top-level function, never inside component body
- **Static export rules:** Dynamic routes need `generateStaticParams()` + `force-static`
- **No API routes:** Phase 2 needs separate CF Worker at `api.freeutil.app`
- **AdSense data-nscript warning:** Cosmetic only, ignore
- **Cache issues:** `Remove-Item -Recurse -Force .next && pnpm dev`
- **crossOrigin:** Capital O in JSX
- **CSR/SelfSigned TypeScript error:** `certReqInfo.buffer as ArrayBuffer` fix
- **Blog page metadata:** `app/blog/page.tsx` is `'use client'` — metadata lives in `app/blog/layout.tsx`

---

## Git Workflow

```powershell
git checkout main   # always work on main (production)
git pull && pnpm dev
git add . && git commit -m "add [feature]" && git push
# Cloudflare Pages auto-deploys ~2-3 min
```

**Branches:**
- `main` → Production (Cloudflare Pages deploys from this)
- `nonprod` → Staging/testing
- `worker` → Old Worker config backup

---

## Project Knowledge Files

Files uploaded to Claude Project Knowledge and what they map to:

| Knowledge file | Actual path in repo |
|---|---|
| `CLAUDE.md` | `CLAUDE.md` (this file) |
| `tools.ts` | `lib/tools.ts` |
| `articles.ts` | `lib/articles.ts` |
| `blog-slug-page.tsx` | `app/blog/[slug]/page.tsx` |
| `tool-slug-page.tsx` | `app/tools/[slug]/page.tsx` |
| `home-page.tsx` | `app/page.tsx` |
| `blog-page.tsx` | `app/blog/page.tsx` |