const expres = require("express");
const updateTodoListController = require("../../controllers/todolists/updateTodoListController");
const createTodoListController = require("../../controllers/todolists/createTodoListController");
const deleteTodolistController = require("../../controllers/todolists/deleteTodolistController");
const getTodoListsController = require("../../controllers/todolists/getTodoListsController");
const router = expres.Router();
const checkIsAuth = require("../../middlewares/checkIsAuth");
const createTodoListValidator = require("../../middlewares/validators/createTodoListValidator");
const updateTodoListValidator = require("../../middlewares/validators/updateTodoListValidator");
const uuidValidator = require("../../middlewares/validators/uuIdValidator");
const isListOwnerValidator = require("../../middlewares/validators/isListOwnerValidator");
const getSinglTodoListController = require("../../controllers/todolists/getSinglTodoListController");
router.use(expres.json());

router
  .get("/todolists", checkIsAuth, getTodoListsController)
  .get("/todolists/:id", checkIsAuth, uuidValidator, getSinglTodoListController)
  .post(
    "/todolists",
    checkIsAuth,
    createTodoListValidator,
    createTodoListController
  )
  .put(
    "/todolists",
    checkIsAuth,
    updateTodoListValidator,
    isListOwnerValidator,
    updateTodoListController
  )
  .delete(
    "/todolists",
    checkIsAuth,
    uuidValidator,
    isListOwnerValidator,
    deleteTodolistController
  );

module.exports = router;
