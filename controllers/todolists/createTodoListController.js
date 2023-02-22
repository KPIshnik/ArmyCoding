const createTodoList = require("../../models/todilists/createTodoList");

const createTodoListController = async (req, res) => {
  const { listname, todos, valid } = req.body;
  const user = req.user;

  if (!valid) {
    throw new Error("request data not valid");
  }

  if (todos) {
    todos.sort((todo1, todo2) => todo1.priority - todo2.priority);
    todos.map((todo, i) => (todo.rank = i * 1000000));
  }

  const timestamp = new Date();

  const id = await createTodoList(user.id, listname, todos, timestamp);

  const response = {
    message: `todolist ${listname} created`,
    data: { id },
  };

  res.status(200).json(response);
};

module.exports = createTodoListController;
