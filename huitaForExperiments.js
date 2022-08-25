const bycript = require("bcrypt");

bycript.hash("q", 10).then(p=> console.log(p))


