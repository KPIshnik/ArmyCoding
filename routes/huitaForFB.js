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
    res.status(200);
    res.end("Huita is in progress on FB");
  }
);

module.exports = router;
