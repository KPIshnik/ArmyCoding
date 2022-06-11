const bcript = require("bcrypt");
const verifyPassword = require("../models/verifyPassword");
const setUserName = require('../models/setUserName')

const setUsernameController = async (req,res) => {
    const userPass = req.body.password;
    const username = req.body.username;
    const user = req.user
    
    if (!userPass) {
        res.status(400).send("password required");
        return;
      }
    
    if (!username) {
        res.status(400).send("email required");
        return;
      }
  
    try {
       
        if (!(await verifyPassword(user, userPass))) {
            res.status(400).send("wrong pass");
            return;
          }
        
        const result = await setUserName(user.id, username)
      
      res.end(`${result}`); // redirect to something norml later

    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }

module.exports = setUsernameController