const getUsersIdsByEmails = require("../../../models/getUserIdsByEmails");
const unshareTodolist = require("../../../models/todilists/share/unshareTodolist");

const unshareTodolistController = async (req, res, next) => {
  try {
    const { id, email } = req.params;

    const usersIds = await getUsersIdsByEmails([email]);
    await unshareTodolist(id, usersIds[0]);

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

module.exports = unshareTodolistController;
