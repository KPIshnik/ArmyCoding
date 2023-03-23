const getUserTodoListDataById = require("../../../models/todilists/getTodoLIstDataById");
const getTodosByListId = require("../../../models/todilists/getTodosByListId");
const getTodonoteById = require("../../../models/todilists/todonote/getTodonoteById");

const getTodonoteController = async (req, res, next) => {
  try {
    const id = req.params.id;

    const todonote = await getTodonoteById(id);

    if (!todonote) {
      res.sendStatus(404);
      return;
    }

    const listData = await getUserTodoListDataById(todonote.listid);

    if (!(req.user.id === listData.owner_id)) {
      res.status(400).json("access denied");
      return;
    }

    const todos = await getTodosByListId(todonote.listid);

    const msg = {
      id: todonote.id,
      text: todonote.text,
      done: todonote.done,
      listid: todonote.listid,
      priority: todos.findIndex((t) => t.id === todonote.id) + 1,
    };

    todonote ? res.status(200).json(msg) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
};

module.exports = getTodonoteController;
