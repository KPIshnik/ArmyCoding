const expres = require("express");
const auth = require("../../services/auth");

const router = expres.Router();
router.get("/auth/fb/cb", auth.facebook.getProfile, auth.facebook.authenticate);

module.exports = router;
