const express = require('express');
const hrController = require('../Controllers/hrController.js');
const hrRouter = express.Router();

hrRouter.post('/createLocation' ,hrController.createLocation);
hrRouter.put('/updateLocation/:ID' ,hrController.updateLocation);
hrRouter.delete('/deleteLocation/:ID' ,hrController.deleteLocation);
hrRouter.post('/addStaffMember',hrController.addStaffMember);
module.exports = hrRouter;
