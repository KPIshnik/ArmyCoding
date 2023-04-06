const { setRank } = require("../../../helpers/setRank");
const getTodosByListId = require("../../../models/todilists/getTodosByListId");
const updateTodos = require("../../../models/todilists/updateTodos");

const updateTodonoteController = async (req, res, next) => {
  try {
    const { text, priority, done, valid } = req.body;
    const { listid, id } = req.params;
    if (!valid) {
      throw new Error("request data not valid");
    }

    const todos = await getTodosByListId(listid);

    const rank = setRank(todos, priority, id);

    let newTodos = [{ id, text, rank, done }];

    if (
      rank < 1 ||
      rank >= 2147483647 ||
      (priority <= todos.length &&
        priority >= 2 &&
        rank === todos[priority - 2].rank)
    ) {
      newTodos = todos.filter((t) => !(t.id === id));
      newTodos.splice(priority - 1, 0, { id, listid, text, rank, done });
      newTodos.forEach((t, i) => (t.rank = (i + 1) * 1000000));
    }

    await updateTodos(newTodos);

    res.status(200).json(`todonote ${id} updated`);
  } catch (err) {
    next(err);
  }
};

module.exports = updateTodonoteController;
