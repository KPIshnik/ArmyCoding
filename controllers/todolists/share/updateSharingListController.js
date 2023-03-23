const shareTodolistHelper = require("../../../helpers/shareTodolistHelper");
const unshareTodolistWithNotMentionedUsers = require("../../../models/todilists/share/unshareTodolistWithNotMentionedUsers");

const updateSharingListController = async (req, res, next) => {
  try {
    let { listid, emails, valid } = req.body;
    if (!valid) {
      throw new Error("request data not valid");
    }
    const user = req.user;

    const userids = await shareTodolistHelper(listid, emails, user);
    await unshareTodolistWithNotMentionedUsers(listid, userids);

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

module.exports = updateSharingListController;
