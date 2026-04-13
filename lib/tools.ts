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
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    shortDesc: 'Decode & verify JSON Web Tokens',
    longDesc: 'Free online JWT decoder tool to decode and inspect JSON Web Tokens instantly. Paste any JWT token to view the decoded header, payload claims, and expiration time in human-readable format. Shows exactly when a token expires or how long ago it expired. Supports all standard JWT algorithms including HS256, HS384, HS512, RS256, RS512, ES256, and more. All processing runs 100% in your browser — your tokens are never sent to any server, making it completely safe to use with real production tokens.',
    category: 'dev',
    keywords: ['jwt decoder', 'decode jwt online', 'json web token decoder', 'jwt parser', 'verify jwt', 'jwt token inspector', 'jwt debugger', 'decode bearer token'],
    howTo: [
      'Paste your JWT token into the input field',
      'The header and payload are decoded automatically',
      'Check the expiry field shown in human-readable time',
      'Copy the decoded JSON output using the copy button',
    ],
    faq: [
      { q: 'Is it safe to paste my JWT here?', a: 'Yes — all decoding runs entirely in your browser using JavaScript. No data is sent to any server.' },
      { q: 'Can this tool verify the JWT signature?', a: 'Signature verification requires the secret key. This tool decodes and displays the payload claims only.' },
      { q: 'What JWT algorithms are supported?', a: 'This decoder supports all standard JWT algorithms including HS256, HS512, RS256, RS512, ES256, and more.' },
    ],
    related: ['base64-encode-decode', 'json-formatter', 'hash-generator'],
    isPopular: true,
  },
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    shortDesc: 'Format, validate & minify JSON',
    longDesc: 'Free online JSON formatter, validator, and minifier. Instantly beautify and pretty-print messy JSON into clean, readable, indented output with syntax highlighting. Validate JSON syntax and get clear error messages pointing to exactly where your JSON is broken. Minify and compress JSON by removing whitespace for production use. Supports indent sizes of 2 or 4 spaces. Works with large JSON files entirely in your browser — no data is uploaded to any server.',
    category: 'dev',
    keywords: ['json formatter', 'json beautifier', 'format json online', 'json validator', 'json minifier', 'pretty print json', 'json parser online', 'json viewer'],
    howTo: [
      'Paste or type your JSON into the input field',
      'Click Format to beautify with proper indentation',
      'Use Validate to check for syntax errors',
      'Click Minify to compress JSON for production',
    ],
    faq: [
      { q: 'What is the maximum JSON size supported?', a: 'The tool handles JSON up to several MB in size. Very large files may slow down your browser.' },
      { q: 'Does it support JSON with comments (JSONC)?', a: 'Standard JSON does not allow comments. The validator will flag comments as errors per the JSON spec.' },
    ],
    related: ['jwt-decoder', 'base64-encode-decode', 'url-encode-decode'],
    isPopular: true,
  },
  {
    slug: 'base64-encode-decode',
    name: 'Base64 Encode / Decode',
    shortDesc: 'Encode or decode Base64 strings instantly',
    longDesc: 'Free online Base64 encoder and decoder tool. Convert any text or string to Base64 encoding instantly, or decode Base64 strings back to plain text. Supports both standard Base64 and URL-safe Base64 (replacing + with - and / with _). Commonly used for encoding API payloads, JWT token components, email attachments, and data URIs. Swap input and output with one click. All processing is 100% client-side — your data never leaves your browser.',
    category: 'dev',
    keywords: ['base64 encode', 'base64 decode', 'base64 encoder decoder online', 'base64 to text', 'text to base64', 'base64 converter', 'base64 url safe', 'decode base64 string'],
    howTo: [
      'Enter your text or Base64 string in the input',
      'Click Encode to convert text to Base64',
      'Click Decode to convert Base64 back to text',
      'Toggle URL-safe mode for use in URLs and JWT',
    ],
    faq: [
      { q: 'What is Base64 used for?', a: 'Base64 is used to encode binary data as ASCII text — common in JWT tokens, email attachments, and data URLs.' },
      { q: 'What is the difference between Base64 and URL-safe Base64?', a: 'URL-safe Base64 replaces + with - and / with _ to make it safe for use in URLs and filenames.' },
    ],
    related: ['jwt-decoder', 'url-encode-decode', 'hash-generator'],
  },
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    shortDesc: 'Test regular expressions with live matching',
    longDesc: 'Free online regex tester and regular expression editor with real-time match highlighting. Test, debug, and build regular expressions with instant feedback. See all matches highlighted in your test string, view capture groups and named groups, and use replace mode with $1 $2 group references. Includes 25+ preset patterns for common use cases like email, URL, IPv4, Thai ID, phone numbers, dates, hex colors, and more. Supports all JavaScript regex flags: global, case-insensitive, multiline, dotAll.',
    category: 'dev',
    keywords: ['regex tester', 'regular expression tester', 'regex online', 'test regex', 'regex debugger', 'regex checker', 'regex editor', 'regex validator', 'regexp tester'],
    howTo: [
      'Enter your regular expression in the pattern field',
      'Set flags (g, i, m, s) as needed using the toggle buttons',
      'Paste your test string in the input area',
      'Matches are highlighted in real time with match details below',
    ],
    faq: [
      { q: 'Which regex flavor does this tool use?', a: 'This tool uses JavaScript (ECMAScript) regex syntax, compatible with Node.js, browsers, and most modern languages.' },
      { q: 'What does the global (g) flag do?', a: 'The global flag finds all matches in the string. Without it, only the first match is returned.' },
    ],
    related: ['json-formatter', 'url-encode-decode', 'hash-generator'],
    isNew: true,
  },
  {
    slug: 'cidr-calculator',
    name: 'CIDR & Subnet Calculator',
    shortDesc: 'Subnet breakdown, host range & broadcast address',
    longDesc: 'Free online CIDR calculator and subnet calculator for network engineers and IT professionals. Calculate complete subnet details from CIDR notation, IP/subnet mask, or IP address range. Shows network address, broadcast address, first and last usable hosts, subnet mask, wildcard mask, total hosts, and usable hosts. Displays all possible subnets for a given prefix length. Supports binary view for learning subnetting. Accepts 192.168.1.0/24, 255.255.255.0 mask format, or IP ranges like 10.0.0.1 - 10.0.0.62.',
    category: 'dev',
    keywords: ['cidr calculator', 'subnet calculator', 'ip subnet calculator', 'cidr notation', 'network calculator', 'subnet mask calculator', 'cidr to subnet mask', 'ip address calculator', 'subnetting tool'],
    howTo: [
      'Enter an IP address with CIDR prefix (e.g. 192.168.1.0/24)',
      'Or enter IP with subnet mask (e.g. 192.168.1.0/255.255.255.0)',
      'Or enter an IP range (e.g. 10.0.0.1 - 10.0.0.254)',
      'View subnet details, host range, and all possible networks',
    ],
    faq: [
      { q: 'What is CIDR notation?', a: 'CIDR (Classless Inter-Domain Routing) notation represents an IP address and its associated network mask, e.g. 192.168.1.0/24.' },
      { q: 'How many hosts can a /24 subnet hold?', a: 'A /24 subnet has 256 addresses, with 254 usable hosts (excluding network and broadcast addresses).' },
    ],
    related: ['url-encode-decode', 'hash-generator', 'jwt-decoder'],
  },
  {
    slug: 'cron-builder',
    name: 'Cron Expression Builder',
    shortDesc: 'Build cron expressions visually — see next run times',
    longDesc: 'Free online cron expression builder and cron job scheduler. Build and validate cron expressions visually without memorizing the syntax. Use the visual builder to set minute, hour, day, month, and day of week fields, or type expressions directly. See the next 8 scheduled run times calculated instantly from the current time. Choose from 10 common presets like every minute, every hour, every day at midnight, every weekday, and more. Supports standard 5-field cron syntax used by Linux crontab, AWS, and most scheduling systems.',
    category: 'dev',
    keywords: ['cron builder', 'cron expression generator', 'cron job builder', 'cron syntax', 'cron schedule builder', 'crontab generator', 'cron expression tester', 'cron validator'],
    howTo: [
      'Use the visual builder to set minute, hour, day, month, and weekday',
      'Or type a cron expression directly in manual mode',
      'Choose from presets for common schedules',
      'View the next 8 run times calculated from now',
    ],
    faq: [
      { q: 'What does * mean in a cron expression?', a: '* means every — * in the minute field means every minute, * in the hour field means every hour.' },
      { q: 'What is the format of a cron expression?', a: 'A standard cron expression has 5 fields: minute (0-59), hour (0-23), day of month (1-31), month (1-12), day of week (0-6, 0=Sunday).' },
    ],
    related: ['jwt-decoder', 'json-formatter'],
    isNew: true,
  },
  {
    slug: 'url-encode-decode',
    name: 'URL Encode / Decode',
    shortDesc: 'Encode special characters for safe URL usage',
    longDesc: 'Free online URL encoder and decoder tool. Percent-encode special characters in strings to make them safe for use in URLs and query parameters. Decode URL-encoded strings (%XX sequences) back to readable text. Supports both encodeURIComponent (for query parameter values) and encodeURI (for full URLs). Handles Thai characters, spaces, special symbols, and Unicode. Swap input and output with one click. Commonly used by web developers working with APIs, query strings, and HTTP requests.',
    category: 'dev',
    keywords: ['url encode', 'url decode', 'url encoder decoder', 'percent encoding', 'urlencode online', 'decode url online', 'url percent encode', 'encode url parameters'],
    howTo: [
      'Enter your string or URL in the input field',
      'Click Encode to percent-encode special characters',
      'Click Decode to convert %XX sequences back to text',
      'Choose encodeURIComponent for query values or encodeURI for full URLs',
    ],
    faq: [
      { q: 'What is the difference between encodeURI and encodeURIComponent?', a: 'encodeURI encodes a full URL, preserving characters like / and ?. encodeURIComponent encodes everything except letters, digits, and - _ . ~.' },
      { q: 'Why do spaces become %20?', a: 'Spaces are not allowed in URLs. %20 is the percent-encoded representation of a space character (ASCII code 32).' },
    ],
    related: ['base64-encode-decode', 'hash-generator', 'regex-tester'],
  },
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    shortDesc: 'Generate MD5, SHA-256, SHA-512 hashes',
    longDesc: 'Free online cryptographic hash generator supporting MD5, SHA-1, SHA-256, SHA-384, and SHA-512 algorithms. Generate all hashes simultaneously from a single text input for easy comparison. Toggle between lowercase and uppercase output. Useful for verifying file checksums, checking data integrity, generating password hashes for testing, and learning about cryptographic hash functions. All hashing runs locally in your browser using the Web Crypto API — no data is uploaded to any server.',
    category: 'dev',
    keywords: ['hash generator', 'md5 generator', 'sha256 generator', 'sha512 online', 'checksum calculator', 'hash text online', 'sha1 hash generator', 'sha384 generator', 'crypto hash online'],
    howTo: [
      'Enter the text you want to hash in the input field',
      'All hash algorithms generate results instantly as you type',
      'Toggle UPPERCASE for uppercase hex output',
      'Click Copy next to any algorithm to copy that hash',
    ],
    faq: [
      { q: 'Is MD5 still safe to use?', a: 'MD5 is considered cryptographically broken and should not be used for security purposes. Use SHA-256 or SHA-512 for secure hashing.' },
      { q: 'What is the difference between SHA-256 and SHA-512?', a: 'SHA-512 produces a longer 512-bit hash and is slightly more secure, but SHA-256 is sufficient for most applications and is faster on 32-bit systems.' },
    ],
    related: ['base64-encode-decode', 'jwt-decoder', 'url-encode-decode'],
  },
  {
    slug: 'unix-timestamp',
    name: 'Unix Timestamp Converter',
    shortDesc: 'Convert Unix timestamps to human-readable dates',
    longDesc: 'Free online Unix timestamp converter. Convert Unix epoch timestamps to human-readable dates and times, or convert any date back to a Unix timestamp. Shows current timestamp in real-time. Supports seconds, milliseconds, and microseconds. Essential tool for developers working with APIs, databases, and log files. All processing is 100% client-side.',
    category: 'dev',
    keywords: ['unix timestamp', 'epoch converter', 'timestamp to date', 'date to timestamp', 'epoch time converter', 'unix time converter', 'seconds to date'],
    howTo: [
      'View the current Unix timestamp updating in real-time',
      'Paste any Unix timestamp to convert to human-readable date',
      'Or pick a date and time to convert to Unix timestamp',
      'Toggle between seconds, milliseconds, and microseconds',
    ],
    faq: [
      { q: 'What is a Unix timestamp?', a: 'A Unix timestamp is the number of seconds elapsed since January 1, 1970 00:00:00 UTC (the Unix epoch). It is widely used in programming and databases.' },
      { q: 'What is the difference between seconds and milliseconds timestamp?', a: 'Unix timestamps are usually in seconds (10 digits). JavaScript uses milliseconds (13 digits). Divide by 1000 to convert milliseconds to seconds.' },
    ],
    related: ['cron-builder', 'thai-date-converter', 'json-formatter'],
    isNew: true,
  },
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    shortDesc: 'Generate UUID v1, v4, and v5 instantly',
    longDesc: 'Free online UUID generator supporting UUID v1 (time-based), v4 (random), and v5 (namespace-based). Generate single or bulk UUIDs instantly. All generation runs 100% in your browser using the Web Crypto API — no data is sent to any server. Essential for developers needing unique identifiers for databases, APIs, and distributed systems.',
    category: 'dev',
    keywords: ['uuid generator', 'uuid v4 generator', 'random uuid', 'guid generator', 'unique id generator', 'uuid online', 'bulk uuid generator'],
    howTo: [
      'Select UUID version: v1 (time-based), v4 (random), or v5 (namespace)',
      'Set the quantity of UUIDs to generate (1-100)',
      'Click Generate or use auto-generate mode',
      'Copy a single UUID or all UUIDs at once',
    ],
    faq: [
      { q: 'What is the difference between UUID v1 and v4?', a: 'UUID v1 is time-based and includes the MAC address, making it sortable but less private. UUID v4 is completely random and is the most commonly used version.' },
      { q: 'Is UUID truly unique?', a: 'UUID v4 has 122 random bits, making collisions astronomically unlikely. The probability of generating a duplicate is negligible for all practical purposes.' },
    ],
    related: ['hash-generator', 'unix-timestamp', 'jwt-decoder'],
    isNew: true,
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    shortDesc: 'Generate secure random passwords instantly',
    longDesc: 'Free online secure password generator. Create strong, random passwords with custom length and character sets including uppercase, lowercase, numbers, and symbols. Generate multiple passwords at once. Measure password strength in real-time. All generation uses the Web Crypto API in your browser — passwords are never sent to any server.',
    category: 'dev',
    keywords: ['password generator', 'random password generator', 'secure password generator', 'strong password generator', 'password creator online', 'generate password'],
    howTo: [
      'Set the desired password length using the slider',
      'Choose character types: uppercase, lowercase, numbers, symbols',
      'Click Generate or use auto-generate mode',
      'Copy your password with one click',
    ],
    faq: [
      { q: 'How secure are the generated passwords?', a: 'Passwords are generated using the Web Crypto API (crypto.getRandomValues) which provides cryptographically secure randomness. No passwords are stored or transmitted.' },
      { q: 'What makes a strong password?', a: 'A strong password is at least 12 characters long and includes a mix of uppercase, lowercase, numbers, and symbols. Avoid dictionary words and personal information.' },
    ],
    related: ['hash-generator', 'uuid-generator', 'base64-encode-decode'],
    isNew: true,
  },
  {
    slug: 'json-to-csv',
    name: 'JSON ↔ CSV Converter',
    shortDesc: 'Convert JSON to CSV and CSV to JSON instantly',
    longDesc: 'Free online JSON to CSV and CSV to JSON converter. Convert JSON arrays to CSV spreadsheet format for Excel and Google Sheets. Convert CSV files back to JSON arrays for use in APIs and applications. Supports nested objects, custom delimiters, and header row options. All conversion runs 100% client-side — your data never leaves your browser.',
    category: 'dev',
    keywords: ['json to csv', 'csv to json', 'json csv converter', 'convert json to csv online', 'csv json online', 'json array to csv'],
    howTo: [
      'Select mode: JSON to CSV or CSV to JSON',
      'Paste your JSON array or CSV data into the input',
      'The conversion happens automatically',
      'Download or copy the converted output',
    ],
    faq: [
      { q: 'What JSON format is supported?', a: 'The tool supports JSON arrays of objects, e.g. [{"name":"John","age":30}]. Each object becomes a row in the CSV.' },
      { q: 'Can I use a custom delimiter?', a: 'Yes — you can choose comma, semicolon, tab, or pipe as the delimiter.' },
    ],
    related: ['json-formatter', 'base64-encode-decode', 'url-encode-decode'],
    isNew: true,
  },
  {
    slug: 'json-to-yaml',
    name: 'JSON ↔ YAML Converter',
    shortDesc: 'Convert JSON to YAML and YAML to JSON instantly',
    longDesc: 'Free online JSON to YAML and YAML to JSON converter. Convert JSON configuration files to human-readable YAML format, or convert YAML back to JSON for APIs and applications. Supports nested objects, arrays, and all standard YAML types. All conversion runs 100% client-side — your data never leaves your browser.',
    category: 'dev',
    keywords: ['json to yaml', 'yaml to json', 'json yaml converter', 'convert json to yaml online', 'yaml json online', 'yaml converter'],
    howTo: [
      'Select mode: JSON to YAML or YAML to JSON',
      'Paste your JSON or YAML data into the input',
      'The conversion happens automatically in real-time',
      'Copy or download the converted output',
    ],
    faq: [
      { q: 'What is YAML?', a: 'YAML (YAML Ain\'t Markup Language) is a human-readable data serialization format commonly used for configuration files in DevOps, Kubernetes, Docker, and CI/CD pipelines.' },
      { q: 'Is YAML a superset of JSON?', a: 'Yes — valid JSON is also valid YAML. YAML is more human-friendly with support for comments, multi-line strings, and less punctuation.' },
    ],
    related: ['json-formatter', 'json-to-csv', 'base64-encode-decode'],
    isNew: true,
  },
  {
    slug: 'color-converter',
    name: 'Color Converter',
    shortDesc: 'Convert colors between HEX, RGB, HSL, and HSV',
    longDesc: 'Free online color converter. Convert colors between HEX, RGB, HSL, and HSV formats instantly. Pick colors with a visual color picker, see live preview, and copy values in any format. Essential tool for web developers, designers, and UI/UX professionals. All conversion runs 100% client-side.',
    category: 'dev',
    keywords: ['color converter', 'hex to rgb', 'rgb to hex', 'hex to hsl', 'color picker online', 'css color converter', 'rgba converter', 'hsl color converter'],
    howTo: [
      'Enter a color value in any format — HEX, RGB, or HSL',
      'Or use the color picker to visually select a color',
      'All formats update instantly',
      'Click copy on any format to copy to clipboard',
    ],
    faq: [
      { q: 'What is the difference between HEX and RGB?', a: 'HEX is a 6-digit hexadecimal representation of RGB values (e.g. #ff5733). RGB uses three numbers from 0-255 for red, green, and blue channels.' },
      { q: 'What is HSL?', a: 'HSL stands for Hue, Saturation, Lightness. It is more intuitive than RGB for humans — hue is the color angle (0-360°), saturation is color intensity (0-100%), and lightness is brightness (0-100%).' },
    ],
    related: ['hash-generator', 'image-compressor', 'favicon-generator'],
    isNew: true,
  },
  {
    slug: 'word-counter',
    name: 'Word Counter',
    shortDesc: 'Count words, characters, sentences and reading time',
    longDesc: 'Free online word counter tool. Count words, characters (with and without spaces), sentences, paragraphs, and estimated reading time instantly as you type. Perfect for writers, students, bloggers, and SEO professionals checking content length. Works with any language including Thai. All processing runs 100% client-side — your text never leaves your browser.',
    category: 'dev',
    keywords: ['word counter', 'character counter', 'word count online', 'count words', 'word counter tool', 'character count', 'text analyzer', 'reading time calculator', 'word counter free'],
    howTo: [
      'Paste or type your text into the input area',
      'Word count, character count, and other stats update instantly',
      'See estimated reading time based on average reading speed',
      'Use the clear button to reset and start over',
    ],
    faq: [
      { q: 'Does it support Thai text?', a: 'Yes — the character counter works with Thai and all Unicode languages. Word counting uses spaces as separators.' },
      { q: 'What is the reading time based on?', a: 'Reading time is calculated at 200 words per minute, which is the average adult reading speed.' },
      { q: 'Is there a character limit?', a: 'No limit — the tool handles large texts. All processing is done in your browser.' },
    ],
    related: ['thai-number-to-text', 'json-formatter', 'url-encode-decode'],
    isNew: true,
  },
  {
    slug: 'pdf-base64',
    name: 'PDF ↔ Base64',
    shortDesc: 'Convert PDF files to Base64 and back',
    longDesc: 'Free online tool to convert PDF files to Base64 encoded strings and decode Base64 strings back to downloadable PDF files. Drag and drop or click to upload a PDF file and instantly get its Base64 representation for use in APIs, email systems, and data URIs. Also converts Base64 strings back to PDF files you can open directly in your browser. Commonly used by developers working with REST APIs that accept PDF as Base64, email attachments, and document management systems. All conversion happens 100% client-side.',
    category: 'file',
    keywords: ['pdf to base64', 'base64 to pdf', 'pdf encoder', 'base64 pdf converter', 'pdf data uri', 'convert pdf base64 online', 'pdf base64 encoder decoder'],
    howTo: [
      'Select mode: PDF to Base64 or Base64 to PDF',
      'For PDF to Base64: drag and drop or click to upload your PDF file',
      'For Base64 to PDF: paste your Base64 string and click Open PDF',
      'Copy the Base64 output or download the decoded PDF',
    ],
    faq: [
      { q: 'Why convert PDF to Base64?', a: 'Many APIs and email protocols require binary files to be encoded as Base64 text for safe transmission over text-based protocols.' },
      { q: 'Is there a file size limit?', a: 'The tool handles PDFs up to ~10MB. Larger files may slow down your browser as all processing is done client-side.' },
    ],
    related: ['base64-encode-decode', 'json-formatter', 'url-encode-decode'],
  },
  {
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    shortDesc: 'Generate QR codes for URLs, text, and more',
    longDesc: 'Free online QR code generator. Create QR codes instantly for URLs, plain text, email addresses, phone numbers, WiFi credentials, and more. Customize size and error correction level. Download as PNG. All generation runs 100% client-side — your data never leaves your browser.',
    category: 'file',
    keywords: ['qr code generator', 'qr code maker', 'create qr code', 'free qr code generator', 'qr code online', 'generate qr code url'],
    howTo: [
      'Select input type: URL, Text, Email, Phone, or WiFi',
      'Enter your content in the input field',
      'QR code generates instantly',
      'Download as PNG or copy to clipboard',
    ],
    faq: [
      { q: 'What types of content can I encode?', a: 'You can encode URLs, plain text, email addresses, phone numbers, SMS, and WiFi credentials.' },
      { q: 'What is error correction level?', a: 'Error correction allows QR codes to be read even if partially damaged. Higher levels (Q, H) are more robust but create denser codes.' },
    ],
    related: ['base64-encode-decode', 'url-encode-decode', 'hash-generator'],
    isNew: true,
  },
  {
    slug: 'image-resize',
    name: 'Image Resize',
    shortDesc: 'Resize images online — maintain aspect ratio',
    longDesc: 'Free online image resizer. Resize JPG, PNG, WebP, and GIF images by pixel dimensions or percentage. Maintain aspect ratio automatically or set custom width and height. Preview before download. All processing runs 100% client-side using Canvas API — your images never leave your browser.',
    category: 'file',
    keywords: ['image resize', 'resize image online', 'image resizer', 'resize jpg online', 'resize png online', 'image size reducer', 'compress image dimensions'],
    howTo: [
      'Upload your image by dragging and dropping or clicking to browse',
      'Set the target width and height in pixels or percentage',
      'Toggle aspect ratio lock to maintain proportions',
      'Preview the result and download as JPG, PNG, or WebP',
    ],
    faq: [
      { q: 'What image formats are supported?', a: 'The tool supports JPG, PNG, WebP, GIF, and BMP files as input. You can download the output as JPG, PNG, or WebP.' },
      { q: 'Is there a file size limit?', a: 'The tool handles images up to ~20MB. Very large images may be slow as all processing is done client-side in your browser.' },
    ],
    related: ['pdf-base64', 'qr-code-generator', 'base64-encode-decode'],
    isNew: true,
  },
  {
    slug: 'favicon-generator',
    name: 'Favicon Generator',
    shortDesc: 'Generate favicon from any image — .ico, PNG, SVG',
    longDesc: 'Free online favicon generator. Upload any image and instantly generate favicon files in all required sizes: 16×16, 32×32, 48×48, 64×64, 128×128, and 192×192 pixels. Download as .ico file or individual PNG files. Perfect for websites, web apps, and PWA icons. All processing runs 100% client-side — your images never leave your browser.',
    category: 'file',
    keywords: ['favicon generator', 'favicon maker', 'create favicon', 'ico generator', 'favicon from image', 'website icon generator', 'favicon online'],
    howTo: [
      'Upload your image (PNG, JPG, SVG recommended)',
      'Preview all favicon sizes instantly',
      'Download individual PNG sizes or all as a ZIP',
      'Place favicon.ico in your website root directory',
    ],
    faq: [
      { q: 'What image format should I use?', a: 'PNG with transparent background works best. Square images (1:1 ratio) give the best results. Minimum 512×512px recommended.' },
      { q: 'Which favicon sizes do I need?', a: 'The essential sizes are 16×16 (browser tab), 32×32 (taskbar), 180×180 (Apple touch icon), and 192×192 (Android/PWA). This tool generates all of them.' },
    ],
    related: ['image-resize', 'qr-code-generator', 'base64-encode-decode'],
    isNew: true,
  },
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    shortDesc: 'Compress JPG, PNG, WebP without losing quality',
    longDesc: 'Free online image compressor. Reduce image file size without visible quality loss. Compress JPG, PNG, WebP, and GIF files instantly. Compare before and after with a live preview. Batch compress multiple images at once. All compression runs 100% client-side using Canvas API — your images never leave your browser.',
    category: 'file',
    keywords: ['image compressor', 'compress image online', 'reduce image size', 'image size reducer', 'compress jpg online', 'compress png online', 'image optimizer', 'compress image without losing quality'],
    howTo: [
      'Upload one or multiple images by dragging and dropping',
      'Adjust quality slider to control compression level',
      'Compare original vs compressed size instantly',
      'Download compressed images individually or all at once',
    ],
    faq: [
      { q: 'Does compression reduce image quality?', a: 'The tool uses smart compression that minimizes visible quality loss. At 80% quality setting, most images look identical to the original but are significantly smaller.' },
      { q: 'What formats are supported?', a: 'JPG, PNG, WebP, and GIF are supported as input. Output can be JPG, PNG, or WebP format.' },
    ],
    related: ['image-resize', 'favicon-generator', 'pdf-base64'],
    isPopular: true,
  },

  // ── Phase 2: Thai tools ────────────────────────────────────────
  {
    slug: 'thai-date-converter',
    name: 'Thai Date Converter',
    shortDesc: 'แปลง พ.ศ. ↔ ค.ศ. ทุกรูปแบบ',
    longDesc: 'เครื่องมือแปลงวันที่ระหว่างปีพุทธศักราช (พ.ศ.) และคริสต์ศักราช (ค.ศ./AD) ฟรี ออนไลน์ รองรับทุกรูปแบบวันที่ทั้งไทยและอังกฤษ แสดงชื่อวันในสัปดาห์ทั้งภาษาไทยและอังกฤษ คำนวณแม่นยำด้วยสูตร พ.ศ. = ค.ศ. + 543 มี 7 รูปแบบวันที่ให้คัดลอก ได้แก่ วันที่แบบยาวภาษาไทย แบบย่อ ตัวเลข ISO 8601 และอื่นๆ — Free Thai Buddhist Era (BE) to Christian Era (CE/AD) date converter supporting all date formats.',
    category: 'thai',
    keywords: ['thai date converter', 'พ.ศ. ค.ศ. แปลง', 'buddhist era converter', 'thai calendar converter', 'be to ce converter', 'แปลงปี พ.ศ. เป็น ค.ศ.', 'thai year converter', 'พุทธศักราช คริสต์ศักราช'],
    howTo: [
      'เลือกประเภทการแปลง: พ.ศ. → ค.ศ. หรือ ค.ศ. → พ.ศ.',
      'กรอกวันที่ เดือน และปีที่ต้องการแปลง หรือกด "วันนี้"',
      'ผลลัพธ์แสดงพร้อมชื่อวันและเดือนภาษาไทยและอังกฤษ',
      'คัดลอกรูปแบบวันที่ที่ต้องการด้วยปุ่ม copy',
    ],
    faq: [
      { q: 'พ.ศ. ต่างจาก ค.ศ. กี่ปี?', a: 'ปีพุทธศักราชมากกว่าปีคริสต์ศักราช 543 ปี เช่น พ.ศ. 2567 = ค.ศ. 2024' },
      { q: 'รองรับการแปลงวันที่ก่อน ค.ศ. 1 ไหม?', a: 'รองรับการแปลงตั้งแต่ พ.ศ. 1 (ค.ศ. 544 ก่อนคริสตกาล) เป็นต้นมา' },
      { q: 'Why is Thai year 543 years ahead of the Western year?', a: 'The Thai Buddhist Era counts from the year of the Buddha\'s passing (Parinirvana), which occurred 543 years before the Christian Era began.' },
    ],
    related: ['cron-builder', 'hash-generator'],
    isPopular: true,
  },
  {
    slug: 'thai-number-to-text',
    name: 'แปลงตัวเลขเป็นคำอ่านภาษาไทย',
    shortDesc: 'แปลงตัวเลขเป็นคำอ่านภาษาไทย และจำนวนเงินบาท',
    longDesc: 'เครื่องมือแปลงตัวเลขเป็นคำอ่านภาษาไทยฟรี ออนไลน์ รองรับทั้งตัวเลขทั่วไปและจำนวนเงินบาท เช่น 1234 → หนึ่งพันสองร้อยสามสิบสี่ และ 1500.50 → หนึ่งพันห้าร้อยบาทห้าสิบสตางค์ เหมาะสำหรับการเขียนเช็ค เอกสารทางกฎหมาย และงานบัญชี ประมวลผลทั้งหมดในเบราว์เซอร์ — Thai number to text converter supporting both general numbers and Thai Baht currency format.',
    category: 'thai',
    keywords: [
      'แปลงตัวเลขเป็นคำอ่านภาษาไทย', 'ตัวเลขเป็นตัวหนังสือ', 'แปลงเลขเป็นคำ',
      'จำนวนเงินเป็นตัวอักษร', 'เขียนเช็คภาษาไทย', 'thai number to text',
      'baht to words', 'แปลงเงินเป็นตัวหนังสือ', 'ตัวเลขภาษาไทย'
    ],
    howTo: [
      'กรอกตัวเลขที่ต้องการแปลงในช่องป้อนข้อมูล',
      'เลือกโหมด: ตัวเลขทั่วไป หรือ จำนวนเงินบาท',
      'ผลลัพธ์แสดงทันทีพร้อมคัดลอก',
      'สามารถแปลงได้ทั้งเลขจำนวนเต็มและทศนิยม',
    ],
    faq: [
      { q: 'รองรับตัวเลขสูงสุดเท่าไหร่?', a: 'รองรับตัวเลขสูงสุดถึง 999,999,999,999 (เก้าร้อยเก้าสิบเก้าพันล้าน) ครับ' },
      { q: 'ใช้สำหรับเขียนเช็คได้ไหม?', a: 'ได้ครับ เลือกโหมด "จำนวนเงินบาท" จะได้รูปแบบที่ถูกต้องตามมาตรฐานการเขียนเช็คและเอกสารทางกฎหมายไทย' },
      { q: 'รองรับทศนิยม (สตางค์) ไหม?', a: 'รองรับครับ ในโหมดจำนวนเงิน ทศนิยม 2 ตำแหน่งจะแปลงเป็นสตางค์โดยอัตโนมัติ เช่น 10.50 = สิบบาทห้าสิบสตางค์' },
    ],
    related: ['thai-date-converter', 'thai-vat-calculator', 'thai-id-validator'],
    isNew: true,
  },
  {
    slug: 'thai-baht-to-words',
    name: 'จำนวนเงินบาทเป็นตัวอักษร',
    shortDesc: 'แปลงจำนวนเงินบาทเป็นตัวอักษรภาษาไทย สำหรับเขียนเช็ค',
    longDesc: 'แปลงจำนวนเงินบาทเป็นตัวอักษรภาษาไทยฟรี ออนไลน์ เหมาะสำหรับเขียนเช็ค ใบสำคัญจ่าย สัญญาซื้อขาย และเอกสารทางกฎหมาย รองรับสตางค์ เช่น 1,500.50 บาท → หนึ่งพันห้าร้อยบาทห้าสิบสตางค์ — Thai Baht amount to words converter for cheque writing.',
    category: 'thai',
    keywords: [
      'จำนวนเงินเป็นตัวอักษร', 'เขียนเช็คภาษาไทย', 'แปลงเงินเป็นตัวหนังสือ',
      'บาทเป็นตัวอักษร', 'thai baht to words', 'cheque writing thai',
      'ใบสำคัญจ่าย', 'สัญญาซื้อขาย', 'จำนวนเงินภาษาไทย'
    ],
    howTo: [
      'กรอกจำนวนเงินที่ต้องการแปลง เช่น 1500.50',
      'ระบบแปลงเป็นตัวอักษรทันที',
      'คัดลอกผลลัพธ์ไปใช้ในเอกสาร',
      'รองรับทศนิยม 2 ตำแหน่งสำหรับสตางค์',
    ],
    faq: [
      { q: 'ใช้สำหรับเขียนเช็คได้ไหม?', a: 'ได้ครับ ผลลัพธ์เป็นรูปแบบมาตรฐานที่ธนาคารและเอกสารทางกฎหมายไทยยอมรับ' },
      { q: 'รองรับสตางค์ไหม?', a: 'รองรับครับ ใส่ทศนิยม 2 ตำแหน่ง เช่น 100.75 จะได้ หนึ่งร้อยบาทเจ็ดสิบห้าสตางค์' },
      { q: 'รองรับตัวเลขสูงสุดเท่าไหร่?', a: 'รองรับสูงสุด 999,999,999,999.99 บาท (เก้าร้อยเก้าสิบเก้าพันล้านบาท)' },
    ],
    related: ['thai-number-to-text', 'thai-date-converter', 'thai-vat-calculator'],
    isNew: true,
  },
  {
    slug: 'thai-tax-calculator',
    name: 'คำนวณภาษีเงินได้บุคคลธรรมดา 2568',
    shortDesc: 'คำนวณภาษีเงินได้บุคคลธรรมดา พร้อมค่าลดหย่อนปี 2568',
    longDesc: 'เครื่องมือคำนวณภาษีเงินได้บุคคลธรรมดาปี 2568 ฟรี ออนไลน์ รองรับค่าลดหย่อนล่าสุดจากกรมสรรพากร ทั้งค่าลดหย่อนส่วนตัว คู่สมรส บุตร บิดามารดา ประกันชีวิต ประกันสังคม RMF SSF กองทุน Thai ESG และ Easy E-Receipt 2568 คำนวณแบบขั้นบันได แสดงผลทันที ประมวลผลทั้งหมดในเบราว์เซอร์ — Thai personal income tax calculator 2025 with all deductions.',
    category: 'thai',
    keywords: [
      'คำนวณภาษีเงินได้บุคคลธรรมดา', 'ภาษีเงินได้ 2568', 'คำนวณภาษี 2568',
      'ลดหย่อนภาษี 2568', 'thai tax calculator', 'income tax thailand 2025',
      'ภาษีบุคคลธรรมดา', 'คำนวณภาษีออนไลน์', 'เสียภาษีเท่าไหร่'
    ],
    howTo: [
      'กรอกรายได้ต่อปีและประเภทเงินได้ (เงินเดือน, ฟรีแลนซ์, อื่นๆ)',
      'เลือกค่าลดหย่อนที่มีสิทธิ เช่น ส่วนตัว คู่สมรส บุตร บิดามารดา',
      'กรอกค่าลดหย่อนกลุ่มประกันและการลงทุน เช่น ประกันชีวิต RMF SSF',
      'ระบบคำนวณภาษีแบบขั้นบันไดและแสดงผลทันที',
    ],
    faq: [
      { q: 'ใช้ข้อมูลค่าลดหย่อนปีไหน?', a: 'ใช้ข้อมูลค่าลดหย่อนปีภาษี 2568 (ยื่นภาษีปี 2569) ล่าสุดจากกรมสรรพากร' },
      { q: 'รองรับเงินได้ประเภทไหนบ้าง?', a: 'รองรับเงินได้มาตรา 40(1) เงินเดือน และ 40(2) ค่าจ้างฟรีแลนซ์ เป็นหลัก' },
      { q: 'ผลลัพธ์แม่นยำแค่ไหน?', a: 'คำนวณตามหลักเกณฑ์กรมสรรพากรปี 2568 แต่เพื่อความถูกต้องสูงสุด ควรปรึกษาผู้เชี่ยวชาญด้านภาษีครับ' },
    ],
    related: ['thai-vat-calculator', 'thai-number-to-text', 'thai-date-converter'],
    isNew: true,
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
