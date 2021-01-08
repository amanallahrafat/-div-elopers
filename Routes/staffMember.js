const staffMemberController = require('../Controllers/staffMemberController.js');
const authorization = require('../Authorization/auth.js'); 
const express = require('express');
const staffMemberRouter = express.Router();

staffMemberRouter.get('/authStaffMember',authorization.authStaffMember,(req,res)=>{res.send("You are logged in as staff member")});
staffMemberRouter.get('/authHr',authorization.authHr,(req,res)=>{res.send("You are logged in as staff member")});
staffMemberRouter.get('/authHOD',authorization.authHOD,(req,res)=>{res.send("You are logged in as HOD")});
staffMemberRouter.get('/authCourseInstructor',authorization.authCourseInstructor,(req,res)=>{res.send("You are logged in as Course Instructor")});
staffMemberRouter.get('/authCourseCoordinator',authorization.authCourseCoordinator,(req,res)=>{res.send("you are logged in as Course Coordinator")});
staffMemberRouter.get('/authAcademicMember',authorization.authAcademicMember,(req,res)=>{res.send("You are logged in as Academic Members")});

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