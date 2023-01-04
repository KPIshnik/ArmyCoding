const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const file = fs.readFileSync(
  path.join(__dirname, "..", "/test/img/testuserAvatarBlack.png")
);
// const writableStream = fs.createWriteStream(
//   path.join(__dirname, "..", "/test/img/bingo.png")
// );

// readbleStream.pipe(writableStream);

sharp(file)
  .webp()
  .toFile(path.join(__dirname, "..", "/test/img/testuserAvatarBlack.webp"))
  .then(() => console.log("done"))
  .catch((err) => {
    console.log(err);
    res.send("Oopsy");
  });

//"./../test/img/testuserAvatarBlack.png"
