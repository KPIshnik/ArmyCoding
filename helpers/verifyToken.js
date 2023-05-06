const jwt = require("jsonwebtoken");

const veifyToken = (token, secret, options = undefined) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, options, (err, data) => {
      if (err) resolve(false);
      resolve(data);
    });
  });

module.exports = veifyToken;
