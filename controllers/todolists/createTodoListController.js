const createTodoList = require("../../models/todilists/createTodoList");

const createTodoListController = async (req, res) => {
  const { listname, todos, valid } = req.body;
  const user = req.user;

  if (!valid) {
    throw new Error("request data not valid");
  }

  await createTodoList(user.id, listname, todos);
  res.status(200).json(`todolist ${listname} created`);
};

module.exports = createTodoListController;
