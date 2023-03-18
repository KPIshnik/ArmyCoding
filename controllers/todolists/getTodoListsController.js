const getUserTodoListsByUserid = require("../../models/todilists/getUserTodoListsByUserid");

const getTodoListsController = async (req, res) => {
  const user = req.user;

  const userTodoLists = await getUserTodoListsByUserid(user.id);

  res.status(200).json(userTodoLists);
};

module.exports = getTodoListsController;
