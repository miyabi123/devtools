'use client'

export default function LinuxServerSetupGuide() {
  return (
    <article className="prose-freeutil">
      <p>This guide takes a fresh Ubuntu 22.04 LTS VPS from zero to a production-ready, secure server. Follow these steps in order — each builds on the previous. Expected time: 45–90 minutes.</p>

      <h2>1. Initial Connection & Root Password</h2>
      <pre><code>{`# Connect as root (initial login)
ssh root@your-server-ip

# Set a strong root password (even though we'll disable root SSH later)
passwd`}</code></pre>

      <h2>2. Create a Non-Root Admin User</h2>
      <pre><code>{`# Create user
adduser alice
usermod -aG sudo alice

# Switch to new user to verify sudo works
su - alice
sudo whoami  # Should output: root`}</code></pre>

      <h2>3. SSH Key Authentication</h2>
      <pre><code>{`# On your LOCAL machine — copy your public key to the server
ssh-copy-id alice@your-server-ip

# Test key login works BEFORE disabling password auth
ssh alice@your-server-ip  # Should connect without password prompt

# On the SERVER — harden SSH config
sudo nano /etc/ssh/sshd_config`}</code></pre>
      <pre><code>{`# /etc/ssh/sshd_config — key changes
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
LoginGraceTime 20
MaxAuthTries 3
MaxSessions 10

# Apply changes (in a new terminal to avoid lockout!)
sudo systemctl reload sshd`}</code></pre>

      <h2>4. Firewall (UFW)</h2>
      <pre><code>{`sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow essential ports
sudo ufw allow 22/tcp         # SSH
sudo ufw allow 80/tcp         # HTTP
sudo ufw allow 443/tcp        # HTTPS

# Enable
sudo ufw enable
sudo ufw status verbose`}</code></pre>

      <h2>5. System Updates</h2>
      <pre><code>{`sudo apt update && sudo apt upgrade -y

# Enable automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades`}</code></pre>

      <h2>6. Install Nginx</h2>
      <pre><code>{`sudo apt install nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Test: visit http://your-server-ip — should see Nginx welcome page

# Create site config
sudo nano /etc/nginx/sites-available/yourdomain.com`}</code></pre>
      <pre><code>{`# /etc/nginx/sites-available/yourdomain.com
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/yourdomain.com;
    index index.html;
    location / { try_files $uri $uri/ =404; }
}

sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx`}</code></pre>

      <h2>7. SSL Certificate (Let's Encrypt)</h2>
      <pre><code>{`sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run`}</code></pre>

      <h2>8. Install Fail2ban</h2>
      <pre><code>{`sudo apt install fail2ban

sudo nano /etc/fail2ban/jail.local`}</code></pre>
      <pre><code>{`[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
[nginx-http-auth]
enabled = true

sudo systemctl enable --now fail2ban
sudo fail2ban-client status`}</code></pre>

      <h2>9. Deploy Your Application</h2>
      <pre><code>{`# Example: Node.js app with PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs
sudo npm install -g pm2

# Deploy app
git clone https://github.com/you/app.git /var/www/app
cd /var/www/app && npm ci --production
pm2 start server.js --name myapp
pm2 startup && pm2 save  # Auto-start on reboot`}</code></pre>

      <h2>10. Monitoring</h2>
      <pre><code>{`# Basic monitoring with htop
sudo apt install htop

# Disk usage alerts
df -h  # Check manually, or set up a cron alert

# Log rotation (already configured by default in Ubuntu)
sudo logrotate --debug /etc/logrotate.conf

# Consider: Uptime Robot (free), Better Uptime, or Grafana Cloud`}</code></pre>

      <h2>11. Backups</h2>
      <pre><code>{`# Database backup (PostgreSQL example)
sudo -u postgres pg_dump mydb > /backup/mydb-$(date +%Y%m%d).sql

# Automated daily backup cron
0 2 * * * pg_dump mydb | gzip > /backup/db-$(date +\%Y\%m\%d).sql.gz
# Sync to S3 or another server with rsync

# Test restore periodically — a backup you've never tested is not a backup`}</code></pre>
    </article>
  )
}
