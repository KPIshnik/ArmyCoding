const createTodoListValidator = async (req, res, next) => {
  req.body.valid = false;
  const { listname, todos } = req.body;

  if (!listname) {
    res.status(400).json("listname required");
    return;
  }

  let prioritySet = new Set();

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

module.exports = createTodoListValidator;
