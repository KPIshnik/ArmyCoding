const expres = require("express");
const checkNOTAuth = require("../middlewares/checkNOTAuth");
const registerUser = require("../controllers/registerUserr");
const router = expres.Router();
router.use(expres.json());

router
  .get("/auth/register", checkNOTAuth, (req, res) => {
    res.status(200);
    res.end("register page");
  })
  .post("/auth/register", registerUser);

module.exports = router;
