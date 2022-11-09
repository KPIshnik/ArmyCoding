const expres = require("express");
const passport = require("passport");

const router = expres.Router();
router.get(
  "/auth/fb/cb",
  passport.authenticate("facebook", {
    failureRedirect: "/auth/fail",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

module.exports = router;
