const expres = require("express");
const router = expres.Router();
const confirmEmailController = require("../../controllers/confirmEmailController");

router.get("/auth/confirmEmail", confirmEmailController);

module.exports = router;
