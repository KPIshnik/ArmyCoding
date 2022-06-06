const bcript = require("bcrypt");
const getUserByEmail = require("../models/getUserByEmail");
const setEmailConfirm = require('../models/setEmailConfirm')

const confirmEmailController = async (req,res) => {
    const email = req.query.email
    const hashedId = req.query.id
    const user = await getUserByEmail(email)
    const checkID = await bcript.compare(`${user.id}`, hashedId)

    if (checkID) {
        const result = await setEmailConfirm(user.id)
        console.log(result)
        if (result) res.end('Email cofirmed')
        else res.end('Oops')
        //res.sendStaus(200).send('vse zbs).redirect(???)
    }
    
    else res.end('email not confirmed')
    


}

module.exports = confirmEmailController