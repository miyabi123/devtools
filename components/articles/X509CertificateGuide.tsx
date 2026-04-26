'use client'

export default function X509CertificateGuide() {
  return (
    <article className="prose-article">
      <p>
        Every HTTPS connection starts with your browser inspecting the server's SSL/TLS certificate.
        Understanding what's inside that certificate — and how to read it — is essential for
        developers and sysadmins deploying secure services.
      </p>

      <h2>What is an X.509 Certificate?</h2>
      <p>
        An X.509 certificate is a standardized digital document that binds a public key to an
        identity (a domain name, organization, or person). It is signed by a Certificate Authority
        (CA) — a trusted third party that vouches for the identity claim.
      </p>
      <p>
        When your browser connects to <code>https://example.com</code>, the server presents its
        X.509 certificate. Your browser checks: Does this certificate say it belongs to
        example.com? Is it signed by a CA I trust? Has it expired? If all three pass, the
        connection proceeds.
      </p>

      <h2>Certificate Structure</h2>
      <p>
        An X.509 certificate contains several fields. Here's what each one means:
      </p>

      <h3>Subject</h3>
      <p>
        Identifies who the certificate was issued to. For a website, this is the domain owner:
      </p>
      <pre><code>{`Subject:
  CN = example.com              ← Common Name (domain)
  O  = Example Corp             ← Organization
  OU = IT Department            ← Organizational Unit
  L  = Bangkok                  ← City/Locality
  ST = Bangkok                  ← State/Province
  C  = TH                       ← Country (ISO 2-letter code)`}</code></pre>
      <p>
        For a DV (Domain Validated) certificate, only the CN is verified. For OV (Organization
        Validated) and EV (Extended Validation), the O and other fields are also verified by the CA.
      </p>

      <h3>Issuer</h3>
      <p>
        The CA that signed the certificate. Same DN format as Subject:
      </p>
      <pre><code>{`Issuer:
  CN = R11
  O  = Let's Encrypt
  C  = US`}</code></pre>
      <p>
        For self-signed certificates, the Issuer and Subject are identical — the certificate signed
        itself.
      </p>

      <h3>Validity Period</h3>
      <pre><code>{`Not Before: 2025-01-01 00:00:00 UTC
Not After:  2025-04-01 23:59:59 UTC`}</code></pre>
      <p>
        Certificates have an expiry date. Let's Encrypt certificates expire after 90 days.
        Commercial CA certificates can be valid for up to 1 year (previously 2 years — browsers
        reduced this limit in 2020).
      </p>
      <p>
        A certificate used outside its validity window is rejected by browsers, regardless of the
        signature. Set up auto-renewal (e.g. with <code>certbot</code>) before the expiry date.
      </p>

      <h3>Subject Alternative Names (SANs)</h3>
      <p>
        SANs list all the domain names the certificate is valid for. Modern certificates use SANs
        instead of (or in addition to) the CN for domain validation:
      </p>
      <pre><code>{`Subject Alternative Names:
  DNS: example.com
  DNS: www.example.com
  DNS: api.example.com
  DNS: *.staging.example.com   ← wildcard`}</code></pre>
      <p>
        Wildcard entries (<code>*.example.com</code>) cover all direct subdomains but not
        deeper nesting — <code>*.example.com</code> covers <code>www.example.com</code> but not{' '}
        <code>api.v2.example.com</code>.
      </p>

      <h3>Public Key Info</h3>
      <pre><code>{`Public Key Algorithm: rsaEncryption
RSA Public Key: 2048 bit`}</code></pre>
      <p>
        The certificate's public key is what browsers use to establish the encrypted session.
        Key size matters for security: 2048-bit RSA is current standard; 4096-bit is higher
        security but slower. ECDSA (P-256, P-384) keys are smaller and faster than RSA at
        equivalent security levels.
      </p>

      <h3>Signature Algorithm</h3>
      <pre><code>{`Signature Algorithm: sha256WithRSAEncryption`}</code></pre>
      <p>
        The algorithm the CA used to sign this certificate. <code>sha256WithRSAEncryption</code> is
        standard. Older certificates used <code>sha1WithRSAEncryption</code>, which is now rejected
        by browsers.
      </p>

      <h3>Fingerprints</h3>
      <pre><code>{`SHA-1:   A1:B2:C3:D4:...
SHA-256: 3F:8A:...`}</code></pre>
      <p>
        Fingerprints are hash digests of the entire certificate. They're used to uniquely identify
        a specific certificate (e.g. for certificate pinning). SHA-1 fingerprints are shown for
        legacy compatibility; use SHA-256 for any security purpose.
      </p>

      <h2>Reading a Certificate with OpenSSL</h2>
      <pre><code>{`# Inspect a certificate file
openssl x509 -in certificate.pem -text -noout

# Check a live server's certificate
openssl s_client -connect example.com:443 -showcerts

# Check expiry date only
openssl x509 -in certificate.pem -noout -dates

# Check SANs only
openssl x509 -in certificate.pem -noout -ext subjectAltName

# Get certificate fingerprint
openssl x509 -in certificate.pem -noout -fingerprint -sha256`}</code></pre>

      <h2>Certificate Chain</h2>
      <p>
        A single certificate is rarely trusted on its own. Browsers trust a small set of Root CAs.
        Intermediate certificates chain from the Root CA to the server certificate:
      </p>
      <pre><code>{`Root CA (trusted by browsers)
  └── Intermediate CA (signed by Root)
        └── Server Certificate (signed by Intermediate)`}</code></pre>
      <p>
        When deploying an SSL certificate, always include the full chain — the server certificate
        plus all intermediate certificates. Missing intermediates cause "certificate not trusted"
        errors on some clients even when it works in Chrome (which fetches missing intermediates
        automatically).
      </p>

      <h2>Common Certificate Errors</h2>
      <table>
        <thead>
          <tr>
            <th>Error</th>
            <th>Cause</th>
            <th>Fix</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Certificate expired</td>
            <td>Not After date is in the past</td>
            <td>Renew the certificate</td>
          </tr>
          <tr>
            <td>Certificate not trusted</td>
            <td>Self-signed or missing intermediate</td>
            <td>Use CA-issued cert; include full chain</td>
          </tr>
          <tr>
            <td>Name mismatch</td>
            <td>Domain not in CN or SANs</td>
            <td>Issue cert for correct domain</td>
          </tr>
          <tr>
            <td>Certificate revoked</td>
            <td>CA revoked the certificate (CRL/OCSP)</td>
            <td>Issue a new certificate</td>
          </tr>
          <tr>
            <td>Weak key</td>
            <td>RSA &lt;2048 bit or SHA-1 signature</td>
            <td>Reissue with RSA 2048+ and SHA-256</td>
          </tr>
        </tbody>
      </table>
    </article>
  )
}
