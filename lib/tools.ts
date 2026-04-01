export type ToolCategory = 'dev' | 'thai' | 'file' | 'finance'

export interface Tool {
  slug: string
  name: string
  shortDesc: string
  longDesc: string
  category: ToolCategory
  keywords: string[]
  howTo: string[]
  faq: { q: string; a: string }[]
  related: string[]
  isNew?: boolean
  isPopular?: boolean
}

export const tools: Tool[] = [
  // ── Phase 1: Dev / IT tools ────────────────────────────────────
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    shortDesc: 'Decode & verify JSON Web Tokens',
    longDesc:
      'Paste any JWT token to instantly decode its header, payload, and check expiry. Shows expiration in human-readable format. All processing is 100% client-side — your tokens never leave your browser.',
    category: 'dev',
    keywords: ['jwt decoder', 'decode jwt online', 'json web token decoder', 'jwt parser', 'verify jwt'],
    howTo: [
      'Paste your JWT token into the input field',
      'The header and payload are decoded automatically',
      'Check the expiry field shown in human-readable time',
      'Copy the decoded JSON output using the copy button',
    ],
    faq: [
      {
        q: 'Is it safe to paste my JWT here?',
        a: 'Yes — all decoding runs entirely in your browser using JavaScript. No data is sent to any server.',
      },
      {
        q: 'Can this tool verify the JWT signature?',
        a: 'Signature verification requires the secret key. This tool decodes and displays the payload claims only.',
      },
      {
        q: 'What JWT algorithms are supported?',
        a: 'This decoder supports all standard JWT algorithms including HS256, HS512, RS256, RS512, ES256, and more.',
      },
    ],
    related: ['base64-encode-decode', 'json-formatter', 'hash-generator'],
    isPopular: true,
  },
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    shortDesc: 'Format, validate & minify JSON',
    longDesc:
      'Format messy JSON into readable, indented output. Validate JSON syntax with clear error messages. Minify JSON for production use. Supports large JSON files — all client-side.',
    category: 'dev',
    keywords: ['json formatter', 'json beautifier', 'format json online', 'json validator', 'json minifier', 'pretty print json'],
    howTo: [
      'Paste or type your JSON into the input field',
      'Click Format to beautify with proper indentation',
      'Use Validate to check for syntax errors',
      'Click Minify to compress JSON for production',
    ],
    faq: [
      {
        q: 'What is the maximum JSON size supported?',
        a: 'The tool handles JSON up to several MB in size. Very large files may slow down your browser.',
      },
      {
        q: 'Does it support JSON with comments (JSONC)?',
        a: 'Standard JSON does not allow comments. The validator will flag comments as errors per the JSON spec.',
      },
    ],
    related: ['jwt-decoder', 'base64-encode-decode', 'csv-to-json'],
    isPopular: true,
  },
  {
    slug: 'base64-encode-decode',
    name: 'Base64 Encode / Decode',
    shortDesc: 'Encode or decode Base64 strings instantly',
    longDesc:
      'Convert text or binary data to Base64 encoding and back. Supports standard Base64 and URL-safe Base64. Useful for encoding API payloads, images, and JWT components.',
    category: 'dev',
    keywords: ['base64 encode', 'base64 decode', 'base64 encoder decoder online', 'base64 to text', 'text to base64'],
    howTo: [
      'Enter your text or Base64 string in the input',
      'Click Encode to convert text → Base64',
      'Click Decode to convert Base64 → text',
      'Toggle URL-safe mode for use in URLs and JWT',
    ],
    faq: [
      {
        q: 'What is Base64 used for?',
        a: 'Base64 is used to encode binary data as ASCII text — common in JWT tokens, email attachments, and data URLs.',
      },
      {
        q: 'What is the difference between Base64 and URL-safe Base64?',
        a: 'URL-safe Base64 replaces + with - and / with _ to make it safe for use in URLs and filenames.',
      },
    ],
    related: ['jwt-decoder', 'url-encode-decode', 'hash-generator'],
  },
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    shortDesc: 'Test regular expressions with live matching',
    longDesc:
      'Test and debug regular expressions in real time. See all matches highlighted, capture groups listed, and get a plain-English explanation of your pattern. Supports JavaScript regex syntax.',
    category: 'dev',
    keywords: ['regex tester', 'regular expression tester', 'regex online', 'test regex', 'regex debugger', 'regex checker'],
    howTo: [
      'Enter your regular expression in the pattern field',
      'Set flags (g, i, m) as needed',
      'Paste your test string in the input area',
      'Matches are highlighted in real time',
    ],
    faq: [
      {
        q: 'Which regex flavor does this tool use?',
        a: 'This tool uses JavaScript (ECMAScript) regex syntax, which is compatible with Node.js, browsers, and most modern languages.',
      },
      {
        q: 'What does the global (g) flag do?',
        a: 'The global flag finds all matches in the string. Without it, only the first match is returned.',
      },
    ],
    related: ['json-formatter', 'url-encode-decode', 'hash-generator'],
    isNew: true,
  },
  {
    slug: 'cidr-calculator',
    name: 'CIDR Calculator',
    shortDesc: 'Subnet breakdown, host range & broadcast address',
    longDesc:
      'Calculate subnet details from CIDR notation. Shows network address, broadcast, usable host range, subnet mask, and total host count. Essential for network engineers and cloud infrastructure work.',
    category: 'dev',
    keywords: ['cidr calculator', 'subnet calculator', 'ip subnet calculator', 'cidr notation', 'network calculator', 'subnet mask calculator'],
    howTo: [
      'Enter an IP address with CIDR prefix, e.g. 192.168.1.0/24',
      'View the calculated subnet mask and network address',
      'Check the usable host range and broadcast address',
      'See total number of hosts in the subnet',
    ],
    faq: [
      {
        q: 'What is CIDR notation?',
        a: 'CIDR (Classless Inter-Domain Routing) notation represents an IP address and its associated network mask, e.g. 192.168.1.0/24.',
      },
      {
        q: 'How many hosts can a /24 subnet hold?',
        a: 'A /24 subnet has 256 addresses, with 254 usable hosts (excluding network and broadcast addresses).',
      },
    ],
    related: ['url-encode-decode', 'hash-generator', 'jwt-decoder'],
  },
  {
    slug: 'cron-builder',
    name: 'Cron Expression Builder',
    shortDesc: 'Build cron expressions visually — see next run times',
    longDesc:
      'Build cron job schedules visually without memorizing the syntax. See the next 10 scheduled run times in human-readable format. Supports standard 5-field and extended 6-field cron expressions.',
    category: 'dev',
    keywords: ['cron builder', 'cron expression generator', 'cron job builder', 'cron syntax', 'cron schedule builder', 'crontab generator'],
    howTo: [
      'Use the visual builder to set minute, hour, day, month, and weekday',
      'Or type a cron expression directly in the input',
      'See the human-readable description of your schedule',
      'View the next 10 run times calculated from now',
    ],
    faq: [
      {
        q: 'What does * mean in a cron expression?',
        a: '* means "every" — * in the minute field means every minute, * in the hour field means every hour.',
      },
      {
        q: 'Does this support seconds in cron expressions?',
        a: 'Yes — toggle 6-field mode to add a seconds field at the beginning, used by some frameworks like Spring.',
      },
    ],
    related: ['jwt-decoder', 'unix-timestamp', 'json-formatter'],
    isNew: true,
  },
  {
    slug: 'url-encode-decode',
    name: 'URL Encode / Decode',
    shortDesc: 'Encode special characters for safe URL usage',
    longDesc:
      'Encode strings for safe use in URLs and query parameters. Decode URL-encoded strings back to readable text. Supports full URL encoding and component-level encoding.',
    category: 'dev',
    keywords: ['url encode', 'url decode', 'url encoder decoder', 'percent encoding', 'urlencode online', 'decode url online'],
    howTo: [
      'Enter your string or URL in the input field',
      'Click Encode to percent-encode special characters',
      'Click Decode to convert %XX sequences back to text',
      'Use encodeURIComponent mode for query parameter values',
    ],
    faq: [
      {
        q: 'What is the difference between encodeURI and encodeURIComponent?',
        a: 'encodeURI encodes a full URL, preserving characters like / and ?. encodeURIComponent encodes everything except letters, digits, and - _ . ~.',
      },
    ],
    related: ['base64-encode-decode', 'hash-generator', 'regex-tester'],
  },
  {
    slug: 'pdf-base64',
    name: 'PDF ↔ Base64',
    shortDesc: 'Convert PDF files to Base64 and back',
    longDesc:
      'Convert PDF files to Base64 encoded strings for use in APIs, emails, and data URIs. Also decode Base64 strings back to downloadable PDF files. All processing is 100% client-side — your files never leave your browser.',
    category: 'file',
    keywords: ['pdf to base64', 'base64 to pdf', 'pdf encoder', 'base64 pdf converter', 'pdf data uri'],
    howTo: [
      'Select mode: PDF to Base64 or Base64 to PDF',
      'For PDF to Base64: click Upload PDF and select your file',
      'For Base64 to PDF: paste your Base64 string in the input',
      'Download or copy the result',
    ],
    faq: [
      {
        q: 'Why convert PDF to Base64?',
        a: 'Many APIs and email protocols require binary files to be encoded as Base64 text for safe transmission over text-based protocols.',
      },
      {
        q: 'Is there a file size limit?',
        a: 'The tool handles PDFs up to ~10MB. Larger files may slow down your browser as all processing is done client-side.',
      },
    ],
    related: ['base64-encode-decode', 'json-formatter', 'url-encode-decode'],
  },
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    shortDesc: 'Generate MD5, SHA-256, SHA-512 hashes',
    longDesc:
      'Generate cryptographic hashes from any text input. Supports MD5, SHA-1, SHA-256, SHA-384, and SHA-512. Useful for checksums, password hashing verification, and data integrity checks.',
    category: 'dev',
    keywords: ['hash generator', 'md5 generator', 'sha256 generator', 'sha512 online', 'checksum calculator', 'hash text online'],
    howTo: [
      'Enter the text you want to hash in the input field',
      'Select the hash algorithm (MD5, SHA-256, etc.)',
      'The hash is generated instantly as you type',
      'Click Copy to copy the hash to your clipboard',
    ],
    faq: [
      {
        q: 'Is MD5 still safe to use?',
        a: 'MD5 is considered cryptographically broken and should not be used for security purposes. Use SHA-256 or SHA-512 for secure hashing.',
      },
      {
        q: 'Can I hash a file instead of text?',
        a: 'File hashing support is coming soon. Currently this tool hashes text input only.',
      },
    ],
    related: ['base64-encode-decode', 'jwt-decoder', 'url-encode-decode'],
  },

  // ── Phase 2: Thai tools ────────────────────────────────────────
  {
    slug: 'thai-date-converter',
    name: 'Thai Date Converter',
    shortDesc: 'แปลง พ.ศ. ↔ ค.ศ. ทุกรูปแบบ',
    longDesc:
      'แปลงวันที่ระหว่างปีพุทธศักราช (พ.ศ.) และคริสต์ศักราช (ค.ศ.) รองรับทุกรูปแบบการแสดงผล พร้อมแสดงชื่อวัน เดือน ภาษาไทย และอังกฤษ. Convert Thai Buddhist Era (BE) dates to Christian Era (CE/AD) and back.',
    category: 'thai',
    keywords: ['thai date converter', 'พ.ศ. ค.ศ. แปลง', 'buddhist era converter', 'thai calendar converter', 'be to ce converter'],
    howTo: [
      'เลือกประเภทการแปลง: พ.ศ. → ค.ศ. หรือ ค.ศ. → พ.ศ.',
      'กรอกวันที่ที่ต้องการแปลง',
      'ผลลัพธ์แสดงพร้อมชื่อวันและเดือนภาษาไทย',
      'คัดลอกผลลัพธ์ด้วยปุ่ม copy',
    ],
    faq: [
      {
        q: 'พ.ศ. ต่างจาก ค.ศ. กี่ปี?',
        a: 'ปีพุทธศักราชมากกว่าปีคริสต์ศักราช 543 ปี เช่น พ.ศ. 2567 = ค.ศ. 2024',
      },
      {
        q: 'รองรับการแปลงวันที่ก่อน ค.ศ. 1 ไหม?',
        a: 'รองรับการแปลงตั้งแต่ พ.ศ. 1 (ค.ศ. 544 ก่อนคริสตกาล) เป็นต้นมา',
      },
    ],
    related: ['unix-timestamp', 'cron-builder'],
    isPopular: true,
  },
]

// ── Helpers ─────────────────────────────────────────────────────

export const getTool = (slug: string): Tool | undefined =>
  tools.find(t => t.slug === slug)

export const getRelatedTools = (tool: Tool): Tool[] =>
  tool.related
    .map(slug => getTool(slug))
    .filter((t): t is Tool => t !== undefined)
    .slice(0, 3)

export const toolsByCategory = (cat: ToolCategory): Tool[] =>
  tools.filter(t => t.category === cat)

export const categoryLabel: Record<ToolCategory, string> = {
  dev: 'Dev / IT',
  thai: 'Thai tools',
  file: 'File & convert',
  finance: 'Finance',
}

export const categoryColors: Record<ToolCategory, { bg: string; text: string }> = {
  dev:     { bg: '#eeedfe', text: '#3c3489' },
  thai:    { bg: '#e1f5ee', text: '#085041' },
  file:    { bg: '#faeeda', text: '#633806' },
  finance: { bg: '#faece7', text: '#712b13' },
}
