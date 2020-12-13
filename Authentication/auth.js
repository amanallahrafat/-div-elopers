const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const key = "jkanbvakljbefjkawkfew";
const Staff_Member = require('../Models/Users/Staff_Member.js');

const register = async (req,res)=>{
    // the salt number : recommended not to go above 14.
    const salt  = await bcrypt.genSalt(10);
    // always pass the body.passward as a string 
    //const hashedPass = await bcrypt.hash(req.body.password,salt);
    const hashedPass = await bcrypt.hash("team9",salt);
    const u = new Staff_Member({
        name : "sarah",
        ID : 12 ,
        email : "req.body.name",
        type : 0,
        password : hashedPass,
        dayOff :" req.body.name",
        gender : "req.body.name",
        officeID : 5,
        extraInfo : "req.body.name",
        salary : 1500,
        annualBalance : 0,
        accidentalLeaveBalance : 6
    });
    await u.save();
    res.send("Registeration Completed!");
}

const login = async(req,res)=>{
    const u = await Staff_Member.findOne({ID:req.body.ID});
    if(!u)
        return res.status(403).send("The user does not exist. The login falied!");
    const verify =await bcrypt.compare(req.body.password,u.password);
    if(!verify)
        return res.status(403).send("Wrong Password");
    // param1: payload (params needed for handeling the user requests)
    // param2 : secret Key (random string)
    const token = jwt.sign({ID:u.ID,type:u.type},key);
    res.header('auth-token',token).send("Login Successfull!");
}

module.exports = {
    login,register
}