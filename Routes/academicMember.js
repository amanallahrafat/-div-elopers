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

//Test this whole part again
academicMemberRouter.delete('/cancelChangeDayOffRequest/:ID', auth, academicMemberController.cancelChangeDayOffRequest);
academicMemberRouter.delete('/cancelCompensationLeaveRequest/:ID', auth, academicMemberController.cancelCompensationLeaveRequest);
academicMemberRouter.delete('/cancelMaternityLeaveRequest/:ID', auth, academicMemberController.cancelMaternityLeaveRequest);
academicMemberRouter.delete('/cancelSickLeaveRequest/:ID', auth, academicMemberController.cancelSickLeaveRequest);
academicMemberRouter.delete('/cancelReplacementRequest/:ID', auth, academicMemberController.cancelReplacementRequest);
academicMemberRouter.delete('/cancelAccidentalLeaveRequest/:ID', auth, academicMemberController.cancelAccidentalLeaveRequest);
academicMemberRouter.delete('/cancelAnnualLeaveRequest/:ID', auth, academicMemberController.cancelAnnualLeaveRequest);


// EXTRA
//post cause it works that way. sam7yny ya HTTP1.1 standards.
academicMemberRouter.post('/viewCourseMembers', auth, academicMemberController.viewCourseMembers);
academicMemberRouter.get('/viewAllCourseSchedules', auth, academicMemberController.viewAllCourseSchedules);
academicMemberRouter.get('/getAllCoursesInstructorsNames', auth, academicMemberController.getAllCoursesInstructorsNames)
module.exports = academicMemberRouter;
