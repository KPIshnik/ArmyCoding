const deleteTodolist = require("../../models/todilists/deleteTodolist");

const deleteTodolistController = async (req, res) => {
  const id = req.query.id;

  const result = await deleteTodolist(id);

  result
    ? res.status(200).json(`todolist ${result.listname} deleted`)
    : res.sendStatus(404);
};

module.exports = deleteTodolistController;
