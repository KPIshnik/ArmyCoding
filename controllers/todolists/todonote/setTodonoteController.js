const createTodos = require("../../../models/todilists/createTodos");
const getTodosByListId = require("../../../models/todilists/getTodosByListId");
const updateTodos = require("../../../models/todilists/updateTodos");

const setTodonoteController = async (req, res) => {
  const { listid, text, priority, done, valid } = req.body;
  if (!valid) {
    throw new Error("request data not valid");
  }

  const todos = await getTodosByListId(listid);
  const rank =
    priority === 1
      ? todos[0].rank / 2
      : priority > todos.length
      ? todos[todos.length - 1].rank + 1000000
      : Math.floor((todos[priority - 1].rank + todos[priority - 2].rank) / 2);

  if (rank === 0 || rank >= 2147483647 || rank === todos[priority - 1].rank) {
    todos.splice(priority - 1, 0, { listid, text, rank, done });
    todos.forEach((t, i) => (t.rank = (i + 1) * 1000000));

    await updateTodos(todos.filter((t) => t.id));
  }

  const idArr = await createTodos(listid, [{ text, rank, done }]);

  res.status(200).json({ msg: "todonote created", id: idArr[0].id });
};

module.exports = setTodonoteController;
