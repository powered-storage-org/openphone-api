#!/usr/bin/env node

/**
 * OpenPhone API Changelog Monitor
 * 
 * This script monitors the OpenPhone API changelog for updates
 * and creates GitHub issues when changes are detected.
 */

import https from 'https';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class ChangelogMonitor {
    constructor() {
        this.changelogUrl = 'https://www.openphone.com/docs/mdx/api-reference/changelog';
        this.apiSpecUrl = 'https://openphone-public-api-prod.s3.us-west-2.amazonaws.com/public/openphone-public-api-v1-prod.json';
        this.storedSpecPath = join(__dirname, '..', 'openapi.json');
        this.changelogCachePath = join(__dirname, '..', '.changelog-cache.json');
    }

    async fetchChangelog() {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'www.openphone.com',
                path: '/docs/mdx/api-reference/changelog',
                method: 'GET',
                headers: {
                    'User-Agent': 'OpenPhone-SDK-Monitor/1.0.0',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(data);
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.end();
        });
    }

    async fetchApiSpec() {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'openphone-public-api-prod.s3.us-west-2.amazonaws.com',
                path: '/public/openphone-public-api-v1-prod.json',
                method: 'GET',
                headers: {
                    'User-Agent': 'OpenPhone-SDK-Monitor/1.0.0'
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    try {
                        const spec = JSON.parse(data);
                        resolve(spec);
                    } catch (error) {
                        reject(error);
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.end();
        });
    }

    parseChangelog(html) {
        // Extract version information
        const versionRegex = /(\d+\.\d+\.\d+)/g;
        const versions = html.match(versionRegex) || [];
        const latestVersion = versions[0] || 'unknown';

        // Extract recent changelog entries
        const changelogEntries = [];

        // Look for specific date patterns and extract content
        const datePatterns = [
            /January 22, 2025[\s\S]*?(?=December 6, 2024|$)/,
            /December 6, 2024[\s\S]*?(?=November 25, 2024|$)/,
            /November 25, 2024[\s\S]*?(?=November 7, 2024|$)/,
            /November 7, 2024[\s\S]*?(?=November 4, 2024|$)/,
            /November 4, 2024[\s\S]*?(?=October 22, 2024|$)/,
            /October 22, 2024[\s\S]*?(?=October 21, 2024|$)/,
            /October 21, 2024[\s\S]*?(?=$)/
        ];

        for (const pattern of datePatterns) {
            const match = html.match(pattern);
            if (match) {
                const entry = match[0].trim();
                if (entry.length > 50) { // Only include substantial entries
                    changelogEntries.push(entry);
                }
            }
        }

        return {
            latestVersion,
            changelogEntries: changelogEntries.slice(0, 3), // Get last 3 entries
            rawHtml: html
        };
    }

    loadStoredData() {
        try {
            const storedSpec = JSON.parse(fs.readFileSync(this.storedSpecPath, 'utf8'));
            const storedVersion = storedSpec.info?.version || 'unknown';

            let cachedChangelog = null;
            try {
                cachedChangelog = JSON.parse(fs.readFileSync(this.changelogCachePath, 'utf8'));
            } catch (error) {
                // Cache file doesn't exist, that's okay
            }

            return {
                storedVersion,
                cachedChangelog
            };
        } catch (error) {
            console.error('Error loading stored data:', error);
            return {
                storedVersion: 'unknown',
                cachedChangelog: null
            };
        }
    }

    saveChangelogCache(data) {
        try {
            fs.writeFileSync(this.changelogCachePath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error saving changelog cache:', error);
        }
    }

    hasChangelogChanged(newChangelog, cachedChangelog) {
        if (!cachedChangelog) return true;

        const newHash = this.hashString(JSON.stringify(newChangelog.changelogEntries));
        const cachedHash = this.hashString(JSON.stringify(cachedChangelog.changelogEntries));

        return newHash !== cachedHash;
    }

    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    async monitor() {
        console.log('🔍 Starting OpenPhone API changelog monitoring...');

        try {
            // Load stored data
            const { storedVersion, cachedChangelog } = this.loadStoredData();
            console.log(`📋 Stored API version: ${storedVersion}`);

            // Fetch current data
            console.log('📥 Fetching current changelog...');
            const changelogHtml = await this.fetchChangelog();

            console.log('📥 Fetching current API spec...');
            const currentSpec = await this.fetchApiSpec();
            const currentVersion = currentSpec.info?.version || 'unknown';

            console.log(`📋 Current API version: ${currentVersion}`);

            // Parse changelog
            const parsedChangelog = this.parseChangelog(changelogHtml);
            console.log(`📋 Latest changelog version: ${parsedChangelog.latestVersion}`);
            console.log(`📋 Found ${parsedChangelog.changelogEntries.length} recent changelog entries`);

            // Check for changes
            const versionChanged = currentVersion !== storedVersion;
            const changelogChanged = this.hasChangelogChanged(parsedChangelog, cachedChangelog);

            console.log(`🔄 Version changed: ${versionChanged}`);
            console.log(`🔄 Changelog changed: ${changelogChanged}`);

            // Save current changelog to cache
            this.saveChangelogCache(parsedChangelog);

            // Return results
            return {
                versionChanged,
                changelogChanged,
                currentVersion,
                storedVersion,
                changelogData: parsedChangelog,
                currentSpec
            };

        } catch (error) {
            console.error('❌ Error during monitoring:', error);
            throw error;
        }
    }
}

// Run the monitor if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const monitor = new ChangelogMonitor();
    monitor.monitor()
        .then((results) => {
            console.log('✅ Monitoring completed successfully');
            console.log('Results:', JSON.stringify(results, null, 2));
        })
        .catch((error) => {
            console.error('❌ Monitoring failed:', error);
            process.exit(1);
        });
}

export default ChangelogMonitor;
