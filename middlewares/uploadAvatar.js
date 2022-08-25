const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const uploadAvatar = upload.single("avatar");

module.exports = uploadAvatar;
