const express = require('express');
const courseInstructorController = require('../Controllers/courseInstructorController.js');
const { authStaffMember, authCourseInstructor } = require('../Authorization/auth.js');
const {getAllAcademicMembers, getAcademicMembersTable, getDepartmentCourses,viewDepartmentMembers} = require('../Controllers/hodController.js');
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


//front-end
courseInstructorRouter.get('/viewSlotAssignmentLocal', auth, courseInstructorController.viewSlotAssignmentLocal);
courseInstructorRouter.get('/requestInstructorCoursesLocal', auth, courseInstructorController.requestInstructorCoursesLocal);


// To be continued inshallah 
courseInstructorRouter.get('/getAllAcademicMembers', auth, getAllAcademicMembers);
courseInstructorRouter.get('/getAcademicMembersTable', auth,getAcademicMembersTable);
courseInstructorRouter.get('/getDepartmentCourses', auth,getDepartmentCourses);
courseInstructorRouter.get('/viewDepartmentMembers', auth,viewDepartmentMembers);
courseInstructorRouter.get('/viewDepartmentMembersByCourse/:courseID', auth,courseInstructorController.viewDepartmentMembersByCourse);



//Use this in remove assigned academic member from course and in assign course coordinator
courseInstructorRouter.get('/viewMembersByCourse/:courseID', auth,courseInstructorController.viewMembersByCourse);





module.exports = courseInstructorRouter;