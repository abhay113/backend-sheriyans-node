const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser()); // middleware to parse cookies

app.get("/", (req, res) => {
  res.cookie("name", "John Doe"); //setting cookie
  res.send("Hello, World!");
});

app.get("/read", (req, res) => {
  console.log(req.cookies); // reading cookies
  res.send("Hello, World!");
});
app.listen(3000, () => {
  console.log(`Server is running on port 3000!`);
});
