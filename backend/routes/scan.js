const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const madge = require("madge");
const DependencyGraph = require("../models/DependencyGraph");
const path = require("path");
const fs = require("fs");

router.post("/", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { repoPath, repoId, repoName } = req.body;

    // Validate required fields
    if (!repoPath || !repoId || !repoName) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Validate repoPath
    if (typeof repoPath !== "string" || !repoPath.trim()) {
      return res.status(400).json({ error: "Invalid or missing repoPath." });
    }

    // Check if path exists
    if (!fs.existsSync(repoPath)) {
      return res.status(404).json({ error: "Repository path not found." });
    }

    // Build graph using madge
    const result = await madge(repoPath, { baseDir: repoPath });
    const graphObj = result.obj();

    // Format nodes and edges
    const nodes = Object.keys(graphObj).map(file => ({ id: file }));
    const edges = [];

    for (const [source, targets] of Object.entries(graphObj)) {
      targets.forEach(target => {
        edges.push({ source, target });
      });
    }

    // Store or update in DB
    await DependencyGraph.findOneAndUpdate(
      { userId: decoded.userId, repoId },
      {
        userId: decoded.userId,
        repoId,
        repoName,
        graph: { nodes, edges },
        lastSynced: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({ message: "Dependency graph generated successfully.", graph: { nodes, edges } });
  } catch (err) {
    console.error("Scan Error:", err.message);
    res.status(500).json({ error: "Failed to generate dependency graph." });
  }
});

module.exports = router;
