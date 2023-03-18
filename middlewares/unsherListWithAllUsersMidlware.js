const unshareListWithAllUsers = require("../models/todilists/share/unshareListWithAllUser");

const unshareListWithAllUsersMidlware = async (req, res, next) => {
  const { listid } = req.body;

  await unshareListWithAllUsers(listid);

  next();
};

module.exports = unshareListWithAllUsersMidlware;
