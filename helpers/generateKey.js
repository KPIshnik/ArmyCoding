const crypto = require("crypto");

const generateKey = () => {
  const radnomString = crypto.randomBytes(16).toString("hex");

  return radnomString;
};

module.exports = generateKey;
