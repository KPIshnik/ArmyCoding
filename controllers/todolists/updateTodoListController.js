const updateTodos = require("../../models/todilists/updateTodos");
const createTodos = require("../../models/todilists/createTodos");
const deleteTodos = require("../../models/todilists/deleteTodos");
const getListLastUpdateTimestamp = require("../../models/todilists/getListLastUpdateTimestamp");
const getTodosByListId = require("../../models/todilists/getTodosByListId");
const updateTodolistData = require("../../models/todilists/updateTodolistData");

const updateTodoListController = async (req, res) => {
  const { id, listname, updated_at, todos, valid } = req.body;

  if (!valid) {
    throw new Error("request data not valid");
  }

  const timestamp = await getListLastUpdateTimestamp(id);

  if (!(updated_at == timestamp.toJSON())) {
    res.status(400).json("list changed before request");
    return;
  }

  const oldTodos = await getTodosByListId(id);

  const todosToDeleteIds = oldTodos.map((todo) => todo.id);

  const changedTodos = [];
  const newTodos = [];

  todos.sort((todo1, todo2) => todo1.priority - todo2.priority);
  todos.map((todo, i) => (todo.rank = i * 1000000));

  todos.forEach((todo) => {
    if (!todo.id) {
      newTodos.push(todo);
      return;
    }

    changedTodos.push(todo);
    todosToDeleteIds.splice(todosToDeleteIds.indexOf(todo.id), 1);
  });

  const date = new Date();

  await deleteTodos(todosToDeleteIds);
  await createTodos(id, newTodos);
  await updateTodos(changedTodos);
  await updateTodolistData(id, listname, date);

  // await Promise.all([
  //   deleteTodos(todosToDeleteIds),
  //   createTodos(id, newTodos),
  //   updateTodos(changedTodos),
  //   updateTodolistData(id, listname, date),
  // ]);

  res.status(200).json(`list ${id} updated`);
};

module.exports = updateTodoListController;
