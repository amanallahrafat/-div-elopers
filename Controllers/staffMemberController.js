const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const key = "jkanbvakljbefjkawkfew";
const Staff_Member = require('../Models/Users/Staff_Member.js');
const Academic_Member = require('../Models/Users/Academic_Member.js');
const BlackListedToken = require('../Models/Others/BlackListedToken.js');
const validator = require('../Validations/staffMemberValidations.js');
const mongoValidator = require('mongoose-validator');
const extraUtils=require('../utils/extraUtils');

const signIn = async (req,res) => {
    const {ID,type} = req.header.user;
    const staff_member = await Staff_Member.findOne({ID : ID , type : type});
    if(staff_member.attendanceRecord.length!=0){
    const lastRecord=staff_member.attendanceRecord[staff_member.attendanceRecord.length-1];
    if(!lastRecord.signout)
        return res.status(400).send("you can't follow a sign in with a signin without signing out");
    }
   staff_member.attendanceRecord.push( {status : 1, signin : Date.now()});
    staff_member.attendanceRecord.push( {status : 1, signin : Date.now(), signout : ""});
    console.log(staff_member.attendanceRecord)
    await Staff_Member.updateOne({ID : ID , type : type} , {attendanceRecord : staff_member.attendanceRecord});
    res.send("Sign in Sucessfully!");
}

const signOut = async (req,res) =>{
    const {ID, type} = req.header.user;
    const staff_member = await Staff_Member.findOne({ID : ID , type : type});
    if(staff_member.attendanceRecord.length==0){
        return res.status(400).send("you can't signout without signing in");
        
    }
        const lastRecord=staff_member.attendanceRecord[staff_member.attendanceRecord.length-1];
    if((lastRecord.signout||!lastRecord.signin))
        return res.status(400).send("you can't signout multiple times or without signing in");
          lastRecord.signout=Date.now();
    await Staff_Member.updateOne({ID : ID , type : type} , {attendanceRecord : staff_member.attendanceRecord});
    res.send("Sign out Sucessfully!"); 
}

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

const viewProfile = async(req,res)=>{
    const {ID,type} = req.header.user;
    const profile = await Staff_Member.findOne({ID:ID,type:type});
    delete profile['_doc'].password;
    delete profile['_doc']['_id'];
    delete profile['_doc']['__v'];
    res.send(profile);
}

const resetPassword = async(req,res)=>{
    const {ID,type} = req.header.user;
    const staffMember=await Staff_Member.findOne({ID:ID,type:type});
    const verify =await bcrypt.compare(req.body.oldPassword,staffMember.password);
    if(!verify)
        return res.status(400).send("please enter the old password correctly");
    if(req.body.newPassword.length<6)
         return res.status(400).send("you password is less than 6 characters");
         
    const salt  = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.newPassword,salt);
    await Staff_Member.updateOne({ID:ID,type:type},{password:hashedPass});
    res.send("password has changed successfully");
}

const viewAttendance = async(req,res) =>{
    const {ID,type} = req.header.user;
    const staff_member = await Staff_Member.findOne({ID : ID,type:type});
    const attendanceArray=staff_member.attendanceRecord;
    let responseArray=[];
    for(const record of attendanceArray)
      {
      record.status=(record.status==1)?"attedant":"absent";
   //   console.log((new Date(record.signin)).getMonth());
      if(record.signin&&record.signout)
      if(!req.body.month||((req.body.month-1)==(new Date(record.signin)).getMonth()))
     {
         record.signin=new Date(record.signin);
         record.signout=new Date(record.signout);
     responseArray.push(record);
     }     
    }      
         res.send(responseArray);
}

const viewMissingHours= async(req,res)=>{
    const {ID,type} = req.header.user;
    const staff_member = await Staff_Member.findOne({ID : ID,type:type});
    const missingHours=extraUtils.getMissingHours(staff_member);
    if(missingHours>0){
        res.send("the missing hours till today are ".concat(missingHours));
    }else{
        res.send("you have extra hours till today ".concat(-1*missingHours));
    }

   
}



module.exports = {
    login,logout,
    signIn,signOut,
    viewProfile,resetPassword,
    viewAttendance,viewMissingHours,
}