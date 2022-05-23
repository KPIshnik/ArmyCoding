const expres = require("express");
const passport = require("passport");
const checkIsAuth = require("../middlewares/checkIsAuth");

const router = expres.Router();

router.get(
  "/huitaForFB",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect('/')
  }
);

module.exports = router;
