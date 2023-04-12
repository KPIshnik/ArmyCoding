const expres = require("express");
const router = expres.Router();
const checkIsAuth = require("../../middlewares/checkIsAuth");
const getUserProfileController = require("../../controllers/getUserProfileController");

router.use(expres.json());

router.get("/me/profile", checkIsAuth, getUserProfileController);

module.exports = router;
