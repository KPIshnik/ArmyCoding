const bcript = require("bcrypt");
const getUserByEmail = require("../models/getUserByEmail");

const confirmEmailController = async (req,res) => {
    const email = req.query.email
    const userID = req.query.id
    const user = await getUserByEmail(email)
    const checkID = await bcript.compare(userID, user.id)

    if (checkID) {
        const result = await confirmEmail(userID)
        if (result) res.end('Email cofirmed')
        else res.end('Oops')
        //res.sendStaus(200).send('vse zbs).redirect(???)
    }
    
    else res.end('email not confirmed')
    


}

module.expors = confirmEmailController