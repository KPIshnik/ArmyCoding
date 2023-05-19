const expres = require("express");
const checkIsAuth = require("../../middlewares/checkIsAuth");
const { auth } = require("../../services/auth");

const router = expres.Router();
router.use(expres.json());

router
  .post("/auth", auth.login)
  .post("/auth/refresh", auth.tokenRefresh)
  .delete("/auth", checkIsAuth, auth.logout)
  .delete("/auth/total", checkIsAuth, auth.totalLogout);

module.exports = router;
