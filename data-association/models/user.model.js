const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/authentication")
  .then("connection established successfully");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  age: { type: Number },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: "default.jpg",
  },
});

module.exports = mongoose.model("User", userSchema);
