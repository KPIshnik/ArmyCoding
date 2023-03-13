const getUserTodoListDataById = require("../../models/todilists/getTodoLIstDataById");
const getTodonoteById = require("../../models/todilists/todonote/getTodonoteById");

const isTodonoteOwnerValidator = async (req, res, next) => {
  req.body.valid = false;
  const id = req.params.id;

  const todonote = await getTodonoteById(id);

  if (!todonote) {
    res.sendStatus(404);
    return;
  }

  const listData = await getUserTodoListDataById(todonote.listid);

  if (!(listData.owner_id === req.user.id)) {
    res.status(400).json("access denied");
    return;
  }
  req.body.valid = true;
  next();
};

module.exports = isTodonoteOwnerValidator;
