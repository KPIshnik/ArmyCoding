const expres = require("express");
const router = expres.Router();
const checkIsAuth = require("../../middlewares/checkIsAuth");

const getAvatarController = require("../../controllers/getAvatarController");
const setAvatarController = require("../../controllers/setAvatarController");
const uploadAvatar = require("../../middlewares/uploadAvatar");
const chengeAvatarController = require("../../controllers/chengeAvatarController");
const delAvatarConrtroller = require("../../controllers/delAvatarController");

router.use(expres.json());

router
  .get("/me/profile/avatar", checkIsAuth, getAvatarController)
  .post("/me/profile/avatar", checkIsAuth, uploadAvatar, setAvatarController)
  .put("/me/profile/avatar", checkIsAuth, uploadAvatar, chengeAvatarController)
  .delete("/me/profile/avatar", checkIsAuth, delAvatarConrtroller);

module.exports = router;
