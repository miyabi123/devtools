'use client'

export default function OpensslCommandsCheatsheet() {
  return (
    <article className="prose-freeutil">
      <p>A practical OpenSSL command reference for the tasks you run most often — generating keys, creating certificates, inspecting, converting, and testing TLS connections.</p>

      <h2>Generate Keys</h2>
      <pre><code>{`# RSA private key (2048-bit standard, 4096-bit high security)
openssl genrsa -out private.key 2048
openssl genrsa -out private.key 4096

# RSA key with passphrase encryption
openssl genrsa -aes256 -out private.key 4096

# ECDSA key (P-256 — modern, faster than RSA)
openssl ecparam -name prime256v1 -genkey -noout -out ec-private.key

# Extract public key from private key
openssl rsa -in private.key -pubout -out public.key`}</code></pre>

      <h2>Generate CSR (Certificate Signing Request)</h2>
      <pre><code>{`# Generate CSR from existing key
openssl req -new -key private.key -out request.csr

# Generate key + CSR in one command
openssl req -new -newkey rsa:2048 -nodes -keyout private.key -out request.csr

# One-liner with subject (no interactive prompts)
openssl req -new -key private.key -out request.csr \
  -subj "/C=TH/ST=Bangkok/L=Bangkok/O=MyCompany/CN=example.com"

# View CSR contents
openssl req -text -noout -in request.csr`}</code></pre>

      <h2>Self-signed Certificates</h2>
      <pre><code>{`# Self-signed cert (365 days)
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes

# Self-signed with SANs (Subject Alternative Names)
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem \
  -days 365 -nodes \
  -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"

# Sign CSR with your own CA
openssl x509 -req -in request.csr -CA ca.crt -CAkey ca.key \
  -CAcreateserial -out cert.crt -days 365`}</code></pre>

      <h2>Inspect Certificates</h2>
      <pre><code>{`# View certificate details
openssl x509 -in cert.pem -text -noout

# Check expiry dates only
openssl x509 -in cert.pem -noout -dates

# Check Subject Alternative Names
openssl x509 -in cert.pem -noout -ext subjectAltName

# Fingerprint (for verification)
openssl x509 -in cert.pem -noout -fingerprint -sha256

# Check a live server's certificate
openssl s_client -connect example.com:443 -showcerts 2>/dev/null \
  | openssl x509 -text -noout

# Check expiry of a live server
echo | openssl s_client -connect example.com:443 2>/dev/null \
  | openssl x509 -noout -dates`}</code></pre>

      <h2>Convert Formats</h2>
      <pre><code>{`# PEM → DER (binary)
openssl x509 -in cert.pem -outform DER -out cert.der

# DER → PEM
openssl x509 -in cert.der -inform DER -out cert.pem

# PEM → PKCS12/PFX (includes key + cert)
openssl pkcs12 -export -in cert.pem -inkey private.key -out bundle.pfx

# PKCS12/PFX → PEM
openssl pkcs12 -in bundle.pfx -out bundle.pem -nodes

# Extract cert from PKCS12
openssl pkcs12 -in bundle.pfx -nokeys -out cert.pem -nodes`}</code></pre>

      <h2>Verify & Debug</h2>
      <pre><code>{`# Verify private key matches certificate
openssl x509 -noout -modulus -in cert.pem | openssl md5
openssl rsa -noout -modulus -in private.key | openssl md5
# Both outputs must match

# Verify certificate chain
openssl verify -CAfile ca.crt cert.pem

# Test TLS connection
openssl s_client -connect example.com:443
openssl s_client -connect example.com:443 -tls1_2
openssl s_client -connect example.com:443 -tls1_3

# Check supported ciphers
openssl ciphers -v`}</code></pre>

      <h2>Hash & Encrypt</h2>
      <pre><code>{`# Hash a file
openssl dgst -sha256 file.txt
openssl dgst -md5 file.txt

# Encrypt a file (AES-256-CBC)
openssl enc -aes-256-cbc -salt -in file.txt -out file.enc -pbkdf2

# Decrypt
openssl enc -aes-256-cbc -d -in file.enc -out file.txt -pbkdf2

# Base64 encode/decode
openssl base64 -in file.bin -out file.b64
openssl base64 -d -in file.b64 -out file.bin`}</code></pre>
    </article>
  )
}
