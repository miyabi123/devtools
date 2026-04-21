export default function WhatIsCSR() {
  return (
    <>
      <h2>What is a CSR?</h2>
      <p>A Certificate Signing Request (CSR) is a block of encoded text that you submit to a Certificate Authority (CA) when applying for an SSL/TLS certificate. The CSR contains your public key and information about your organization that will be included in the certificate.</p>

      <h2>What a CSR Contains</h2>
      <table>
        <thead><tr><th>Field</th><th>Abbreviation</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td>Common Name</td><td>CN</td><td>example.com or *.example.com</td></tr>
          <tr><td>Organization</td><td>O</td><td>My Company Ltd</td></tr>
          <tr><td>Organizational Unit</td><td>OU</td><td>IT Department</td></tr>
          <tr><td>City/Locality</td><td>L</td><td>Bangkok</td></tr>
          <tr><td>State/Province</td><td>ST</td><td>Bangkok</td></tr>
          <tr><td>Country</td><td>C</td><td>TH</td></tr>
          <tr><td>Email</td><td>E</td><td>admin@example.com</td></tr>
          <tr><td>Public Key</td><td>—</td><td>RSA 2048-bit or EC key</td></tr>
        </tbody>
      </table>

      <h2>The CSR Process</h2>
      <ol>
        <li>Generate a private key and CSR (key never leaves your server)</li>
        <li>Submit the CSR to a Certificate Authority</li>
        <li>CA validates your domain ownership (and organization for OV/EV certs)</li>
        <li>CA signs and returns the SSL certificate</li>
        <li>Install certificate + private key on your web server</li>
      </ol>

      <h2>Generate a CSR with OpenSSL</h2>
      <pre><code>{`# Generate key and CSR together
openssl req -new -newkey rsa:2048 -nodes \\
  -keyout private.key \\
  -out server.csr \\
  -subj "/CN=example.com/O=My Company/C=TH"

# View the CSR contents
openssl req -in server.csr -text -noout`}</code></pre>

      <div className="callout callout-blue">
        <p>💡 The Common Name (CN) must exactly match the domain you want to secure. For wildcard certificates use *.example.com to secure all subdomains. For multi-domain certs, the additional domains go in Subject Alternative Names (SANs), not the CN.</p>
      </div>

      <h2>Free SSL Certificates</h2>
      <p>Let's Encrypt provides free, auto-renewing SSL certificates trusted by all major browsers. Use Certbot to automate the process — it generates the CSR, validates your domain, and installs the certificate automatically.</p>
      <pre><code>{`# Install Certbot and get a certificate for Nginx
certbot --nginx -d example.com -d www.example.com`}</code></pre>
    </>
  )
}
