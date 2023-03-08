const validateTodos = require("../../helpers/validateTodos");

const createTodoListValidator = async (req, res, next) => {
  req.body.valid = false;
  const { listname, todos } = req.body;

  if (!listname) {
    res.status(400).json("listname required");
    return;
  }

  if (todos) {
    const msg = validateTodos(todos);
    if (msg) {
      res.status(400).json(msg);
      return;
    }
  }

  req.body.valid = true;
  next();
};

module.exports = createTodoListValidator;
