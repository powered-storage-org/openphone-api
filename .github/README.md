# GitHub Actions CI/CD Pipeline

This repository includes a comprehensive CI/CD pipeline using GitHub Actions for automated testing, building, and publishing.

## Workflows

### 1. Main CI Pipeline (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Release events

**Jobs:**
- **Lint and Test**: Runs linting, formatting checks, tests, and builds
- **Build and Publish**: Publishes to npm on pushes to main branch
- **Release**: Creates GitHub releases
- **Security Audit**: Runs security vulnerability checks

### 2. Pull Request Checks (`.github/workflows/pr.yml`)

**Triggers:**
- Pull requests to `main` or `develop` branches

**Features:**
- Code quality checks
- Build verification
- File size monitoring
- Comprehensive testing

### 3. Release Workflow (`.github/workflows/release.yml`)

**Triggers:**
- Release events

**Features:**
- Automated npm publishing
- GitHub release creation
- Release notes generation

### 4. Manual Publish (`.github/workflows/manual-publish.yml`)

**Triggers:**
- Manual workflow dispatch

**Features:**
- Version selection
- NPM tag selection (latest, beta, alpha)
- Automated version bumping
- Git tagging

## Setup Instructions

### 1. Repository Secrets

Add the following secrets to your GitHub repository:

```
NPM_TOKEN - Your npm authentication token
```

To get an npm token:
1. Go to [npmjs.com](https://www.npmjs.com)
2. Sign in to your account
3. Go to Access Tokens
4. Generate a new token with "Automation" type
5. Copy the token and add it to your repository secrets

### 2. Branch Protection Rules

Set up branch protection rules for the `main` branch:
- Require status checks to pass before merging
- Require branches to be up to date before merging
- Require pull request reviews before merging
- Restrict pushes to the main branch

### 3. Dependabot Configuration

The repository includes Dependabot configuration (`.github/dependabot.yml`) for:
- Automatic dependency updates
- Security vulnerability monitoring
- Automated pull request creation

## Pipeline Features

### Code Quality
- **ESLint**: TypeScript linting with custom rules
- **Prettier**: Code formatting enforcement
- **TypeScript**: Type checking
- **Security Audit**: Vulnerability scanning

### Testing
- **Unit Tests**: Automated test execution
- **Build Verification**: Ensures code compiles correctly
- **File Size Checks**: Monitors bundle size

### Publishing
- **Automated Publishing**: Publishes to npm on main branch pushes
- **Version Management**: Automatic version bumping
- **Release Notes**: Automated release note generation
- **Multiple Tags**: Support for latest, beta, and alpha releases

### Security
- **Dependency Scanning**: Regular security audits
- **Token Management**: Secure secret handling
- **Access Control**: Branch protection rules

## Usage

### Running Locally

```bash
# Run the full CI pipeline locally
bun run ci

# Run individual steps
bun run lint          # Lint code
bun run format:check  # Check formatting
bun run type-check    # Type check
bun run test          # Run tests
bun run build         # Build project
```

### Manual Publishing

1. Go to the "Actions" tab in your GitHub repository
2. Select "Manual Publish" workflow
3. Click "Run workflow"
4. Enter the version number and npm tag
5. Click "Run workflow"

### Release Process

1. Create a new release in GitHub
2. The workflow will automatically:
   - Build the project
   - Publish to npm
   - Create a GitHub release
   - Generate release notes

## Monitoring

### Build Status
- Green checkmark: All checks passed
- Red X: One or more checks failed
- Yellow circle: Build in progress

### Notifications
- Email notifications for failed builds
- Slack/Discord integration (if configured)
- GitHub notifications

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check the Actions tab for detailed error logs
   - Ensure all dependencies are properly installed
   - Verify TypeScript compilation

2. **Publishing Failures**
   - Verify NPM_TOKEN secret is set correctly
   - Check npm package name availability
   - Ensure version number is unique

3. **Test Failures**
   - Review test output in the Actions logs
   - Ensure all tests are passing locally
   - Check for environment-specific issues

### Getting Help

- Check the [GitHub Actions documentation](https://docs.github.com/en/actions)
- Review the workflow files in `.github/workflows/`
- Open an issue in this repository for support

## Customization

### Adding New Checks
1. Add new scripts to `package.json`
2. Update the CI workflow to include the new checks
3. Test locally with `bun run ci`

### Modifying Publishing
1. Edit the publish workflows in `.github/workflows/`
2. Update the npm publishing configuration
3. Test with manual publish workflow

### Adding Notifications
1. Add notification steps to workflows
2. Configure webhook endpoints
3. Set up integration with your preferred service
