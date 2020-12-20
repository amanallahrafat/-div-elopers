const academicMemberController = require('../Controllers/academicMemberController.js');
const { authStaffMember, authAcademicMember } = require('../Authorization/auth.js');

const express = require('express');
const academicMemberRouter = express.Router();


auth = [authStaffMember, authAcademicMember];

academicMemberRouter.post('/sendSlotLinkingRequest', auth, academicMemberController.sendSlotLinkingRequest);
academicMemberRouter.post('/sendChangeDayOffRequest', auth, academicMemberController.sendChangeDayOffRequest);
academicMemberRouter.post('/sendMaternityLeaveRequest', auth, academicMemberController.sendMaternityLeaveRequest);
academicMemberRouter.post('/sendSickLeaveRequest', auth, academicMemberController.sendSickLeaveRequest);
academicMemberRouter.post('/sendReplacementRequest', auth, academicMemberController.sendReplacementRequest);
academicMemberRouter.post('/sendCompensationLeaveRequest', auth, academicMemberController.sendCompensationLeaveRequest);
academicMemberRouter.post('/sendAccidentalLeaveRequest', auth, academicMemberController.sendAccidentalLeaveRequest);
academicMemberRouter.get('/getAllNotifications', auth, academicMemberController.getAllNotifications);
academicMemberRouter.get('/viewAllRequests/:view', auth, academicMemberController.viewAllRequests);
academicMemberRouter.post('/sendReplacementRequest', auth, academicMemberController.sendReplacementRequest);
academicMemberRouter.get('/viewSchedule', auth, academicMemberController.viewSchedule);
academicMemberRouter.get('/viewReplacementRequests', auth, academicMemberController.viewReplacementRequests);
academicMemberRouter.put('/respondToReplacementRequest', auth, academicMemberController.respondToReplacementRequest);
academicMemberRouter.post('/sendAnnualLeaveRequest', auth, academicMemberController.sendAnnualLeaveRequest);
academicMemberRouter.delete('/cancelSlotLinkingRequest/:requestID', auth, academicMemberController.cancelSlotLinkingRequest);

academicMemberRouter.delete('/cancelAccidentalLeaveRequest', auth, academicMemberController.cancelAccidentalLeaveRequest);
academicMemberRouter.delete('/cancelAnnualLeaveRequest', auth, academicMemberController.cancelAnnualLeaveRequest);

module.exports = academicMemberRouter;