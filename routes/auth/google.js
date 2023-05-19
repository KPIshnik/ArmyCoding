const expres = require("express");
const { auth } = require("../../services/auth");

const router = expres.Router();

router.get("/auth/google", auth.google.getCode);

module.exports = router;
