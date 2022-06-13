const expres = require("express");
const passport = require("passport");

const router = expres.Router();
//проверить есть ли тако, если нет то зарегить по данным. если есть ауситикате.
router.get(
  "/huita",
  passport.authenticate("google", {
    //пошаманить тут. получить профиль, зарегать, редиректнуть.
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

module.exports = router;
