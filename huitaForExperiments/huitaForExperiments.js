const res = {
  status: (code) => {
    console.log(code);
    return res;
  },

  json: (string) => {
    console.log(string);
    return res;
  },
};

res.status(200).json("Aloha");
