const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../modles/User");

const redirectToGitHub = (req, res) => {
  const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&scope=read:user,user:email,repo`;
  res.redirect(githubAuthURL);
};

const handleGitHubCallback = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Authorization code missing");
  }

  try {
    // Step 1: Exchange code for access token
    const tokenResponse = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_REDIRECT_URI,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Step 2: Fetch user profile
    const userResponse = await axios.get(`https://api.github.com/user`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { id, login, avatar_url, email, name } = userResponse.data;

    // Optional: Save user to DB (you can add your own logic here)
    let user = await User.findOne({ githubId: id });

    if (!user) {
      user = new User({
        githubId: id, // ✅ Required field from your schema
        username: login,
        avatar: avatar_url,
        email,
        name,
        accessToken,
      });
    } else {
      user.accessToken = accessToken;
    }

    await user.save();

    // Step 3: Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
        githubUsername: user.username, // Add this!
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    
    // Step 4: Redirect to frontend
    const redirectUrl = `${process.env.FRONTEND_URL}/welcome?token=${token}`;
    res.redirect(redirectUrl);
  } catch (err) {
    console.error("GitHub OAuth Error:", err);
    res.status(500).send("Authentication failed");
  }
};

module.exports = { redirectToGitHub, handleGitHubCallback };
