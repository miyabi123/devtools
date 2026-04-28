'use client'

export default function LinuxFilePermissionsExplained() {
  return (
    <article className="prose-freeutil">
      <p>Linux file permissions control who can read, write, and execute files. Understanding them is essential for secure system administration — wrong permissions are a common cause of both security vulnerabilities and broken applications.</p>

      <h2>Reading ls -l Output</h2>
      <pre><code>{`$ ls -l /var/www/html/index.html
-rwxr-xr-- 1 www-data developers 4096 Apr 1 12:00 index.html`}</code></pre>
      <p>Breaking down the permission string <code>-rwxr-xr--</code>:</p>
      <table>
        <thead>
          <tr><th>Character(s)</th><th>Meaning</th></tr>
        </thead>
        <tbody>
          <tr><td><code>-</code></td><td>File type: <code>-</code> = regular file, <code>d</code> = directory, <code>l</code> = symlink</td></tr>
          <tr><td><code>rwx</code></td><td>Owner permissions: read, write, execute</td></tr>
          <tr><td><code>r-x</code></td><td>Group permissions: read, no write, execute</td></tr>
          <tr><td><code>r--</code></td><td>Other permissions: read only</td></tr>
        </tbody>
      </table>

      <h2>Octal Notation</h2>
      <p>Each permission set maps to a number: read=4, write=2, execute=1. Sum them to get the octal digit:</p>
      <table>
        <thead>
          <tr><th>Octal</th><th>Symbolic</th><th>Permissions</th></tr>
        </thead>
        <tbody>
          <tr><td>7</td><td>rwx</td><td>Read + Write + Execute</td></tr>
          <tr><td>6</td><td>rw-</td><td>Read + Write</td></tr>
          <tr><td>5</td><td>r-x</td><td>Read + Execute</td></tr>
          <tr><td>4</td><td>r--</td><td>Read only</td></tr>
          <tr><td>0</td><td>---</td><td>No permissions</td></tr>
        </tbody>
      </table>
      <p>So <code>755</code> = owner rwx (7), group r-x (5), others r-x (5). <code>644</code> = owner rw- (6), group r-- (4), others r-- (4).</p>

      <h2>chmod — Changing Permissions</h2>
      <pre><code>{`# Octal syntax
chmod 755 script.sh      # rwxr-xr-x
chmod 644 config.txt     # rw-r--r--
chmod 600 private.key    # rw------- (only owner can read/write)
chmod -R 755 /var/www/   # Recursive — apply to all files and dirs

# Symbolic syntax
chmod u+x script.sh      # Add execute for owner
chmod g-w file.txt       # Remove write from group
chmod o= file.txt        # Remove all permissions from others
chmod a+r file.txt       # Add read for all (user + group + others)`}</code></pre>

      <h2>chown — Changing Ownership</h2>
      <pre><code>{`chown alice file.txt           # Change owner to alice
chown alice:developers file.txt # Change owner and group
chown -R www-data /var/www/    # Recursive — change all files in directory
chgrp developers file.txt      # Change group only`}</code></pre>

      <h2>Common Permission Patterns</h2>
      <table>
        <thead>
          <tr><th>Permission</th><th>Use case</th></tr>
        </thead>
        <tbody>
          <tr><td>755</td><td>Web directories, executables — owner full, others read/execute</td></tr>
          <tr><td>644</td><td>Web files, configs — owner read/write, others read-only</td></tr>
          <tr><td>600</td><td>Private keys, secrets — owner read/write only</td></tr>
          <tr><td>700</td><td>Private directories — owner full access only</td></tr>
          <tr><td>777</td><td>⚠️ All permissions for everyone — almost never correct</td></tr>
        </tbody>
      </table>

      <h2>Special Permission Bits</h2>
      <p><strong>setuid (4xxx)</strong> — When set on an executable, it runs with the file owner's permissions instead of the executing user's. Used by system binaries like <code>passwd</code>.</p>
      <p><strong>setgid (2xxx)</strong> — On executables, runs with the group's permissions. On directories, new files inherit the directory's group.</p>
      <p><strong>sticky bit (1xxx)</strong> — On directories, only the file owner can delete their own files. Used on <code>/tmp</code>.</p>
      <pre><code>{`chmod 4755 binary     # setuid
chmod 2755 directory  # setgid
chmod 1777 /tmp       # sticky bit`}</code></pre>

      <h2>umask — Default Permissions</h2>
      <p>umask sets the default permissions subtracted from new files. A umask of 022 means new files get 644 (666-022) and new directories get 755 (777-022):</p>
      <pre><code>{`umask          # Show current umask
umask 022      # Standard: files=644, dirs=755
umask 027      # More restrictive: files=640, dirs=750`}</code></pre>
    </article>
  )
}
