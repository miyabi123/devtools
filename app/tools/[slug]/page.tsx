import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTool, tools } from '@/lib/tools'
import ToolLayout from '@/components/ToolLayout'
import dynamic from 'next/dynamic'

export function generateStaticParams() {
  return tools.map(t => ({ slug: t.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const tool = getTool(slug)
  if (!tool) return {}

  const url = `https://freeutil.app/tools/${tool.slug}`
  const ogImage = `/api/og?slug=${tool.slug}`

  return {
    title: `${tool.name} — ${tool.shortDesc}`,
    description: tool.longDesc,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${tool.name} | FreeUtil`,
      description: tool.shortDesc,
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: tool.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} | FreeUtil`,
      description: tool.shortDesc,
      images: [ogImage],
    },
  }
}

const toolComponents: Record<string, React.ComponentType> = {
  'jwt-decoder':          dynamic(() => import('@/components/tools/JwtDecoder')),
  'json-formatter':       dynamic(() => import('@/components/tools/JsonFormatter')),
  'base64-encode-decode': dynamic(() => import('@/components/tools/Base64Tool')),
  'url-encode-decode':    dynamic(() => import('@/components/tools/UrlEncodeDecode')),
  'pdf-base64':           dynamic(() => import('@/components/tools/PdfBase64')),
  'hash-generator':       dynamic(() => import('@/components/tools/HashGenerator')),
  'cron-builder':         dynamic(() => import('@/components/tools/CronBuilder')),
  'cidr-calculator':      dynamic(() => import('@/components/tools/CidrCalculator')),
  'regex-tester':         dynamic(() => import('@/components/tools/RegexTester')),
  'thai-date-converter':  dynamic(() => import('@/components/tools/ThaiDateConverter')),
  'unix-timestamp':       dynamic(() => import('@/components/tools/UnixTimestamp')),
  'uuid-generator':       dynamic(() => import('@/components/tools/UuidGenerator')),
  'password-generator':   dynamic(() => import('@/components/tools/PasswordGenerator')),
  'json-to-csv':          dynamic(() => import('@/components/tools/JsonToCsv')),
  'json-to-yaml': dynamic(() => import('@/components/tools/JsonToYaml')),
  'qr-code-generator': dynamic(() => import('@/components/tools/QrCodeGenerator')),
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tool = getTool(slug)
  if (!tool) notFound()

  const ToolComponent = toolComponents[tool.slug]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: tool.name,
        description: tool.longDesc,
        url: `https://freeutil.app/tools/${tool.slug}`,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web Browser',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: tool.keywords,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://freeutil.app' },
          { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://freeutil.app/tools' },
          { '@type': 'ListItem', position: 3, name: tool.name, item: `https://freeutil.app/tools/${tool.slug}` },
        ],
      },
      {
        '@type': 'HowTo',
        name: `How to use ${tool.name}`,
        step: tool.howTo.map((text, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: `Step ${i + 1}`,
          text,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: tool.faq.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolLayout tool={tool}>
        {ToolComponent ? <ToolComponent /> : (
          <div className="text-sm text-[#a8a69e] font-mono py-8 text-center">
            tool coming soon
          </div>
        )}
      </ToolLayout>
    </>
  )
}
