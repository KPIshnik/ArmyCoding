const expres = require("express");
const deleteTodonoteController = require("../../controllers/todolists/todonote/deleteTodonoteController");
const getTodonoteController = require("../../controllers/todolists/todonote/getTodonoteController");
const setTodonoteController = require("../../controllers/todolists/todonote/setTodonoteController");
const updateTodonoteController = require("../../controllers/todolists/todonote/updateTodonoteController");
const router = expres.Router();
const checkIsAuth = require("../../middlewares/checkIsAuth");
const isListOwnerValidator = require("../../middlewares/validators/isListOwnerValidator");
const isTodonoteOwnerValidator = require("../../middlewares/validators/isTodonoteOwnerValidator");
const todonoteValidator = require("../../middlewares/validators/todonoteValidator");
const uuidValidator = require("../../middlewares/validators/uuIdValidator");
router.use(expres.json());

router
  .get(
    "/todolists/todonotes/:id",
    checkIsAuth,
    uuidValidator,
    getTodonoteController
  )
  .post(
    "/todolists/:listid/todonotes",
    checkIsAuth,
    todonoteValidator,
    isListOwnerValidator,
    setTodonoteController
  )
  .put(
    "/todolists/:listid/todonotes/:id",
    checkIsAuth,
    uuidValidator,
    todonoteValidator,
    isListOwnerValidator,
    updateTodonoteController
  )
  .delete(
    "/todolists/todonotes/:id",
    checkIsAuth,
    uuidValidator,
    isTodonoteOwnerValidator,
    deleteTodonoteController
  );

module.exports = router;
