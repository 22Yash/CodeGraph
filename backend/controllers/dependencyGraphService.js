const madge = require("madge");
const fs = require("fs-extra");
const axios = require("axios");
const unzipper = require("unzipper");
const path = require("path");

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
  if (!subfolders[0]) throw new Error("No files extracted");

  const realRepoPath = path.join(tempFolderPath, subfolders[0]);

  console.log("✅ Real repo path:", realRepoPath);

  return { realRepoPath, tempFolderPath };
}

function convertMadgeGraphToTree(graphObj) {
  const nodes = {};

  Object.keys(graphObj).forEach((file) => {
    nodes[file] = { name: file, children: [] };
  });

  Object.keys(graphObj).forEach((file) => {
    graphObj[file].forEach((dep) => {
      if (nodes[dep]) {
        nodes[file].children.push(nodes[dep]);
      }
    });
  });

  const rootKey = Object.keys(graphObj)[0] || "root";
  return nodes[rootKey];
}

async function generateDependencyGraphFromRepo(repoFullName, accessToken) {
  const { realRepoPath, tempFolderPath } = await downloadAndExtractRepo(repoFullName, accessToken);

  if (!realRepoPath || !(await fs.pathExists(realRepoPath))) {
    throw new Error("Invalid or missing repository path");
  }

  console.log("✅ Running madge on path:", realRepoPath);

  let result;
  try {
    result = await madge(realRepoPath, {
      fileExtensions: ["js", "jsx", "ts", "tsx", "mjs", "cjs"],
      includeNpm: false,
    });
  } catch (err) {
    console.error("Madge parsing failed:", err.message);
    throw new Error("Madge could not parse files in the repository.");
  }

  const graphObj = result.obj();

  if (!graphObj || Object.keys(graphObj).length === 0) {
    throw new Error("No dependency graph generated — possibly empty or unsupported files.");
  }

  const treeGraph = convertMadgeGraphToTree(graphObj);

  return { graphObj, treeGraph, tempFolderPath };
}

module.exports = { generateDependencyGraphFromRepo };
