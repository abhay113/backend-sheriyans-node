const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.get("/", (req, res) => {
  let token = jwt.sign({ email: "abhay@cateina.com" }, "secretKey");
  res.cookie("token", token, { expiresIn: "1h" });
  res.send("Welcome to the API!");
});

app.get("/read", (req, res) => {
  let c = req.cookies;
  let data = jwt.verify(c.token, "secretKey");
  console.log("User data: ", data);
  res.send("User data successfully read!");
});
app.listen(3000, () => {
  console.log(`Server is running on port 3000!`);
});
