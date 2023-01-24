const expres = require("express");
const passport = require("../../middlewares/passport");
const checkIsAuth = require("../../middlewares/checkIsAuth");
const checkNOTAuth = require("../../middlewares/checkNOTAuth");
const logoutController = require("../../controllers/logoutController");

const router = expres.Router();
router.use(expres.json());

router
  .get("/auth", checkNOTAuth, (req, res) => {
    const msg = "register page";
    res.status(200).json(msg);
  })
  .post("/auth", checkNOTAuth, passport.authenticate("local"), (req, res) => {
    res.redirect("/");
  })
  .delete("/auth", checkIsAuth, logoutController);

module.exports = router;
