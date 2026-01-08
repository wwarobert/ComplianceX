# Wiki Sync Setup Instructions

## Problem
The GitHub Actions `GITHUB_TOKEN` does not have permission to push to the wiki repository by default.

## Solution

### Option 1: Configure Personal Access Token (Recommended)

1. **Create a Personal Access Token (PAT)**:
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Give it a name: `ComplianceX Wiki Sync`
   - Select scopes:
     - ✅ `repo` (Full control of private repositories)
   - Set expiration (recommend: 90 days, then renew)
   - Click "Generate token"
   - **Copy the token immediately** (you won't see it again!)

2. **Add token as repository secret**:
   - Go to your repository: `https://github.com/wwarobert/ComplianceX`
   - Click **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `WIKI_TOKEN`
   - Value: Paste the PAT you copied
   - Click **Add secret**

3. **Enable the wiki sync**:
   - Go to **Settings** → **Variables** → **Actions**
   - Click **New repository variable**
   - Name: `ENABLE_WIKI_SYNC`
   - Value: `true`
   - Click **Add variable**

4. **Enable Wiki in repository**:
   - Go to **Settings**
   - Scroll to **Features**
   - Check ✅ **Wikis**

5. **Test the workflow**:
   - Go to **Actions** → **Sync Wiki**
   - Click **Run workflow**
   - Select branch: `main`
   - Click **Run workflow**

### Option 2: Manual Wiki Updates (No Token Required)

If you prefer not to use automated sync:

1. **Clone the wiki repository**:
   ```bash
   git clone https://github.com/wwarobert/ComplianceX.wiki.git
   cd ComplianceX.wiki
   ```

2. **Copy documentation manually**:
   ```bash
   # From your main repo directory
   cp -r docs/* ../ComplianceX.wiki/
   cp .github/copilot-instructions.md ../ComplianceX.wiki/GitHub-Copilot-Instructions.md
   ```

3. **Create Home page**:
   ```bash
   cd ../ComplianceX.wiki
   # Create Home.md with content from sync-wiki.yml
   ```

4. **Commit and push**:
   ```bash
   git add .
   git commit -m "Update documentation"
   git push
   ```

### Option 3: Disable Wiki Sync

If you don't want to use the wiki:

1. **Delete the workflow file**:
   ```bash
   rm .github/workflows/sync-wiki.yml
   ```

2. **Keep documentation in `docs/` folder** (still accessible on GitHub)

## Security Notes

- **PAT Security**: Store PATs as secrets, never commit them to the repository
- **Token Scope**: Use minimal required scope (`repo` for private repos, or `public_repo` for public)
- **Token Expiration**: Set reasonable expiration dates and renew before they expire
- **Token Rotation**: Rotate tokens regularly for security
- **Alternative**: Consider using GitHub Apps for more granular permissions (advanced)

## Troubleshooting

### Error: "WIKI_TOKEN secret not configured"
- Follow Option 1 steps 1-2 to add the secret

### Error: "Permission denied"
- Verify the PAT has the correct scope (`repo`)
- Ensure the PAT hasn't expired
- Check that the secret name is exactly `WIKI_TOKEN`

### Error: "Repository not found"
- Enable Wiki in repository settings (Settings → Features → Wikis)
- Initialize the wiki by creating at least one page manually first

### Workflow doesn't run
- Ensure `ENABLE_WIKI_SYNC` variable is set to `true`
- Check that changes are in `docs/**` or `.github/copilot-instructions.md`
- Push to the `main` branch (not other branches)

## References

- [GitHub Actions: Creating encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub: Creating a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub Actions: Automatic token authentication](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)
