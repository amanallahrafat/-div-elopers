const academicMemberController = require('../Controllers/academicMemberController.js');
const {authStaffMember, authAcademicMember} = require('../Authorization/auth.js');

const express = require('express');
const academicMemberRouter = express.Router();

auth = [authStaffMember,authAcademicMember];

academicMemberRouter.post('/sendSlotLinkingRequest', auth, academicMemberController.sendSlotLinkingRequest);
academicMemberRouter.post('/sendChangeDayOffRequest', auth, academicMemberController.sendChangeDayOffRequest);
academicMemberRouter.get('/getAllNotifications', auth, academicMemberController.getAllNotifications);
academicMemberRouter.get('/viewAllRequests/:view', auth, academicMemberController.viewAllRequests);
academicMemberRouter.post('/sendReplacementRequest', auth, academicMemberController.sendReplacementRequest);

//Test this whole part again
academicMemberRouter.delete('/cancelChangeDayOffRequest/:ID', auth, academicMemberController.cancelChangeDayOffRequest);
academicMemberRouter.delete('/cancelCompensationLeaveRequest/:ID', auth, academicMemberController.cancelCompensationLeaveRequest);
academicMemberRouter.delete('/cancelMaternityLeaveRequest/:ID', auth, academicMemberController.cancelMaternityLeaveRequest);
academicMemberRouter.delete('/cancelSickLeaveRequest/:ID', auth, academicMemberController.cancelSickLeaveRequest);
academicMemberRouter.delete('/cancelReplacementRequest/:ID', auth, academicMemberController.cancelReplacementRequest);

module.exports = academicMemberRouter;