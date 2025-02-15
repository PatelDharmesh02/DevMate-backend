const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello DevMate");
});

app.get("/home", (req, res) => {
  res.send("Hello DevMate Home page");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
