#!/bin/bash

# Git commit script for SKIMPY Token project
# Usage: ./scripts/git-commit.sh "Your commit message"

if [ $# -eq 0 ]; then
    echo "❌ Error: Please provide a commit message"
    echo "Usage: ./scripts/git-commit.sh \"Your commit message\""
    exit 1
fi

COMMIT_MSG="$1"

echo "🔄 Staging all changes..."
git add .

echo "📝 Committing with message: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

if [ $? -eq 0 ]; then
    echo "⬆️  Pushing to GitHub..."
    git push
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully pushed to GitHub!"
        echo "🔔 Sending Discord notification..."
        node scripts/discord-notify.js "📦 New commit pushed: $COMMIT_MSG"
    else
        echo "❌ Failed to push to GitHub"
        exit 1
    fi
else
    echo "❌ Nothing to commit or commit failed"
fi