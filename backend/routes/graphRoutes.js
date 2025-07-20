const express = require("express");
const fs = require("fs-extra");
const router = express.Router();
const { generateDependencyGraphFromRepo } = require("../controllers/dependencyGraphService");
const ProjectGraph = require("../models/ProjectGraph"); // Import the Mongoose model

// POST route for generating/loading a graph
router.post("/", async (req, res) => {
  const { repoFullName, githubToken, userId } = req.body; 

  // Basic validation for required fields
  if (!repoFullName || !githubToken || !userId) {
    return res.status(400).json({ error: "repoFullName, githubToken, and userId are required" });
  }

  let tempFolderPath = null; // Variable to store temporary folder path for cleanup

  try {
    // Attempt to find an existing graph for this user and repository
    const existingGraph = await ProjectGraph.findOne({ userId, repoFullName });

    if (existingGraph) {
      console.log("✅ Graph loaded from MongoDB for repo:", repoFullName);
      
      // Update lastSynced for existing graph to reflect recent activity
      existingGraph.lastSynced = new Date();
      await existingGraph.save(); // Save the updated timestamp

      // If found, return the existing graph data
      return res.json({
        graph: existingGraph.graphData, // Assuming 'graph' is the format your frontend expects for initial rendering
        treeGraph: existingGraph.graphData, // Assuming 'treeGraph' is the specific format for your GraphTree component
        message: "Graph loaded from database."
      });
    }

    console.log("Graph not found in DB, generating new graph for:", repoFullName);
    // Generate the graph if it doesn't exist
    // This function is assumed to handle cloning, parsing, and returning graph structures
    const { graphObj, treeGraph, tempFolderPath: generatedTempPath } = await generateDependencyGraphFromRepo(repoFullName, githubToken);
    tempFolderPath = generatedTempPath; // Store the generated temp path for cleanup

    // Create a new document to save the graph
    const newProjectGraph = new ProjectGraph({
      userId,
      repoFullName,
      graphData: treeGraph, // Store the tree-structured graph data
      lastSynced: new Date(), // Set the initial synced date
    });

    // Save the new graph to MongoDB
    await newProjectGraph.save();
    console.log("✅ Graph saved to MongoDB for repo:", repoFullName);

    // Return the newly generated graph data
    res.json({
      graph: graphObj, // Return the full graph object if needed by other parts of your app
      treeGraph: treeGraph, // Return the tree-structured graph for the frontend
      message: "Graph generated and saved to database."
    });

  } catch (error) {
    console.error("Dependency graph operation error:", error.message);
    // Send a 500 status code and an error message if something goes wrong
    res.status(500).json({ error: "Failed to perform dependency graph operation", details: error.message });
  } finally {
    // Ensure temporary folder is cleaned up, regardless of success or failure
    if (tempFolderPath) {
      try {
        await fs.remove(tempFolderPath);
        console.log("Cleaned up temporary folder:", tempFolderPath);
      } catch (cleanupError) {
        console.error("Error cleaning up temporary folder:", cleanupError.message);
      }
    }
  }
});

// NEW GET route for fetching recent activities
router.get("/recent-activities", async (req, res) => {
  const { userId } = req.query; // Get userId from query parameters

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    // Find all graphs for the given userId, sort by lastSynced (descending),
    // and limit to a reasonable number for recent activities display.
    const activities = await ProjectGraph.find({ userId })
      .sort({ lastSynced: -1 }) // Sort by most recent activity first
      .limit(10); // Limit to 10 recent activities (you can adjust this number)

    res.json({ activities }); // Send back the found activities
  } catch (error) {
    console.error("Error fetching recent activities:", error.message);
    res.status(500).json({ error: "Failed to fetch recent activities", details: error.message });
  }
});

module.exports = router;
