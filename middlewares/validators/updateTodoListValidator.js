const isUUIDvalid = require("../../helpers/isUUIDvalid");

const updateTodoListValidator = async (req, res, next) => {
  req.body.valid = false;
  const { id, updated_at, listname, todos } = req.body;

  if (!isUUIDvalid(id)) {
    res.status(400).json("valid id required");
    return;
  }

  if (!updated_at) {
    res.status(400).json("last update timestamp required");
    return;
  }

  if (!listname) {
    res.status(400).json("listname required");
    return;
  }

  const prioritySet = new Set();
  if (todos) {
    for (let todo of todos) {
      if (
        !todo.text ||
        !(typeof todo.priority === "number") ||
        !(typeof todo.done === "boolean")
      ) {
        res.status(400).json("request not valid");
        return;
      }

      prioritySet.add(todo.priority);
    }
    if (!(prioritySet.size === todos.length)) {
      res.status(400).json("request not valid");
      return;
    }

    if (todos.lenth > 2000) {
      res.status(400).json("list to long. limit = 2000");
      return;
    }
  }
  req.body.valid = true;
  next();
};

module.exports = updateTodoListValidator;
