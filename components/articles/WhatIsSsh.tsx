'use client'

export default function WhatIsSsh() {
  return (
    <article className="prose-freeutil">
      <p>SSH (Secure Shell) is a cryptographic protocol for securely connecting to remote computers. It encrypts all traffic — commands you type, output you receive, files you transfer — making it safe to use over untrusted networks.</p>

      <h2>How SSH Authentication Works</h2>
      <h3>Password Authentication</h3>
      <p>The simplest method — you type a username and password. The password is sent over the encrypted channel (not plain text). Simple but vulnerable to brute-force attacks and phishing. Disable it in production environments.</p>

      <h3>Key-based Authentication</h3>
      <p>More secure and more convenient. You generate a key pair: a private key (stays on your machine) and a public key (placed on the server). The server challenges your client to prove it holds the private key, without ever sending the key itself.</p>
      <pre><code>{`# The math: server encrypts a challenge with your public key
# Only your private key can decrypt it → proves you're you`}</code></pre>

      <h2>Generating SSH Keys</h2>
      <pre><code>{`# Ed25519 (recommended — modern, fast, secure)
ssh-keygen -t ed25519 -C "your@email.com"

# RSA-4096 (for legacy systems)
ssh-keygen -t rsa -b 4096 -C "your@email.com"

# Files created:
# ~/.ssh/id_ed25519      → private key (keep secret, never share)
# ~/.ssh/id_ed25519.pub  → public key (safe to share)

# Add public key to server
ssh-copy-id user@server   # Copies to ~/.ssh/authorized_keys
# Or manually:
cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys`}</code></pre>

      <h2>Basic SSH Usage</h2>
      <pre><code>{`# Connect
ssh user@hostname
ssh user@192.168.1.10
ssh -p 2222 user@hostname          # Custom port

# Run a command without opening shell
ssh user@host "ls -la /var/www"
ssh user@host "sudo systemctl restart nginx"

# Copy files (scp)
scp file.txt user@host:/remote/path/
scp user@host:/remote/file.txt ./local/
scp -r ./dir/ user@host:/remote/   # Directory

# Sync files (rsync — faster for large transfers)
rsync -avz ./local/ user@host:/remote/
rsync -avz --delete ./local/ user@host:/remote/  # Mirror`}</code></pre>

      <h2>SSH Config File</h2>
      <p>Save connection settings in <code>~/.ssh/config</code> to avoid typing the full command every time:</p>
      <pre><code>{`# ~/.ssh/config
Host myserver
    HostName 192.168.1.10
    User alice
    Port 2222
    IdentityFile ~/.ssh/id_ed25519

Host github
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_key

Host work-server
    HostName 10.0.0.5
    User bob
    ProxyJump jump.company.com   # Jump through bastion host

# Now just type:
ssh myserver      # instead of: ssh -p 2222 alice@192.168.1.10
git clone github:user/repo   # uses github config`}</code></pre>

      <h2>SSH Tunneling & Port Forwarding</h2>
      <pre><code>{`# Local forwarding: access remote service locally
ssh -L 8080:localhost:80 user@server
# → http://localhost:8080 now connects to server's port 80

# Remote forwarding: expose local service remotely
ssh -R 9090:localhost:3000 user@server
# → server's port 9090 forwards to your local port 3000

# SOCKS proxy: route all traffic through server
ssh -D 1080 user@server
# → configure browser to use SOCKS5 proxy 127.0.0.1:1080`}</code></pre>

      <h2>Securing SSH</h2>
      <pre><code>{`# /etc/ssh/sshd_config — harden your server
PermitRootLogin no            # Never login as root
PasswordAuthentication no     # Keys only
PubkeyAuthentication yes
Port 2222                     # Non-default port (minor security)
MaxAuthTries 3
LoginGraceTime 20

# Apply changes
sudo systemctl restart sshd`}</code></pre>
    </article>
  )
}
