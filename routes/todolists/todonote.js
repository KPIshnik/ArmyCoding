const expres = require("express");
const deleteTodonoteController = require("../../controllers/todolists/todonote/deleteTodonoteController");
const getTodonoteController = require("../../controllers/todolists/todonote/getTodonoteController");
const setTodonoteController = require("../../controllers/todolists/todonote/setTodonoteController");
const router = expres.Router();
const checkIsAuth = require("../../middlewares/checkIsAuth");
const setTodonoteValidator = require("../../middlewares/validators/setTodonoteValidator");
const uuidValidator = require("../../middlewares/validators/uuIdValidator");
router.use(expres.json());

router
  .get("/todonote/:id", checkIsAuth, uuidValidator, getTodonoteController)
  .post("/todonote", checkIsAuth, setTodonoteValidator, setTodonoteController)
  .put("/todonote", checkIsAuth)
  .delete(
    "/todonote/:id",
    checkIsAuth,
    uuidValidator,
    deleteTodonoteController
  );

module.exports = router;
