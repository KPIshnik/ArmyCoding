const expres = require("express");
const setUserEmailController = require("../../controllers/setUserEmailController");
const checkIsAuth = require("../../middlewares/checkIsAuth");

const router = expres.Router();

router
  .get("/profile/email", checkIsAuth, (req, res) =>
    res.status(200).json("useremail page")
  )
  .post("/profile/email", checkIsAuth, setUserEmailController);

module.exports = router;
