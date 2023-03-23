const getUserTodoListDataById = require("../../models/todilists/getTodoLIstDataById");

const isListOwnerValidator = async (req, res, next) => {
  try {
    req.body.valid = false;

    const listid =
      req.params.id || req.body.listid || req.body.id || req.query.id;

    const listData = await getUserTodoListDataById(listid);

    if (!(listData.owner_id === req.user.id)) {
      res.status(400).json("access denied");
      return;
    }
    req.body.valid = true;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = isListOwnerValidator;
