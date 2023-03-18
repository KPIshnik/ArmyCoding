const getUserTodoListsByUserid = require("../../models/todilists/getUserTodoListsByUserid");
const getTodosByListId = require("../../models/todilists/getTodosByListId");
const getUserTodoListDataById = require("../../models/todilists/getTodoLIstDataById");
const isUUIDvalid = require("../../helpers/isUUIDvalid");
const isUserHaveAccesToList = require("../../models/todilists/permitted/isUserHaveAccesTolist");

const getSinglTodoListController = async (req, res) => {
  const user = req.user;
  const listId = req.params.id;

  const listData = await getUserTodoListDataById(listId);

  if (!listData) {
    res.sendStatus(404);
    return;
  }

  if (!(user.id === listData.owner_id)) {
    const access = await isUserHaveAccesToList(user.id, listId);
    if (!access) {
      res.status(400).json("access denied");
      return;
    }
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

module.exports = getSinglTodoListController;
