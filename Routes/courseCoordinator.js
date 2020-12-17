const courseCoordinatorController = require('../Controllers/courseCoordinatorController.js');
const {authStaffMember,authCourseCoordinator} = require('../Authorization/auth.js');

const express = require('express');
const courseCoordinatorRouter = express.Router();

auth = [authStaffMember,authCourseCoordinator];

courseCoordinatorRouter.get('/viewSlotLinkingRequest',auth,courseCoordinatorController.viewSlotLinkingRequests)
courseCoordinatorRouter.post('/handleSlotLinkingRequest',auth,courseCoordinatorController.hendleSlotLinkingRequest);
courseCoordinatorRouter.post('/createSlot',auth,courseCoordinatorController.createSlot);

module.exports = courseCoordinatorRouter;
