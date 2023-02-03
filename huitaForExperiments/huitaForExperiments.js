const emailValidator = require("deep-email-validator");

emailValidator.validate("goodEmail@gmail.com").then((res) => {
  console.log(res);
});
