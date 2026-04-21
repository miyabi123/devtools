export default function TLSVersions() {
  return (
    <>
      <h2>What is TLS?</h2>
      <p>TLS (Transport Layer Security) is the cryptographic protocol that secures communication over the internet. When you see HTTPS in your browser, TLS is providing the encryption and authentication. TLS is the successor to SSL — the term "SSL certificate" is still commonly used but modern certificates use TLS.</p>

      <h2>TLS Version History</h2>
      <table>
        <thead><tr><th>Version</th><th>Released</th><th>Status</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td>SSL 2.0</td><td>1995</td><td>❌ Deprecated</td><td>Never use — multiple critical flaws</td></tr>
          <tr><td>SSL 3.0</td><td>1996</td><td>❌ Deprecated</td><td>POODLE attack (2014)</td></tr>
          <tr><td>TLS 1.0</td><td>1999</td><td>❌ Deprecated</td><td>BEAST, POODLE attacks; disabled by PCI DSS</td></tr>
          <tr><td>TLS 1.1</td><td>2006</td><td>❌ Deprecated</td><td>Deprecated by browsers in 2020</td></tr>
          <tr><td>TLS 1.2</td><td>2008</td><td>✅ Supported</td><td>Current minimum standard</td></tr>
          <tr><td>TLS 1.3</td><td>2018</td><td>✅ Recommended</td><td>Fastest and most secure</td></tr>
        </tbody>
      </table>

      <h2>TLS 1.2 vs TLS 1.3</h2>
      <table>
        <thead><tr><th></th><th>TLS 1.2</th><th>TLS 1.3</th></tr></thead>
        <tbody>
          <tr><td>Handshake round trips</td><td>2 RTT</td><td>1 RTT (0-RTT resumption)</td></tr>
          <tr><td>Cipher suites</td><td>Many (including weak ones)</td><td>Only strong suites</td></tr>
          <tr><td>Forward secrecy</td><td>Optional</td><td>Mandatory</td></tr>
          <tr><td>RSA key exchange</td><td>Supported</td><td>Removed</td></tr>
          <tr><td>Performance</td><td>Good</td><td>Better (~30% faster handshake)</td></tr>
          <tr><td>Security</td><td>Good</td><td>Excellent</td></tr>
        </tbody>
      </table>

      <h2>Check TLS Support with OpenSSL</h2>
      <pre><code>{`# Check TLS 1.3 support
openssl s_client -connect example.com:443 -tls1_3 < /dev/null

# Check TLS 1.2 support
openssl s_client -connect example.com:443 -tls1_2 < /dev/null

# Show full handshake info
echo | openssl s_client -connect example.com:443 2>&1 | grep "Protocol"`}</code></pre>

      <h2>Configure Nginx for TLS 1.2 and 1.3</h2>
      <pre><code>{`server {
  listen 443 ssl;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384;
  ssl_prefer_server_ciphers off;
}`}</code></pre>

      <div className="callout callout-green">
        <p>✓ Recommendation: Support TLS 1.2 and TLS 1.3, disable TLS 1.0 and 1.1. This balances security with broad compatibility. PCI DSS 3.2+ requires disabling TLS 1.0 for cardholder data environments.</p>
      </div>
    </>
  )
}
