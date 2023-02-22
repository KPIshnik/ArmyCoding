const uuidValidator = require("../../helpers/uuidValidator");
const deleteTodolist = require("../../models/todilists/deleteTodolist");

const deleteTodolistController = async (req, res) => {
  const id = req.query.id;

  if (!uuidValidator(id)) {
    res.status(400).json("id not valid");
    return;
  }

  const result = await deleteTodolist(id);

  result
    ? res.status(200).json(`todolist ${result.listname} deleted`)
    : res.sendStatus(404);
};

module.exports = deleteTodolistController;
