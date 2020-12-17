const Academic_Member = require('../Models/Users/Academic_Member');
const Course = require('../Models/Academic/Course.js');
const Department = require('../Models/Academic/Department.js');
const BlackListedToken = require('../Models/Others/BlackListedToken.js');
const jwt = require('jsonwebtoken');
const key = "jkanbvakljbefjkawkfew";

const authStaffMember = async (req,res,next)=>{
    const token = req.header("auth-token");
    if(!token)
        return res.status(403).send("Please Login to continue !");
    try{
        const tokens = (await BlackListedToken.find()).map(obj=>obj.token);
        if(tokens.includes(token))
            return res.status(403).send("You are logged out!");
            
        const payload = jwt.verify(token,key,(err,payload)=>{
            req.header.user = payload;
            next();
        });
    }
    catch(err){
       return res.status(403).send("Please login to continue!");
    }
}
const authHr=async(req,res,next)=>{
    if(req.header.user.type!=1)
    return res.status(403).send("you are not an HR and don't have authority");
    next();
}


const authHr = async (req,res,next) =>{
    const token = req.header("auth-token");
    if(!token)
        return res.status(403).send("You need to login to continue");
    const {ID , type} = req.header.user;
    if(type != 1)
        return res.status(401).send("you are not allowed. this operation is only for HRs");
    next();
}

const authHOD = async (req,res,next) =>{
    const token = req.header("auth-token");
    if(!token)
        return res.status(403).send("You need to login to continue");
    const {ID , type} = req.header.user;
    const department = await Department.findOne({hodID : ID});
    if(!department)
        return res.status(401).send("you are not allowed. this opreation is only for Head")
    next();
}

const authCourseInstructor = async (req,res,next)=>{
    const token = req.header("auth-token");
    if(!token)
        return res.status(403).send("you need to login to continue");
    const {ID , type} = req.header.user;
    const academic_member = await Academic_Member.findOne({ID : ID});
    if(academic_member.type != 1)
        return res.status(401).send("you are not allowed. this operation is only for Course Instructors only");
    next();    
}

const authCourseCoordinator = async (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token)
        return res.status(403).send("ypu need to login to continue");
    const{ID , type} = req.header.user;
    const academic_member = await Academic_Member.findOne({ID : ID});
    if(academic_member.type != 2)
        return res.status(401).send("you are not allowed. this operation is only for Course Coordinators only");
    next();
}

const authTA = async (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token)
        return res.status(403).send("ypu need to login to continue");
    const{ID , type} = req.header.user;
    const academic_member = await Academic_Member.findOne({ID : ID});
    if(academic_member.type != 3)
        return res.status(401).send("you are not allowed. this operation is only for TAs only");
    next();
}
module.exports = {
    authStaffMember,authHr,
    authHr,authHOD,authCourseInstructor,
    authCourseCoordinator,authTA
}