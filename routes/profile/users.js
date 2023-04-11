const expres = require("express");
const checkIsAuth = require("../../middlewares/checkIsAuth");
const getUsernameController = require("../../controllers/getUsernameController");
const getUserAvaatarConreoller = require("../../controllers/getUserAvatarController");
const uuidValidator = require("../../middlewares/validators/uuIdValidator");

const router = expres.Router();

router
  .get(
    "/users/:id/profile/username",
    checkIsAuth,
    uuidValidator,
    getUsernameController
  )
  .get(
    "/users/:id/profile/avatar",
    checkIsAuth,
    uuidValidator,
    getUserAvaatarConreoller
  );

module.exports = router;
