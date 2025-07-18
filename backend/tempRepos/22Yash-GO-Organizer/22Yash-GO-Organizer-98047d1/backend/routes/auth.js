const express = require('express');
const router = express.Router();
const {
  redirectToGitHub,
  handleGitHubCallback,
} = require('../controllers/authController');

router.get('/github', redirectToGitHub);
router.get('/github/callback', handleGitHubCallback);

module.exports = router;
