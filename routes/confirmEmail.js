const expres = require("express");
const router = expres.Router();
const confirmEmailController= require('../controllers/confirmEmailController')

// router.get("/confirmEmail", (req, res) => {
//   const id = req.query.id;
//   res.status(200).end(`Aloha ${id}! Huita is in peogress`);
// });

router.get("/confirmEmail",confirmEmailController);


module.exports = router;
