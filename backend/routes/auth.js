const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const { redirectToGitHub, handleGitHubCallback } = require("../controllers/authController");

router.get("/github", redirectToGitHub);
// router.get("/github/callback", handleGitHubCallback);

// // Important: GitHub token route
// router.get("/me/github-token", async (req, res) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({ error: "No token provided" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.userId);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     return res.json({ githubAccessToken: user.accessToken });
//   } catch (err) {
//     console.error(err);
//     res.status(401).json({ error: "Invalid token" });
//   }
// });

module.exports = router;
