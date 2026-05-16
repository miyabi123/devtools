'use client'

export default function Chmod755Vs644() {
  return (
    <article className="prose-freeutil">
      <p>If you've ever set up a web server, you've been told to use 755 for directories and 644 for files. Here's exactly what those numbers mean and why they're the standard.</p>

      <h2>Decoding the Numbers</h2>
      <p>Each digit represents permissions for: <strong>owner</strong>, <strong>group</strong>, <strong>others</strong> (everyone else). The value is the sum of read (4) + write (2) + execute (1):</p>
      <table>
        <thead><tr><th>Value</th><th>Permission</th><th>Means</th></tr></thead>
        <tbody>
          <tr><td>7</td><td>rwx</td><td>Read + Write + Execute</td></tr>
          <tr><td>6</td><td>rw-</td><td>Read + Write</td></tr>
          <tr><td>5</td><td>r-x</td><td>Read + Execute</td></tr>
          <tr><td>4</td><td>r--</td><td>Read only</td></tr>
          <tr><td>0</td><td>---</td><td>No permissions</td></tr>
        </tbody>
      </table>

      <h2>chmod 755 — For Directories and Executables</h2>
      <pre><code>{`755 = 7 (owner) + 5 (group) + 5 (others)
    = rwx r-x r-x

Owner: read, write, execute  → Full control
Group: read, execute         → Can enter directory, read files, run scripts
Others: read, execute        → Same as group

chmod 755 /var/www/html/    # Web directory
chmod 755 deploy.sh         # Shell script`}</code></pre>
      <p>Execute on a directory means "can enter it" (cd into it). Without execute on a directory, you can't access anything inside, even with read permission.</p>

      <h2>chmod 644 — For Regular Files</h2>
      <pre><code>{`644 = 6 (owner) + 4 (group) + 4 (others)
    = rw- r-- r--

Owner: read, write   → Can edit the file
Group: read          → Can read but not modify
Others: read         → Can read but not modify

chmod 644 /var/www/html/index.html  # HTML file
chmod 644 config.php                 # Config file`}</code></pre>
      <p>Regular files don't need execute permission — only scripts and binaries do.</p>

      <h2>The Web Server Pattern</h2>
      <pre><code>{`# Typical web server file structure
drwxr-xr-x (755)  /var/www/html/          ← directory: enter + read
-rw-r--r-- (644)  /var/www/html/index.html ← file: read
-rw-r--r-- (644)  /var/www/html/style.css
drwxr-xr-x (755)  /var/www/html/images/   ← subdirectory
-rw-r--r-- (644)  /var/www/html/images/logo.png

# Web server (nginx, apache) runs as www-data user
# Needs to READ files and ENTER directories → 644/755 is correct
# Set recursively:
find /var/www/html -type d -exec chmod 755 {} \;
find /var/www/html -type f -exec chmod 644 {} \;`}</code></pre>

      <h2>Other Common Permission Sets</h2>
      <table>
        <thead><tr><th>Mode</th><th>Symbolic</th><th>Use case</th></tr></thead>
        <tbody>
          <tr><td>700</td><td>rwx------</td><td>Private directories, SSH keys directory</td></tr>
          <tr><td>600</td><td>rw-------</td><td>Private keys, .env files with secrets</td></tr>
          <tr><td>755</td><td>rwxr-xr-x</td><td>Directories, executable scripts</td></tr>
          <tr><td>644</td><td>rw-r--r--</td><td>Web files, config files</td></tr>
          <tr><td>777</td><td>rwxrwxrwx</td><td>⚠️ Avoid — world-writable, security risk</td></tr>
        </tbody>
      </table>
    </article>
  )
}
