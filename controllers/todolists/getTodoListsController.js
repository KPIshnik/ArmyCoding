const getUserTodoListsByUserid = require("../../models/todilists/getUserTodoListsByUserid");
const getTodosByListId = require("../../models/todilists/getTodosByListId");
const getUserTodoListDataById = require("../../models/todilists/getTodoLIstDataById");

const getTodoListsController = async (req, res) => {
  const user = req.user;
  const listId = req.query.id;

  if (!listId) {
    const userTodoLists = await getUserTodoListsByUserid(user.id);
    res.status(200).json(userTodoLists);
    return;
  }

  const listData = await getUserTodoListDataById(listId);
  const todos = await getTodosByListId(listId);

  todos.forEach((todo, i) => (todo.priority = i + 1));

  const response = {
    listData,
    todos,
  };
  res.status(200).json(response);
};

module.exports = getTodoListsController;
