const getUserById = require("../models/getUserrById");

const getUserProfileController = async (req, res, next) => {
  try {
    const { id } = req.user;
    const userdata = await getUserById(id);

    delete userdata.password;

    res.status(200).json(userdata);
  } catch (err) {
    next(err);
  }
};

module.exports = getUserProfileController;
