'use client'

export default function NginxVsApache() {
  return (
    <article className="prose-freeutil">
      <p>Nginx and Apache are the two dominant web servers — together they power over 50% of websites. While both can handle most workloads, their architectures make each better suited for different scenarios.</p>

      <h2>Architecture Difference</h2>
      <p><strong>Apache</strong> uses a process/thread-per-connection model. Each request gets its own process or thread. Simple to understand and configure, but each connection consumes memory — Apache can struggle under thousands of concurrent connections.</p>
      <p><strong>Nginx</strong> uses an event-driven, asynchronous model. A small number of worker processes handle thousands of connections simultaneously. Much more memory-efficient under load.</p>

      <h2>Performance</h2>
      <table>
        <thead><tr><th>Metric</th><th>Nginx</th><th>Apache</th></tr></thead>
        <tbody>
          <tr><td>Static file serving</td><td>Excellent</td><td>Good</td></tr>
          <tr><td>Concurrent connections</td><td>Excellent (event-driven)</td><td>Good (threaded)</td></tr>
          <tr><td>Memory under load</td><td>Low (predictable)</td><td>Higher (grows with connections)</td></tr>
          <tr><td>PHP performance</td><td>Good (via PHP-FPM)</td><td>Good (mod_php)</td></tr>
          <tr><td>Reverse proxy</td><td>Excellent</td><td>Good</td></tr>
        </tbody>
      </table>

      <h2>Configuration Style</h2>
      <pre><code>{`# Nginx — block-based, declarative
server {
    listen 80;
    server_name example.com;
    location / { proxy_pass http://localhost:3000; }
}

# Apache — directive-based, supports .htaccess
<VirtualHost *:80>
    ServerName example.com
    ProxyPass / http://localhost:3000/
</VirtualHost>`}</code></pre>
      <p>Apache supports <code>.htaccess</code> files — per-directory configuration without restarting the server. Useful for shared hosting and WordPress. Nginx does not support <code>.htaccess</code> and requires configuration at the server level.</p>

      <h2>Module Ecosystem</h2>
      <p><strong>Apache</strong> has a mature module system — <code>mod_php</code>, <code>mod_rewrite</code>, <code>mod_security</code>. Modules can be loaded without recompiling.</p>
      <p><strong>Nginx</strong> modules must be compiled in at build time (though the official distribution includes most common ones). The module ecosystem is smaller but sufficient for most needs.</p>

      <h2>When to Choose Nginx</h2>
      <ul>
        <li>High-traffic sites serving mostly static content</li>
        <li>Reverse proxy / load balancer in front of Node.js, Python, or Ruby apps</li>
        <li>Microservices routing</li>
        <li>When memory efficiency matters</li>
        <li>New projects with no legacy constraints</li>
      </ul>

      <h2>When to Choose Apache</h2>
      <ul>
        <li>WordPress or PHP apps — Apache + mod_php is well-documented and widely supported</li>
        <li>Shared hosting environments (most use Apache)</li>
        <li>When you need .htaccess per-directory configuration</li>
        <li>Legacy applications built for Apache</li>
        <li>When your team already knows Apache</li>
      </ul>

      <h2>Nginx + Apache Together</h2>
      <p>A common pattern: Nginx as the front-facing reverse proxy (handles SSL, static files, rate limiting) with Apache running on a non-public port handling PHP processing. You get Nginx's performance with Apache's PHP compatibility.</p>
    </article>
  )
}
