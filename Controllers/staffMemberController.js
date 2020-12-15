const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const key = "jkanbvakljbefjkawkfew";
const Staff_Member = require('../Models/Users/Staff_Member.js');
const BlackListedToken = require('../Models/Others/BlackListedToken.js');
const validator = require('../Validations/staffMemberValidations.js');
const mongoValidator = require('mongoose-validator');

const login = async(req,res)=>{
    const isValid = validator.validateLogin(req.body);
    if(isValid.error)
        return res.status(400).send({error : isValid.error.details[0].message});
    const u = await Staff_Member.findOne({email:req.body.email});
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

const logout = async (req,res) =>{
    const token = req.header("auth-token");
    const blackListedToken = new BlackListedToken({
        token : token
    });
    await blackListedToken.save();
    res.send("Loged out Successfully!");
}


module.exports = {
    login,logout
}