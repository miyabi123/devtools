'use client'

export default function LinuxCronJobSetup() {
  return (
    <article className="prose-freeutil">
      <p>Cron is the standard Linux task scheduler, but it has quirks that cause jobs to fail silently — the most frustrating kind of failure. This guide covers setup, common failure modes, and debugging techniques.</p>

      <h2>Crontab Syntax</h2>
      <pre><code>{`# ┌───────────── minute (0-59)
# │ ┌───────────── hour (0-23)
# │ │ ┌───────────── day of month (1-31)
# │ │ │ ┌───────────── month (1-12)
# │ │ │ │ ┌───────────── day of week (0-6, 0=Sunday)
# │ │ │ │ │
# * * * * * command to execute

0 2 * * *     /usr/bin/backup.sh      # Daily at 2:00 AM
*/15 * * * *  /usr/bin/healthcheck.sh  # Every 15 minutes
0 9 * * 1-5   /usr/bin/report.sh      # Weekdays at 9 AM
0 0 1 * *     /usr/bin/monthly.sh     # First of each month`}</code></pre>

      <h2>Editing Crontab</h2>
      <pre><code>{`crontab -e    # Edit current user's crontab
crontab -l    # List current user's crontab
crontab -r    # Remove current user's crontab (careful!)

# System-wide crontab (root)
sudo crontab -e

# Or add files to /etc/cron.d/ for system jobs
# /etc/cron.d/myjob
0 3 * * * root /usr/bin/myjob.sh`}</code></pre>

      <h2>Why Cron Jobs Fail Silently</h2>

      <h3>1. Environment Variables</h3>
      <p>Cron runs with a minimal environment — not your login shell. <code>PATH</code> is typically just <code>/usr/bin:/bin</code>. Commands that work in your terminal may fail in cron because they're not in the cron PATH.</p>
      <pre><code>{`# ❌ May fail — python3 not in cron's PATH
0 * * * * python3 /home/user/script.py

# ✅ Use full paths
0 * * * * /usr/bin/python3 /home/user/script.py

# Or set PATH at the top of your crontab
PATH=/usr/local/bin:/usr/bin:/bin
0 * * * * python3 /home/user/script.py`}</code></pre>

      <h3>2. Working Directory</h3>
      <p>Cron's working directory is the user's home directory, not the script's directory. Scripts that use relative paths for config files or outputs will fail.</p>
      <pre><code>{`# ✅ Change to the script's directory first
0 * * * * cd /opt/myapp && ./run.sh

# Or use absolute paths inside your script`}</code></pre>

      <h3>3. No Output — Silent Failures</h3>
      <p>Cron discards stdout and stderr unless you configure email or redirect output. Always redirect to a log file during development:</p>
      <pre><code>{`# Redirect stdout and stderr to a log file
0 2 * * * /usr/bin/backup.sh >> /var/log/backup.log 2>&1

# Rotate logs to prevent them growing unboundedly
# Use logrotate or append a date:
0 2 * * * /usr/bin/backup.sh >> /var/log/backup-$(date +\%Y\%m\%d).log 2>&1`}</code></pre>

      <h2>Debugging Cron Jobs</h2>
      <pre><code>{`# Check if cron is running
sudo systemctl status cron

# Check cron logs (Ubuntu/Debian)
grep CRON /var/log/syslog
journalctl -u cron --since "1 hour ago"

# Test your script as cron would run it
# (minimal environment, no login shell)
env -i HOME=/home/user LANG=en_US.UTF-8 /bin/sh -c "/usr/bin/myscript.sh"

# Check if script is executable
ls -la /usr/bin/myscript.sh  # Must have execute permission
chmod +x /usr/bin/myscript.sh`}</code></pre>

      <h2>Systemd Timers — A Modern Alternative</h2>
      <p>Systemd timers are more powerful than cron: they support dependencies, can run on boot, and their logs are accessible via <code>journalctl</code>.</p>
      <pre><code>{`# /etc/systemd/system/backup.service
[Unit]
Description=Daily Backup

[Service]
Type=oneshot
ExecStart=/usr/bin/backup.sh

# /etc/systemd/system/backup.timer
[Unit]
Description=Run backup daily

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target

# Enable and start
sudo systemctl enable --now backup.timer
sudo systemctl list-timers  # View all timers
journalctl -u backup.service  # View logs`}</code></pre>
    </article>
  )
}
