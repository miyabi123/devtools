'use client'

export default function WhatIsALoadBalancer() {
  return (
    <article className="prose-freeutil">
      <p>A load balancer distributes incoming network traffic across multiple servers, preventing any single server from becoming overwhelmed. It's the traffic cop of your infrastructure.</p>

      <h2>What a Load Balancer Does</h2>
      <p>Without a load balancer, all requests hit one server. When that server reaches capacity, requests slow down or fail. A load balancer sits in front of your servers and routes each request to the server best positioned to handle it.</p>
      <pre><code>{`Internet → Load Balancer → Server 1 (handles 33% of requests)
                        → Server 2 (handles 33% of requests)
                        → Server 3 (handles 33% of requests)`}</code></pre>

      <h2>Layer 4 vs Layer 7</h2>
      <table>
        <thead><tr><th></th><th>Layer 4 (Transport)</th><th>Layer 7 (Application)</th></tr></thead>
        <tbody>
          <tr><td>Operates at</td><td>TCP/UDP level</td><td>HTTP/HTTPS level</td></tr>
          <tr><td>Sees</td><td>IP address, port</td><td>URL, headers, cookies</td></tr>
          <tr><td>Can route by</td><td>IP, protocol</td><td>URL path, host, headers</td></tr>
          <tr><td>Speed</td><td>Faster (less processing)</td><td>Slightly slower</td></tr>
          <tr><td>SSL termination</td><td>No (pass-through)</td><td>Yes</td></tr>
          <tr><td>Example</td><td>AWS NLB, HAProxy TCP</td><td>Nginx, AWS ALB, Cloudflare</td></tr>
        </tbody>
      </table>

      <h2>Load Balancing Algorithms</h2>
      <ul>
        <li><strong>Round Robin</strong> — each server gets requests in rotation. Simple, works well when servers are identical.</li>
        <li><strong>Least Connections</strong> — route to the server with fewest active connections. Better for long-running requests.</li>
        <li><strong>IP Hash</strong> — same client IP always goes to same server. Used for stateful apps that don't use shared sessions.</li>
        <li><strong>Weighted</strong> — servers with more capacity get more traffic. Useful when servers have different specs.</li>
        <li><strong>Random</strong> — statistically similar to round robin. Used in some distributed systems.</li>
      </ul>

      <h2>Health Checks</h2>
      <p>A load balancer continuously checks if each server is healthy. If a server fails a health check, it's removed from the rotation until it recovers.</p>
      <pre><code>{`# Nginx upstream with health checking
upstream myapp {
    server 10.0.0.1:3000;
    server 10.0.0.2:3000;
    server 10.0.0.3:3000;
}

server {
    location / {
        proxy_pass http://myapp;
    }
}`}</code></pre>

      <h2>When Do You Need a Load Balancer?</h2>
      <ul>
        <li>Your single server can't handle peak traffic</li>
        <li>You need zero-downtime deployments (deploy to one server, swap)</li>
        <li>You need high availability (if one server dies, others keep serving)</li>
        <li>You're scaling horizontally (adding more servers, not bigger ones)</li>
      </ul>
      <p>For small apps, a single server is fine. Add a load balancer when you need the second server — not before.</p>
    </article>
  )
}
