const expres = require("express");
const passport = require("../middlewares/passport");
const checkIsAuth = require("../middlewares/checkIsAuth");
const checkNOTAuth = require("../middlewares/checkNOTAuth");

const router = expres.Router();
router.use(expres.json());

router
  .get("/avatar", sendAvatarController)
  .post("/avatar", setAvatarController)
  .patch("/avatar", chengAvatarController)
  .delete("/avatar", delAvatarController);

module.exports = router;
