const express = require("express");

//migrateUP();

const app = express();

app.get("/", (req, res) => {
  res.redirect("/lola");
});
app.get("/lola", (req, res) => {
  res.status(200).json("lola");
});

app.listen(8000, () => {
  console.log("go go go");
});
