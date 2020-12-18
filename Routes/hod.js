const express = require('express');
const hodController = require('../Controllers/hodController.js');
const hodRouter = express.Router();
const authorization = require('../Authorization/auth.js');

hodRouter.put('/assignCourseInstructor', authorization.authStaffMember, hodController.assignCourseInstructor);
hodRouter.put('/updateCourseInstructor/:ID', authorization.authStaffMember, hodController.updateCourseInstructor);
hodRouter.delete('/deleteCourseInstructor/:courseID', authorization.authStaffMember, hodController.deleteCourseInstructor);
hodRouter.get('/viewDepartmentMembers', authorization.authStaffMember, hodController.viewDepartmentMembers);
hodRouter.get('/viewDepartmentMembersByCourse/:courseID', authorization.authStaffMember, hodController.viewDepartmentMembersByCourse);
hodRouter.get('/viewAllStaffDayOff', authorization.authStaffMember, hodController.viewAllStaffDayOff);
hodRouter.get('/viewSingleStaffDayOff/:ID', authorization.authStaffMember, hodController.viewSingleStaffDayOff);
hodRouter.get('/viewCourseTeachingAssignments/:ID', authorization.authStaffMember, hodController.viewCourseTeachingAssignments);
hodRouter.get('/viewCourseCoverage/:ID', authorization.authStaffMember, hodController.viewCourseCoverage);




module.exports = hodRouter;