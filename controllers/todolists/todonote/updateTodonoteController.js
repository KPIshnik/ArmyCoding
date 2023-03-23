const getTodosByListId = require("../../../models/todilists/getTodosByListId");
const updateTodos = require("../../../models/todilists/updateTodos");

const updateTodonoteController = async (req, res, next) => {
  try {
    const { listid, id, text, priority, done, valid } = req.body;
    if (!valid) {
      throw new Error("request data not valid");
    }

    const todos = await getTodosByListId(listid);

    const setRank = () => {
      const oldPriority = todos.findIndex((t) => t.id === id) + 1;

      if (oldPriority === priority) return todos[oldPriority - 1].rank;

      const rank =
        priority === 1
          ? todos[0].rank / 2
          : priority >= todos.length
          ? todos[todos.length - 1].rank + 1000000
          : Math.floor((todos[priority].rank + todos[priority - 1].rank) / 2);

      return rank;
    };
    const rank = setRank();

    if (rank === 0 || rank >= 2147483647 || rank === todos[priority - 1].rank) {
      const newTodos = todos.filter((t) => !(t.id === id));
      newTodos.splice(priority - 1, 0, { id, listid, text, rank, done });
      newTodos.map((t, i) => (t.rank = (i + 1) * 1000000));

      await updateTodos(newTodos);
      res.status(200).json(`todonote ${id} updated`);
      return;
    }

    await updateTodos([{ id, text, rank, done }]);

    res.status(200).json(`todonote ${id} updated`);
  } catch (err) {
    next(err);
  }
};

module.exports = updateTodonoteController;
