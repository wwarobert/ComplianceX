# Azure DevOps Marketplace Deployment Guide

## Prerequisites

### 1. Publisher Account
1. Go to [Visual Studio Marketplace Management](https://marketplace.visualstudio.com/manage)
2. Sign in with your Azure DevOps account
3. Create a publisher if you don't have one:
   - Click "Create publisher"
   - Fill in the required information
   - Note down the Publisher ID

### 2. Required Permissions
1. Ensure you have:
   - Owner or administrator rights on the publisher account
   - Permission to manage extensions in your Azure DevOps organization
   - A Personal Access Token (PAT) with Marketplace publishing permissions

## Preparation Steps

### 1. Update Extension Manifest
1. Edit `vss-extension.json`:
   ```json
   {
       "manifestVersion": 1,
       "id": "compliancex",
       "publisher": "your-publisher-id",
       "version": "1.0.0",
       // ... other settings
   }
   ```

### 2. Version Management
1. Update version numbers in:
   - `vss-extension.json`
   - `package.json`
   - Any version-dependent code

### 3. Extension Contents
1. Verify required files are included:
   - Extension icon (at least 128x128 pixels)
   - README.md
   - LICENSE
   - Privacy policy (if collecting user data)
   - Documentation

### 4. Marketplace Presentation
1. Prepare marketplace listing:
   - Overview.md with feature descriptions
   - Screenshots of key features
   - Demo videos (optional)
   - Support links
   - Q&A section

## Testing Before Publication

### 1. Local Testing
1. Build the extension:
   ```bash
   npm run build
   ```

2. Package the extension:
   ```bash
   npm run package
   ```

3. Install in test organization:
   ```bash
   tfx extension install --vsix ComplianceX-1.0.0.vsix --publisher your-publisher-id
   ```

### 2. Validation Testing
1. Test all features:
   - Core functionality
   - Edge cases
   - Error handling
   - UI/UX flows

2. Cross-browser testing:
   - Chrome
   - Firefox
   - Edge

3. Performance testing:
   - Large organizations
   - Multiple projects
   - Concurrent users

## Publishing Process

### 1. Initial Private Publication
1. Share with test organization:
   ```bash
   tfx extension publish --vsix ComplianceX-1.0.0.vsix --share-with your-test-org
   ```

2. Verify in test organization:
   - Installation process
   - Configuration
   - All features
   - Performance
   - Security

### 2. Public Release
1. Update visibility in `vss-extension.json`:
   ```json
   {
       "public": true,
       // ... other settings
   }
   ```

2. Publish to Marketplace:
   ```bash
   tfx extension publish --vsix ComplianceX-1.0.0.vsix
   ```

### 3. Post-Publication Steps
1. Verify marketplace listing
2. Monitor installation metrics
3. Set up support channels
4. Document known issues

## Maintenance

### 1. Version Updates
1. Update version numbers
2. Update changelog
3. Test new version
4. Publish update:
   ```bash
   tfx extension publish --vsix ComplianceX-x.x.x.vsix
   ```

### 2. Monitoring
1. Set up monitoring for:
   - Installation success rate
   - Usage metrics
   - Error rates
   - Performance metrics

### 3. Support
1. Monitor:
   - Q&A section
   - Support tickets
   - GitHub issues
2. Provide timely responses
3. Update documentation as needed

## Compliance Requirements

### 1. Microsoft Requirements
- Follow [Microsoft Publisher Agreement](https://aka.ms/vsmarketplace-agreement)
- Comply with [Marketplace Policy](https://aka.ms/vsmarketplace-policy)
- Maintain data privacy standards

### 2. Security Requirements
- Regular security audits
- Dependency updates
- Vulnerability scanning
- Access control review

## Troubleshooting

### Common Publishing Issues
1. **Validation Errors**
   - Check manifest format
   - Verify all required files
   - Review size limits

2. **Installation Failures**
   - Check permissions
   - Verify dependencies
   - Review compatibility

3. **Version Conflicts**
   - Clear version history
   - Use semantic versioning
   - Update all version references

## Best Practices

1. **Release Management**
   - Maintain release notes
   - Use release branches
   - Tag releases in git
   - Follow semver

2. **Documentation**
   - Keep docs updated
   - Include screenshots
   - Provide examples
   - Document breaking changes

3. **Support**
   - Monitor feedback
   - Respond promptly
   - Update FAQs
   - Track issues

4. **Testing**
   - Automated tests
   - Manual validation
   - Beta testing
   - Performance testing