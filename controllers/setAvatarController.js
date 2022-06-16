const setAvatarConrtroller = (req, res) => {
  console.log(req.file);
  res.end("there is no avatar");
};

module.exports = setAvatarConrtroller;
