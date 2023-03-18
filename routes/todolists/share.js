const expres = require("express");
const getUsersWithAccessToListController = require("../../controllers/todolists/share/getUsersWithAccessToListController");
const shareTodolistController = require("../../controllers/todolists/share/shareTodolistConstroller");
const unshareTodolistController = require("../../controllers/todolists/share/unshareTodolistController");
const updateSharingListController = require("../../controllers/todolists/share/updateSharingListController");
const router = expres.Router();
const checkIsAuth = require("../../middlewares/checkIsAuth");
const unshareListWithAllUsersMidlware = require("../../middlewares/unsherListWithAllUsersMidlware");
const isListOwnerValidator = require("../../middlewares/validators/isListOwnerValidator");
const shareTodolistValidator = require("../../middlewares/validators/shareTodolistValidator");
const unshareTodolistValidator = require("../../middlewares/validators/unshareTodolistValidator");
const uuidValidator = require("../../middlewares/validators/uuIdValidator");

router.use(expres.json());

router
  .get(
    "/todolist/share/:id",
    checkIsAuth,
    uuidValidator,
    getUsersWithAccessToListController
  )
  .post(
    "/todolist/share",
    checkIsAuth,
    uuidValidator,
    shareTodolistValidator,
    isListOwnerValidator,
    shareTodolistController
  )
  .put(
    "/todolist/share",
    checkIsAuth,
    uuidValidator,
    shareTodolistValidator,
    isListOwnerValidator,
    updateSharingListController
  )
  .delete(
    "/todolist/share",
    checkIsAuth,
    uuidValidator,
    isListOwnerValidator,
    unshareTodolistController
  );

module.exports = router;
