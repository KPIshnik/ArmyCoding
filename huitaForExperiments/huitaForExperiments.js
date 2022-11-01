const emailValidator = require("deep-email-validator");

const s = async () => {
  const res = await emailValidator.validate("abc-@mail.com");
  console.log(res.valid);
};

s();
