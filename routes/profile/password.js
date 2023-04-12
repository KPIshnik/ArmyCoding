const expres = require("express");
const checkIsAuth = require("../../middlewares/checkIsAuth");
const updateUserPasswordController = require("../../controllers/updateUserPasswordController");
const resetPassValidator = require("../../middlewares/validators/resetPasswordValidator");

const router = expres.Router();

router.put(
  "/me/profile/password",
  checkIsAuth,
  resetPassValidator,
  updateUserPasswordController
);

module.exports = router;
