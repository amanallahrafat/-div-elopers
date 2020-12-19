const express = require('express');
const hrController = require('../Controllers/hrController.js');
const {authStaffMember,authHr} = require('../Authorization/auth.js');
const hrRouter = express.Router();

auth = [authStaffMember , authHr];

hrRouter.post('/createLocation' ,hrController.createLocation);
hrRouter.put('/updateLocation/:ID' ,hrController.updateLocation);
hrRouter.delete('/deleteLocation/:ID' ,hrController.deleteLocation);


hrRouter.post('/createLocation',auth,hrController.createLocation);
hrRouter.put('/updateLocation/:ID',auth ,hrController.updateLocation);
hrRouter.delete('/deleteLocation/:ID',auth ,hrController.deleteLocation);

hrRouter.post('/createFaculty',auth ,hrController.createFaculty);
hrRouter.put('/updateFaculty/:name',auth ,hrController.updateFaculty);
hrRouter.delete('/deleteFaculty/:name',auth ,hrController.deleteFaculty);

hrRouter.post('/createDepartment',auth ,hrController.createDepartment);
hrRouter.put('/updateDepartment/:ID',auth,hrController.updateDepartment);
hrRouter.delete('/deleteDepartment/:ID',auth,hrController.deleteDepartment);

hrRouter.post('/addStaffMember',auth,hrController.addStaffMember);
hrRouter.put('/updateStaffMember/:ID/:type',auth,hrController.updateStaffMember);
hrRouter.delete('/deleteStaffMember/:ID/:type',auth,hrController.deleteStaffMember);

hrRouter.post('/createCourse',auth,hrController.createCourse);
hrRouter.put('/updateCourse/:ID',auth,hrController.updateCourse);
hrRouter.delete('/deleteCourse/:ID',auth,hrController.deleteCourse);


hrRouter.post('/addMissingSignInOut',auth,hrController.addMissingSignInOut);
hrRouter.get('/viewStaffMemberAttendance/:ID/:type',auth,hrController.viewStaffMemberAttendance);
hrRouter.post('/updateStaffMemberSalary',auth,hrController.updateStaffMemberSalary);
hrRouter.get('/viewStaffMembersWithMissingHours',auth,hrController.viewStaffMembersWithMissingHours);

hrRouter.get('/viewStaffMembersWithMissingDays',auth,hrController.viewStaffMembersWithMissingDays);

module.exports = hrRouter;
