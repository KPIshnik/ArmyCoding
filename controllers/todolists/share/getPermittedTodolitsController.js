const getPermittedTodolists = require("../../../models/todilists/permitted/getPermittedTodolists");

const getPermittedTodolistsController = async (req, res, next) => {
  try {
    const user = req.user;

    const lists = await getPermittedTodolists(user.id);

    res.status(200).json(lists);
  } catch (err) {
    next(err);
  }
};

module.exports = getPermittedTodolistsController;
