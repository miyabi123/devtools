'use client'

export default function NginxConfigGuide() {
  return (
    <article className="prose-freeutil">
      <p>Nginx is the most widely used web server and reverse proxy. Understanding its configuration lets you serve static files, proxy to application servers, terminate SSL, and handle thousands of concurrent connections efficiently.</p>

      <h2>Configuration File Structure</h2>
      <pre><code>{`# Main config: /etc/nginx/nginx.conf
# Site configs: /etc/nginx/sites-available/ (symlinked to sites-enabled/)

# /etc/nginx/nginx.conf
worker_processes auto;          # Usually = number of CPU cores

events {
    worker_connections 1024;    # Connections per worker
}

http {
    include mime.types;
    sendfile on;
    keepalive_timeout 65;

    include /etc/nginx/sites-enabled/*;  # Include site configs
}`}</code></pre>

      <h2>Static File Server</h2>
      <pre><code>{`server {
    listen 80;
    server_name example.com www.example.com;

    root /var/www/html;
    index index.html;

    # Serve files, fallback to index.html for SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}`}</code></pre>

      <h2>Reverse Proxy to Node.js / Python</h2>
      <pre><code>{`server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://localhost:3000;

        # Required proxy headers
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;      # WebSocket support
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_read_timeout 300s;
        proxy_connect_timeout 60s;
    }
}`}</code></pre>

      <h2>SSL/TLS with Let's Encrypt</h2>
      <pre><code>{`server {
    listen 443 ssl http2;
    server_name example.com www.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;

    location / {
        proxy_pass http://localhost:3000;
        # ... proxy headers
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$host$request_uri;
}`}</code></pre>

      <h2>Gzip Compression</h2>
      <pre><code>{`# In http {} block
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript
           text/xml application/xml image/svg+xml;`}</code></pre>

      <h2>Rate Limiting</h2>
      <pre><code>{`# Define zone in http {} block
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

# Apply to location
location /api/ {
    limit_req zone=api burst=20 nodelay;
    proxy_pass http://localhost:3000;
}`}</code></pre>

      <h2>Testing and Reloading</h2>
      <pre><code>{`sudo nginx -t                   # Test configuration syntax
sudo nginx -T                   # Print full config (debug)
sudo systemctl reload nginx     # Reload config (zero downtime)
sudo systemctl restart nginx    # Full restart (brief downtime)`}</code></pre>
    </article>
  )
}
