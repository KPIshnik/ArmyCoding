const expres = require("express");
const updateUserEmailController = require("../../controllers/updateUserEmailController");
const checkIsAuth = require("../../middlewares/checkIsAuth");
const resetUserEmailValidator = require("../../middlewares/validators/resetUserEmailValidator");

const router = expres.Router();

router.put(
  "/me/profile/email",
  checkIsAuth,
  resetUserEmailValidator,
  updateUserEmailController
);

module.exports = router;
