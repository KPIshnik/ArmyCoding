const expres = require("express");
const passport = require("passport");

const router = expres.Router();
router.get(
  "/auth/fb/cb",
  // fbAuthController
  //(req, res)=>{

  //}
  passport.authenticate("facebook", {
    failureRedirect: "/auth/fail",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

module.exports = router;
