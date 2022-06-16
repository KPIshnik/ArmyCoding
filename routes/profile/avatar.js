const expres = require("express");
const router = expres.Router();
const checkIsAuth = require("../../middlewares/checkIsAuth");

//const getAvatarController = require('../controllers/getAvatarController')
const setAvatarController = require("../../controllers/setAvatarController");
const uploadAvatar = require("../../middlewares/uploadAvatar");
//const chengeAvatarController = require('../controllers/chengeAvatarController')
//const delAvatarConrtroller = require('../controllers/delAvatarController')

router.use(expres.json());

router
  //.get("/user/avatar", getAvatarController)
  .post("/profile/avatar", checkIsAuth, uploadAvatar, (req, res) =>
    res.end("zaebca")
  );
//.patch("/user/avatar", chengeAvatarController)
//.delete("/user/avatar", delAvatarConrtroller);

module.exports = router;
