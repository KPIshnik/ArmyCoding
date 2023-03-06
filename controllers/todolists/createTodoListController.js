const createTodoList = require("../../models/todilists/createTodoList");
const createTodos = require("../../models/todilists/createTodos");

const createTodoListController = async (req, res) => {
  const { listname, todos, valid } = req.body;
  const user = req.user;

  if (!valid) {
    throw new Error("request data not valid");
  }

  const timestamp = new Date();

  const id = await createTodoList(user.id, listname, timestamp);

  if (todos) {
    todos.sort((todo1, todo2) => todo1.priority - todo2.priority);
    todos.map((todo, i) => (todo.rank = i * 1000000));
    await createTodos(id, todos);
  }

  const response = {
    message: `todolist ${listname} created`,
    data: { id },
  };

  res.status(200).json(response);
};

module.exports = createTodoListController;
