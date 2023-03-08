const createTodos = require("../../../models/todilists/createTodos");
const getTodosByListId = require("../../../models/todilists/getTodosByListId");

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
      : (todos[priority - 1].rank + todos[priority - 2].rank) / 2;

  const idArr = await createTodos(listid, [{ text, rank, done }]);

  res.status(200).json({ msg: "todonote created", id: idArr[0].id });
};

module.exports = setTodonoteController;
