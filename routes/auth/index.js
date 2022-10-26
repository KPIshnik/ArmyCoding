const expres = require("express");
const passport = require("../../middlewares/passport");
const checkIsAuth = require("../../middlewares/checkIsAuth");
const checkNOTAuth = require("../../middlewares/checkNOTAuth");

const router = expres.Router();
router.use(expres.json());

router
  .get("/auth", checkNOTAuth, (req, res) => {
    res.end("auth page");
  })
  .post("/auth", checkNOTAuth, passport.authenticate("local"), (req, res) => {
    res.redirect("/");
  })
  .delete("/auth", checkIsAuth, (req, res) => {
    req.logout().redirect(200, "/auth");
  });

module.exports = router;
