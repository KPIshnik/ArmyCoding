const expres = require("express");
const passport = require("passport");

const router = expres.Router();

router.get(
  "/auth/google/cb",
  passport.authenticate("google", {
    failureRedirect: "/auth/fail",
    failureMessage: true,
  }),
  (req, res) => {
    res.redirect("/");
  }
);

module.exports = router;

// (req, res, next) => {
//   passport.authenticate(
//     "google",

//     (err, user, info) => {
//       if (err) {
//         return next(err);
//       }
//       if (!user) {
//         return res.status(401).json(info);
//       }
// req.login(user, function(err){
//   if(err){
//     return next(err);
//   }

//       return res.redirect("/");
//     }
//   )(req, res, next);
// }
