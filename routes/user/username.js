const expres = require("express");
const setUsernameController = require("../../controllers/setUsernameController");
const checkIsAuth = require("../../middlewares/checkIsAuth");

const router = expres.Router();

router
  .get("/user/username", checkIsAuth, (req, res) => res.end("username page"))
  .post("/user/username", checkIsAuth, setUsernameController);

module.exports = router;
