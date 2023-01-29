const expres = require("express");
const checkIsAuth = require("../../middlewares/checkIsAuth");
const setUserPasswordController = require("../../controllers/setUserPasswordController");
const resetPassValidator = require("../../middlewares/validators/changePasswordValidator");

const router = expres.Router();

router
  .get("/profile/password", checkIsAuth, (req, res) =>
    res.status(200).json("pass page")
  )
  .post(
    "/profile/password",
    checkIsAuth,
    resetPassValidator,
    setUserPasswordController
  );

module.exports = router;
