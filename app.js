const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
app.get("/", (req, res) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash("password123", salt, (err, hash) => {
      console.log(hash);
      console.log(salt);
      // Store hash in your password DB.
    });
  });
  res.send("Hello, World!");
});

app.get("/check", (req, res) => {
  bcrypt.compare(
    "password123",
    "$2a$10$aQ4zULTkcc9dKnuDzJ6IhODpwop5kdsV5KmGULAKiFmAmr/z4cNua",
    (err, result) => {
      if (err) throw err;
      console.log(result);
    }
  );
  res.send("Hello, World!");
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000!`);
});
