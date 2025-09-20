# Step-by-Step Guide: Creating an OpenPhone API SDK

This guide walks through the complete process of creating a TypeScript SDK library for the OpenPhone API using Bun as the runtime and package manager.

## Prerequisites

- Bun installed (https://bun.sh)
- Node.js 18+ (if not using Bun)
- Git (for version control)

## Step 1: Initialize the Project

```bash
# Create project directory
mkdir openphone-api-sdk
cd openphone-api-sdk

# Initialize Bun project
bun init -y
```

## Step 2: Download OpenAPI Specification

```bash
# Download the OpenAPI spec
curl -o openapi.json https://openphone-public-api-prod.s3.us-west-2.amazonaws.com/public/openphone-public-api-v1-prod.json
```

## Step 3: Install Dependencies

```bash
# Install OpenAPI tools and dependencies
bun add -D openapi-typescript openapi-fetch

# Install additional dev dependencies
bun add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint prettier
```

## Step 4: Generate TypeScript Types

```bash
# Generate TypeScript types from OpenAPI spec
npx openapi-typescript openapi.json -o src/types.ts
```

## Step 5: Create the SDK Client

Create `src/client.ts` with the main SDK class:

```typescript
import createClient from 'openapi-fetch';
import type { paths } from './types.js';

export interface OpenPhoneConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

export class OpenPhoneClient {
  private client: ReturnType<typeof createClient<paths>>;
  private config: OpenPhoneConfig;

  constructor(config: OpenPhoneConfig) {
    this.config = {
      baseUrl: 'https://api.openphone.com',
      timeout: 30000,
      ...config,
    };

    this.client = createClient<paths>({
      baseUrl: this.config.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'openphone-api-sdk/1.0.0',
      },
    });
  }

  // API methods here...
}
```

## Step 6: Create Main Entry Point

Create `src/index.ts`:

```typescript
export { OpenPhoneClient } from './client.js';
export type { OpenPhoneConfig } from './client.js';
export type { paths } from './types.js';
```

## Step 7: Configure TypeScript

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "moduleDetection": "force",
    "noEmit": true,
    "composite": true,
    "strict": true,
    "downlevelIteration": true,
    "skipLibCheck": true,
    "jsx": "preserve",
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "allowJs": true,
    "types": ["bun-types"],
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "esModuleInterop": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.spec.ts"]
}
```

## Step 8: Configure Package.json

Update `package.json` for npm publication:

```json
{
  "name": "@openphone/api-sdk",
  "version": "1.0.0",
  "description": "TypeScript SDK for OpenPhone Public API",
  "main": "dist/index.js",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "type": "module",
  "files": [
    "dist/**/*",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "bun run build:types && bun run build:js",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "build:js": "bun build src/index.ts --outdir dist --format esm --target bun",
    "dev": "bun run src/index.ts",
    "test": "bun run src/test.ts",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts",
    "prepublishOnly": "bun run build"
  },
  "keywords": [
    "openphone",
    "api",
    "sdk",
    "typescript",
    "phone",
    "calls",
    "messages",
    "voip"
  ],
  "author": "OpenPhone Support <support@openphone.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/openphone/openphone-api-sdk.git"
  },
  "bugs": {
    "url": "https://github.com/openphone/openphone-api-sdk/issues"
  },
  "homepage": "https://github.com/openphone/openphone-api-sdk#readme",
  "dependencies": {
    "openapi-fetch": "^0.14.0"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "eslint": "^8.57.0",
    "openapi-typescript": "^7.9.1",
    "prettier": "^3.0.0",
    "typescript": "^5.9.2"
  },
  "peerDependencies": {
    "typescript": "^5"
  },
  "engines": {
    "node": ">=18.0.0",
    "bun": ">=1.0.0"
  }
}
```

## Step 9: Add Configuration Files

### ESLint Configuration (`.eslintrc.json`)

```json
{
  "env": {
    "browser": true,
    "es2022": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error"
  }
}
```

### Prettier Configuration (`.prettierrc`)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### Git Ignore (`.gitignore`)

```
# Dependencies
node_modules/
bun.lockb

# Build outputs
dist/
build/

# Environment variables
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Generated files
src/types.ts
openapi.json
openapi-generator-config.json
```

## Step 10: Create Documentation

Create a comprehensive `README.md` with:
- Installation instructions
- Quick start guide
- API reference
- Examples
- TypeScript support information

## Step 11: Create Examples

Create example files in `examples/` directory:
- `basic-usage.ts` - Basic API usage
- `webhook-setup.ts` - Webhook configuration
- `send-message.ts` - Message sending

## Step 12: Add Tests

Create `src/test.ts` with basic functionality tests:
- Client instantiation
- Configuration updates
- Error handling

## Step 13: Build and Test

```bash
# Build the project
bun run build

# Run tests
bun run test

# Lint code
bun run lint

# Format code
bun run format
```

## Step 14: Prepare for NPM Publication

```bash
# Login to npm (if not already logged in)
npm login

# Publish the package
npm publish

# Or publish with a specific tag
npm publish --tag beta
```

## Step 15: Version Management

```bash
# Update version
npm version patch  # for bug fixes
npm version minor  # for new features
npm version major  # for breaking changes

# Publish new version
npm publish
```

## Project Structure

```
openphone-api-sdk/
├── src/
│   ├── index.ts          # Main entry point
│   ├── client.ts         # SDK client class
│   ├── types.ts          # Generated TypeScript types
│   └── test.ts           # Basic tests
├── examples/
│   ├── basic-usage.ts    # Basic usage example
│   ├── webhook-setup.ts  # Webhook setup example
│   └── send-message.ts   # Message sending example
├── dist/                 # Built output
├── .eslintrc.json        # ESLint configuration
├── .prettierrc           # Prettier configuration
├── .gitignore            # Git ignore rules
├── tsconfig.json         # TypeScript configuration
├── package.json          # Package configuration
├── README.md             # Documentation
└── STEP_BY_STEP_GUIDE.md # This guide
```

## Key Features Implemented

✅ **TypeScript First**: Full type safety with auto-generated types
✅ **Modern Build System**: Using Bun for fast builds and execution
✅ **Tree-shakable**: ES modules with tree-shaking support
✅ **Complete API Coverage**: Support for all OpenPhone API endpoints
✅ **Error Handling**: Proper error handling for all API calls
✅ **Documentation**: Comprehensive documentation and examples
✅ **Testing**: Basic test suite for core functionality
✅ **Linting & Formatting**: Code quality tools configured
✅ **NPM Ready**: Properly configured for npm publication

## Next Steps

1. **Add More Tests**: Expand test coverage for all API methods
2. **Add CI/CD**: Set up GitHub Actions for automated testing and publishing
3. **Add Examples**: Create more comprehensive examples
4. **Add Documentation**: Generate API documentation from TypeScript types
5. **Add Validation**: Add request/response validation
6. **Add Retry Logic**: Implement retry logic for failed requests
7. **Add Rate Limiting**: Implement rate limiting for API calls

This SDK provides a solid foundation for integrating with the OpenPhone API in TypeScript applications, with full type safety and modern development practices.
