const getTodoListS = require("../../models/todilists/getTodoLists");
const getTodoList = require("../../models/todilists/getTodoList");

const getTodoListsController = async (req, res) => {
  const user = req.user;
  const todoID = req.param.id;

  if (!todoID) {
    const todoListS = await getTodoListS(user.id);
    res.status(200).json(todoListS);
    return;
  }

  const todoList = await getTodoList(user.id, todoID);
  res.status(200).json(todoList);
};

module.exports = getTodoListsController;
