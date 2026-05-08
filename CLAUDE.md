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
│   ├── page.tsx                      # Homepage — HeroSearch + SearchableToolGrid + HomeAdSlot (no nav/footer)
│   ├── manifest.ts                   # PWA manifest (force-static)
│   ├── about/page.tsx                # About page (SEO + AdSense optimized, no nav/footer)
│   ├── blog/
│   │   ├── page.tsx                  # Blog index (no nav/footer)
│   │   └── [slug]/page.tsx           # Article page + SEO + JSON-LD
│   ├── privacy/page.tsx              # Privacy policy
│   └── tools/
│       ├── page.tsx                  # All tools page — grid by category (no nav/footer)
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

Nav links in `Header.tsx`:
```tsx
const navLinks = [
  { href: '/tools', label: 'tools' },
  { href: '/blog',  label: 'blog'  },
  { href: '/about', label: 'about' },
]
```

Footer links in `Footer.tsx`:
```tsx
const footerLinks = [
  { href: '/tools',   label: 'tools'   },
  { href: '/blog',    label: 'blog'    },
  { href: '/about',   label: 'about'   },
  { href: '/privacy', label: 'privacy' },
]
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
2. Create `components/tools/ToolName.tsx` — `'use client'`, design system styles
3. Register in `app/tools/[slug]/page.tsx` toolComponents map
4. Push → Cloudflare auto-deploys → Request indexing in Search Console

## Adding a New Article — Checklist

1. Add entry in `lib/articles.ts` (slug, title, description, category, categoryColor, categoryText, readTime, publishedAt, relatedTool?, lang, keywords)
2. Create `components/articles/ArticleName.tsx` — `'use client'`, use `.prose-article` className, write full article body
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

---

## SEO & Content Structure

- Per-tool metadata via `generateMetadata()` in `app/tools/[slug]/page.tsx`
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

## Tools Completed ✅ (37 tools)

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

---

## Blog Articles

### Article Strategy — Why variety matters for AdSense
Google's "Low value content" flag targets sites with only one content type. freeutil.app needs:
- **Depth signal**: articles that stand alone without being tied to a specific tool
- **Variety signal**: comparison, troubleshooting, how-to — not just "what is X" definitions
- **Commercial signal**: articles where readers have purchase/decision intent → higher RPM

### Article Types & AdSense RPM
| Type | RPM Range | Why |
|---|---|---|
| Comparison (X vs Y) | $4–8 | Commercial intent — readers deciding between options |
| Error / Troubleshooting | $5–9 | Urgent intent — high engagement, multiple page views |
| How-to guides | $5–10 | Developer audience is high-CPM demographic |
| Tool-linked informational | $2–5 | Info intent — lower but solid |
| Thai-specific | $2–5 | Niche, low competition |
| Glossary / Definitions | $1–3 | Top-of-funnel, low intent |

---

## Blog Articles Completed ✅ (104 articles)

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

### Batch 3 — Comparison + Error fix + How-to (15 articles, English)

#### Comparison articles (7)
- `https-vs-http` → HttpsVsHttp.tsx
- `jwt-vs-session-auth` → JwtVsSessionAuth.tsx
- `rsa-vs-ecdsa-vs-ed25519` → RsaVsEcdsaVsEd25519.tsx
- `json-vs-xml` → JsonVsXml.tsx
- `png-vs-jpg-vs-webp` → PngVsJpgVsWebp.tsx
- `sha256-vs-bcrypt-vs-argon2` → Sha256VsBcryptVsArgon2.tsx
- `lets-encrypt-vs-paid-ssl` → LetsEncryptVsPaidSsl.tsx

#### Error / Troubleshooting articles (5)
- `err-ssl-protocol-error` → ErrSslProtocolError.tsx
- `invalid-json-fix` → InvalidJsonFix.tsx
- `jwt-expired-error` → JwtExpiredError.tsx
- `cors-error-fix` → CorsErrorFix.tsx
- `413-request-entity-too-large` → RequestEntityTooLarge.tsx

#### How-to guides (3)
- `nginx-ssl-lets-encrypt` → NginxSslLetsEncrypt.tsx
- `linux-file-permissions-explained` → LinuxFilePermissionsExplained.tsx
- `linux-cron-job-setup` → LinuxCronJobSetup.tsx

### Batch 4 — Cheatsheets + What is X + Comparison + Thai + How-to (20 articles)

#### Cheatsheets (5)
- `http-status-codes-guide` → HttpStatusCodesGuide.tsx
- `linux-commands-cheatsheet` → LinuxCommandsCheatsheet.tsx
- `git-commands-cheatsheet` → GitCommandsCheatsheet.tsx
- `openssl-commands-cheatsheet` → OpensslCommandsCheatsheet.tsx
- `regex-cheatsheet` → RegexCheatsheet.tsx

#### What is X (5)
- `what-is-api` → WhatIsApi.tsx
- `how-dns-works` → HowDnsWorks.tsx
- `what-is-ssh` → WhatIsSsh.tsx
- `what-is-docker` → WhatIsDocker.tsx
- `what-is-webhook` → WhatIsWebhook.tsx

#### Comparison (4)
- `rest-vs-graphql-vs-grpc` → RestVsGraphqlVsGrpc.tsx
- `api-authentication-methods` → ApiAuthenticationMethods.tsx
- `sql-vs-nosql` → SqlVsNosql.tsx
- `symmetric-vs-asymmetric-encryption` → SymmetricVsAsymmetricEncryption.tsx

#### Thai-specific (3)
- `thai-pdpa-developers` → ThaiPdpaDevelopers.tsx (EN)
- `thai-vat-guide` → ThaiVatGuide.tsx (TH)
- `thai-company-registration` → ThaiCompanyRegistration.tsx (TH)

#### How-to (3)
- `how-to-generate-ssh-key` → HowToGenerateSshKey.tsx
- `how-to-read-ssl-certificate` → HowToReadSslCertificate.tsx
- `how-to-debug-api-requests` → HowToDebugApiRequests.tsx

### Batch 5 — Developer Career + Security + Thai Dev/Business (12 articles)
- `best-free-developer-tools-2025` → BestFreeDeveloperTools2025.tsx
- `api-testing-guide` → ApiTestingGuide.tsx
- `vps-vs-shared-hosting` → VpsVsSharedHosting.tsx
- `cloudflare-free-tier-guide` → CloudflareFreeGuide.tsx
- `https-everywhere-guide` → HttpsEverywhereGuide.tsx
- `common-web-security-mistakes` → CommonWebSecurityMistakes.tsx
- `data-encryption-explained` → DataEncryptionExplained.tsx
- `two-factor-authentication-guide` → TwoFactorAuthGuide.tsx
- `thai-developer-salary-guide` → ThaiDeveloperSalaryGuide.tsx
- `freelance-tax-thailand` → FreelanceTaxThailand.tsx
- `open-source-license-guide` → OpenSourceLicenseGuide.tsx
- `git-workflow-guide` → GitWorkflowGuide.tsx

### Batch 6 — Error Fix + DevOps + Web Perf + Security + Comparison (18 articles)

#### Error Fix (5)
- `err-connection-refused` → ErrConnectionRefused.tsx
- `504-gateway-timeout-fix` → GatewayTimeout504.tsx
- `certificate-expired-fix` → CertificateExpiredFix.tsx
- `500-internal-server-error-fix` → InternalServerError500.tsx
- `mixed-content-warning-fix` → MixedContentWarningFix.tsx

#### DevOps & Environment (4)
- `environment-variables-guide` → EnvironmentVariablesGuide.tsx
- `ci-cd-explained` → CiCdExplained.tsx
- `docker-compose-guide` → DockerComposeGuide.tsx
- `nginx-config-guide` → NginxConfigGuide.tsx

#### Web Performance (3)
- `core-web-vitals-guide` → CoreWebVitalsGuide.tsx
- `web-performance-optimization` → WebPerformanceOptimization.tsx
- `http-caching-guide` → HttpCachingGuide.tsx

#### Security Basics (3)
- `xss-attack-explained` → XssAttackExplained.tsx
- `sql-injection-explained` → SqlInjectionExplained.tsx
- `web-security-headers` → WebSecurityHeaders.tsx

#### Comparison (3)
- `nginx-vs-apache` → NginxVsApache.tsx
- `mysql-vs-postgresql` → MysqlVsPostgresql.tsx
- `monolith-vs-microservices` → MonolithVsMicroservices.tsx

---

## Blog Articles Roadmap

### Batch 3 ✅ Done | Batch 4 ✅ Done | Batch 5 ✅ Done | Batch 6 ✅ Done

### Batch 7 — Next (when needed)

Remaining high-value topic clusters not yet covered:

#### Error Fix (more)
- `err-too-many-redirects` — redirect loop fix
- `dns-propagation-delay` — why DNS changes are slow
- `ssl-handshake-failed` — debugging TLS handshake errors

#### DevOps / Cloud
- `kubernetes-vs-docker-compose` — when to graduate to K8s
- `cloudflare-workers-tutorial` — serverless edge functions
- `github-actions-vs-gitlab-ci` — CI tool comparison

#### Thai Dev Career
- `thai-freelancer-guide` — platform, rates, contracts
- `remote-work-thai-developer` — tools, taxes, clients

#### Web / Frontend
- `next-js-vs-react` — when to use Next.js
- `typescript-vs-javascript` — migration guide
- `tailwind-css-guide` — utility-first CSS explained

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
  - ✅ Batch 1–6: 104 articles (tool-linked, comparison, error fix, how-to, cheatsheets, security, devops)
  - ✅ Shared Header + Footer with /blog and /about links (all pages)
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