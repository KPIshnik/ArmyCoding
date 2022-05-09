const expres = require("express");
const checkIsAuth = require("../middlewares/checkIsAuth");
const passport = require("passport");

const router = expres.Router();

router.get(
  "/googleAuth",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

module.exports = router;
