const expres = require("express");
const getUsersWithAccessToListController = require("../../controllers/todolists/share/getUsersWithAccessToListController");
const shareTodolistController = require("../../controllers/todolists/share/shareTodolistConstroller");
const unshareTodolistController = require("../../controllers/todolists/share/unshareTodolistController");
const updateSharingListController = require("../../controllers/todolists/share/updateSharingListController");
const router = expres.Router();
const checkIsAuth = require("../../middlewares/checkIsAuth");
const isListOwnerValidator = require("../../middlewares/validators/isListOwnerValidator");
const shareTodolistValidator = require("../../middlewares/validators/shareTodolistValidator");
const uuidValidator = require("../../middlewares/validators/uuIdValidator");

router.use(expres.json());

router
  .get(
    "/todolists/:id/share",
    checkIsAuth,
    uuidValidator,
    getUsersWithAccessToListController
  )
  .post(
    "/todolists/:id/share",
    checkIsAuth,
    uuidValidator,
    shareTodolistValidator,
    isListOwnerValidator,
    shareTodolistController
  )
  .put(
    "/todolists/:id/share",
    checkIsAuth,
    uuidValidator,
    shareTodolistValidator,
    isListOwnerValidator,
    updateSharingListController
  )
  .delete(
    "/todolists/:id/share/:email",
    checkIsAuth,
    uuidValidator,
    isListOwnerValidator,
    unshareTodolistController
  );

module.exports = router;
