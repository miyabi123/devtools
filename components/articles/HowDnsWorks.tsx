'use client'

export default function HowDnsWorks() {
  return (
    <article className="prose-freeutil">
      <p>Every time you type a domain name in your browser, DNS translates it into an IP address. This happens in milliseconds and involves multiple servers — here's exactly how it works.</p>

      <h2>The DNS Resolution Chain</h2>
      <p>When you visit <code>example.com</code>:</p>
      <ol>
        <li><strong>Browser cache</strong> — checks if it already knows the IP from a recent visit</li>
        <li><strong>OS cache</strong> — checks the local <code>/etc/hosts</code> file and system DNS cache</li>
        <li><strong>Recursive resolver</strong> — your ISP's or configured DNS server (e.g. 8.8.8.8)</li>
        <li><strong>Root nameserver</strong> — knows where to find <code>.com</code> nameservers</li>
        <li><strong>TLD nameserver</strong> — knows where to find <code>example.com</code>'s nameservers</li>
        <li><strong>Authoritative nameserver</strong> — has the actual IP for <code>example.com</code></li>
      </ol>
      <pre><code>{`You → Resolver → Root NS → .com NS → example.com NS → IP: 93.184.216.34
                 (13 roots)   (TLD)     (authoritative)

Total time: ~30-100ms for a cold lookup
Cached:     ~1ms`}</code></pre>

      <h2>DNS Record Types</h2>
      <table>
        <thead><tr><th>Type</th><th>Purpose</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td><strong>A</strong></td><td>Domain → IPv4 address</td><td><code>example.com → 93.184.216.34</code></td></tr>
          <tr><td><strong>AAAA</strong></td><td>Domain → IPv6 address</td><td><code>example.com → 2606:2800:220:1:248...</code></td></tr>
          <tr><td><strong>CNAME</strong></td><td>Alias to another domain</td><td><code>www.example.com → example.com</code></td></tr>
          <tr><td><strong>MX</strong></td><td>Mail server for domain</td><td><code>example.com → mail.example.com (priority 10)</code></td></tr>
          <tr><td><strong>TXT</strong></td><td>Text data (SPF, DKIM, verification)</td><td><code>v=spf1 include:_spf.google.com ~all</code></td></tr>
          <tr><td><strong>NS</strong></td><td>Authoritative nameservers</td><td><code>ns1.cloudflare.com</code></td></tr>
          <tr><td><strong>SOA</strong></td><td>Zone authority info</td><td>Serial, refresh, retry times</td></tr>
          <tr><td><strong>PTR</strong></td><td>Reverse DNS (IP → domain)</td><td><code>34.216.184.93.in-addr.arpa → example.com</code></td></tr>
        </tbody>
      </table>

      <h2>TTL — Time to Live</h2>
      <p>Every DNS record has a TTL (in seconds) — how long resolvers cache the answer. A TTL of 3600 means the record is cached for 1 hour before re-checking.</p>
      <p>Lower TTL = faster DNS changes propagate (useful before migrations). Higher TTL = faster resolution for users (fewer lookups needed). Lower TTL = more load on nameservers.</p>

      <h2>Looking Up DNS Records</h2>
      <pre><code>{`# dig — detailed DNS lookup
dig example.com                  # Default (A record)
dig example.com A                # IPv4 address
dig example.com MX               # Mail servers
dig example.com TXT              # TXT records
dig example.com NS               # Nameservers
dig @8.8.8.8 example.com        # Use Google's DNS

# nslookup
nslookup example.com
nslookup -type=MX example.com

# Check what your system resolves
getent hosts example.com`}</code></pre>

      <h2>Common DNS Issues</h2>
      <ul>
        <li><strong>Propagation delay</strong> — after changing DNS, old records may be cached for up to TTL seconds worldwide. This is normal, not a mistake.</li>
        <li><strong>CNAME at root</strong> — you can't use a CNAME for your root domain (<code>example.com</code>) with standard DNS. Use CNAME flattening (Cloudflare) or an A record instead.</li>
        <li><strong>Missing MX records</strong> — if email isn't working, verify MX records point to your mail provider.</li>
        <li><strong>SPF/DKIM failures</strong> — email going to spam? Check TXT records for SPF, DKIM, and DMARC configuration.</li>
      </ul>
    </article>
  )
}
