'use client'

export default function HowToReadATraceroute() {
  return (
    <article className="prose-freeutil">
      <p>Traceroute reveals the path packets take from your machine to a destination — useful for diagnosing where a connection is slow, failing, or being blocked.</p>

      <h2>Run a Traceroute</h2>
      <pre><code>{`# Linux/macOS
traceroute google.com
tracepath google.com   # No root required, more info

# Windows
tracert google.com

# Better: MTR (combines ping + traceroute, real-time)
sudo apt install mtr
mtr google.com    # Interactive real-time view`}</code></pre>

      <h2>Reading the Output</h2>
      <pre><code>{`traceroute to google.com (142.250.185.78), 30 hops max
 1  192.168.1.1       1.2 ms   1.1 ms   1.0 ms   # Your router (gateway)
 2  10.10.1.1         5.3 ms   5.1 ms   5.4 ms   # ISP's first hop
 3  203.144.1.1      12.4 ms  12.2 ms  12.1 ms   # ISP backbone
 4  * * *                                          # Hop that doesn't respond
 5  72.14.232.1      25.3 ms  24.9 ms  25.1 ms   # Google's network
 6  142.250.185.78   26.2 ms  26.0 ms  26.4 ms   # Destination

#  ↑           ↑                  ↑ ↑ ↑
# Hop#    IP address          RTT for 3 probes (ms)`}</code></pre>

      <h2>What Each Column Means</h2>
      <ul>
        <li><strong>Hop number</strong> — each router (hop) the packet passes through</li>
        <li><strong>IP/hostname</strong> — the router that responded</li>
        <li><strong>RTT × 3</strong> — round-trip time for 3 separate probes. Variation indicates instability.</li>
      </ul>

      <h2>Common Patterns</h2>
      <pre><code>{`# 1. Stars (* * *) — router doesn't respond to traceroute probes
#    Not necessarily a problem — many routers block ICMP
 4  * * *   ← this is normal

# 2. Sudden RTT spike — bottleneck at that hop
 5  200ms 201ms 199ms   # Spike here = congestion or slow link at hop 5

# 3. RTT decreases after a spike — asymmetric routing, not a real problem
 5  200ms 199ms 201ms
 6   30ms  29ms  31ms   ← actually fine — just a different return path

# 4. Consistent high RTT from a specific hop onward — problem is AT that hop
 4   10ms  10ms  11ms
 5  200ms 199ms 200ms   ← problem starts here
 6  201ms 200ms 201ms   ← stays high = hop 5 is the bottleneck`}</code></pre>

      <h2>When Traceroute Isn't Enough</h2>
      <p>Use <strong>MTR</strong> for real-time continuous monitoring — it shows packet loss percentage per hop and updates in real time. Run it for 30-60 seconds to get meaningful packet loss data. A hop showing 100% loss but subsequent hops responding normally just means that router doesn't respond to probes — it's passing traffic fine.</p>
    </article>
  )
}
