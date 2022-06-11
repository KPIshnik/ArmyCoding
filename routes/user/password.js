const expres = require("express");
const checkIsAuth = require("../../middlewares/checkIsAuth");
const setUserPasswordController = require("../../models/setUserPasswordController");

const router = expres.Router();

router
  .get(
    "/user/password", checkIsAuth, (req,res) => res.end('pass page')
  )
  .post(
    "/user/password", checkIsAuth, setUserPasswordController
  )

module.exports = router;
