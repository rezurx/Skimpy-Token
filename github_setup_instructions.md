# GitHub Setup Instructions for SKIMPY Token Project

This document outlines the steps to set up your SKIMPY Token project with a private GitHub repository using the GitHub CLI.

## Prerequisites:

Before you begin, ensure you have the following installed and configured on your system:

*   **Git:** The version control system.
    *   Verify installation: `git --version`
*   **GitHub CLI (`gh`):** The official GitHub command-line tool.
    *   Verify installation: `gh --version`
*   **GitHub CLI Authentication:** You must be authenticated with your GitHub account.
    *   Authenticate: `gh auth login` (follow the prompts)
*   **SSH Key or Personal Access Token:** Set up for pushing over HTTPS, if applicable.

## Step-by-Step GitHub Repository Setup:

Follow these commands in your terminal from the root of your `skimpy-token` project directory (`/home/resurx/blockchain-projects/skimpy-token/`).

```bash
# Navigate to your local Skimpy project folder (if not already there)
cd /home/resurx/blockchain-projects/skimpy-token

# Initialize Git (if not already done)
# This creates a new .git subdirectory and prepares the project for version control.
git init

# Add all current project files to the Git staging area
git add .

# Commit the staged files to your local repository
git commit -m "Initial commit of SKIMPY token project"

# Create a private GitHub repository using the GitHub CLI
# --private: Ensures the repository is private.
# --source=.: Links the new GitHub repo to your current local directory.
# --remote=origin: Sets the remote name to 'origin'.
# --push: Pushes your initial commit to the new remote repository.
gh repo create skimpy-token --private --source=. --remote=origin --push

# Set 'main' as the default branch (if it's not already set)
# This aligns with modern Git conventions.
git branch -M main

# Push the 'main' branch to the remote 'origin' and set it as the upstream branch
# This links your local 'main' branch to the remote 'main' branch.
git push -u origin main

# Verify that the repository was created and pushed successfully
# This command will open your new GitHub repository in your web browser.
gh repo view skimpy-token --web
```

## Expected Result:

Upon successful execution of the steps above, your project will be:

*   Pushed to a new **private** repository on GitHub under your account (`https://github.com/rezurx/skimpy-token`).
*   Configured with `origin` as its remote.
*   Set up with `main` as its default branch.
*   Accessible in your web browser for confirmation.

## Further Enhancements (Optional):

Once your basic GitHub setup is complete, you might consider these advanced integrations:

*   **Making the Repo Public:** If you decide to open-source your project later.
*   **Adding a Webhook to Discord:** For automated notifications (refer to `discord_webhook_setup.md`).
*   **Creating GitHub Actions:** For automated test runs, deployment, or other CI/CD workflows.
