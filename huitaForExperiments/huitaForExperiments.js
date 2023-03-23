const fs = require("fs").promises;
const path = require("path");
const pathToLog = path.join(__dirname, "../log/errlog.txt");

fs.stat(pathToLog).then((data) => {
  console.log(+data.mtime);
  console.log(new Date());
});
