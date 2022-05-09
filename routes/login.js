const expres = require("express");
const passport = require("../middlewares/passport");
const checkIsAuth = require("../middlewares/checkIsAuth");
const checkNOTAuth = require("../middlewares/checkNOTAuth");

const router = expres.Router();
router.use(expres.json());

router
  .get("/login", checkNOTAuth, (req, res) => {
    res.end("login page");
  })
  .post("/login", checkNOTAuth, passport.authenticate("local"), (req, res) => {
    res.redirect(200, "/");
  })
  .delete("/login", checkIsAuth, (req, res) => {
    req.logout();
    res.redirect(200, "/login");
  });

module.exports = router;
