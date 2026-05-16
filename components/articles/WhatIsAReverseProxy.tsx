'use client'

export default function WhatIsAReverseProxy() {
  return (
    <article className="prose-freeutil">
      <p>A reverse proxy is a server that sits in front of your application servers and forwards client requests to them. From the client's perspective, they're talking to one server — the proxy — but behind the scenes, requests are being routed to multiple servers or services.</p>

      <h2>Forward Proxy vs Reverse Proxy</h2>
      <table>
        <thead><tr><th></th><th>Forward Proxy</th><th>Reverse Proxy</th></tr></thead>
        <tbody>
          <tr><td>Sits in front of</td><td>Clients</td><td>Servers</td></tr>
          <tr><td>Hides</td><td>Client identity from server</td><td>Server identity from client</td></tr>
          <tr><td>Used for</td><td>Privacy, content filtering, corporate networks</td><td>Load balancing, SSL termination, caching</td></tr>
          <tr><td>Example</td><td>VPN, Squid proxy</td><td>Nginx, Cloudflare, AWS ALB</td></tr>
        </tbody>
      </table>

      <h2>What a Reverse Proxy Does</h2>
      <ul>
        <li><strong>SSL termination</strong> — handle TLS decryption so your app doesn't need to. Your Node.js or Python app receives plain HTTP, Nginx handles the SSL complexity.</li>
        <li><strong>Load balancing</strong> — distribute traffic across multiple application servers.</li>
        <li><strong>Caching</strong> — cache responses from application servers to reduce backend load.</li>
        <li><strong>Compression</strong> — gzip responses before sending to clients.</li>
        <li><strong>Security</strong> — hide your backend architecture, filter malicious requests, rate limiting.</li>
        <li><strong>Single entry point</strong> — route different URL paths to different backend services.</li>
      </ul>

      <h2>Nginx as Reverse Proxy</h2>
      <pre><code>{`# Route all requests to a Node.js app on port 3000
server {
    listen 443 ssl;
    server_name api.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Route different paths to different services
server {
    listen 443 ssl;
    server_name example.com;

    location /api/ {
        proxy_pass http://localhost:3000;  # API service
    }

    location /uploads/ {
        root /var/www/storage;            # Static files served directly
    }

    location / {
        proxy_pass http://localhost:3001; # Frontend service
    }
}`}</code></pre>

      <h2>Why Every Production App Uses One</h2>
      <p>Running your Node.js or Python app directly on port 80/443 means it handles SSL, compression, and static files itself — work it's not optimized for. Nginx handles these concerns 10-100x more efficiently, freeing your app to focus on business logic. It also means you can restart your app without dropping connections — Nginx buffers requests while your app restarts.</p>
    </article>
  )
}
