const expres = require("express");
const deleteTodonoteController = require("../../controllers/todolists/todonote/deleteTodonoteController");
const getTodonoteController = require("../../controllers/todolists/todonote/getTodonoteController");
const setTodonoteController = require("../../controllers/todolists/todonote/setTodonoteController");
const updateTodonoteController = require("../../controllers/todolists/todonote/updateTodonoteController");
const router = expres.Router();
const checkIsAuth = require("../../middlewares/checkIsAuth");
const todonoteValidator = require("../../middlewares/validators/todonoteValidator");
const uuidValidator = require("../../middlewares/validators/uuIdValidator");
router.use(expres.json());

router
  .get("/todonote/:id", checkIsAuth, uuidValidator, getTodonoteController)
  .post("/todonote", checkIsAuth, todonoteValidator, setTodonoteController)
  .put(
    "/todonote",
    checkIsAuth,
    uuidValidator,
    todonoteValidator,
    updateTodonoteController
  )
  .delete(
    "/todonote/:id",
    checkIsAuth,
    uuidValidator,
    deleteTodonoteController
  );

module.exports = router;
