'use client'

export default function LinuxCommandsCheatsheet() {
  return (
    <article className="prose-freeutil">
      <p>
        A practical reference of the most useful Linux commands, organized by task. All examples work on Ubuntu, Debian, CentOS, and most Linux distributions.
      </p>

      <h2>File & Directory Management</h2>
      <pre><code>{`ls -la              # List all files with permissions, hidden files
ls -lh              # Human-readable file sizes
pwd                 # Print current directory
cd /path/to/dir     # Change directory
cd ~                # Go to home directory
cd -                # Go to previous directory

mkdir -p a/b/c      # Create nested directories
cp -r src/ dest/    # Copy directory recursively
mv oldname newname  # Move or rename
rm -rf dirname/     # Delete directory (⚠️ no confirmation)
ln -s target link   # Create symbolic link

find / -name "*.log" -type f       # Find files by name
find . -mtime -7                   # Files modified in last 7 days
find . -size +100M                 # Files larger than 100MB`}</code></pre>

      <h2>File Viewing & Editing</h2>
      <pre><code>{`cat file.txt             # Print file content
less file.txt            # Paginated viewer (q to quit)
head -n 20 file.txt      # First 20 lines
tail -n 50 file.txt      # Last 50 lines
tail -f /var/log/syslog  # Follow log in real time

grep "error" file.log            # Search for pattern
grep -r "TODO" ./src/            # Recursive search
grep -i "error" file.log         # Case-insensitive
grep -n "pattern" file.txt       # Show line numbers
grep -v "debug" file.log         # Exclude pattern

wc -l file.txt       # Count lines
wc -w file.txt       # Count words
sort file.txt        # Sort lines alphabetically
sort -n numbers.txt  # Sort numerically
uniq -c file.txt     # Count duplicate lines
cut -d',' -f1,3 data.csv  # Extract CSV columns 1 and 3`}</code></pre>

      <h2>File Permissions</h2>
      <pre><code>{`chmod 755 script.sh       # rwxr-xr-x
chmod 644 config.txt      # rw-r--r--
chmod 600 private.key     # rw------- (owner only)
chmod +x script.sh        # Add execute permission
chmod -R 755 /var/www/    # Recursive

chown alice file.txt              # Change owner
chown alice:www-data file.txt     # Change owner and group
chown -R www-data /var/www/       # Recursive`}</code></pre>

      <h2>Process Management</h2>
      <pre><code>{`ps aux                   # All running processes
ps aux | grep nginx      # Find process by name
top                      # Interactive process monitor
htop                     # Better interactive monitor (may need install)

kill 1234                # Kill process by PID (SIGTERM)
kill -9 1234             # Force kill (SIGKILL)
killall nginx            # Kill all processes named nginx
pkill -f "python script" # Kill by command pattern

# Run in background
./script.sh &            # Background process
nohup ./script.sh &      # Survives terminal close
disown %1                # Detach from shell

jobs                     # List background jobs
fg %1                    # Bring job to foreground`}</code></pre>

      <h2>Disk & Memory</h2>
      <pre><code>{`df -h                  # Disk usage (human readable)
du -sh /var/log/       # Directory size
du -sh * | sort -hr    # All dirs sorted by size

free -h                # RAM and swap usage
vmstat 1               # VM stats every 1 second

lsblk                  # List block devices
mount /dev/sdb1 /mnt   # Mount disk
umount /mnt            # Unmount`}</code></pre>

      <h2>Networking</h2>
      <pre><code>{`ip addr                          # Show IP addresses (modern)
ifconfig                         # Show interfaces (older)
ip route                         # Show routing table

ping google.com                  # Test connectivity
traceroute google.com            # Trace network path
nslookup example.com             # DNS lookup
dig example.com A                # DNS lookup (detailed)
dig example.com MX               # MX records

curl -I https://example.com      # HTTP headers only
curl -X POST -H "Content-Type: application/json" \
  -d '{"key":"val"}' https://api.example.com/endpoint

wget https://example.com/file.zip  # Download file

ss -tulpn               # Open ports and listening sockets
netstat -tulpn          # Same (older)
lsof -i :3000           # What's using port 3000`}</code></pre>

      <h2>System Services (systemd)</h2>
      <pre><code>{`sudo systemctl start nginx      # Start service
sudo systemctl stop nginx       # Stop service
sudo systemctl restart nginx    # Restart service
sudo systemctl reload nginx     # Reload config (no downtime)
sudo systemctl enable nginx     # Start on boot
sudo systemctl disable nginx    # Don't start on boot
sudo systemctl status nginx     # Check status

journalctl -u nginx             # Service logs
journalctl -u nginx -f          # Follow logs
journalctl -u nginx --since "1 hour ago"   # Recent logs`}</code></pre>

      <h2>Archiving & Compression</h2>
      <pre><code>{`tar -czf archive.tar.gz dir/    # Create gzip archive
tar -xzf archive.tar.gz         # Extract gzip archive
tar -czf archive.tar.gz -C /path dir/  # Archive from path

zip -r archive.zip dir/         # Create zip
unzip archive.zip               # Extract zip
unzip archive.zip -d /dest/     # Extract to directory`}</code></pre>

      <h2>Text Processing</h2>
      <pre><code>{`sed 's/old/new/g' file.txt            # Replace all occurrences
sed -i 's/old/new/g' file.txt         # Edit file in-place
sed -n '10,20p' file.txt              # Print lines 10-20

awk '{print $1, $3}' file.txt         # Print columns 1 and 3
awk -F',' '{print $2}' data.csv       # CSV column 2
awk '/pattern/ {print $0}' file.txt   # Print matching lines

diff file1.txt file2.txt              # Compare files
sort file.txt | uniq                  # Remove duplicate lines`}</code></pre>

      <h2>Environment & Variables</h2>
      <pre><code>{`env                          # All environment variables
echo $PATH                   # Print PATH
export MY_VAR="value"        # Set variable for session
echo $MY_VAR                 # Use variable

source ~/.bashrc             # Reload shell config
which python3                # Find command location
type nginx                   # Show command type/location`}</code></pre>

      <h2>SSH</h2>
      <pre><code>{`ssh user@host                        # Connect
ssh -p 2222 user@host                # Custom port
ssh -i ~/.ssh/mykey.pem user@host    # Specific key
ssh-copy-id user@host                # Copy public key to server

scp file.txt user@host:/remote/path/      # Copy to server
scp user@host:/remote/file.txt ./local/   # Copy from server
rsync -avz ./local/ user@host:/remote/   # Sync directory`}</code></pre>
    </article>
  )
}
