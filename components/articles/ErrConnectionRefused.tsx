'use client'

export default function ErrConnectionRefused() {
  return (
    <article className="prose-freeutil">
      <p>ERR_CONNECTION_REFUSED means the browser successfully reached the server's IP address but the server refused to accept the connection — there was nothing listening on that port. Here's how to diagnose each layer.</p>

      <h2>What Actually Happens</h2>
      <pre><code>{`Browser → DNS lookup → IP address ✅
Browser → TCP connect to IP:PORT → Connection refused ❌

The browser reached the machine, but no process is
listening on the requested port.`}</code></pre>

      <h2>Most Common Causes</h2>

      <h3>1. Server or Service Not Running</h3>
      <pre><code>{`# Check if your app is running
sudo systemctl status nginx
sudo systemctl status myapp

# Check what's listening on a specific port
ss -tulpn | grep :3000
lsof -i :3000

# Nothing listening? Start the service
sudo systemctl start nginx
node server.js  # or pm2 start`}</code></pre>

      <h3>2. Wrong Port Number</h3>
      <p>Double-check the port your app actually binds to versus the port you're connecting to. Common mismatches:</p>
      <pre><code>{`# Verify what port your app is actually using
ss -tulpn | grep node
# or
netstat -tulpn | grep LISTEN

# Common ports to check
# Development: 3000, 4000, 5000, 8000, 8080
# Production: 80 (HTTP), 443 (HTTPS)
# PostgreSQL: 5432, MySQL: 3306, Redis: 6379`}</code></pre>

      <h3>3. Firewall Blocking the Port</h3>
      <pre><code>{`# Check UFW (Ubuntu)
sudo ufw status

# Allow a port
sudo ufw allow 3000/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check iptables directly
sudo iptables -L -n | grep DROP

# Cloudflare / cloud security groups
# Check your provider's firewall/security group rules`}</code></pre>

      <h3>4. Service Listening on Wrong Interface</h3>
      <p>If your app binds to <code>127.0.0.1</code> (localhost only) instead of <code>0.0.0.0</code> (all interfaces), connections from other machines or Docker containers will be refused:</p>
      <pre><code>{`# Listening on localhost only — only accessible from same machine
127.0.0.1:3000

# Listening on all interfaces — accessible from anywhere
0.0.0.0:3000

# Fix in Node.js
app.listen(3000, '0.0.0.0', () => console.log('Listening on all interfaces'))

# Fix in Python (FastAPI/uvicorn)
uvicorn main:app --host 0.0.0.0 --port 3000`}</code></pre>

      <h3>5. Localhost Issues in Docker</h3>
      <p>Inside a Docker container, <code>localhost</code> refers to the container itself, not your host machine. Use <code>host.docker.internal</code> on Mac/Windows, or the container's network IP on Linux:</p>
      <pre><code>{`# Connect to host machine from inside Docker (Mac/Windows)
http://host.docker.internal:3000

# Connect to another container — use service name from docker-compose
http://db:5432    # not localhost:5432

# Find container IP
docker inspect container_name | grep IPAddress`}</code></pre>

      <h3>6. App Crashed on Startup</h3>
      <pre><code>{`# Check app logs for startup errors
sudo journalctl -u myapp -n 50
pm2 logs myapp
docker logs container_name

# Common startup failures: missing env var, port already in use, DB connection failed`}</code></pre>

      <h2>Quick Diagnosis Checklist</h2>
      <ol>
        <li>Is the service running? → <code>sudo systemctl status servicename</code></li>
        <li>Is anything listening on that port? → <code>ss -tulpn | grep :PORT</code></li>
        <li>Is a firewall blocking it? → <code>sudo ufw status</code></li>
        <li>Is the service binding to the right interface? → Check your app's host/bind config</li>
        <li>Is the app crashing on start? → Check logs</li>
      </ol>
    </article>
  )
}
