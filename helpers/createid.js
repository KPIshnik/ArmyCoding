const crypto = require("crypto");
exports.createid = () => {
  return crypto.randomBytes(10).toString("hex");
};
