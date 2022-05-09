const expres = require("express");
const bcrypt = require("bcrypt");

const router = expres.Router();

router.get("/confirmEmail", (req, res) => {
  const id = req.query.id;
  res.status(200).end(`Aloha ${id}! Huita is in peogress`);
});

module.exports = router;
