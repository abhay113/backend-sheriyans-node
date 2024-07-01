const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const Post = require("../models/post.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const upload = require("../utils/multer");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/profile", isLoggedIn, async (req, res) => {
  let user = await User.findOne({ email: req.user.email }).populate("posts", {
    strictPopulate: false,
  });
  res.render("profile", { user });
});

router.get("/like/:id", isLoggedIn, async (req, res) => {
  let post = await Post.findOne({ _id: req.params.id }).populate("user", {
    strictPopulate: false,
  });

  if (post.likes.indexOf(req.user.userid) === -1) {
    post.likes.push(req.user.userid);
  } else {
    post.likes.splice(post.likes.indexOf(req.user.userid), 1);
  }
  await post.save();
  res.redirect("/profile");
});
router.get("/edit/:id", isLoggedIn, async (req, res) => {
  let post = await Post.findOne({ _id: req.params.id });
  res.render("edit", { post });
});

router.post("/edit/:id", isLoggedIn, async (req, res) => {
  let { content } = req.body;
  let post = await Post.findOne({ _id: req.params.id });
  post.content = content;
  let updated = await post.save();
  console.log(post);
  console.log(updated);
  res.redirect("/profile");
});

router.post("/post", isLoggedIn, async (req, res) => {
  let user = await User.findOne({ email: req.user.email });
  let content = req.body.content;
  let post = await Post.create({
    user: user._id,
    content: content,
  });

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let user = await User.findOne({ email: email });
  if (!user) return res.status(404).json({ message: "User not found!" });

  bcrypt.compare(password, user.password, (err, isMatch) => {
    if (!isMatch) return res.status(400).json({ message: "Wrong password!" });
    let token = jwt.sign({ email: email, userid: user._id }, "secret");
    res.cookie("token", token);
    return res.status(200).redirect("/profile");
  });
});

router.get("/logout", async (req, res) => {
  res.clearCookie("token");
  return res.redirect("/login");
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
        return res.status(200).redirect("/profile");
      });
    });
  }
});

router.get("/edit-profile", isLoggedIn, async (req, res) => {
  let user = await User.findOne({ email: req.user.email });
  res.render("edit-profile", { user });
  console.log(user);
});

router.post(
  "/update-profile",
  isLoggedIn,
  upload.single("image"),
  async (req, res) => {
    let user = await User.findOne({ id: req.user.id });
    user.profileImage = req.file.filename;
    await user.save();

    res.send(user);
  }
);
function isLoggedIn(req, res, next) {
  if (!req.cookies.token) {
    res.send("you must be logged in !!");
  } else {
    let data = jwt.verify(req.cookies.token, "secret");
    req.user = data;
  }
  next();
}
module.exports = router;
