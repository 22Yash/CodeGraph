const express = require("express");
const fs = require("fs-extra");
const router = express.Router();
const { generateDependencyGraphFromRepo } = require("../controllers/dependencyGraphService");

// POST endpoint to generate and return the dependency graph for a given repository
router.post("/", async (req, res) => {
  const { repoFullName, githubToken } = req.body;

  if (!repoFullName || !githubToken) {
    return res.status(400).json({ error: "repoFullName and githubToken are required" });
  }

  try {
    // Call the service to download the repo, generate the graph, and get the temp folder path
    // This function now returns the treeGraph directly.
    const { graphObj, treeGraph, tempFolderPath } = await generateDependencyGraphFromRepo(repoFullName, githubToken);

    // Send the treeGraph back to the client.
    res.json({ graph: graphObj, treeGraph: treeGraph });

    // Step 6: Clean up: remove the temporary repository folder after sending the response
    // This is important for disk space management
    await fs.remove(tempFolderPath);
  } catch (error) {
    console.error("Dependency graph generation error:", error.message);
    res.status(500).json({ error: "Failed to generate dependency graph", details: error.message });
  }
});

module.exports = router;
