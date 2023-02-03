const expres = require("express");
const createTodoListController = require("../../controllers/todolists/createTodoListController");
const getTodoListsController = require("../../controllers/todolists/getTodoListsController");
const router = expres.Router();
const checkIsAuth = require("../../middlewares/checkIsAuth");
const createTodoListValidator = require("../../middlewares/validators/createTodoListValidator");

router.use(expres.json());

router
  .get("/todolists", checkIsAuth, getTodoListsController)
  .post(
    "/todolists",
    checkIsAuth,
    createTodoListValidator,
    createTodoListController
  );
//   .put("/todolists", checkIsAuth)
//   .delete("/todolists", checkIsAuth);

module.exports = router;
