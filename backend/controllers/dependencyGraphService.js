const madge = require("madge");
const fs = require("fs-extra");
const axios = require("axios");
const unzipper = require("unzipper");
const path = require("path");
const { convertGraphToTree } = require("../utils/convertGraphToTree");

async function downloadAndExtractRepo(repoFullName, accessToken) {
  const safeRepoName = repoFullName.replace("/", "-");
  const tempFolderPath = path.join(__dirname, "../tempRepos", safeRepoName);
  await fs.ensureDir(tempFolderPath);

  const zipUrl = `https://api.github.com/repos/${repoFullName}/zipball`;

  const response = await axios({
    url: zipUrl,
    method: "GET",
    responseType: "stream",
    headers: {
      Authorization: `token ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  await new Promise((resolve, reject) => {
    response.data
      .pipe(unzipper.Extract({ path: tempFolderPath }))
      .on("close", resolve)
      .on("error", reject);
  });

  const subfolders = await fs.readdir(tempFolderPath);
  if (!subfolders[0]) {
    throw new Error("No files extracted from the repository zipball.");
  }

  const realRepoPath = path.join(tempFolderPath, subfolders[0]);

  console.log("✅ Real repository extracted to:", realRepoPath);

  return { realRepoPath, tempFolderPath };
}

async function generateDependencyGraphFromRepo(repoFullName, accessToken) {
  const { realRepoPath, tempFolderPath } = await downloadAndExtractRepo(repoFullName, accessToken);

  if (!realRepoPath || !(await fs.pathExists(realRepoPath))) {
    throw new Error("Invalid or missing repository path after extraction.");
  }

  console.log("✅ Running Madge on path:", realRepoPath);

  let result;
  try {
    result = await madge(realRepoPath, {
      fileExtensions: ["js", "jsx", "ts", "tsx", "mjs", "cjs"],
      includeNpm: false,
    });
  } catch (err) {
    console.error("Madge parsing failed:", err.message);
    throw new Error("Madge could not parse files in the repository. Ensure it contains supported code files.");
  }

  const graphObj = result.obj();

  if (!graphObj || Object.keys(graphObj).length === 0) {
    throw new Error("No dependency graph generated — possibly an empty repository or unsupported file types.");
  }

  // Pass the desired root name (e.g., the repo name) to convertGraphToTree
  const rootNameFromRepo = repoFullName.split('/').pop(); // "owner/repo-name" -> "repo-name"
  const treeGraph = convertGraphToTree(graphObj, rootNameFromRepo);

  return { graphObj, treeGraph, tempFolderPath };
}

module.exports = { generateDependencyGraphFromRepo };
