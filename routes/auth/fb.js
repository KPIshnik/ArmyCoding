const expres = require("express");
const auth = require("../../services/auth");

const router = expres.Router();

router.get("/auth/fb", auth.facebook.getCode);

module.exports = router;
