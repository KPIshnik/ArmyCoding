const expres = require("express");
const checkIsAuth = require("../middlewares/checkIsAuth");
const passport = require("passport");

const router = expres.Router();

router.get(
  "/facebookAuth",
  passport.authenticate("facebook", {
    scope: ["email"/*, "profile"*/],
  })
);

module.exports = router;
