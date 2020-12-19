const express = require('express');
const courseInstructorController = require('../Controllers/courseInstructorController.js');
const { authStaffMember, authCourseInstructor } = require('../Authorization/auth.js');
const courseInstructorRouter = express.Router();

auth = [authStaffMember, authCourseInstructor];

courseInstructorRouter.get('/viewCourseCoverage/:courseID', auth, courseInstructorController.viewCourseCoverage);
courseInstructorRouter.get('/viewSlotAssignment', auth, courseInstructorController.viewSlotAssignment);
courseInstructorRouter.post('/assignAcademicMemberToSlot', auth, courseInstructorController.assignAcademicMemberToSlot);
courseInstructorRouter.delete('/removeAcademicMemberToSlot', auth, courseInstructorController.removeAssignmentOfAcademicMemberToSlot);
courseInstructorRouter.put('/updateAcademicMemberslotAssignment', auth, courseInstructorController.updateAcademicMemberslotAssignment);
courseInstructorRouter.delete('/removeAcademicMemberFromCourse', auth, courseInstructorController.removeAcademicMemberFromCourse);
courseInstructorRouter.put('/assignCourseCoordinator', auth, courseInstructorController.assignCourseCoordinator);

courseInstructorRouter.get('/viewStaffProfilesInDepartment', auth, courseInstructorController.viewStaffProfilesInDepartment);
courseInstructorRouter.get('/viewStaffProfilesInCourse/:courseID', auth, courseInstructorController.viewStaffProfilesInCourse);

module.exports = courseInstructorRouter;