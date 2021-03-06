const Academic_Member = require('../Models/Users/Academic_Member');
const Department = require('../Models/Academic/Department.js');
const BlackListedToken = require('../Models/Others/BlackListedToken.js');
const jwt = require('jsonwebtoken');
const Staff_Member = require('../Models/Users/Staff_Member');
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
            if(!payload)
                return res.status(403).send("Please login to continue!");
            next();
        });
    }
    catch(err){
       return res.status(403).send("Please login to continue!");
    }
}

const authHr = async (req,res,next) =>{
    const token = req.header("auth-token");
    if(!token)
        return res.status(403).send("You need to login to continue");
    const {ID , type} = req.header.user;
    if(type != 1){
        console.log("type is not hr");
        return res.status(401).send("you are not allowed. this operation is only for HRs");
    }
    const staff_member = await Staff_Member.findOne({ID : ID , type : 1});
    if(staff_member==null){
        console.log("not in the DB");
        return res.status(401).send("Please register first");
    }
    next();
}

const authHOD = async (req,res,next) =>{
    const token = req.header("auth-token");
    if(!token)
        return res.status(403).send("You need to login to continue");
    const {ID , type} = req.header.user;
    if(type != 0)
        return res.status(401).send("you are not allowed. this operation is only for academic members only");
    const academic_member = await Academic_Member.findOne({ID : ID});
    if(academic_member==null)
        return res.status(401).send("Please register first");
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
    if(type != 0)
        return res.status(401).send("you are not allowed. this operation is only for academic members only");
    const academic_member = await Academic_Member.findOne({ID : ID});
    if(academic_member==null)
        return res.status(401).send("Please register first");
    if(academic_member.type != 1 && academic_member.type != 0)
        return res.status(401).send("you are not allowed. this operation is only for Course Instructors only");
    next();    
}

const authCourseCoordinator = async (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token)
        return res.status(403).send("you need to login to continue");
    const{ID , type} = req.header.user;
    if(type != 0)
        return res.status(401).send("you are not allowed. this operation is only for academic members only");
    const academic_member = await Academic_Member.findOne({ID : ID});
    if(academic_member==null)
        return res.status(401).send("Please register first");
    if(academic_member.type != 2)
        return res.status(401).send("you are not allowed. this operation is only for Course Coordinators only");
    next();
}

const authAcademicMember = async (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token)
        return res.status(403).send("you need to login to continue");
    const{ID , type} = req.header.user;
    const academic_member = await Academic_Member.findOne({ID : ID});
    if(academic_member==null)
        return res.status(401).send("Please register first");
    if(type != 0)
        return res.status(401).send("you are not allowed. this operation is only for academic members only");
    next();
}

module.exports = {
    authStaffMember,
    authHr,authHOD,authCourseInstructor,
    authCourseCoordinator,authAcademicMember
}