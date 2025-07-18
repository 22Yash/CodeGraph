const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  githubId: { type: String, required: true, unique: true },
  username: String,
  avatarUrl: String,
  email: String,
  accessToken: String, // <-- store access token here
});

module.exports = mongoose.model('User', userSchema);
