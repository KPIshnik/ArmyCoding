const { tokensecret } = require("../configs/credentials");
const veifyToken = require("../helpers/verifyToken");

const checkIsAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) return res.sendStatus(401);

    const user = await veifyToken(token, tokensecret);

    if (!user) return res.status(401);

    req.user = user;

    if (!req.user.email) return res.status(403).json("confirm email");

    if (!req.user.username & (req.url != "/me/profile/username"))
      return res.status(403).json("set username");

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = checkIsAuth;
