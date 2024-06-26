const express = require("express");
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .send({ status: "server-error", message: "Something went wrong!" });
});

app.get("/", (req, res) => {
  app.locals.title = "My App";
  res.send("Hello World!");
});

app.get("/err", (req, res, next) => {
  return next(new Error("Page not found"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
