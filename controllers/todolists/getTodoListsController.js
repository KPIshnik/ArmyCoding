const getUserTodoListsByUserid = require("../../models/todilists/getUserTodoListsByUserid");

const getTodoListsController = async (req, res, next) => {
  try {
    const user = req.user;

    const userTodoLists = await getUserTodoListsByUserid(user.id);

    res.status(200).json(userTodoLists);
  } catch (err) {
    next(err);
  }
};

module.exports = getTodoListsController;
