const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/avatars");
  },
  filename: function (req, file, cb) {
    const originalname = file.originalname;
    const ext = originalname.slice(originalname.lastIndexOf("."));
    const fileName = req.user.username + ext;

    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

const uploadAvatar = upload.single("avatar");

module.exports = uploadAvatar;
