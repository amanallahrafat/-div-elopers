"use strict";

var academicMemberController = require('../Controllers/academicMemberController.js');

var _require = require('../Authorization/auth.js'),
    authStaffMember = _require.authStaffMember,
    authAcademicMember = _require.authAcademicMember;

var express = require('express');

var academicMemberRouter = express.Router();
auth = [authStaffMember, authAcademicMember];
academicMemberRouter.post('/sendSlotLinkingRequest', auth, academicMemberController.sendSlotLinkingRequest);
academicMemberRouter.post('/sendChangeDayOffRequest', auth, academicMemberController.sendChangeDayOffRequest);
academicMemberRouter.post('/sendMaternityLeaveRequest', auth, academicMemberController.sendMaternityLeaveRequest);
academicMemberRouter.get('/getAllNotifications', auth, academicMemberController.getAllNotifications);
academicMemberRouter.get('/viewAllRequests/:view', auth, academicMemberController.viewAllRequests);
academicMemberRouter.post('/sendReplacementRequest', auth, academicMemberController.sendReplacementRequest); //academicMemberRouter.post('/handleReplacmentRequest', auth, academicMemberController.handleReplacmentRequest);

academicMemberRouter.get('/viewSchedule', auth, academicMemberController.viewSchedule);
academicMemberRouter.post('/sendAnnualLeaveRequest', auth, academicMemberController.sendAnnualLeaveRequest);
module.exports = academicMemberRouter;