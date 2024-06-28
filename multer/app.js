const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const path = require("path");
const ejs = require("ejs");
const bcrypt = require("bcryptjs");
const upload = require("./multer");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file.filename);
  res.render("create");
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000!`);
});
