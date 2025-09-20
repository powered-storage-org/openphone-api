#!/usr/bin/env node

/**
 * Manual API Update Checker
 * 
 * This script can be run manually to check for OpenPhone API updates
 * and create GitHub issues when changes are detected.
 */

import ChangelogMonitor from './monitor-changelog.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const fs = require('fs');
const path = require('path');

class UpdateChecker {
    constructor() {
        this.monitor = new ChangelogMonitor();
    }

    async checkForUpdates() {
        console.log('🚀 Starting manual API update check...');
        console.log('='.repeat(50));

        try {
            const results = await this.monitor.monitor();

            console.log('\n📊 Monitoring Results:');
            console.log('-'.repeat(30));
            console.log(`Current Version: ${results.currentVersion}`);
            console.log(`Stored Version:  ${results.storedVersion}`);
            console.log(`Version Changed: ${results.versionChanged}`);
            console.log(`Changelog Changed: ${results.changelogChanged}`);

            if (results.versionChanged) {
                console.log('\n🔄 API VERSION UPDATE DETECTED!');
                console.log('='.repeat(50));
                console.log(`Version changed from ${results.storedVersion} to ${results.currentVersion}`);
                console.log('\nRecent changelog entries:');
                results.changelogData.changelogEntries.forEach((entry, index) => {
                    console.log(`\n${index + 1}. ${entry.substring(0, 200)}...`);
                });

                console.log('\n📝 Recommended actions:');
                console.log('1. Review the changelog for breaking changes');
                console.log('2. Update the OpenAPI specification');
                console.log('3. Regenerate TypeScript types');
                console.log('4. Update the SDK client if necessary');
                console.log('5. Test the updated SDK');
                console.log('6. Release new SDK version');

            } else if (results.changelogChanged) {
                console.log('\n📝 CHANGELOG UPDATE DETECTED!');
                console.log('='.repeat(50));
                console.log('The changelog has been updated with new information.');
                console.log('\nRecent changelog entries:');
                results.changelogData.changelogEntries.forEach((entry, index) => {
                    console.log(`\n${index + 1}. ${entry.substring(0, 200)}...`);
                });

                console.log('\n📝 Recommended actions:');
                console.log('1. Review the updated changelog');
                console.log('2. Check if any changes affect the SDK');
                console.log('3. Update documentation if needed');

            } else {
                console.log('\n✅ No updates detected');
                console.log('The API version and changelog are up to date.');
            }

            // Save results to file for GitHub Actions
            const resultsFile = path.join(process.cwd(), 'monitor-results.json');
            fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
            console.log(`\n💾 Results saved to: ${resultsFile}`);

            return results;

        } catch (error) {
            console.error('\n❌ Error during update check:', error);
            throw error;
        }
    }
}

// Run the checker if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const checker = new UpdateChecker();
    checker.checkForUpdates()
        .then((results) => {
            console.log('\n✅ Update check completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Update check failed:', error);
            process.exit(1);
        });
}

export default UpdateChecker;
