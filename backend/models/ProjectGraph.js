const mongoose = require('mongoose');

// Define the schema for the ProjectGraph
const projectGraphSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true // Add an index for faster lookups by userId
  },
  repoFullName: {
    type: String,
    required: true,
    index: true // Add an index for faster lookups by repoFullName
  },
  // graphData can be a complex, nested object.
  // Using mongoose.Schema.Types.Mixed allows for flexible (schemaless) data storage.
  // Alternatively, you could define a more specific nested schema if the structure is fixed.
  graphData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  lastSynced: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps automatically
});

// Add a compound index to ensure uniqueness for a given user and repository
// This prevents duplicate graph entries for the same user and repo.
projectGraphSchema.index({ userId: 1, repoFullName: 1 }, { unique: true });

// Create the Mongoose model
const ProjectGraph = mongoose.model('ProjectGraph', projectGraphSchema);

module.exports = ProjectGraph;
