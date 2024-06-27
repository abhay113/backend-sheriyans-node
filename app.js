const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const path = require("path");
const ejs = require("ejs");
const userModel = require("./models/user.model");
const bcrypt = require("bcryptjs");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/create", (req, res) => {
  let { username, email, age, password } = req.body;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      const user = await userModel.create({
        username,
        email,
        age,
        password: hash,
      });
      const token = jwt.sign(email, "secretkey");
      res.cookie("token", token);
      res.status(201).json(user);
    });
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  await userModel
    .findOne({ email: req.body.email })
    .then((user) => {
      if (!user) return res.status(404).json({ message: "User not found!" });
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if (!isMatch)
          return res.status(401).json({ message: "Invalid credentials!" });
        const token = jwt.sign(user.email, "secretkey");
        res.cookie("token", token);
        res.status(200).json({ message: "Logged in successfully!" });
      });
    })
    .catch((err) => console.error(err));
});

app.get("/logout", async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully!" }).redirect("/");
});
app.listen(3000, () => {
  console.log(`Server is running on port 3000!`);
});
