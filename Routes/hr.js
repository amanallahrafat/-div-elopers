const express = require('express');
const hrController = require('../Controllers/hrController.js');
const hrRouter = express.Router();

hrRouter.post('/createLocation' ,hrController.createLocation);
hrRouter.put('/updateLocation/:ID' ,hrController.updateLocation);
hrRouter.delete('/deleteLocation/:ID' ,hrController.deleteLocation);

hrRouter.post('/createFaculty' ,hrController.createFaculty);
hrRouter.put('/updateFaculty/:name' ,hrController.updateFaculty);
hrRouter.delete('/deleteFaculty/:name' ,hrController.deleteFaculty);

hrRouter.post('/createDepartment' ,hrController.createDepartment);
hrRouter.put('/updateDepartment/:ID',hrController.updateDepartment);
hrRouter.delete('/deleteDepartment/:ID',hrController.deleteDepartment);

hrRouter.post('/addStaffMember',hrController.addStaffMember);
hrRouter.put('/updateStaffMember/:ID/:type',hrController.updateStaffMember);
hrRouter.delete('/deleteStaffMember/:ID/:type',hrController.deleteStaffMember);



module.exports = hrRouter;
