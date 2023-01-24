const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

(async () => {
  const avatar = await fs.promises.readFile(path.join(__dirname, "/123.png"));

  sharp(avatar)
    .webp()
    .toFile(path.join(__dirname, "/123.webp"))
    .then(async () => {
      const avatarWebp = await fs.promises.readFile(
        path.join(__dirname, "/123.webp")
      );

      sharp(avatar)
        .webp()
        .toBuffer()
        .then((file) => {
          console.log(Buffer.compare(file, avatarWebp));
        });
    })

    .catch((err) => {
      console.log(err);
    });
})();
