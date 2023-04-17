const expres = require("express");
const passport = require("../../middlewares/passport");
const checkIsAuth = require("../../middlewares/checkIsAuth");
const checkNOTAuth = require("../../middlewares/checkNOTAuth");
const logoutController = require("../../controllers/logoutController");

const router = expres.Router();
router.use(expres.json());

router
  .post(
    "/auth",
    //kill chek, kill pasport
    checkNOTAuth,
    passport.authenticate("local"),
    (req, res) => {
      res.redirect("/");
    }
  )
  .delete("/auth", checkIsAuth, logoutController);

module.exports = router;
