const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("../modles/User"); // adjust path if needed

router.get("/repos", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    // You can use JWT decode or DB lookup based on your design
    const user = await User.findOne({}); // or decode token to get userId

    if (!user || !user.accessToken) {
      return res.status(404).json({ error: "User or access token not found" });
    }

    const githubRes = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });

    return res.json({ repos: githubRes.data });
  } catch (err) {
    console.error("GitHub API Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch repos" });
  }
});

module.exports = router;
