// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const CleanupActivity = require('../modles/CleanupActivity');

// Get all scanned repo reports for a specific user
router.get('/user-repos/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const reports = await CleanupActivity.find({ userId }).sort({ createdAt: -1 });

    res.json(reports);
  } catch (err) {
    console.error('Error fetching user repo reports:', err);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

module.exports = router;
