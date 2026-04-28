import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getArticle, articles } from '@/lib/articles'
import { getTool } from '@/lib/tools'

export function generateStaticParams() {
  return articles.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return {}
  const url = `https://freeutil.app/blog/${article.slug}`
  return {
    title: `${article.title} | FreeUtil`,
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      type: 'article',
      publishedTime: article.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
  }
}

// ── Article content map ──────────────────────────────────────────
import WhatIsJWT from '@/components/articles/WhatIsJWT'
import Base64Explained from '@/components/articles/Base64Explained'
import CIDRGuide from '@/components/articles/CIDRGuide'
import RegexGuide from '@/components/articles/RegexGuide'
import HashFunctions from '@/components/articles/HashFunctions'
import CronGuide from '@/components/articles/CronGuide'
import UUIDGuide from '@/components/articles/UUIDGuide'
import UnixTimestamp from '@/components/articles/UnixTimestamp'
import JSONvsYAML from '@/components/articles/JSONvsYAML'
import SSLCertTypes from '@/components/articles/SSLCertTypes'
import SelfSignedCertGuide from '@/components/articles/SelfSignedCertGuide'
import WhatIsCSR from '@/components/articles/WhatIsCSR'
import TLSVersions from '@/components/articles/TLSVersions'
import RSAExplained from '@/components/articles/RSAExplained'
import ThaiTaxGuide from '@/components/articles/ThaiTaxGuide'
import ThaiBahtToWordsGuide from '@/components/articles/ThaiBahtToWordsGuide'
import ThaiDateGuide from '@/components/articles/ThaiDateGuide'
import ImageCompressionGuide from '@/components/articles/ImageCompressionGuide'
import QRCodeGuide from '@/components/articles/QRCodeGuide'
// ── New articles ─────────────────────────────────────────────────
import JsonFormattingGuide from '@/components/articles/JsonFormattingGuide'
import UrlEncodingExplained from '@/components/articles/UrlEncodingExplained'
import PasswordSecurityGuide from '@/components/articles/PasswordSecurityGuide'
import JsonToCsvGuide from '@/components/articles/JsonToCsvGuide'
import CssColorFormatsExplained from '@/components/articles/CssColorFormatsExplained'
import MarkdownGuide from '@/components/articles/MarkdownGuide'
import ContentLengthSeoGuide from '@/components/articles/ContentLengthSeoGuide'
import FaviconGuide from '@/components/articles/FaviconGuide'
import X509CertificateGuide from '@/components/articles/X509CertificateGuide'
import ThaiNumberWritingGuide from '@/components/articles/ThaiNumberWritingGuide'
// ── Batch 3 imports (เพิ่มหลัง Batch 2 imports) ──────────────
import HttpsVsHttp from '@/components/articles/HttpsVsHttp'
import JwtVsSessionAuth from '@/components/articles/JwtVsSessionAuth'
import RsaVsEcdsaVsEd25519 from '@/components/articles/RsaVsEcdsaVsEd25519'
import JsonVsXml from '@/components/articles/JsonVsXml'
import PngVsJpgVsWebp from '@/components/articles/PngVsJpgVsWebp'
import Sha256VsBcryptVsArgon2 from '@/components/articles/Sha256VsBcryptVsArgon2'
import LetsEncryptVsPaidSsl from '@/components/articles/LetsEncryptVsPaidSsl'
import ErrSslProtocolError from '@/components/articles/ErrSslProtocolError'
import InvalidJsonFix from '@/components/articles/InvalidJsonFix'
import JwtExpiredError from '@/components/articles/JwtExpiredError'
import CorsErrorFix from '@/components/articles/CorsErrorFix'
import RequestEntityTooLarge from '@/components/articles/RequestEntityTooLarge'
import NginxSslLetsEncrypt from '@/components/articles/NginxSslLetsEncrypt'
import LinuxFilePermissionsExplained from '@/components/articles/LinuxFilePermissionsExplained'
import LinuxCronJobSetup from '@/components/articles/LinuxCronJobSetup'

