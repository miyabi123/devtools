'use client'

export default function GitCommandsCheatsheet() {
  return (
    <article className="prose-freeutil">
      <p>
        A concise Git reference covering the commands you use daily, organized by task. From setup to advanced workflows.
      </p>

      <h2>Setup & Configuration</h2>
      <pre><code>{`git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global core.editor "vim"
git config --list                    # View all config
git config --global alias.st status  # Create alias`}</code></pre>

      <h2>Starting a Repository</h2>
      <pre><code>{`git init                        # Initialize new repo
git clone https://github.com/u/repo.git    # Clone remote
git clone --depth 1 https://...            # Shallow clone (faster)`}</code></pre>

      <h2>Staging & Committing</h2>
      <pre><code>{`git status                      # What's changed?
git diff                        # Unstaged changes
git diff --staged               # Staged changes

git add file.txt                # Stage a file
git add .                       # Stage all changes
git add -p                      # Stage interactively (hunk by hunk)

git commit -m "message"         # Commit staged changes
git commit -am "message"        # Stage tracked files + commit
git commit --amend              # Edit last commit (before push)
git commit --amend --no-edit    # Amend without changing message`}</code></pre>

      <h2>Branching</h2>
      <pre><code>{`git branch                      # List local branches
git branch -a                   # List all (including remote)
git branch feature/login        # Create branch
git checkout feature/login      # Switch to branch
git checkout -b feature/login   # Create + switch in one step
git switch -c feature/login     # Modern syntax (Git 2.23+)

git branch -d feature/login     # Delete (safe — only if merged)
git branch -D feature/login     # Force delete (unmerged ok)
git branch -m old-name new-name # Rename branch`}</code></pre>

      <h2>Merging & Rebasing</h2>
      <pre><code>{`git merge feature/login         # Merge into current branch
git merge --no-ff feature/login # Always create merge commit
git merge --squash feature/login # Squash into one commit

git rebase main                 # Rebase current branch onto main
git rebase -i HEAD~3            # Interactive rebase last 3 commits
git rebase --abort              # Abort rebase in progress
git rebase --continue           # Continue after resolving conflict

git cherry-pick abc123          # Apply a specific commit
git cherry-pick abc123..def456  # Range of commits`}</code></pre>

      <h2>Remote Operations</h2>
      <pre><code>{`git remote -v                           # List remotes
git remote add origin https://...       # Add remote
git remote set-url origin https://...   # Change remote URL

git fetch origin                # Download changes (don't merge)
git fetch --all --prune         # Fetch all remotes, remove deleted

git pull                        # Fetch + merge
git pull --rebase               # Fetch + rebase (cleaner history)

git push origin main            # Push to remote
git push -u origin feature/x   # Push + set upstream
git push --force-with-lease     # Force push (safer than --force)
git push origin --delete old-branch  # Delete remote branch`}</code></pre>

      <h2>Stashing</h2>
      <pre><code>{`git stash                       # Stash current changes
git stash push -m "WIP login"   # Stash with description
git stash list                  # List stashes
git stash pop                   # Apply latest + remove from stack
git stash apply stash@{2}       # Apply specific stash (keep it)
git stash drop stash@{0}        # Delete a stash
git stash clear                 # Delete all stashes`}</code></pre>

      <h2>Undoing Changes</h2>
      <pre><code>{`git restore file.txt            # Discard unstaged changes (Git 2.23+)
git checkout -- file.txt        # Same (older Git)
git restore --staged file.txt   # Unstage file

git reset HEAD~1                # Undo last commit, keep changes staged
git reset --soft HEAD~1         # Undo commit, keep changes staged
git reset --mixed HEAD~1        # Undo commit, keep changes unstaged
git reset --hard HEAD~1         # Undo commit, DISCARD changes ⚠️

git revert abc123               # Revert a commit (creates new commit)
git revert HEAD                 # Revert last commit`}</code></pre>

      <h2>History & Logs</h2>
      <pre><code>{`git log                         # Full commit history
git log --oneline               # Compact view
git log --oneline --graph       # Graph with branches
git log --oneline -10           # Last 10 commits
git log --author="Alice"        # Filter by author
git log --since="2024-01-01"    # Since a date
git log -- file.txt             # History for a file
git log -p file.txt             # History with diffs for a file

git show abc123                 # Show commit details
git blame file.txt              # Who changed each line
git diff HEAD~3 HEAD -- file.txt  # File diff between commits`}</code></pre>

      <h2>Tags</h2>
      <pre><code>{`git tag                         # List tags
git tag v1.0.0                  # Lightweight tag
git tag -a v1.0.0 -m "Release"  # Annotated tag
git push origin v1.0.0          # Push a tag
git push origin --tags          # Push all tags
git tag -d v1.0.0               # Delete local tag
git push origin --delete v1.0.0 # Delete remote tag`}</code></pre>

      <h2>Useful Aliases</h2>
      <pre><code>{`git config --global alias.st "status"
git config --global alias.co "checkout"
git config --global alias.br "branch"
git config --global alias.lg "log --oneline --graph --all"
git config --global alias.undo "reset HEAD~1 --mixed"
git config --global alias.last "log -1 HEAD --stat"`}</code></pre>

      <h2>Gitignore Patterns</h2>
      <pre><code>{`# .gitignore
node_modules/
.env
.env.local
*.log
dist/
.DS_Store
*.pyc
__pycache__/
.vscode/
coverage/

# Ignore everything in a dir except one file
secret/*
!secret/public-config.json`}</code></pre>
    </article>
  )
}
