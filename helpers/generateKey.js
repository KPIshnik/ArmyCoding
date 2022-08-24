const crypto = require("crypto");

const generateKey = () => {
  const radnomString = crypto.randomBytes(16).toString("hex");
  const date = Date.now();
  return date + "." + radnomString;
};

module.exports = generateKey;
