const express = require("express");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../models/User"); // ✅ Make sure this path is correct!
const router = express.Router();

router.get('/repos', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.accessToken) {
      return res.status(404).json({ error: "User or access token not found" });
    }

    const githubRes = await axios.get("https://api.github.com/user/repos", {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    });

    console.log("GitHub Repos Response:", githubRes.data);
    return res.json({ repos: githubRes.data });

  } catch (err) {
    console.error("GitHub API or Auth Error:", err.message);

    // Only send error response if not already sent
    if (!res.headersSent) {
      return res.status(500).json({ error: "Failed to fetch repos" });
    }
  }
});


module.exports = router;
