const express = require("express");
const fs = require("fs-extra");
const router = express.Router();
const { generateDependencyGraphFromRepo } = require("../controllers/dependencyGraphService");
const { convertGraphToTree } = require("../utils/convertGraphToTree");

router.post("/", async (req, res) => {
  const { repoFullName, githubToken } = req.body;

  if (!repoFullName || !githubToken) {
    return res.status(400).json({ error: "repoFullName and githubToken are required" });
  }

  try {
    const { graph, tempFolderPath } = await generateDependencyGraphFromRepo(repoFullName, githubToken);

    const treeGraph = convertGraphToTree(graph);

    res.json({ graph, treeGraph });

    await fs.remove(tempFolderPath);
  } catch (error) {
    console.error("Dependency graph error:", error.message);
    res.status(500).json({ error: "Failed to generate dependency graph" });
  }
});

module.exports = router;
