const expres = require("express");
const updateUsernameController = require("../../controllers/updateUsernameController");
const checkIsAuth = require("../../middlewares/checkIsAuth");
const resetUsernameValidator = require("../../middlewares/validators/resetUsernameValidator");

const router = expres.Router();

router.put(
  "/me/profile/username",
  checkIsAuth,
  resetUsernameValidator,
  updateUsernameController
);

module.exports = router;
