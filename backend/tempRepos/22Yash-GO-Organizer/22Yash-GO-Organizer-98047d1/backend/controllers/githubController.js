const axios = require('axios');
const User = require('../modles/User'); // fix spelling if it's 'models'

const getRepos = async (req, res) => {

  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ githubId: decoded.githubId });

    if (!user || !user.accessToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const githubRes = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `token ${user.accessToken}`,
      },
    });

    res.json({ repos: githubRes.data });
  } catch (err) {
    console.error("GitHub fetch error:", err);
    res.status(500).json({ message: "Failed to fetch repositories" });
  }
};
module.exports = { getRepos };
