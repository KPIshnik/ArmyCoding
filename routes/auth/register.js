const expres = require("express");
const registerUser = require("../../controllers/registerUserr");
const registerUserValidator = require("../../middlewares/validators/registerUserValidator");

const router = expres.Router();
router.use(expres.json());

router.post("/auth/register", registerUserValidator, registerUser);

module.exports = router;
