const expres = require("express");
const setUserEmailController = require("../../controllers/setUserEmailController");
const checkIsAuth = require("../../middlewares/checkIsAuth");

const router = expres.Router();

router
  .get(
    "/user/email", checkIsAuth, (req,res) =>res.end('useremail')
  )
  .post(
      "/user/email", checkIsAuth, setUserEmailController
  )

module.exports = router;
