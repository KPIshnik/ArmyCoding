const expres = require("express");
const getSinglTodoListController = require("../../controllers/todolists/getSinglTodoListController");
const getPermittedTodolistsController = require("../../controllers/todolists/share/getPermittedTodolitsController");
const router = expres.Router();
const checkIsAuth = require("../../middlewares/checkIsAuth");
const shareTodolistValidator = require("../../middlewares/validators/shareTodolistValidator");
const uuidValidator = require("../../middlewares/validators/uuIdValidator");

router.use(expres.json());

router
  .get("/permitted", checkIsAuth, getPermittedTodolistsController)
  .get(
    "/permitted/:id",
    checkIsAuth,
    uuidValidator,
    getSinglTodoListController
  );

module.exports = router;
