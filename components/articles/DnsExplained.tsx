'use client'

export default function DnsExplained() {
  return (
    <>
      <h2>What is DNS?</h2>
      <p>
        DNS (Domain Name System) is the internet's phone book. Computers communicate using IP addresses like <code>104.26.10.90</code>, but humans remember names like <code>freeutil.app</code>. DNS translates between the two — mapping domain names to IP addresses so your browser can connect to the right server.
      </p>
      <p>
        Every time you type a URL, open an app, or send an email, DNS works silently in the background. It happens so fast (typically 10–50ms) that you never notice — until it breaks.
      </p>

      <h2>The DNS Resolution Process — Step by Step</h2>
      <p>When you type <code>freeutil.app</code> into your browser, here's what happens:</p>

      <h3>Step 1: Browser Cache</h3>
      <p>
        Your browser first checks its own DNS cache. If it visited <code>freeutil.app</code> recently and the TTL hasn't expired, it uses the cached IP immediately. No network request needed.
      </p>

      <h3>Step 2: OS Cache + hosts file</h3>
      <p>
        If not in browser cache, the OS checks its own resolver cache and the <code>/etc/hosts</code> (Linux/macOS) or <code>C:\Windows\System32\drivers\etc\hosts</code> (Windows) file. This is why adding entries to <code>hosts</code> overrides DNS — it's checked before any network lookups.
      </p>

      <h3>Step 3: Recursive Resolver</h3>
      <p>
        If still not cached, the OS sends the query to a <strong>recursive resolver</strong> — typically provided by your ISP, or a public resolver like Google (<code>8.8.8.8</code>), Cloudflare (<code>1.1.1.1</code>), or NextDNS. The recursive resolver does the heavy lifting on your behalf.
      </p>

      <h3>Step 4: Root Name Servers</h3>
      <p>
        If the recursive resolver doesn't have the answer cached, it asks one of the 13 <strong>root name servers</strong> (actually hundreds of servers worldwide via anycast). The root server doesn't know the final IP — it knows which <strong>TLD name server</strong> handles <code>.app</code> domains and returns that address.
      </p>

      <h3>Step 5: TLD Name Server</h3>
      <p>
        The recursive resolver now asks the <strong>TLD (Top-Level Domain) name server</strong> for <code>.app</code>. This server knows which <strong>authoritative name servers</strong> are responsible for <code>freeutil.app</code> and returns those.
      </p>

      <h3>Step 6: Authoritative Name Server</h3>
      <p>
        Finally, the recursive resolver queries the <strong>authoritative name server</strong> for <code>freeutil.app</code> (e.g., Cloudflare's name servers). This server has the actual DNS records and returns the IP address.
      </p>

      <h3>Step 7: Response Cached and Returned</h3>
      <p>
        The recursive resolver caches the result based on the record's <strong>TTL</strong>, then returns the IP to your browser. Your browser also caches it. Future requests skip all these steps until the TTL expires.
      </p>

      <div className="callout callout-blue">
        <p>
          <strong>This whole process sounds slow</strong> — root servers, TLD servers, authoritative servers — but it typically takes 20–100ms total on the first lookup. The recursive resolver caches results aggressively, so most lookups are answered instantly from cache.
        </p>
      </div>

      <h2>DNS Record Types</h2>
      <table>
        <thead><tr><th>Record</th><th>Purpose</th><th>Example</th></tr></thead>
        <tbody>
          <tr>
            <td><code>A</code></td>
            <td>Maps domain to IPv4 address</td>
            <td><code>freeutil.app → 104.26.10.90</code></td>
          </tr>
          <tr>
            <td><code>AAAA</code></td>
            <td>Maps domain to IPv6 address</td>
            <td><code>freeutil.app → 2606:4700::...</code></td>
          </tr>
          <tr>
            <td><code>CNAME</code></td>
            <td>Alias — points to another domain name</td>
            <td><code>www.freeutil.app → freeutil.app</code></td>
          </tr>
          <tr>
            <td><code>MX</code></td>
            <td>Mail server for the domain</td>
            <td><code>freeutil.app → mail.google.com (priority 10)</code></td>
          </tr>
          <tr>
            <td><code>TXT</code></td>
            <td>Arbitrary text — used for SPF, DKIM, domain verification</td>
            <td><code>v=spf1 include:_spf.google.com ~all</code></td>
          </tr>
          <tr>
            <td><code>NS</code></td>
            <td>Authoritative name servers for the domain</td>
            <td><code>ns1.cloudflare.com, ns2.cloudflare.com</code></td>
          </tr>
          <tr>
            <td><code>SOA</code></td>
            <td>Start of Authority — zone metadata</td>
            <td>Serial number, refresh intervals, admin email</td>
          </tr>
          <tr>
            <td><code>CAA</code></td>
            <td>Which CAs can issue SSL certs for this domain</td>
            <td><code>0 issue "letsencrypt.org"</code></td>
          </tr>
          <tr>
            <td><code>PTR</code></td>
            <td>Reverse DNS — IP to domain name</td>
            <td><code>90.10.26.104.in-addr.arpa → freeutil.app</code></td>
          </tr>
          <tr>
            <td><code>SRV</code></td>
            <td>Service location — host and port for specific services</td>
            <td>Used by SIP, XMPP, gaming servers</td>
          </tr>
        </tbody>
      </table>

      <h2>What is TTL?</h2>
      <p>
        TTL (Time To Live) is the number of seconds a DNS record can be cached before resolvers must re-fetch it. It's set by the domain owner in their DNS provider.
      </p>
      <ul>
        <li><strong>Low TTL (60–300s)</strong> — changes propagate quickly. Use before migrations or IP changes. Slightly more DNS query load.</li>
        <li><strong>High TTL (3600–86400s)</strong> — faster for end users (cache hits). Changes take longer to propagate globally.</li>
      </ul>
      <div className="callout">
        <p>
          <strong>Before migrating a site:</strong> Lower TTL to 300s (5 minutes) at least 48 hours before the migration. After migration is stable, raise TTL back to 3600+.
        </p>
      </div>

      <h2>DNS Propagation</h2>
      <p>
        When you change a DNS record, the change propagates gradually as cached records expire around the world. This is why "DNS propagation" can take hours — not because DNS is slow, but because old records are cached in resolvers worldwide until their TTL expires.
      </p>
      <p>
        You can check how your domain looks from different locations using tools like <code>dig</code>, <code>nslookup</code>, or online DNS checker services.
      </p>
      <pre><code>{`# Check A record using Cloudflare's resolver
dig @1.1.1.1 freeutil.app A

# Check with Google
dig @8.8.8.8 freeutil.app A

# Trace the full resolution chain
dig +trace freeutil.app`}</code></pre>

      <h2>CNAME vs A Record — When to Use Each</h2>
      <p>
        A common question: should I use a CNAME or an A record? The rule is:
      </p>
      <ul>
        <li><strong>A record</strong> — use for the root/apex domain (<code>freeutil.app</code>). CNAME is not allowed at the apex per DNS spec.</li>
        <li><strong>CNAME</strong> — use for subdomains (<code>www.freeutil.app → freeutil.app</code>). Useful when the target IP may change — you update the A record once and all CNAMEs follow.</li>
      </ul>
      <p>
        Cloudflare and some other DNS providers offer <strong>CNAME flattening</strong> (also called ALIAS or ANAME records) that allows CNAME-like behavior at the root domain. This is how Cloudflare Pages and Vercel work for apex domains.
      </p>

      <h2>DNS Security — DNSSEC</h2>
      <p>
        Plain DNS has no authentication — responses can be spoofed (DNS cache poisoning). <strong>DNSSEC</strong> adds cryptographic signatures to DNS records, allowing resolvers to verify responses are authentic. However, DNSSEC is complex to configure and not universally adopted.
      </p>
      <p>
        <strong>DNS over HTTPS (DoH)</strong> and <strong>DNS over TLS (DoT)</strong> address a different problem: they encrypt DNS queries so ISPs and network observers can't see what domains you're looking up. Modern browsers support DoH natively.
      </p>

      <h2>Summary</h2>
      <p>
        DNS translates human-readable domain names to IP addresses through a hierarchical system of resolvers, root servers, TLD servers, and authoritative name servers. Key records to know are A (IPv4), AAAA (IPv6), CNAME (alias), MX (email), TXT (verification), and NS (name servers). TTL controls how long records are cached. Changes propagate as caches expire worldwide.
      </p>
    </>
  )
}
