const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  password: String,
  role: String,
  googleId: String,
  avatar: String,
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  }
});

module.exports = mongoose.model("User", UserSchema);