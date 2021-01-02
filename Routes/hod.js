const express = require('express');
const hodController = require('../Controllers/hodController.js');
const hodRouter = express.Router();
const {authStaffMember, authHOD} = require('../Authorization/auth.js');
auth = [authStaffMember, authHOD]

hodRouter.put('/assignCourseInstructor',auth, hodController.assignCourseInstructor);
hodRouter.put('/updateCourseInstructor/:ID', auth, hodController.updateCourseInstructor);
hodRouter.delete('/deleteCourseInstructor/:courseID', auth, hodController.deleteCourseInstructor);
hodRouter.get('/viewDepartmentMembers', auth, hodController.viewDepartmentMembers);
hodRouter.get('/viewDepartmentMembersByCourse/:courseID', auth, hodController.viewDepartmentMembersByCourse);
hodRouter.get('/viewAllStaffDayOff', auth, hodController.viewAllStaffDayOff);
hodRouter.get('/viewSingleStaffDayOff/:ID', auth, hodController.viewSingleStaffDayOff);
hodRouter.get('/viewCourseTeachingAssignments/:ID',auth, hodController.viewCourseTeachingAssignments);
hodRouter.get('/viewCourseCoverage/:ID', auth, hodController.viewCourseCoverage);

hodRouter.get('/viewAllRequests', auth, hodController.viewAllRequests);

hodRouter.put('/respondToChangeDayOffRequest/:ID', auth, hodController.respondToChangeDayOffRequest);
hodRouter.put('/respondToMaternityLeaveRequest/:ID', auth, hodController.respondToMaternityLeaveRequest);
hodRouter.put('/respondToSickLeaveRequests/:ID', auth, hodController.respondToSickLeaveRequests);
hodRouter.put('/respondToAnnualLeaveRequests/:ID', auth, hodController.respondToAnnualLeaveRequests);
hodRouter.put('/respondToCompensationLeaveRequest/:ID', auth, hodController.respondToCompensationLeaveRequest);
hodRouter.put('/respondToAccidentalLeaveRequest/:ID', auth, hodController.respondToAccidentalLeaveRequest);


//added for front-end
hodRouter.get('/getDepartmentCourses', auth, hodController.getDepartmentCourses);
hodRouter.get('/getAllAcademicMembers', auth, hodController.getAllAcademicMembers);
hodRouter.get('/getAcademicMembersTable', auth, hodController.getAcademicMembersTable);






module.exports = hodRouter;