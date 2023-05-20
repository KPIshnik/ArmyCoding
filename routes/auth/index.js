const expres = require("express");
const checkIsAuth = require("../../middlewares/checkIsAuth");
const auth = require("../../services/auth");

const router = expres.Router();
router.use(expres.json());

router
  .post("/auth", auth.email.login)
  .post("/auth/refresh", auth.email.tokenRefresh)
  .delete("/auth", checkIsAuth, auth.email.logout)
  .delete("/auth/total", checkIsAuth, auth.email.totalLogout);

module.exports = router;
