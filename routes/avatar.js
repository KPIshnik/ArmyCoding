const expres = require("express");
const passport = require("../middlewares/passport");
const checkIsAuth = require("../middlewares/checkIsAuth");
const checkNOTAuth = require("../middlewares/checkNOTAuth");

const getAvatarController = require('../controllers/getAvatarController')
const setAvatarController = require('../controllers/setAvatarController')
const chengeAvatarController = require('../controllers/chengeAvatarController')
const delAvatarConrtroller = require('../controllers/delAvatarController')

const router = expres.Router();
router.use(expres.json());

router
  .get("/user/avatar", getAvatarController)
  .post("/user/avatar", setAvatarController)
  .patch("/user/avatar", chengeAvatarController)
  .delete("/user/avatar", delAvatarConrtroller);

module.exports = router;
