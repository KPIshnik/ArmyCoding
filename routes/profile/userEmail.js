const expres = require("express");
const setUserEmailController = require("../../controllers/setUserEmailController");
const checkIsAuth = require("../../middlewares/checkIsAuth");
const resetUserEmailValidator = require("../../middlewares/validators/resetUserEmailValidator");

const router = expres.Router();

router
  .get("/profile/email", checkIsAuth, (req, res) =>
    res.status(200).json("useremail page")
  )
  .post(
    "/profile/email",
    checkIsAuth,
    resetUserEmailValidator,
    setUserEmailController
  );

module.exports = router;
