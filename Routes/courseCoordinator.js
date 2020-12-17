const courseCoordinatorController = require('../Controllers/courseCoordinatorController.js');
const authorization = require('../Authorization/auth.js');

const express = require('express');
const courseCoordinatorRouter = express.Router();

courseCoordinatorRouter.get('../viewSlotLinkingRequest',courseCoordinatorController.viewSlotLinkingRequests)
courseCoordinatorRouter.post('../handleSlotLinkingRequest',authorization.authStaffMember,courseCoordinatorController.hendleSlotLinkingRequest);

module.exports = courseCoordinatorRouter;
