const expres = require("express");
const checkIsAuth = require("../middlewares/checkIsAuth");

const router = expres.Router();

router.get("/", checkIsAuth, (req, res) => {
  res.status(200);
  res.end("Aloha");
});

module.exports = router;
