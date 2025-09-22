#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Fix TypeScript declaration files to use correct import extensions
 * This is needed because TypeScript generates .js extensions in imports
 * but the declaration files need to reference the actual .d.ts files
 */

function fixDeclarationFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace .js extensions in imports with .d.ts extensions for declaration files
  // But only for relative imports, not for node_modules
  content = content.replace(
    /from\s+['"](\.\/[^'"]+)\.js['"]/g,
    (match, importPath) => {
      // For declaration files, we need to reference the .d.ts files
      // But we need to remove the .d.ts extension since TypeScript will resolve it automatically
      return `from '${importPath}'`;
    }
  );

  fs.writeFileSync(filePath, content);
  console.log(`Fixed declarations in: ${filePath}`);
}

function fixJavaScriptFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix .js imports to include .js extensions for ES modules
  content = content.replace(
    /from\s+['"](\.\/[^'"]+)(?!\.js)['"]/g,
    (match, importPath) => {
      // Only add .js if the corresponding .js file exists
      const dir = path.dirname(filePath);
      const jsPath = path.join(dir, `${importPath}.js`);
      if (fs.existsSync(jsPath)) {
        return `from '${importPath}.js'`;
      }
      return match;
    }
  );

  fs.writeFileSync(filePath, content);
  console.log(`Fixed JavaScript imports in: ${filePath}`);
}

function fixAllDeclarations() {
  const distDir = path.join(__dirname, '..', 'dist');
  
  if (!fs.existsSync(distDir)) {
    console.log('Dist directory not found. Run build first.');
    return;
  }

  // Find all .d.ts files
  const files = fs.readdirSync(distDir);
  const dtsFiles = files.filter(file => file.endsWith('.d.ts'));
  const jsFiles = files.filter(file => file.endsWith('.js'));
  
  dtsFiles.forEach(file => {
    const filePath = path.join(distDir, file);
    fixDeclarationFile(filePath);
  });

  jsFiles.forEach(file => {
    const filePath = path.join(distDir, file);
    fixJavaScriptFile(filePath);
  });

  console.log('Fixed all declaration and JavaScript files');
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fixAllDeclarations();
}

export { fixDeclarationFile, fixAllDeclarations };
