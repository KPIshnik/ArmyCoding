const crypto = require("crypto");

const createKeyStr = () => {
  const radnomString = crypto.randomBytes(16).toString("hex");
  const date = Date.now();
  return date + "." + radnomString;
};

console.log(createKeyStr().toString().length);
