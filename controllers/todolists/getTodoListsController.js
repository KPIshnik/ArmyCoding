const getUserTodoListsByUserid = require("../../models/todilists/getUserTodoListsByUserid");
const getTodosByListId = require("../../models/todilists/getTodosByListId");
const getUserTodoListDataById = require("../../models/todilists/getTodoLIstDataById");
const isUUIDvalid = require("../../helpers/isUUIDvalid");

const getTodoListsController = async (req, res) => {
  const user = req.user;
  const listId = req.query.id;

  if (!listId) {
    const userTodoLists = await getUserTodoListsByUserid(user.id);

    res.status(200).json(userTodoLists);
    return;
  }

  if (!isUUIDvalid(listId)) {
    res.status(400).json("valid id required");
    return;
  }

  const listData = await getUserTodoListDataById(listId);

  if (!listData) {
    res.sendStatus(404);
    return;
  }

  const todos = await getTodosByListId(listId);
  const preparedTodos = todos.map((todo, i) => {
    return {
      id: todo.id,
      text: todo.text,
      done: todo.done,
      priority: i + 1,
    };
  });

  const response = {
    ...listData,
    todos: preparedTodos,
  };
  res.status(200).json(response);
};

module.exports = getTodoListsController;
