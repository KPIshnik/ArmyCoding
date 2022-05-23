const expres = require("express");
const passport = require("passport");
const checkIsAuth = require("../middlewares/checkIsAuth");

const router = expres.Router();

router.get(
  "/huita",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect('/')
  }
);

module.exports = router;
