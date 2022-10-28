const expres = require("express");
const checkIsAuth = require("../../middlewares/checkIsAuth");
const setUserPasswordController = require("../../controllers/setUserPasswordController");

const router = expres.Router();

router
  .get("/profile/password", checkIsAuth, (req, res) => res.end("pass page"))
  .post("/profile/password", checkIsAuth, setUserPasswordController);

module.exports = router;
