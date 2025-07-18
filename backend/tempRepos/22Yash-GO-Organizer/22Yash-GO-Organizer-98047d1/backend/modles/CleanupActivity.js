const mongoose = require('mongoose')

const IssueSchema = new mongoose.Schema({
  file: { type: String, required: true },
  type: { type: String, required: true },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Low',
  },
  description: { type: String, required: true }
});

const CleanupActivitySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  repoName: { type: String, required: true },
  scanType: { type: String, default: 'Full Scan' },
  issuesFound: { type: Number, default: 0 },
  issues: [IssueSchema], // ✅ stores full list of detailed issues
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CleanupActivity', CleanupActivitySchema);
