const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/avatar");
  },
  filename: function (req, file, cb) {
    const fileName = req.user.username + file.originalname;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

const uploadAvatar = upload.single("avatar");

module.exports = uploadAvatar;
