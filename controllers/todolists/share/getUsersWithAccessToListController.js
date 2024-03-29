const getUsersDataByIds = require("../../../models/getUsersDataByIds");
const getUsersWithAccessIdsByListid = require("../../../models/todilists/share/getUsersWithAccessIdsByListid");

const getUsersWithAccessToListController = async (req, res, next) => {
  try {
    const listid = req.params.id;

    if (!req.body.valid) {
      throw new Error("request data not valid");
    }

    const usersIds = await getUsersWithAccessIdsByListid(listid);
    const users = await getUsersDataByIds(usersIds);

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

module.exports = getUsersWithAccessToListController;
