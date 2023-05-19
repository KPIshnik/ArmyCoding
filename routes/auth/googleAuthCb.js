const expres = require("express");
const { auth } = require("../../services/auth");

const router = expres.Router();

router.get("/auth/google/cb", auth.google.getProfile, auth.google.authenticate);

module.exports = router;
