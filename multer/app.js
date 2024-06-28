const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const path = require("path");
const ejs = require("ejs");
const bcrypt = require("bcryptjs");
const multer = require("multer");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload/");
  },
  filename: function (req, file, cb) {
    const fname = file.originalname.split(".");
    cb(null, fname[0] + "-" + Date.now() + "." + fname[1]);
  // cb(null, fname[0] + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

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
