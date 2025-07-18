const simpleGit = require('simple-git');
const fs = require('fs-extra');
const globby = require('globby');
const path = require('path');
const os = require('os');
const getUnusedImports = require('../controllers/unusedImportScanner');
const { detectUnusedFiles } = require('../controllers/unusedFileScanner');
const CleanupActivity = require('../modles/CleanupActivity');

const startScan = async (req, res) => {
  const { repoName, repoOwner, cloneUrl, userId } = req.body;

  if (!repoName || !cloneUrl || !userId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  console.log("🛠️ Received scan request for repo:", repoName);
  const tempDir = path.join(os.tmpdir(), `repo-scan-${Date.now()}`);

  try {
    // ✅ Step 1: Prepare & Clone Repo
    await fs.ensureDir(tempDir);
    const git = simpleGit();
    console.log("📦 Cloning repo into:", tempDir);
    await git.clone(cloneUrl, tempDir);

    // ✅ Step 2: Find Source Files
    const filePaths = await globby(['**/*.{js,jsx,ts,tsx}'], {
      cwd: tempDir,
      gitignore: true,
      ignore: [
        'node_modules/**',
        '**/*.d.ts',
        '**/__tests__/**',
        '**/*.test.*',
        '**/*.spec.*',
        'dist/**',
        'build/**',
        'coverage/**',
        '.next/**',
        'out/**',
      ],
    });

    console.log(`🔍 Found ${filePaths.length} files to scan`);

    // ✅ Step 3: Detect Unused Imports
    const unusedImportResults = await getUnusedImports(filePaths, tempDir);
    console.log(`🧹 Found ${unusedImportResults.length} files with unused imports`);

    // ✅ Step 4: Detect Unused Files
    const unusedFiles = await detectUnusedFiles(tempDir);
    console.log(`🗃️ Found ${unusedFiles.length} unused files`);

    // ✅ Step 5: Build Issue Report
    const issues = [];

    unusedImportResults.forEach(item => {
      if (item.imports.length > 0) {
        issues.push({
          file: item.file,
          type: "Unused Import",
          severity: "Low",
          description: `${item.imports.join(', ')} not used in file.`,
        });
      }
    });

    unusedFiles.forEach(filePath => {
      issues.push({
        file: filePath,
        type: "Unused File",
        severity: "Medium",
        description: "This file is not imported anywhere in the project.",
      });
    });

    console.log(`📋 Total issues detected: ${issues.length}`);

    // ✅ Step 6: Save to MongoDB
    await CleanupActivity.create({
      userId,
      repoName,
      scanType: "Full Scan",
      issuesFound: issues.length,
      issues,
    });

    console.log("✅ Scan report saved to DB");

    // ✅ Step 7: Clean up temp folder
    await fs.remove(tempDir);
    console.log("🧽 Temp folder cleaned");

    // ✅ Step 8: Return response
    res.status(200).json({
      message: "Scan complete",
      fileCount: filePaths.length,
      unusedImports: unusedImportResults,
      unusedFiles,
      issues,
    });

  } catch (err) {
    console.error("❌ Scan error:", err);
    await fs.remove(tempDir); // cleanup in case of error
    return res.status(500).json({ error: "Scan failed." });
  }
};

module.exports = { startScan };
