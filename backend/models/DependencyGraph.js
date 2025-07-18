const mongoose = require("mongoose");

const dependencyGraphSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  repoId: { type: String, required: true },
  repoName: { type: String, required: true },
  graph: {
    nodes: [{ id: String }],
    edges: [{ source: String, target: String }]
  },
  lastSynced: { type: Date, default: Date.now }
});

module.exports = mongoose.model("DependencyGraph", dependencyGraphSchema);
