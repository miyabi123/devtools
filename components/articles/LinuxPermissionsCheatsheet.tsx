'use client'

export default function LinuxPermissionsCheatsheet() {
  return (
    <>
      <h2>Reading Permissions with ls -l</h2>
      <p>
        Run <code>ls -l</code> in any directory and you'll see a string like <code>-rwxr-xr-x</code> at the start of each line. Here's how to decode it:
      </p>
      <pre><code>{`-rwxr-xr-x  1  alice  staff  4096  May 1 10:00  myscript.sh
│└──┘└──┘└──┘
│  │   │   │
│  │   │   └── Others: r-x = read + execute (no write)
│  │   └────── Group:  r-x = read + execute (no write)
│  └────────── Owner:  rwx = read + write + execute
└───────────── Type: - = file, d = directory, l = symlink`}</code></pre>

      <h2>The Three Permission Sets</h2>
      <table>
        <thead><tr><th>Set</th><th>Who it applies to</th></tr></thead>
        <tbody>
          <tr><td><strong>Owner (u)</strong></td><td>The user who owns the file</td></tr>
          <tr><td><strong>Group (g)</strong></td><td>Members of the file's group</td></tr>
          <tr><td><strong>Others (o)</strong></td><td>Everyone else on the system</td></tr>
        </tbody>
      </table>

      <h2>The Three Permission Bits</h2>
      <table>
        <thead><tr><th>Letter</th><th>Octal</th><th>On files</th><th>On directories</th></tr></thead>
        <tbody>
          <tr><td><code>r</code></td><td>4</td><td>Read file contents</td><td>List directory contents (<code>ls</code>)</td></tr>
          <tr><td><code>w</code></td><td>2</td><td>Write / modify file</td><td>Create, delete, rename files inside</td></tr>
          <tr><td><code>x</code></td><td>1</td><td>Execute as program</td><td>Enter directory (<code>cd</code>)</td></tr>
          <tr><td><code>-</code></td><td>0</td><td>Permission denied</td><td>Permission denied</td></tr>
        </tbody>
      </table>

      <div className="callout callout-blue">
        <p><strong>Directories need execute to be useful.</strong> Without <code>x</code> on a directory, you can't <code>cd</code> into it or access files inside — even if you have <code>r</code>. This surprises many newcomers.</p>
      </div>

      <h2>Octal Notation</h2>
      <p>
        Each permission set (owner/group/others) maps to a single octal digit (0–7) by summing the bits:
      </p>
      <table>
        <thead><tr><th>Octal</th><th>Binary</th><th>Symbolic</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td>7</td><td>111</td><td>rwx</td><td>Read + Write + Execute</td></tr>
          <tr><td>6</td><td>110</td><td>rw-</td><td>Read + Write</td></tr>
          <tr><td>5</td><td>101</td><td>r-x</td><td>Read + Execute</td></tr>
          <tr><td>4</td><td>100</td><td>r--</td><td>Read only</td></tr>
          <tr><td>3</td><td>011</td><td>-wx</td><td>Write + Execute (rare)</td></tr>
          <tr><td>2</td><td>010</td><td>-w-</td><td>Write only (rare)</td></tr>
          <tr><td>1</td><td>001</td><td>--x</td><td>Execute only (rare)</td></tr>
          <tr><td>0</td><td>000</td><td>---</td><td>No permissions</td></tr>
        </tbody>
      </table>

      <h2>Common Permission Patterns</h2>
      <table>
        <thead><tr><th>Octal</th><th>Symbolic</th><th>Use Case</th></tr></thead>
        <tbody>
          <tr><td><code>755</code></td><td>rwxr-xr-x</td><td>Directories, executable scripts — owner full, everyone can read/enter</td></tr>
          <tr><td><code>644</code></td><td>rw-r--r--</td><td>Web files (HTML, CSS, images) — owner can edit, everyone can read</td></tr>
          <tr><td><code>600</code></td><td>rw-------</td><td>Private keys, config files with secrets — owner only</td></tr>
          <tr><td><code>700</code></td><td>rwx------</td><td>Private scripts, home directories — owner only</td></tr>
          <tr><td><code>640</code></td><td>rw-r-----</td><td>Config files readable by group (e.g., web server group)</td></tr>
          <tr><td><code>664</code></td><td>rw-rw-r--</td><td>Shared files within a team</td></tr>
          <tr><td><code>777</code></td><td>rwxrwxrwx</td><td>⚠️ Everyone has full access. Never use in production.</td></tr>
        </tbody>
      </table>

      <h2>chmod — Changing Permissions</h2>
      <h3>Numeric (octal) mode</h3>
      <pre><code>{`chmod 755 myscript.sh      # rwxr-xr-x
chmod 644 index.html       # rw-r--r--
chmod 600 ~/.ssh/id_rsa    # rw-------  (private key must be 600)
chmod -R 755 /var/www/     # recursive — all files and dirs`}</code></pre>

      <h3>Symbolic mode</h3>
      <pre><code>{`chmod +x myscript.sh       # add execute for all
chmod u+x myscript.sh      # add execute for owner only
chmod g-w file.txt         # remove write from group
chmod o-rwx secret.conf    # remove all from others
chmod a=r file.txt         # set everyone to read-only (= replaces)
chmod u=rwx,g=rx,o=r file  # set all three at once`}</code></pre>

      <h2>chown — Changing Ownership</h2>
      <pre><code>{`chown alice file.txt           # change owner to alice
chown alice:staff file.txt     # change owner and group
chown -R www-data /var/www/    # recursive — web server ownership
chown :developers project/     # change group only`}</code></pre>

      <h2>chgrp — Changing Group</h2>
      <pre><code>{`chgrp developers project/
chgrp -R www-data /var/www/html/`}</code></pre>

      <h2>umask — Default Permissions</h2>
      <p>
        <code>umask</code> controls the default permissions for newly created files and directories. It works as a <em>mask</em> that removes bits from the maximum default (666 for files, 777 for directories).
      </p>
      <pre><code>{`umask         # view current umask (typically 022)
umask 022     # most common: new files=644, new dirs=755
umask 027     # stricter: new files=640, new dirs=750`}</code></pre>
      <table>
        <thead><tr><th>umask</th><th>New file perms</th><th>New dir perms</th></tr></thead>
        <tbody>
          <tr><td>022</td><td>644 (rw-r--r--)</td><td>755 (rwxr-xr-x)</td></tr>
          <tr><td>027</td><td>640 (rw-r-----)</td><td>750 (rwxr-x---)</td></tr>
          <tr><td>077</td><td>600 (rw-------)</td><td>700 (rwx------)</td></tr>
        </tbody>
      </table>

      <h2>Special Bits: setuid, setgid, Sticky Bit</h2>
      <h3>Setuid (SUID) — octal 4xxx</h3>
      <p>
        When set on an executable, the file runs as the owner's user, not the caller's. This is how <code>passwd</code> can write to <code>/etc/shadow</code> even when run by a regular user.
      </p>
      <pre><code>{`chmod u+s /usr/bin/passwd   # set SUID
ls -l /usr/bin/passwd       # shows: -rwsr-xr-x (s in owner execute)`}</code></pre>

      <h3>Setgid (SGID) — octal 2xxx</h3>
      <p>
        On directories: new files inherit the directory's group rather than the creator's primary group. Useful for shared team directories.
      </p>
      <pre><code>{`chmod g+s /shared/project/  # set SGID on directory`}</code></pre>

      <h3>Sticky Bit — octal 1xxx</h3>
      <p>
        On directories: only the file owner (or root) can delete/rename files inside, even if the directory is world-writable. Used on <code>/tmp</code>.
      </p>
      <pre><code>{`chmod +t /tmp               # sticky bit (shows as 't' in others execute)
chmod 1777 /shared/uploads  # common: rwxrwxrwt`}</code></pre>

      <h2>SSH Key Permissions</h2>
      <p>SSH is strict about key file permissions. Wrong permissions = connection refused.</p>
      <pre><code>{`chmod 700 ~/.ssh/              # directory: owner only
chmod 600 ~/.ssh/id_rsa        # private key: owner read/write only
chmod 644 ~/.ssh/id_rsa.pub    # public key: world-readable is fine
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/config`}</code></pre>

      <h2>Web Server Quick Reference</h2>
      <pre><code>{`# Typical web directory setup
chown -R www-data:www-data /var/www/html/
find /var/www/html/ -type f -exec chmod 644 {} \;   # files: 644
find /var/www/html/ -type d -exec chmod 755 {} \;   # dirs: 755

# PHP writable uploads directory
chmod 775 /var/www/html/uploads/
chown www-data:developers /var/www/html/uploads/`}</code></pre>

      <div className="callout">
        <p><strong>Never use 777 in production.</strong> If your app needs to write files, set the correct user/group with <code>chown</code> and use 755/664 instead of opening everything to everyone.</p>
      </div>

      <h2>Quick Reference Card</h2>
      <pre><code>{`# View permissions
ls -la                    # all files including hidden
stat filename             # detailed info including octal perms
namei -l /path/to/file    # show permissions along entire path

# chmod shortcuts
chmod +x file             # make executable
chmod -x file             # remove executable
chmod -R 755 dir/         # recursive

# Find files with wrong permissions
find /var/www/ -name "*.php" -not -perm 644
find /home/ -type f -perm /o+w    # world-writable files (security check)
find / -perm /4000 -type f        # SUID files`}</code></pre>
    </>
  )
}
