const courseCoordinatorController = require('../Controllers/courseCoordinatorController.js');
const {authStaffMember,authCourseCoordinator} = require('../Authorization/auth.js');

const express = require('express');
const courseCoordinatorRouter = express.Router();

auth = [authStaffMember,authCourseCoordinator];

courseCoordinatorRouter.get('/viewSlotLinkingRequests',auth,courseCoordinatorController.viewSlotLinkingRequests)
courseCoordinatorRouter.post('/handleSlotLinkingRequest',auth,courseCoordinatorController.hendleSlotLinkingRequest);

courseCoordinatorRouter.post('/createSlot',auth,courseCoordinatorController.createSlot);
courseCoordinatorRouter.delete('/deleteSlot/:courseID/:slotID',auth,courseCoordinatorController.deleteSlot);
courseCoordinatorRouter.put('/updateSlot/:courseID/:slotID',auth,courseCoordinatorController.updateSlot);

module.exports = courseCoordinatorRouter;
