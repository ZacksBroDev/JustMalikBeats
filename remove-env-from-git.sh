#!/bin/bash
# Script to remove .env from git history
# WARNING: This will rewrite git history - coordinate with team members!

echo "⚠️  This will remove .env from git history"
echo "This is a DESTRUCTIVE operation that rewrites history!"
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 1
fi

echo "Backing up current .env file..."
cp .env .env.backup

echo "Removing .env from git history..."
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

echo "Forcing push to remote..."
echo "⚠️  This will require force push to remote repository"
read -p "Push to remote? (yes/no): " push_confirm

if [ "$push_confirm" = "yes" ]; then
    git push origin --force --all
    git push origin --force --tags
    echo "✅ Completed! .env removed from git history"
else
    echo "Local history cleaned. Run 'git push origin --force --all' manually when ready."
fi

echo ""
echo "Restoring .env file from backup..."
mv .env.backup .env

echo ""
echo "⚠️  IMPORTANT NEXT STEPS:"
echo "1. Tell all team members to re-clone the repository"
echo "2. Or have them run: git pull --rebase"
echo "3. Update .env with production secrets before deploying"
