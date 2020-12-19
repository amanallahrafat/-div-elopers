const academicMemberController = require('../Controllers/academicMemberController.js');
const {authStaffMember, authAcademicMember} = require('../Authorization/auth.js');

const express = require('express');
const academicMemberRouter = express.Router();

auth = [authStaffMember,authAcademicMember];
//sendMaternityLeaveRequest

academicMemberRouter.post('/sendSlotLinkingRequest', auth, academicMemberController.sendSlotLinkingRequest);
academicMemberRouter.post('/sendChangeDayOffRequest', auth, academicMemberController.sendChangeDayOffRequest);
academicMemberRouter.post('/sendMaternityLeaveRequest', auth, academicMemberController.sendMaternityLeaveRequest);
academicMemberRouter.get('/getAllNotifications', auth, academicMemberController.getAllNotifications);
academicMemberRouter.get('/viewAllRequests', auth, academicMemberController.viewAllRequests);

module.exports = academicMemberRouter;