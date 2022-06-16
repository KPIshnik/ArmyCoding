const expres = require("express");
const passport = require("passport");

const router = expres.Router();

router.get(
  "/auth/fb",
  passport.authenticate("facebook", {
    scope: ["email" /*, "profile"*/],
  })
);

module.exports = router;