const articleComponents: Record<string, React.ComponentType> = {
  'what-is-jwt': WhatIsJWT,
  'base64-encoding-explained': Base64Explained,
  'cidr-subnetting-guide': CIDRGuide,
  'regex-guide-for-developers': RegexGuide,
  'hash-functions-md5-sha256-sha512': HashFunctions,
  'cron-expression-guide': CronGuide,
  'uuid-guide': UUIDGuide,
  'unix-timestamp-explained': UnixTimestamp,
  'json-yaml-comparison': JSONvsYAML,
  'ssl-certificate-types-explained': SSLCertTypes,
  'self-signed-certificate-guide': SelfSignedCertGuide,
  'what-is-csr': WhatIsCSR,
  'tls-versions-explained': TLSVersions,
  'rsa-encryption-explained': RSAExplained,
  'thai-income-tax-2568-guide': ThaiTaxGuide,
  'thai-baht-to-words-guide': ThaiBahtToWordsGuide,
  'thai-date-converter-guide': ThaiDateGuide,
  'image-compression-guide': ImageCompressionGuide,
  'qr-code-guide': QRCodeGuide,
  // ── New articles ──────────────────────────────────────────────
  'json-formatting-guide': JsonFormattingGuide,
  'url-encoding-explained': UrlEncodingExplained,
  'password-security-guide': PasswordSecurityGuide,
  'json-to-csv-guide': JsonToCsvGuide,
  'css-color-formats-explained': CssColorFormatsExplained,
  'markdown-guide': MarkdownGuide,
  'content-length-seo-guide': ContentLengthSeoGuide,
  'favicon-guide': FaviconGuide,
  'x509-certificate-guide': X509CertificateGuide,
  'thai-number-writing-guide': ThaiNumberWritingGuide,
  // ── Batch 3 map entries (เพิ่มใน articleComponents object) ────
  'https-vs-http': HttpsVsHttp,
  'jwt-vs-session-auth': JwtVsSessionAuth,
  'rsa-vs-ecdsa-vs-ed25519': RsaVsEcdsaVsEd25519,
  'json-vs-xml': JsonVsXml,
  'png-vs-jpg-vs-webp': PngVsJpgVsWebp,
  'sha256-vs-bcrypt-vs-argon2': Sha256VsBcryptVsArgon2,
  'lets-encrypt-vs-paid-ssl': LetsEncryptVsPaidSsl,
  'err-ssl-protocol-error': ErrSslProtocolError,
  'invalid-json-fix': InvalidJsonFix,
  'jwt-expired-error': JwtExpiredError,
  'cors-error-fix': CorsErrorFix,
  '413-request-entity-too-large': RequestEntityTooLarge,
  'nginx-ssl-lets-encrypt': NginxSslLetsEncrypt,
  'linux-file-permissions-explained': LinuxFilePermissionsExplained,
  'linux-cron-job-setup': LinuxCronJobSetup,
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  const ArticleContent = articleComponents[slug]
  const relatedTool = article.relatedTool ? getTool(article.relatedTool) : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    author: { '@type': 'Organization', name: 'FreeUtil', url: 'https://freeutil.app' },
    publisher: { '@type': 'Organization', name: 'FreeUtil', url: 'https://freeutil.app' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://freeutil.app/blog/${slug}` },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px 80px', fontFamily: 'var(--font-sans)' }}>

        {/* Breadcrumb */}
        <nav style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#a8a69e', marginBottom: 24, display: 'flex', gap: 6, alignItems: 'center' }}>
          <Link href="/" style={{ color: '#a8a69e', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/blog" style={{ color: '#a8a69e', textDecoration: 'none' }}>Blog</Link>
          <span>/</span>
          <span style={{ color: '#6b6960' }}>{article.title.slice(0, 40)}...</span>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, padding: '3px 10px',
              borderRadius: 99, background: article.categoryColor, color: article.categoryText,
            }}>{article.category}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#a8a69e' }}>
              {article.readTime} min read
            </span>
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: '#1a1917', lineHeight: 1.25, marginBottom: 14, letterSpacing: '-0.02em' }}>
            {article.title}
          </h1>
          <p style={{ fontSize: 15, color: '#6b6960', lineHeight: 1.75, marginBottom: 0 }}>
            {article.description}
          </p>
        </header>

        {/* Article content */}
        <article className="prose-freeutil">
          {ArticleContent ? <ArticleContent /> : (
            <p style={{ color: '#a8a69e', fontFamily: 'var(--font-mono)', fontSize: 13 }}>Content coming soon.</p>
          )}
        </article>

        {/* Related tool CTA */}
        {relatedTool && (
          <div style={{
            marginTop: 48, background: article.categoryColor,
            border: `1px solid ${article.categoryText}33`,
            borderRadius: 10, padding: '20px 24px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: 12,
          }}>
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: article.categoryText, margin: '0 0 4px', letterSpacing: '0.06em', opacity: 0.7 }}>
                TRY THE FREE TOOL
              </p>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#1a1917', margin: 0 }}>{relatedTool.name}</p>
              <p style={{ fontSize: 12, color: '#6b6960', margin: '2px 0 0' }}>{relatedTool.shortDesc}</p>
            </div>
            <Link href={`/tools/${relatedTool.slug}`} style={{
              fontFamily: 'var(--font-mono)', fontSize: 12, padding: '10px 20px',
              background: '#1a1917', color: '#f8f7f4',
              borderRadius: 8, textDecoration: 'none',
              display: 'inline-block', whiteSpace: 'nowrap',
            }}>Open Tool →</Link>
          </div>
        )}

        {/* Back to blog */}
        <div style={{ marginTop: 32 }}>
          <Link href="/blog" style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6960',
            textDecoration: 'none',
          }}>← Back to all articles</Link>
        </div>

      </main>

      <style>{`
        .prose-freeutil h2 { font-size: 20px; font-weight: 600; color: #1a1917; margin: 36px 0 12px; }
        .prose-freeutil h3 { font-size: 16px; font-weight: 600; color: #1a1917; margin: 28px 0 10px; }
        .prose-freeutil p { font-size: 15px; color: #4a4845; line-height: 1.85; margin: 0 0 16px; }
        .prose-freeutil ul, .prose-freeutil ol { padding-left: 22px; margin: 0 0 16px; }
        .prose-freeutil li { font-size: 15px; color: #4a4845; line-height: 1.75; margin-bottom: 6px; }
        .prose-freeutil code { font-family: var(--font-mono); font-size: 12px; background: #f0eefd; color: #3c3489; padding: 2px 6px; border-radius: 4px; }
        .prose-freeutil pre { background: #1a1917; color: #e1f5ee; padding: 16px; border-radius: 8px; overflow-x: auto; margin: 16px 0; }
        .prose-freeutil pre code { background: transparent; color: inherit; padding: 0; font-size: 13px; }
        .prose-freeutil blockquote { border-left: 3px solid #8b7fd4; margin: 20px 0; padding: 10px 16px; background: #eeedfe; border-radius: 0 6px 6px 0; }
        .prose-freeutil blockquote p { color: #3c3489; margin: 0; }
        .prose-freeutil table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
        .prose-freeutil th { background: #f8f7f4; padding: 10px 14px; text-align: left; border: 0.5px solid #c8c6c0; font-weight: 600; color: #1a1917; }
        .prose-freeutil td { padding: 9px 14px; border: 0.5px solid #e8e6e0; color: #4a4845; }
        .prose-freeutil tr:nth-child(even) td { background: #fafaf9; }
        .prose-freeutil a { color: #3c3489; text-decoration: underline; }
        .prose-freeutil hr { border: none; border-top: 1px solid #e8e6e0; margin: 32px 0; }
        .prose-freeutil .callout { background: #faeeda; border: 0.5px solid #e8c97a; border-radius: 8px; padding: 14px 16px; margin: 20px 0; }
        .prose-freeutil .callout p { color: #633806; margin: 0; font-size: 13px; }
        .prose-freeutil .callout-green { background: #e1f5ee; border-color: #1D9E75; }
        .prose-freeutil .callout-green p { color: #085041; }
        .prose-freeutil .callout-blue { background: #eef6ff; border-color: #93c5fd; }
        .prose-freeutil .callout-blue p { color: #1D4ED8; }
      `}</style>
    </>
  )
}