'use client'

export default function NewDeveloperOnboardingChecklist() {
  return (
    <article className="prose-freeutil">
      <p>Whether you're a new developer setting up your first machine or a team lead onboarding someone new, this checklist covers everything needed to go from zero to productive. Follow it in order — each step builds on the previous.</p>

      <h2>1. SSH Keys</h2>
      <pre><code>{`# Generate Ed25519 key pair
ssh-keygen -t ed25519 -C "your@email.com"
# Accept default location (~/.ssh/id_ed25519)
# Set a passphrase (recommended)

# Add to GitHub: github.com → Settings → SSH and GPG keys → New SSH key
cat ~/.ssh/id_ed25519.pub  # Copy this

# Test
ssh -T git@github.com  # "Hi username! You've successfully authenticated"`}</code></pre>

      <h2>2. Git Configuration</h2>
      <pre><code>{`git config --global user.name "Your Name"
git config --global user.email "your@email.com"
git config --global core.editor "code --wait"   # VS Code
git config --global init.defaultBranch main
git config --global pull.rebase false           # Use merge for pulls

# Useful aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.lg "log --oneline --graph --all"`}</code></pre>

      <h2>3. Clone the Repository</h2>
      <pre><code>{`# Always clone via SSH (not HTTPS) for developer machines
git clone git@github.com:company/repo.git

cd repo
ls -la  # Look for .env.example, README.md, package.json`}</code></pre>

      <h2>4. Environment Variables</h2>
      <pre><code>{`# Copy the example env file
cp .env.example .env

# Fill in values from team password manager / documentation
# NEVER commit .env — verify it's in .gitignore
cat .gitignore | grep .env  # Should appear

# Common variables to ask the team about:
# DATABASE_URL, JWT_SECRET, API keys (Stripe, SendGrid, etc.)`}</code></pre>

      <h2>5. Install Dependencies</h2>
      <pre><code>{`# Node.js projects
npm install          # or
yarn install         # or
pnpm install

# Python projects
python3 -m venv venv
source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt

# Check if there's a Docker option (often faster)
docker compose up   # Spins up everything`}</code></pre>

      <h2>6. Run the Project</h2>
      <pre><code>{`# Check package.json / Makefile / README for the start command
npm run dev        # Most Node.js projects
python manage.py runserver  # Django

# Verify it works at localhost:3000 (or whatever port)
# Run the tests
npm test
pytest`}</code></pre>

      <h2>7. Editor Setup (VS Code)</h2>
      <pre><code>{`# Install from the command line
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension eamodio.gitlens
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-python.python  # If Python project

# Check if the repo has .vscode/settings.json for team config
ls .vscode/`}</code></pre>

      <h2>8. Team Conventions to Learn</h2>
      <ul>
        <li>Branch naming: <code>feature/description</code>, <code>fix/bug-name</code>, <code>chore/task</code></li>
        <li>Commit message format (conventional commits or team standard)</li>
        <li>PR review process: how many approvals, who reviews what</li>
        <li>Deployment process: how does code get to staging/production?</li>
        <li>On-call rotation: who gets paged when production breaks?</li>
        <li>Where is documentation: Notion, Confluence, GitHub Wiki?</li>
        <li>How to get help: Slack channel, pairing sessions, office hours?</li>
      </ul>

      <h2>9. First Week Goals</h2>
      <ul>
        <li>Get the project running locally ✅</li>
        <li>Make a small, safe change and open a PR</li>
        <li>Have your first PR reviewed and merged</li>
        <li>Attend one team standup / meeting</li>
        <li>Read the last 3 postmortems (understand what broke and why)</li>
        <li>Ask about the most confusing part of the codebase</li>
      </ul>
    </article>
  )
}
