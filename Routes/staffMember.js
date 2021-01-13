const staffMemberController = require('../Controllers/staffMemberController.js');
const authorization = require('../Authorization/auth.js'); 
const express = require('express');
const staffMemberRouter = express.Router();

const authHR = [authorization.authStaffMember,authorization.authHr]
const authHOD = [authorization.authStaffMember,authorization.authHOD]
const authCI = [authorization.authStaffMember,authorization.authCourseInstructor]
const authCC = [authorization.authStaffMember,authorization.authCourseCoordinator]
const authAC = [authorization.authStaffMember,authorization.authAcademicMember]

staffMemberRouter.get('/authStaffMember',authorization.authStaffMember,(req,res)=>{res.send("You are logged in as staff member")});
staffMemberRouter.get('/authHr',authHR,(req,res)=>{res.send("You are logged in as staff member")});
staffMemberRouter.get('/authHOD',authHOD,(req,res)=>{res.send("You are logged in as HOD")});
staffMemberRouter.get('/authCourseInstructor',authCI,(req,res)=>{res.send("You are logged in as Course Instructor")});
staffMemberRouter.get('/authCourseCoordinator',authCC,(req,res)=>{res.send("you are logged in as Course Coordinator")});
staffMemberRouter.get('/authAcademicMember',authAC,(req,res)=>{res.send("You are logged in as Academic Members")});

staffMemberRouter.post('/login', staffMemberController.login);
staffMemberRouter.post('/logout', authorization.authStaffMember,staffMemberController.logout);

staffMemberRouter.post('/signIn',authorization.authStaffMember,staffMemberController.signIn);
staffMemberRouter.post('/signOut',authorization.authStaffMember,staffMemberController.signOut);

staffMemberRouter.get('/viewProfile', authorization.authStaffMember,staffMemberController.viewProfile);
staffMemberRouter.post('/resetPassword', authorization.authStaffMember,staffMemberController.resetPassword);
staffMemberRouter.get('/viewAttendance',authorization.authStaffMember,staffMemberController.viewAttendance);

staffMemberRouter.get('/viewMissingHours',authorization.authStaffMember,staffMemberController.viewMissingHours);
staffMemberRouter.get('/viewMissingDays',authorization.authStaffMember,staffMemberController.viewMissingDays);

staffMemberRouter.post('/updateMyProfile',authorization.authStaffMember,staffMemberController.updateMyProfile);



module.exports = staffMemberRouter;