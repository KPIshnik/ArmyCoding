const expres = require("express");
const router = expres.Router();
const checkIsAuth = require("../../middlewares/checkIsAuth");
const uuidValidator = require("../../middlewares/validators/uuIdValidator");
router.use(expres.json());

router
  .get("/todolist/todonote/:id", checkIsAuth, uuidValidator)
  .post("/todolist/todonote", checkIsAuth)
  .put("/todolist/todonote", checkIsAuth)
  .delete("/todolist/todonote/:id", checkIsAuth, uuidValidator);

module.exports = router;
