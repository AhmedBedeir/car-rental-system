# Car Rental System

## Git Workflow Instructions

### When a Pull Request is Merged to Main

When someone make a pull request from their branch to the main branch and merged, all team members (including the PR author) need to update their branches to incorporate these changes.

### For All Team Members (Including PR Authors)

After a PR is merged to main, follow these steps:

```bash
# Switch to your main branch
git checkout main

# Pull the latest changes from remote main
git pull origin main

# Switch back to your feature branch
git checkout your-branch

# Merge changes from main into your branch
git merge main

# Resolve any conflicts if necessary

# Push your updated branch if needed
git push origin your-feature-branch
```

### Before Pushing Your Changes

**IMPORTANT:** Always merge the latest changes from main before pushing your code:

### Best Practices

1. Update your branch regularly to avoid large, difficult merges
2. Always merge from main before pushing your changes
3. Communicate with your team when you're making significant changes
4. Make sure to pull main before creating new branches to start from the latest code
