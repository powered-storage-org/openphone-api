#!/usr/bin/env node

/**
 * Development Setup Script
 * 
 * This script sets up the development environment by:
 * 1. Installing dependencies
 * 2. Generating TypeScript types from OpenAPI spec
 * 3. Running initial tests
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

class DevSetup {
    constructor() {
        this.projectRoot = process.cwd();
    }

    log(message) {
        console.log(`🔧 ${message}`);
    }

    error(message) {
        console.error(`❌ ${message}`);
    }

    success(message) {
        console.log(`✅ ${message}`);
    }

    async runCommand(command, description) {
        this.log(description);
        try {
            execSync(command, {
                stdio: 'inherit',
                cwd: this.projectRoot
            });
            this.success(`${description} completed`);
        } catch (error) {
            this.error(`${description} failed: ${error.message}`);
            throw error;
        }
    }

    async checkPrerequisites() {
        this.log('Checking prerequisites...');

        // Check if openapi.json exists
        const openapiPath = path.join(this.projectRoot, 'openapi.json');
        if (!fs.existsSync(openapiPath)) {
            this.error('openapi.json not found. Please download it first.');
            this.log('Run: curl -o openapi.json https://openphone-public-api-prod.s3.us-west-2.amazonaws.com/public/openphone-public-api-v1-prod.json');
            process.exit(1);
        }

        this.success('Prerequisites check passed');
    }

    async setup() {
        console.log('🚀 Setting up OpenPhone API SDK development environment...');
        console.log('='.repeat(60));

        try {
            // Check prerequisites
            await this.checkPrerequisites();

            // Install dependencies
            await this.runCommand('bun install', 'Installing dependencies');

            // Generate TypeScript types
            await this.runCommand('bun run generate:types', 'Generating TypeScript types from OpenAPI spec');

            // Run tests
            await this.runCommand('bun run test', 'Running tests');

            // Build project
            await this.runCommand('bun run build', 'Building project');

            console.log('\n🎉 Development environment setup completed successfully!');
            console.log('\n📋 Next steps:');
            console.log('1. Review the generated types in src/types.ts');
            console.log('2. Update the SDK client if needed');
            console.log('3. Run "bun run dev" to start development');
            console.log('4. Run "bun run ci" to run the full CI pipeline');

        } catch (error) {
            this.error('Setup failed');
            console.error(error);
            process.exit(1);
        }
    }
}

// Run setup if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const setup = new DevSetup();
    setup.setup();
}

export default DevSetup;
