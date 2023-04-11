const path = require("path");
const getUsernameById = require("../models/getUsernameById");
const fs = require("fs");

const getUserAvaatarConreoller = async (req, res, next) => {
  try {
    const { id } = req.params;
    const username = await getUsernameById(id);

    isAvatar = fs.existsSync(
      path.join(__dirname, `../public/avatars/${username}.webp`)
    );

    if (!isAvatar) return res.sendStatus(404);

    res.sendFile(path.join(__dirname, `../public/avatars/${username}.webp`));
  } catch (err) {
    next(err);
  }
};

module.exports = getUserAvaatarConreoller;
