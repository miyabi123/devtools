'use client'

export default function HowToReadSslCertificate() {
  return (
    <article className="prose-freeutil">
      <p>Reading an SSL certificate tells you who it was issued to, when it expires, which domains it covers, and whether it's from a trusted CA. Here's how to inspect certificates from a browser, the command line, and online tools.</p>

      <h2>Check Certificate in Browser</h2>
      <p>Click the padlock icon in the address bar → "Connection is secure" → "Certificate is valid" to view:</p>
      <ul>
        <li><strong>Subject</strong> — the domain or organization the cert is for</li>
        <li><strong>Issuer</strong> — the CA that signed it (Let's Encrypt, DigiCert, etc.)</li>
        <li><strong>Valid from / until</strong> — the validity window</li>
        <li><strong>SANs</strong> — Subject Alternative Names (all domains the cert covers)</li>
      </ul>

      <h2>Check with OpenSSL (Command Line)</h2>
      <pre><code>{`# Check a live server's certificate
openssl s_client -connect example.com:443 -showcerts 2>/dev/null \
  | openssl x509 -text -noout

# Check expiry dates only
echo | openssl s_client -connect example.com:443 2>/dev/null \
  | openssl x509 -noout -dates

# Output:
# notBefore=Jan 15 00:00:00 2025 GMT
# notAfter=Apr 15 23:59:59 2025 GMT

# Check SANs (which domains are covered)
echo | openssl s_client -connect example.com:443 2>/dev/null \
  | openssl x509 -noout -ext subjectAltName

# Check a certificate file
openssl x509 -in cert.pem -text -noout
openssl x509 -in cert.pem -noout -dates
openssl x509 -in cert.pem -noout -fingerprint -sha256`}</code></pre>

      <h2>Reading the Certificate Output</h2>
      <pre><code>{`Certificate:
  Data:
    Version: 3 (0x2)
    Subject: CN = example.com           ← Common Name (primary domain)
    Issuer: CN = R11, O = Let's Encrypt  ← Who signed it

    Validity
      Not Before: Jan 15 00:00:00 2025 GMT  ← Valid from
      Not After : Apr 15 23:59:59 2025 GMT  ← Expires (90 days for Let's Encrypt)

    Subject Public Key Info:
      Public Key Algorithm: id-ecPublicKey  ← ECDSA (modern) or rsaEncryption
      EC Key: 256 bit                        ← Key size

    X509v3 Subject Alternative Name:
      DNS:example.com, DNS:www.example.com  ← All covered domains

    X509v3 Basic Constraints:
      CA:FALSE                               ← Not a CA certificate`}</code></pre>

      <h2>Verify a Certificate Matches Its Private Key</h2>
      <pre><code>{`# Both outputs must be identical — if they match, the key and cert are a pair
openssl x509 -noout -modulus -in cert.pem | openssl md5
openssl rsa -noout -modulus -in private.key | openssl md5

# For ECDSA keys
openssl x509 -noout -pubkey -in cert.pem | openssl md5
openssl ec -pubout -in private.key 2>/dev/null | openssl md5`}</code></pre>

      <h2>Check the Certificate Chain</h2>
      <pre><code>{`# Download and show full chain from live server
openssl s_client -connect example.com:443 -showcerts 2>/dev/null

# Verify chain locally
openssl verify -CAfile /etc/ssl/certs/ca-certificates.crt cert.pem

# Check chain completeness (missing intermediate is a common issue)
openssl s_client -connect example.com:443 2>/dev/null | grep "Verify return code"
# Should be: Verify return code: 0 (ok)
# NOT: 21 (unable to verify the first certificate) — missing intermediate`}</code></pre>

      <h2>Monitor Certificate Expiry</h2>
      <pre><code>{`#!/bin/bash
# Check days until expiry for a domain
DOMAIN="example.com"
EXPIRY=$(echo | openssl s_client -connect $DOMAIN:443 2>/dev/null \
  | openssl x509 -noout -enddate | cut -d= -f2)
EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s)
NOW_EPOCH=$(date +%s)
DAYS=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))
echo "$DOMAIN expires in $DAYS days ($EXPIRY)"

# Automate with cron to alert when < 30 days remain`}</code></pre>
    </article>
  )
}
