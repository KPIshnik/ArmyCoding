const bcript = require("bcrypt");
const verifyPassword = require("../models/verifyPassword");
const setUserEmail = require('../models/setUserEmail');
const checkUniqueUserEmail = require('../models/checkUniqueUserEmail')


const setUserEmailController = async (req,res) => {
    const userPass = req.body.password;
    const userEmail = req.body.email;
    const user = req.user
    
    if (!userPass) {
        res.status(400).send("password required");
        return;
      }
    
    if (!userEmail) {
        res.status(400).send("email required");
        return;
      }

  
    try {
       if(await checkUniqueUserEmail(userEmail)) {
          res.status(400).send("email should be unique");
          return;
        }
     

        if (!(await verifyPassword(user, userPass))) {
            res.status(400).send("wrong pass");
            return;
          }
        
        const result = await setUserEmail(user.id, userEmail)
      
      res.end(`${result}`); // redirect to something norml later

    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }

module.exports = setUserEmailController