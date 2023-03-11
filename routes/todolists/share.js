const expres = require("express");
const getUsersWithAccessToListController = require("../../controllers/todolists/share/getUsersWithAccessToListController");
const shareTodolistController = require("../../controllers/todolists/share/shareTodolistConstroller");
const router = expres.Router();
const checkIsAuth = require("../../middlewares/checkIsAuth");
const uuidValidator = require("../../middlewares/validators/uuIdValidator");
router.use(expres.json());

router
  .get(
    "/todolists/share/:id",
    checkIsAuth,
    uuidValidator,
    getUsersWithAccessToListController
  )
  .post("/todolists/share", checkIsAuth, shareTodolistController)
  .put("/todolists/share", checkIsAuth, (req, res) => {})
  .delete("/todolists/share/:id", checkIsAuth, uuidValidator);

module.exports = router;
