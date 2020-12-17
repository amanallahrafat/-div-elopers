const express = require('express');
const courseInstructorController = require('../Controllers/courseInstructorController.js');
const {authStaffMember,authCourseInstructor} = require('../Authorization/auth.js');
const courseInstructorRouter = express.Router();

auth = [authStaffMember,authCourseInstructor];

courseInstructorRouter.get('/viewCourseCoverage/:courseID',auth, courseInstructorController.viewCourseCoverage);
courseInstructorRouter.get('/viewSlotAssignment',auth, courseInstructorController.viewSlotAssignment);
courseInstructorRouter.post('/assignAcademicMemberToSlot',auth, courseInstructorController.assignAcademicMemberToSlot);
courseInstructorRouter.post('/removeAcademicMemberToSlot',auth, courseInstructorController.removeAssignmentOfAcademicMemberToSlot);
courseInstructorRouter.post('/updateAcademicMemberToSlot',auth, courseInstructorController.updateAssignmentOfAcademicMemberToSlot);


module.exports = courseInstructorRouter;