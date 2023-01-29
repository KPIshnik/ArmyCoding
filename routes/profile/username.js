const expres = require("express");
const setUsernameController = require("../../controllers/setUsernameController");
const checkIsAuth = require("../../middlewares/checkIsAuth");

const router = expres.Router();

router
  .get("/profile/username", checkIsAuth, (req, res) =>
    res.status(200).json("username page")
  )
  .post("/profile/username", checkIsAuth, setUsernameController);

module.exports = router;
