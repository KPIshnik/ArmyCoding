const expres = require("express");
const passport = require("../../middlewares/passport");
const checkIsAuth = require("../../middlewares/checkIsAuth");
const { login, logout, totalLogout, refresh } = require("../../services/auth");

const router = expres.Router();
router.use(expres.json());

router
  .post("/auth", login)
  .post("/auth/refresh", refresh)
  .delete("/auth", checkIsAuth, logout)
  .delete("/auth/total", checkIsAuth, totalLogout);

module.exports = router;
