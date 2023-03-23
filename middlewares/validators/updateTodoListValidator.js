const isUUIDvalid = require("../../helpers/isUUIDvalid");
const validateTodos = require("../../helpers/validateTodos");

const updateTodoListValidator = async (req, res, next) => {
  try {
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

    if (todos) {
      const msg = validateTodos(todos);
      if (msg) {
        res.status(400).json(msg);
        return;
      }
    }

    req.body.valid = true;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = updateTodoListValidator;
