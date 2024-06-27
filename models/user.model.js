const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/jwt-auth")
  .then(console.log("MongoDB Connected..."))
  .catch((err) => console.error(err));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
