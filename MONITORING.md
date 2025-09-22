# OpenPhone API Monitoring System

This repository includes an automated monitoring system that tracks changes to the OpenPhone API and creates GitHub issues when updates are detected.

## 🔍 What It Monitors

Based on the [OpenPhone API changelog](https://www.openphone.com/docs/mdx/api-reference/changelog), the system tracks:

- **API Version Changes**: When the OpenAPI specification version is updated
- **Changelog Updates**: When new entries are added to the changelog
- **Breaking Changes**: Major version updates that may require SDK updates
- **New Features**: Minor version updates with new functionality
- **Bug Fixes**: Patch version updates with fixes

## 📊 Current API Status

According to the latest changelog information:

- **Latest Version**: 1.2.0 (January 22, 2025)
- **Current SDK Version**: 1.0.1
- **Status**: ⚠️ **OUTDATED** - The API has been updated with new features

### Recent Changes (v1.2.0 - January 22, 2025)

- Added `externalId` property to contact model
- Added `externalId` and `source` parameters to Create Contact endpoint
- Added `externalId` and `source` parameters to Update Contact endpoint
- Added route to list contacts (`GET /contacts`)
- Fixed issue with invalid custom fields returning 500 error

## 🚀 How It Works

### Automated Monitoring

1. **Daily Checks**: Runs every day at 6 AM UTC
2. **Version Comparison**: Compares current API version with stored version
3. **Changelog Parsing**: Extracts recent changelog entries
4. **Issue Creation**: Creates GitHub issues when changes are detected
5. **Auto-Updates**: Updates OpenAPI spec and regenerates types

### Manual Checks

You can run manual checks using:

```bash
# Check for updates manually
bun run check-updates

# Run the monitoring script directly
bun run monitor-changelog
```

## 📋 GitHub Issues Created

The system creates different types of issues:

### API Version Updates
- **Title**: `🔄 OpenPhone API Version Update: v1.0.1 → v1.2.0`
- **Labels**: `api-update`, `version-1.2.0`, `needs-review`
- **Actions**: Updates OpenAPI spec, regenerates types, runs tests

### Changelog Updates
- **Title**: `📝 OpenPhone API Changelog Updated`
- **Labels**: `changelog-update`, `needs-review`
- **Actions**: Reviews changelog for new information

## 🔧 Workflow Files

### 1. API Version Check (`.github/workflows/api-version-check.yml`)
- **Schedule**: Daily at 6 AM UTC
- **Triggers**: Manual dispatch
- **Features**: Version checking, changelog monitoring, auto-updates

### 2. Changelog Monitor (`.github/workflows/changelog-monitor.yml`)
- **Schedule**: Weekly on Mondays at 9 AM UTC
- **Triggers**: Manual dispatch
- **Features**: Detailed changelog analysis, issue creation

## 📁 Monitoring Scripts

### `scripts/monitor-changelog.js`
- Fetches current OpenAPI specification
- Parses changelog HTML content
- Compares versions and changelog entries
- Returns structured monitoring results

### `scripts/check-updates.js`
- Manual update checker
- Provides detailed console output
- Saves results for GitHub Actions
- User-friendly interface

## 🏷️ Issue Labels

The system uses these labels for organization:

- `api-update`: API version changes
- `changelog-update`: Changelog updates
- `version-X.X.X`: Specific version updates
- `needs-review`: Requires human review
- `breaking-change`: Breaking changes detected
- `new-feature`: New features added
- `bug-fix`: Bug fixes included

## 📝 Action Items

When an issue is created, it includes these action items:

### For API Version Updates:
- [ ] Review the changelog for breaking changes
- [ ] Update the OpenAPI specification file
- [ ] Regenerate TypeScript types
- [ ] Update the SDK client if necessary
- [ ] Test the updated SDK
- [ ] Update documentation if needed
- [ ] Release new SDK version if applicable

### For Changelog Updates:
- [ ] Review the updated changelog
- [ ] Check if any changes affect the SDK
- [ ] Update documentation if needed

## 🔄 Auto-Update Process

When a version change is detected, the system automatically:

1. **Downloads** the new OpenAPI specification
2. **Backs up** the old specification
3. **Updates** the stored specification
4. **Regenerates** TypeScript types
5. **Runs tests** to ensure compatibility
6. **Commits changes** to the repository

## 🚨 Alerts and Notifications

- **GitHub Issues**: Created automatically when changes are detected
- **Workflow Summaries**: Detailed summaries in GitHub Actions
- **Console Output**: Detailed logging for manual runs
- **Email Notifications**: GitHub can send email notifications for failed workflows

## 🛠️ Configuration

### Environment Variables
- `GITHUB_TOKEN`: Required for creating issues and committing changes
- `NPM_TOKEN`: Required for publishing updates

### Schedule Customization
Edit the cron expressions in the workflow files:
- Daily check: `0 6 * * *` (6 AM UTC)
- Weekly check: `0 9 * * 1` (9 AM UTC on Mondays)

## 📊 Monitoring Dashboard

You can view the monitoring status in:
- **GitHub Actions**: Workflow runs and results
- **Issues**: Created issues and their status
- **Commits**: Auto-updates and changes
- **Releases**: New SDK versions

## 🔍 Troubleshooting

### Common Issues

1. **Monitoring Script Fails**
   - Check network connectivity
   - Verify OpenPhone API availability
   - Review error logs in GitHub Actions

2. **Issues Not Created**
   - Verify GitHub token permissions
   - Check for similar existing issues
   - Review workflow logs

3. **Auto-Update Fails**
   - Check file permissions
   - Verify git configuration
   - Review commit history

### Getting Help

- Check the [GitHub Actions logs](https://github.com/yourusername/openphone-api-sdk/actions)
- Review the [monitoring scripts](scripts/)
- Open an issue for support

## 📈 Future Enhancements

- [ ] Slack/Discord notifications
- [ ] Detailed change analysis
- [ ] Automatic SDK updates
- [ ] Performance monitoring
- [ ] Security vulnerability tracking
- [ ] Dependency update monitoring

---

*This monitoring system helps keep the OpenPhone API SDK up-to-date with the latest API changes and ensures users are notified of important updates.*
