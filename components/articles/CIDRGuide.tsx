export default function CIDRGuide() {
  return (
    <>
      <h2>What is CIDR Notation?</h2>
      <p>CIDR (Classless Inter-Domain Routing) notation is a compact way to represent an IP address and its associated network mask. It consists of an IP address followed by a slash and a prefix length number, like <code>192.168.1.0/24</code>.</p>
      <p>The prefix length (the number after the slash) indicates how many bits of the IP address represent the network portion. The remaining bits are used to identify individual hosts within that network.</p>

      <h2>Understanding IP Address Structure</h2>
      <p>An IPv4 address is 32 bits, written as four octets (groups of 8 bits) in decimal notation:</p>
      <pre><code>{`192.168.1.100
= 11000000.10101000.00000001.01100100
  ←─── 32 bits total ───────────────→`}</code></pre>

      <h2>How the Prefix Length Works</h2>
      <p>In <code>192.168.1.0/24</code>, the <code>/24</code> means the first 24 bits are the network address and the remaining 8 bits identify hosts:</p>
      <pre><code>{`192.168.1.0/24
11000000.10101000.00000001 | 00000000
←────── Network (24 bits) ──────────→ ←── Host (8 bits) ──→`}</code></pre>

      <h2>Key Subnet Calculations</h2>
      <p>From a CIDR block, you can calculate several important values:</p>
      <table>
        <thead><tr><th>Value</th><th>Formula</th><th>Example (/24)</th></tr></thead>
        <tbody>
          <tr><td>Total addresses</td><td>2^(32 - prefix)</td><td>2^8 = 256</td></tr>
          <tr><td>Usable hosts</td><td>Total - 2</td><td>256 - 2 = 254</td></tr>
          <tr><td>Network address</td><td>First IP in range</td><td>192.168.1.0</td></tr>
          <tr><td>Broadcast address</td><td>Last IP in range</td><td>192.168.1.255</td></tr>
          <tr><td>First usable host</td><td>Network + 1</td><td>192.168.1.1</td></tr>
          <tr><td>Last usable host</td><td>Broadcast - 1</td><td>192.168.1.254</td></tr>
        </tbody>
      </table>

      <h2>Common CIDR Blocks Reference</h2>
      <table>
        <thead><tr><th>CIDR</th><th>Subnet Mask</th><th>Total Hosts</th><th>Usable Hosts</th><th>Common Use</th></tr></thead>
        <tbody>
          <tr><td>/32</td><td>255.255.255.255</td><td>1</td><td>0</td><td>Single host route</td></tr>
          <tr><td>/30</td><td>255.255.255.252</td><td>4</td><td>2</td><td>Point-to-point links</td></tr>
          <tr><td>/29</td><td>255.255.255.248</td><td>8</td><td>6</td><td>Small segments</td></tr>
          <tr><td>/28</td><td>255.255.255.240</td><td>16</td><td>14</td><td>Small office</td></tr>
          <tr><td>/27</td><td>255.255.255.224</td><td>32</td><td>30</td><td>Small department</td></tr>
          <tr><td>/26</td><td>255.255.255.192</td><td>64</td><td>62</td><td>Medium subnet</td></tr>
          <tr><td>/25</td><td>255.255.255.128</td><td>128</td><td>126</td><td>Large subnet</td></tr>
          <tr><td>/24</td><td>255.255.255.0</td><td>256</td><td>254</td><td>Standard LAN</td></tr>
          <tr><td>/23</td><td>255.255.254.0</td><td>512</td><td>510</td><td>Large LAN</td></tr>
          <tr><td>/22</td><td>255.255.252.0</td><td>1,024</td><td>1,022</td><td>Campus network</td></tr>
          <tr><td>/16</td><td>255.255.0.0</td><td>65,536</td><td>65,534</td><td>Large organization</td></tr>
          <tr><td>/8</td><td>255.0.0.0</td><td>16,777,216</td><td>16,777,214</td><td>ISP allocation</td></tr>
        </tbody>
      </table>

      <h2>Private IP Address Ranges</h2>
      <p>RFC 1918 defines three ranges of private IP addresses for use within organizations:</p>
      <table>
        <thead><tr><th>Range</th><th>CIDR</th><th>Addresses</th></tr></thead>
        <tbody>
          <tr><td>10.0.0.0 – 10.255.255.255</td><td>10.0.0.0/8</td><td>16,777,216</td></tr>
          <tr><td>172.16.0.0 – 172.31.255.255</td><td>172.16.0.0/12</td><td>1,048,576</td></tr>
          <tr><td>192.168.0.0 – 192.168.255.255</td><td>192.168.0.0/16</td><td>65,536</td></tr>
        </tbody>
      </table>

      <h2>Subnetting Example</h2>
      <p>Suppose you have the network <code>10.0.0.0/8</code> and need to divide it into smaller subnets for different departments:</p>
      <pre><code>{`Department A (500 hosts needed) → 10.1.0.0/23  (510 usable)
Department B (200 hosts needed) → 10.2.0.0/24  (254 usable)
Department C (50 hosts needed)  → 10.3.0.0/26  (62 usable)
Point-to-point link             → 10.4.0.0/30  (2 usable)`}</code></pre>

      <div className="callout callout-green">
        <p>✓ Tip: To find the right prefix length for a required number of hosts, use the formula: prefix = 32 - ceil(log2(hosts + 2)). For 100 hosts: 32 - ceil(log2(102)) = 32 - 7 = /25 (126 usable hosts).</p>
      </div>

      <h2>CIDR in Cloud Environments</h2>
      <p>CIDR notation is fundamental in cloud networking. When you create a VPC (Virtual Private Cloud) in AWS, Azure, or GCP, you assign a CIDR block that defines the IP address space for the entire virtual network. Subnets within the VPC are smaller CIDR blocks carved from the VPC range.</p>
      <pre><code>{`VPC:              10.0.0.0/16    (65,534 addresses)
Public Subnet:    10.0.1.0/24    (254 addresses)
Private Subnet:   10.0.2.0/24    (254 addresses)
Database Subnet:  10.0.3.0/24    (254 addresses)`}</code></pre>
    </>
  )
}
