const path = require('path');
const fs = require('fs-extra');
const globby = require('globby');

const referenceRegex = /(?:import\s+.*?['"](.+?\.(png|jpg|jpeg|svg|gif|webp|ico))['"])|(?:require\(['"](.+?\.(png|jpg|jpeg|svg|gif|webp|ico))['"]\))|(?:url\(['"]?(.+?\.(png|jpg|jpeg|svg|gif|webp|ico))['"]?\))|(?:src=['"](.+?\.(png|jpg|jpeg|svg|gif|webp|ico))['"])/g;

// Optional ignore patterns (common false positives)
const ignorePatterns = ['favicon', 'logo192', 'logo512', 'android-chrome', 'apple-touch'];

const detectUnusedFiles = async (repoPath) => {
  const usedFiles = new Set();

  // Step 1: Collect all code files to scan for references
  const codeFiles = await globby(['**/*.{js,jsx,ts,tsx,html,css}'], {
    cwd: repoPath,
    gitignore: true,
    ignore: ['node_modules/**', 'dist/**', 'build/**', '.next/**', 'out/**'],
  });

  // Step 2: Extract all file references
  for (const file of codeFiles) {
    const fullPath = path.join(repoPath, file);
    try {
      const content = await fs.readFile(fullPath, 'utf8');
      const matches = [...content.matchAll(referenceRegex)];

      for (const match of matches) {
        const matchedPath = match[1] || match[2] || match[3] || match[4] || match[5];
        if (matchedPath) {
          const normalized = path.normalize(matchedPath).replace(/^(\.\/|\/)/, '').replace(/\\/g, '/');
          usedFiles.add(normalized);
        }
      }
    } catch (err) {
      console.warn(`⚠️ Could not read file: ${file}`);
    }
  }

  // Step 3: List all asset/image files in the project
  const assetFiles = await globby(['**/*.{png,jpg,jpeg,svg,gif,webp,ico}'], {
    cwd: repoPath,
    gitignore: true,
    ignore: ['node_modules/**', 'dist/**', 'build/**', '.next/**', 'out/**'],
  });

  const unusedFiles = [];

  for (const file of assetFiles) {
    const normalizedFile = file.replace(/\\/g, '/');

    // Skip known files (like favicons)
    if (ignorePatterns.some((pattern) => normalizedFile.toLowerCase().includes(pattern))) {
      continue;
    }

    // Compare against used file references
    const isUsed = [...usedFiles].some((used) => normalizedFile.endsWith(used) || normalizedFile.includes(used));
    if (!isUsed) {
      unusedFiles.push(normalizedFile);
    }
  }

  return unusedFiles;
};

module.exports = { detectUnusedFiles };
