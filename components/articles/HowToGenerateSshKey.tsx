'use client'

export default function HowToGenerateSshKey() {
  return (
    <article className="prose-freeutil">
      <p>SSH keys are more secure than passwords and more convenient once set up. This guide covers generating a key pair on any platform and adding it to GitHub, GitLab, or a remote server.</p>

      <h2>Which Key Type to Generate?</h2>
      <p>Use <strong>Ed25519</strong> for all new keys — it's faster, more secure, and produces smaller keys than RSA. Use RSA-4096 only if connecting to older systems that don't support Ed25519.</p>

      <h2>Mac and Linux</h2>
      <pre><code>{`# Ed25519 (recommended)
ssh-keygen -t ed25519 -C "your@email.com"

# RSA-4096 (legacy systems)
ssh-keygen -t rsa -b 4096 -C "your@email.com"

# You'll be prompted for:
# File location — press Enter to accept default (~/.ssh/id_ed25519)
# Passphrase — optional but recommended (encrypts the private key)

# Files created:
~/.ssh/id_ed25519      # Private key — NEVER share this
~/.ssh/id_ed25519.pub  # Public key — safe to share`}</code></pre>

      <h2>Windows (PowerShell)</h2>
      <pre><code>{`# Windows 10/11 includes OpenSSH
ssh-keygen -t ed25519 -C "your@email.com"

# If ssh-keygen is not found, install OpenSSH:
# Settings → Apps → Optional Features → Add: OpenSSH Client

# Keys saved to:
# C:\\Users\\YourName\\.ssh\\id_ed25519
# C:\\Users\\YourName\\.ssh\\id_ed25519.pub`}</code></pre>

      <h2>Add Key to GitHub</h2>
      <pre><code>{`# Copy your public key
cat ~/.ssh/id_ed25519.pub     # Mac/Linux
# Windows:
type C:\\Users\\YourName\\.ssh\\id_ed25519.pub

# → GitHub → Settings → SSH and GPG keys → New SSH key
# Paste the public key content and save

# Test the connection
ssh -T git@github.com
# → "Hi username! You've successfully authenticated"`}</code></pre>

      <h2>Add Key to GitLab</h2>
      <pre><code>{`# Same process — copy public key content then:
# GitLab → Preferences → SSH Keys → Add new key

ssh -T git@gitlab.com
# → "Welcome to GitLab, username!"`}</code></pre>

      <h2>Add Key to a Remote Server</h2>
      <pre><code>{`# Easiest: use ssh-copy-id
ssh-copy-id user@server
ssh-copy-id -p 2222 user@server    # Custom port

# Manual: append public key to authorized_keys on server
cat ~/.ssh/id_ed25519.pub | ssh user@server "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

# Verify permissions on server (critical!)
ssh user@server "chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"

# Test key login
ssh user@server`}</code></pre>

      <h2>Multiple Keys for Multiple Accounts</h2>
      <pre><code>{`# Generate separate keys for work and personal
ssh-keygen -t ed25519 -C "personal@gmail.com" -f ~/.ssh/id_personal
ssh-keygen -t ed25519 -C "work@company.com" -f ~/.ssh/id_work

# Configure ~/.ssh/config to use the right key automatically
Host github-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_personal

Host github-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_work

# Use in git clone:
git clone git@github-personal:username/personal-repo.git
git clone git@github-work:company/work-repo.git`}</code></pre>

      <h2>Troubleshooting Permission Errors</h2>
      <pre><code>{`# "Permission denied (publickey)" — common fixes:

# 1. Check if your key is loaded in the agent
ssh-add -l
ssh-add ~/.ssh/id_ed25519    # Add if not listed

# 2. Verify correct key is being used
ssh -v user@server 2>&1 | grep "Trying\|Offering\|identity"

# 3. Check server authorized_keys
ssh user@server "cat ~/.ssh/authorized_keys"

# 4. Fix permissions (most common cause)
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub`}</code></pre>
    </article>
  )
}
