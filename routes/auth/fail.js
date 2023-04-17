const expres = require("express");
const checkNotAuth = require("../../middlewares/checkNOTAuth");

const router = expres.Router();

router.get("/auth/fail", (req, res) => {
  let msg;
  if (req.session)
    msg = req.session.messages[0] ? req.session.messages[0] : "Unauthorized((";

  res.status(401).json(msg);
});

module.exports = router;
