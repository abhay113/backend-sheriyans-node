const express = require("express");
const app = express();
const port = 3000;

// app.use((req, res, next) => {
//   console.log("middleware chaalla");
//   next(); // kam hone ke baad next middleware execute hoga
// });

app.use(accessLog);
app.use(errorLog);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

function accessLog(req, res, next) {
  const { hostname, method, path, ip, protocol } = req;
  console.log(`ACCESS: ${method} ${protocol}://${hostname}${path} - ${ip}`);
  next();
}

function errorLog(err, req, res, next) {
  const { hostname, method, path, protocol } = req;
  console.log(`ERROR: ${method} ${protocol}://${hostname}${path} - ${err}`);
  // next(); // you can call either next or send a uniform error response
  res.status(500).send({ status: "server-error", message: err.message });
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
