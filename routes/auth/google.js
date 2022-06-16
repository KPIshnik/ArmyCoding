const expres = require("express");
const passport = require("passport");

const router = expres.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

module.exports = router;
