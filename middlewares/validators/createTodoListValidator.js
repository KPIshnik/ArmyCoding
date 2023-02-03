const createTodoListValidator = async (req, res, next) => {
  req.body.valid = false;
  const { listname, todos } = req.body;
  if (!listname) {
    res.status(400).json("listname required");
    return;
  }

  if (todos) {
    for (let todo of todos) {
      if (!todo.text || !todo.priority || !(typeof todo.done === "boolean")) {
        res.status(400).json("request not valid");
        return;
      }
    }
  }

  req.body.valid = true;
  next();
};

module.exports = createTodoListValidator;
