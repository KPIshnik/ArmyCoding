const fs = require("fs").promises;
const path = require("path");

const errLog = async (err, req, res, next) => {
  console.log(err.name, " logged");
  let log = "";
  log += new Date() + "\n";
  log += err.stack.toString() + "\n\n";

  const pathToLogFile = path.join(__dirname, `../log/errlog.txt`);
  await fs.appendFile(pathToLogFile, log);
  res.status(500).json("Oops, server error((");
};
module.exports = errLog;
