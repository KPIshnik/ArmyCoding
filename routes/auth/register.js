const expres = require("express");
const checkNOTAuth = require("../../middlewares/checkNOTAuth");
const registerUser = require("../../controllers/registerUserr");
const registerUserValidator = require("../../middlewares/validators/registerUserValidator");
const router = expres.Router();
router.use(expres.json());

router
  .get("/auth/register", checkNOTAuth, (req, res) => {
    res.status(200).json("register page");
  })
  .post("/auth/register", registerUserValidator, registerUser);

module.exports = router;
