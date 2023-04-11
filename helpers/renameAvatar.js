const path = require("path");
const fs = require("fs");

const renameAvatar = async (oldname, newname) => {
  const oldpath = path.join(__dirname, `../public/avatars/${oldname}.webp`);
  const newpath = path.join(__dirname, `../public/avatars/${newname}.webp`);

  if (!fs.existsSync(oldpath)) return;
  await fs.promises.rename(oldpath, newpath);
};

module.exports = renameAvatar;
