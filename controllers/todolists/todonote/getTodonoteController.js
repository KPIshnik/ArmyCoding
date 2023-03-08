const getTodosByListId = require("../../../models/todilists/getTodosByListId");
const getTodonoteById = require("../../../models/todilists/todonote/getTodonoteById");

const getTodonoteController = async (req, res) => {
  const id = req.params.id;

  const todonote = await getTodonoteById(id);
  const todos = await getTodosByListId(todonote.listid);

  const msg = {
    id: todonote.id,
    text: todonote.text,
    done: todonote.done,
    listid: todonote.listid,
    priority: todos.findIndex((t) => t.id === todonote.id) + 1,
  };

  todonote ? res.status(200).json(msg) : res.sendStatus(404);
};

module.exports = getTodonoteController;
