const BlackListedToken = require('../Models/Others/BlackListedToken.js');
const jwt = require('jsonwebtoken');
const key = "jkanbvakljbefjkawkfew";

const authStaffMember = async (req,res,next)=>{
    const token = req.header("auth-token");
    if(!token)
        return res.status(403).send("Please Login to continue !");
    try{
        const payload = jwt.verify(token,key);
        req.header.user = payload;
        // const tokens = (await BlackListedToken.find()).map(obj=>obj.token);
        // if(tokens.includes(token))
        //     return res.send(403).send("You are logged out!");
        next();
    }
    catch(err){
        res.status(403).send("Please login to continue!");
    }
}

module.exports = {
    authStaffMember,
}