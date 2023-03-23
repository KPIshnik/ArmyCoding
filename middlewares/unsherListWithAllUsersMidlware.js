const unshareListWithAllUsers = require("../models/todilists/share/unshareListWithAllUser");

const unshareListWithAllUsersMidlware = async (req, res, next) => {
  try {
    const { listid } = req.body;

    await unshareListWithAllUsers(listid);

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = unshareListWithAllUsersMidlware;
