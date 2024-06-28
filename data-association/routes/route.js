const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const Post = require("../models/post.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

router.get("/", (req, res) => {
  res.render("index");
});

router.post("/register", async (req, res) => {
  let { email, username, age, password } = req.body;
  let user = await User.findOne({ email: email });
  if (user) {
    return res.status(400).json({ message: "User already exists!" });
  } else {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) throw err;
        password = hash;
        let newUser = await User.create({ email, username, password, age });

        let token = jwt.sign({ email: email, userid: newUser._id }, "secret");
        res.cookie("token", token);
        return res
          .status(200)
          .json({ message: "user registered successfully" });
      });
    });
  }
});

module.exports = router;
