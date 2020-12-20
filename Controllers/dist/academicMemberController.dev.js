"use strict";

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

var Annual_Leave_Request = require('../Models/Requests/Annual_Leave_Request.js');

var Slot_Linking_Request = require('../Models/Requests/Slot_Linking_Request.js');

var Change_Day_Off_Request = require("../Models/Requests/Change_Day_Off_Request.js");

var Accidental_Leave_Request = require('../Models/Requests/Accidental_Leave_Request.js');

var Compensation_Leave_Request = require('../Models/Requests/Compensation_Leave_Request.js');

var Maternity_Leave_Request = require('../Models/Requests/Maternity_Leave_Request.js');

var Replacement_Request = require('../Models/Requests/Replacement_Request.js');

var Sick_Leave_Request = require('../Models/Requests/Sick_Leave_Request');

var Course_Schedule = require('../Models/Academic/Course_Schedule.js');

var Academic_Member = require('../Models/Users/Academic_Member.js');

var Course = require('../Models/Academic/Course.js');

var Department = require('../Models/Academic/Department.js');

var validator = require('../Validations/academicMemberValidations');

var extraUtils = require('../utils/extraUtils.js');

var Notification = require('../Models/Others/Notification.js');

var Staff_Member = require('../Models/Users/Staff_Member.js'); // body : {replacementID, courseID, slotID , requestedDate}


var sendReplacementRequest = function sendReplacementRequest(req, res) {
  var _req$header$user, ID, type, courseID, replacementID, slotID, requestedDate, isValid, replacedCourse, replacedSlot, course, coursesSchedules, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, coursesSchedule, slots, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, slot, requests, replacement_request, replaced_member, replacedSlotNumber, notification;

  return regeneratorRuntime.async(function sendReplacementRequest$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$header$user = req.header.user, ID = _req$header$user.ID, type = _req$header$user.type;
          courseID = req.body.courseID;
          replacementID = req.body.replacementID;
          slotID = req.body.slotID;
          requestedDate = req.body.requestedDate;
          isValid = validator.validateReplacementRequest(req.body);

          if (!isValid.error) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", res.status(400).send({
            error: isValid.error.details[0].message
          }));

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap(Course_Schedule.findOne({
            ID: courseID
          }));

        case 10:
          replacedCourse = _context.sent;

          if (!(replacedCourse == null)) {
            _context.next = 13;
            break;
          }

          return _context.abrupt("return", res.status(404).send("The requested course was not found"));

        case 13:
          replacedSlot = replacedCourse.slots.filter(function (elm) {
            return elm.ID == slotID;
          });

          if (!(replacedSlot == null)) {
            _context.next = 16;
            break;
          }

          return _context.abrupt("return", res.status(404).send("The requested slot was not found"));

        case 16:
          _context.next = 18;
          return regeneratorRuntime.awrap(Academic_Member.findOne({
            ID: replacementID
          }));

        case 18:
          _context.t0 = _context.sent;

          if (!(_context.t0 == null)) {
            _context.next = 21;
            break;
          }

          return _context.abrupt("return", res.status(404).send("The replacement member was not found"));

        case 21:
          _context.next = 23;
          return regeneratorRuntime.awrap(Academic_Member.findOne({
            ID: ID
          }));

        case 23:
          _context.t1 = _context.sent.departmentID;
          _context.next = 26;
          return regeneratorRuntime.awrap(Academic_Member.findOne({
            ID: replacementID
          }));

        case 26:
          _context.t2 = _context.sent.departmentID;

          if (!(_context.t1 != _context.t2)) {
            _context.next = 29;
            break;
          }

          return _context.abrupt("return", res.status(400).send("you cannot be replaced by a member does not belong to your department"));

        case 29:
          _context.next = 31;
          return regeneratorRuntime.awrap(Course.findOne({
            ID: courseID
          }));

        case 31:
          course = _context.sent;

          if (course.teachingStaff.includes(ID) ^ course.instructor.includes(ID) && course.teachingStaff.includes(replacementID) ^ course.instructor.includes(replacementID)) {
            _context.next = 34;
            break;
          }

          return _context.abrupt("return", res.status(400).send("you canot be replaced by a member does not teach the same course"));

        case 34:
          if (!(extraUtils.getDifferenceInDays(requestedDate, Date.now()) <= 0)) {
            _context.next = 36;
            break;
          }

          return _context.abrupt("return", res.status(400).send("The requested date already passed !"));

        case 36:
          _context.next = 38;
          return regeneratorRuntime.awrap(Course_Schedule.find());

        case 38:
          coursesSchedules = _context.sent;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 42;
          _iterator = coursesSchedules[Symbol.iterator]();

        case 44:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 76;
            break;
          }

          coursesSchedule = _step.value;
          slots = coursesSchedule.slots;
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context.prev = 50;
          _iterator2 = slots[Symbol.iterator]();

        case 52:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context.next = 59;
            break;
          }

          slot = _step2.value;

          if (!(slot.slotNumber == replacedSlot.slotNumber && slot.instructor == replacedSlot.instructor && replacedSlot.day == slot.day)) {
            _context.next = 56;
            break;
          }

          return _context.abrupt("return", res.status(403).send("The request is not allowed as the replacement member has a slot in the same time"));

        case 56:
          _iteratorNormalCompletion2 = true;
          _context.next = 52;
          break;

        case 59:
          _context.next = 65;
          break;

        case 61:
          _context.prev = 61;
          _context.t3 = _context["catch"](50);
          _didIteratorError2 = true;
          _iteratorError2 = _context.t3;

        case 65:
          _context.prev = 65;
          _context.prev = 66;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 68:
          _context.prev = 68;

          if (!_didIteratorError2) {
            _context.next = 71;
            break;
          }

          throw _iteratorError2;

        case 71:
          return _context.finish(68);

        case 72:
          return _context.finish(65);

        case 73:
          _iteratorNormalCompletion = true;
          _context.next = 44;
          break;

        case 76:
          _context.next = 82;
          break;

        case 78:
          _context.prev = 78;
          _context.t4 = _context["catch"](42);
          _didIteratorError = true;
          _iteratorError = _context.t4;

        case 82:
          _context.prev = 82;
          _context.prev = 83;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 85:
          _context.prev = 85;

          if (!_didIteratorError) {
            _context.next = 88;
            break;
          }

          throw _iteratorError;

        case 88:
          return _context.finish(85);

        case 89:
          return _context.finish(82);

        case 90:
          _context.next = 92;
          return regeneratorRuntime.awrap(Replacement_Request.find());

        case 92:
          requests = _context.sent;
          replacement_request = new Replacement_Request({
            ID: getMaxSlotID(requests) + 1,
            senderID: ID,
            receiverID: replacementID,
            submissionDate: Date.now(),
            requestedDate: requestedDate,
            slotID: slotID,
            courseID: courseID,
            status: "pending"
          });
          _context.next = 96;
          return regeneratorRuntime.awrap(replacement_request.save());

        case 96:
          _context.next = 98;
          return regeneratorRuntime.awrap(Staff_Member.findOne({
            ID: ID,
            type: type
          }));

        case 98:
          replaced_member = _context.sent;
          _context.next = 101;
          return regeneratorRuntime.awrap(Course_Schedule.findOne({
            ID: courseID
          }));

        case 101:
          _context.t5 = function (elem) {
            return elem.ID == slotID;
          };

          replacedSlotNumber = _context.sent.slots.filter(_context.t5)[0].slotNumber;
          notification = new Notification({
            senderID: ID,
            receiverID: replacementID,
            msg: "you have a replacement request from " + replaced_member.name + " for the slot number " + replacedSlotNumber + " in the course" + course.name,
            date: Date.now()
          });
          _context.next = 106;
          return regeneratorRuntime.awrap(notification.save());

        case 106:
          res.send("The replacement request has been sent sucessfully !");

        case 107:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[42, 78, 82, 90], [50, 61, 65, 73], [66,, 68, 72], [83,, 85, 89]]);
}; // body : {requestID , decision} // 0 for rejection and 1 for accepting
// const handleReplacmentRequest = async (req,res)=>{
//     const {ID,type} = req.header.user;
// }


var getMaxSlotID = function getMaxSlotID(requests) {
  var max = 0;

  if (requests.length != 0) {
    max = Math.max.apply(Math, requests.map(function (obj) {
      return obj.ID;
    }));
  }

  return max;
};

var getMaxChangeDayOffRequest = function getMaxChangeDayOffRequest(req) {
  max = 0;

  if (req.length != 0) {
    max = Math.max.apply(Math, req.map(function (obj) {
      return obj.ID;
    }));
  }

  return max;
}; //{slotID , CourseID}


var sendSlotLinkingRequest = function sendSlotLinkingRequest(req, res) {
  var _req$header$user2, ID, type, courseID, slotID, course, course_schedule, slot, requests, slotLinkingRequest;

  return regeneratorRuntime.async(function sendSlotLinkingRequest$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$header$user2 = req.header.user, ID = _req$header$user2.ID, type = _req$header$user2.type;
          courseID = req.body.courseID;
          slotID = req.body.slotID;
          _context2.next = 5;
          return regeneratorRuntime.awrap(Course.findOne({
            ID: courseID
          }));

        case 5:
          course = _context2.sent;

          if (!(course == null)) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", res.status(404).send("The requested course was not found"));

        case 8:
          if (!course.instructor.includes(ID) && !course.teachingStaff.includes(ID)) res.status(403).send("You are not part of the course teaching staff");
          _context2.next = 11;
          return regeneratorRuntime.awrap(Course_Schedule.findOne({
            ID: courseID
          }));

        case 11:
          course_schedule = _context2.sent;
          if (course_schedule == null) res.status(404).send("The requested course does not exist");
          slot = course_schedule.slots.filter(function (elm) {
            return elm.ID == slotID;
          });

          if (!(slot == null)) {
            _context2.next = 16;
            break;
          }

          return _context2.abrupt("return", res.status(404).send("The requested slot was not found"));

        case 16:
          if (!(slot.instructor != null)) {
            _context2.next = 18;
            break;
          }

          return _context2.abrupt("return", res.status(400).send("The requested slot is already assigned to another academic member"));

        case 18:
          _context2.next = 20;
          return regeneratorRuntime.awrap(Slot_Linking_Request.find());

        case 20:
          requests = _context2.sent;
          slotLinkingRequest = new Slot_Linking_Request({
            ID: getMaxSlotID(requests) + 1,
            senderID: ID,
            receiverID: course.coordinatorID,
            courseID: courseID,
            slotID: slotID,
            status: "pending"
          });
          _context2.next = 24;
          return regeneratorRuntime.awrap(slotLinkingRequest.save());

        case 24:
          res.send("The request has been sent sucessfully");

        case 25:
        case "end":
          return _context2.stop();
      }
    }
  });
}; // {newdayoff , msg}


var sendChangeDayOffRequest = function sendChangeDayOffRequest(req, res) {
  var _req$header$user3, ID, type, departmentID, department, newDayOff, message, hodID, isValid, request, changeDayOffRequest;

  return regeneratorRuntime.async(function sendChangeDayOffRequest$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$header$user3 = req.header.user, ID = _req$header$user3.ID, type = _req$header$user3.type;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Academic_Member.findOne({
            ID: ID
          }));

        case 3:
          departmentID = _context3.sent.departmentID;
          _context3.next = 6;
          return regeneratorRuntime.awrap(Department.findOne({
            ID: departmentID
          }));

        case 6:
          department = _context3.sent;
          newDayOff = req.body.newDayOff;
          message = req.body.msg;

          if (!(department == null)) {
            _context3.next = 11;
            break;
          }

          return _context3.abrupt("return", res.status(403).send("The user does not belong to a department yet"));

        case 11:
          hodID = department.hodID;

          if (!(hodID == null)) {
            _context3.next = 14;
            break;
          }

          return _context3.abrupt("return", res.status(404).send("The department does not have a head yet, you can't send this request"));

        case 14:
          if (message == null) message = "";
          isValid = validator.validateDayOff(req.body);
          console.log(req.body);

          if (!isValid.error) {
            _context3.next = 19;
            break;
          }

          return _context3.abrupt("return", res.status(400).send({
            error: isValid.error.details[0].message
          }));

        case 19:
          _context3.next = 21;
          return regeneratorRuntime.awrap(Change_Day_Off_Request.find());

        case 21:
          request = _context3.sent;
          changeDayOffRequest = new Change_Day_Off_Request({
            ID: getMaxChangeDayOffRequest(request) + 1,
            senderID: ID,
            receiverID: hodID,
            msg: message,
            targetDayOff: newDayOff,
            submissionDate: Date.now(),
            status: "pending"
          });
          _context3.next = 25;
          return regeneratorRuntime.awrap(changeDayOffRequest.save());

        case 25:
          return _context3.abrupt("return", res.send("The change day request is added successfully."));

        case 26:
        case "end":
          return _context3.stop();
      }
    }
  });
};

var getAllNotifications = function getAllNotifications(req, res) {
  var _req$header$user4, ID, type;

  return regeneratorRuntime.async(function getAllNotifications$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$header$user4 = req.header.user, ID = _req$header$user4.ID, type = _req$header$user4.type;
          _context4.t0 = res;
          _context4.next = 4;
          return regeneratorRuntime.awrap(Notification.find({
            receiverID: ID
          }));

        case 4:
          _context4.t1 = _context4.sent;

          _context4.t0.send.call(_context4.t0, _context4.t1);

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  });
}; //{view : 0}
//all : 0 , accepted : 1, rejected : 2, pending : 3.


var viewAllRequests = function viewAllRequests(req, res) {
  var _req$header$user5, ID, type, result;

  return regeneratorRuntime.async(function viewAllRequests$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$header$user5 = req.header.user, ID = _req$header$user5.ID, type = _req$header$user5.type;
          result = [];

          if (!(req.params.view == 0)) {
            _context5.next = 46;
            break;
          }

          _context5.t0 = result;
          _context5.next = 6;
          return regeneratorRuntime.awrap(Accidental_Leave_Request.find({
            senderID: ID
          }));

        case 6:
          _context5.t1 = _context5.sent;

          _context5.t0.push.call(_context5.t0, _context5.t1);

          _context5.t2 = result;
          _context5.next = 11;
          return regeneratorRuntime.awrap(Annual_Leave_Request.find({
            senderID: ID
          }));

        case 11:
          _context5.t3 = _context5.sent;

          _context5.t2.push.call(_context5.t2, _context5.t3);

          _context5.t4 = result;
          _context5.next = 16;
          return regeneratorRuntime.awrap(Change_Day_Off_Request.find({
            senderID: ID
          }));

        case 16:
          _context5.t5 = _context5.sent;

          _context5.t4.push.call(_context5.t4, _context5.t5);

          _context5.t6 = result;
          _context5.next = 21;
          return regeneratorRuntime.awrap(Compensation_Leave_Request.find({
            senderID: ID
          }));

        case 21:
          _context5.t7 = _context5.sent;

          _context5.t6.push.call(_context5.t6, _context5.t7);

          _context5.t8 = result;
          _context5.next = 26;
          return regeneratorRuntime.awrap(Maternity_Leave_Request.find({
            senderID: ID
          }));

        case 26:
          _context5.t9 = _context5.sent;

          _context5.t8.push.call(_context5.t8, _context5.t9);

          _context5.t10 = result;
          _context5.next = 31;
          return regeneratorRuntime.awrap(Replacement_Request.find({
            senderID: ID
          }));

        case 31:
          _context5.t11 = _context5.sent;

          _context5.t10.push.call(_context5.t10, _context5.t11);

          _context5.t12 = result;
          _context5.next = 36;
          return regeneratorRuntime.awrap(Sick_Leave_Request.find({
            senderID: ID
          }));

        case 36:
          _context5.t13 = _context5.sent;

          _context5.t12.push.call(_context5.t12, _context5.t13);

          _context5.t14 = result;
          _context5.next = 41;
          return regeneratorRuntime.awrap(Slot_Linking_Request.find({
            senderID: ID
          }));

        case 41:
          _context5.t15 = _context5.sent;

          _context5.t14.push.call(_context5.t14, _context5.t15);

          return _context5.abrupt("return", res.send(result));

        case 46:
          if (!(req.params.view == 1)) {
            _context5.next = 90;
            break;
          }

          _context5.t16 = result;
          _context5.next = 50;
          return regeneratorRuntime.awrap(Accidental_Leave_Request.find({
            senderID: ID,
            status: "accepted"
          }));

        case 50:
          _context5.t17 = _context5.sent;

          _context5.t16.push.call(_context5.t16, _context5.t17);

          _context5.t18 = result;
          _context5.next = 55;
          return regeneratorRuntime.awrap(Annual_Leave_Request.find({
            senderID: ID,
            status: "accepted"
          }));

        case 55:
          _context5.t19 = _context5.sent;

          _context5.t18.push.call(_context5.t18, _context5.t19);

          _context5.t20 = result;
          _context5.next = 60;
          return regeneratorRuntime.awrap(Change_Day_Off_Request.find({
            senderID: ID,
            status: "accepted"
          }));

        case 60:
          _context5.t21 = _context5.sent;

          _context5.t20.push.call(_context5.t20, _context5.t21);

          _context5.t22 = result;
          _context5.next = 65;
          return regeneratorRuntime.awrap(Compensation_Leave_Request.find({
            senderID: ID,
            status: "accepted"
          }));

        case 65:
          _context5.t23 = _context5.sent;

          _context5.t22.push.call(_context5.t22, _context5.t23);

          _context5.t24 = result;
          _context5.next = 70;
          return regeneratorRuntime.awrap(Maternity_Leave_Request.find({
            senderID: ID,
            status: "accepted"
          }));

        case 70:
          _context5.t25 = _context5.sent;

          _context5.t24.push.call(_context5.t24, _context5.t25);

          _context5.t26 = result;
          _context5.next = 75;
          return regeneratorRuntime.awrap(Replacement_Request.find({
            senderID: ID,
            status: "accepted"
          }));

        case 75:
          _context5.t27 = _context5.sent;

          _context5.t26.push.call(_context5.t26, _context5.t27);

          _context5.t28 = result;
          _context5.next = 80;
          return regeneratorRuntime.awrap(Sick_Leave_Request.find({
            senderID: ID,
            status: "accepted"
          }));

        case 80:
          _context5.t29 = _context5.sent;

          _context5.t28.push.call(_context5.t28, _context5.t29);

          _context5.t30 = result;
          _context5.next = 85;
          return regeneratorRuntime.awrap(Slot_Linking_Request.find({
            senderID: ID,
            status: "accepted"
          }));

        case 85:
          _context5.t31 = _context5.sent;

          _context5.t30.push.call(_context5.t30, _context5.t31);

          return _context5.abrupt("return", res.send(result));

        case 90:
          if (!(req.params.view == 2)) {
            _context5.next = 134;
            break;
          }

          _context5.t32 = result;
          _context5.next = 94;
          return regeneratorRuntime.awrap(Accidental_Leave_Request.find({
            senderID: ID,
            status: "rejected"
          }));

        case 94:
          _context5.t33 = _context5.sent;

          _context5.t32.push.call(_context5.t32, _context5.t33);

          _context5.t34 = result;
          _context5.next = 99;
          return regeneratorRuntime.awrap(Annual_Leave_Request.find({
            senderID: ID,
            status: "rejected"
          }));

        case 99:
          _context5.t35 = _context5.sent;

          _context5.t34.push.call(_context5.t34, _context5.t35);

          _context5.t36 = result;
          _context5.next = 104;
          return regeneratorRuntime.awrap(Change_Day_Off_Request.find({
            senderID: ID,
            status: "rejected"
          }));

        case 104:
          _context5.t37 = _context5.sent;

          _context5.t36.push.call(_context5.t36, _context5.t37);

          _context5.t38 = result;
          _context5.next = 109;
          return regeneratorRuntime.awrap(Compensation_Leave_Request.find({
            senderID: ID,
            status: "rejected"
          }));

        case 109:
          _context5.t39 = _context5.sent;

          _context5.t38.push.call(_context5.t38, _context5.t39);

          _context5.t40 = result;
          _context5.next = 114;
          return regeneratorRuntime.awrap(Maternity_Leave_Request.find({
            senderID: ID,
            status: "rejected"
          }));

        case 114:
          _context5.t41 = _context5.sent;

          _context5.t40.push.call(_context5.t40, _context5.t41);

          _context5.t42 = result;
          _context5.next = 119;
          return regeneratorRuntime.awrap(Replacement_Request.find({
            senderID: ID,
            status: "rejected"
          }));

        case 119:
          _context5.t43 = _context5.sent;

          _context5.t42.push.call(_context5.t42, _context5.t43);

          _context5.t44 = result;
          _context5.next = 124;
          return regeneratorRuntime.awrap(Sick_Leave_Request.find({
            senderID: ID,
            status: "rejected"
          }));

        case 124:
          _context5.t45 = _context5.sent;

          _context5.t44.push.call(_context5.t44, _context5.t45);

          _context5.t46 = result;
          _context5.next = 129;
          return regeneratorRuntime.awrap(Slot_Linking_Request.find({
            senderID: ID,
            status: "rejected"
          }));

        case 129:
          _context5.t47 = _context5.sent;

          _context5.t46.push.call(_context5.t46, _context5.t47);

          return _context5.abrupt("return", res.send(result));

        case 134:
          if (!(req.params.view == 3)) {
            _context5.next = 176;
            break;
          }

          _context5.t48 = result;
          _context5.next = 138;
          return regeneratorRuntime.awrap(Accidental_Leave_Request.find({
            senderID: ID,
            status: "pending"
          }));

        case 138:
          _context5.t49 = _context5.sent;

          _context5.t48.push.call(_context5.t48, _context5.t49);

          _context5.t50 = result;
          _context5.next = 143;
          return regeneratorRuntime.awrap(Annual_Leave_Request.find({
            senderID: ID,
            status: "pending"
          }));

        case 143:
          _context5.t51 = _context5.sent;

          _context5.t50.push.call(_context5.t50, _context5.t51);

          _context5.t52 = result;
          _context5.next = 148;
          return regeneratorRuntime.awrap(Change_Day_Off_Request.find({
            senderID: ID,
            status: "pending"
          }));

        case 148:
          _context5.t53 = _context5.sent;

          _context5.t52.push.call(_context5.t52, _context5.t53);

          _context5.t54 = result;
          _context5.next = 153;
          return regeneratorRuntime.awrap(Compensation_Leave_Request.find({
            senderID: ID,
            status: "pending"
          }));

        case 153:
          _context5.t55 = _context5.sent;

          _context5.t54.push.call(_context5.t54, _context5.t55);

          _context5.t56 = result;
          _context5.next = 158;
          return regeneratorRuntime.awrap(Maternity_Leave_Request.find({
            senderID: ID,
            status: "pending"
          }));

        case 158:
          _context5.t57 = _context5.sent;

          _context5.t56.push.call(_context5.t56, _context5.t57);

          _context5.t58 = result;
          _context5.next = 163;
          return regeneratorRuntime.awrap(Replacement_Request.find({
            senderID: ID,
            status: "pending"
          }));

        case 163:
          _context5.t59 = _context5.sent;

          _context5.t58.push.call(_context5.t58, _context5.t59);

          _context5.t60 = result;
          _context5.next = 168;
          return regeneratorRuntime.awrap(Sick_Leave_Request.find({
            senderID: ID,
            status: "pending"
          }));

        case 168:
          _context5.t61 = _context5.sent;

          _context5.t60.push.call(_context5.t60, _context5.t61);

          _context5.t62 = result;
          _context5.next = 173;
          return regeneratorRuntime.awrap(Slot_Linking_Request.find({
            senderID: ID,
            status: "pending"
          }));

        case 173:
          _context5.t63 = _context5.sent;

          _context5.t62.push.call(_context5.t62, _context5.t63);

          return _context5.abrupt("return", res.send(result));

        case 176:
          res.status(403).send("The required filer is not a valid one");

        case 177:
        case "end":
          return _context5.stop();
      }
    }
  });
};

var viewSchedule = function viewSchedule(req, res) {
  var academicMemberID, courseSchdeduleTable, sentReplacementReq, recievedReplacementReq, schedule, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, courseSchedule, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, slot, isReplaced, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, _req, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _courseSchedule, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, _slot, _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _iterator8, _step8, _req2;

  return regeneratorRuntime.async(function viewSchedule$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          academicMemberID = req.header.user.ID;
          _context6.next = 3;
          return regeneratorRuntime.awrap(Course_Schedule.find());

        case 3:
          courseSchdeduleTable = _context6.sent;
          _context6.next = 6;
          return regeneratorRuntime.awrap(Replacement_Request.find({
            senderID: academicMemberID,
            status: "accepted"
          }));

        case 6:
          sentReplacementReq = _context6.sent;
          _context6.next = 9;
          return regeneratorRuntime.awrap(Replacement_Request.find({
            receiverID: academicMemberID,
            status: "accepted"
          }));

        case 9:
          recievedReplacementReq = _context6.sent;
          schedule = [];
          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context6.prev = 14;
          _iterator3 = courseSchdeduleTable[Symbol.iterator]();

        case 16:
          if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
            _context6.next = 68;
            break;
          }

          courseSchedule = _step3.value;

          if (!courseSchedule.slots) {
            _context6.next = 65;
            break;
          }

          _iteratorNormalCompletion5 = true;
          _didIteratorError5 = false;
          _iteratorError5 = undefined;
          _context6.prev = 22;
          _iterator5 = courseSchedule.slots[Symbol.iterator]();

        case 24:
          if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
            _context6.next = 51;
            break;
          }

          slot = _step5.value;

          if (!(slot.instructor == academicMemberID)) {
            _context6.next = 48;
            break;
          }

          isReplaced = false;
          _iteratorNormalCompletion6 = true;
          _didIteratorError6 = false;
          _iteratorError6 = undefined;
          _context6.prev = 31;

          for (_iterator6 = sentReplacementReq[Symbol.iterator](); !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            _req = _step6.value;

            if (_req.slotID == slot.ID && _req.courseID == courseSchedule.ID && extraUtils.isRequestInWeek(_req.requestedDate, new Date())) {
              isReplaced = (_readOnlyError("isReplaced"), true);
            }
          }

          _context6.next = 39;
          break;

        case 35:
          _context6.prev = 35;
          _context6.t0 = _context6["catch"](31);
          _didIteratorError6 = true;
          _iteratorError6 = _context6.t0;

        case 39:
          _context6.prev = 39;
          _context6.prev = 40;

          if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
            _iterator6["return"]();
          }

        case 42:
          _context6.prev = 42;

          if (!_didIteratorError6) {
            _context6.next = 45;
            break;
          }

          throw _iteratorError6;

        case 45:
          return _context6.finish(42);

        case 46:
          return _context6.finish(39);

        case 47:
          if (!isReplaced) {
            schedule.push({
              "courseID": courseSchedule.ID,
              "slot": slot
            });
          }

        case 48:
          _iteratorNormalCompletion5 = true;
          _context6.next = 24;
          break;

        case 51:
          _context6.next = 57;
          break;

        case 53:
          _context6.prev = 53;
          _context6.t1 = _context6["catch"](22);
          _didIteratorError5 = true;
          _iteratorError5 = _context6.t1;

        case 57:
          _context6.prev = 57;
          _context6.prev = 58;

          if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
            _iterator5["return"]();
          }

        case 60:
          _context6.prev = 60;

          if (!_didIteratorError5) {
            _context6.next = 63;
            break;
          }

          throw _iteratorError5;

        case 63:
          return _context6.finish(60);

        case 64:
          return _context6.finish(57);

        case 65:
          _iteratorNormalCompletion3 = true;
          _context6.next = 16;
          break;

        case 68:
          _context6.next = 74;
          break;

        case 70:
          _context6.prev = 70;
          _context6.t2 = _context6["catch"](14);
          _didIteratorError3 = true;
          _iteratorError3 = _context6.t2;

        case 74:
          _context6.prev = 74;
          _context6.prev = 75;

          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }

        case 77:
          _context6.prev = 77;

          if (!_didIteratorError3) {
            _context6.next = 80;
            break;
          }

          throw _iteratorError3;

        case 80:
          return _context6.finish(77);

        case 81:
          return _context6.finish(74);

        case 82:
          _iteratorNormalCompletion4 = true;
          _didIteratorError4 = false;
          _iteratorError4 = undefined;
          _context6.prev = 85;
          _iterator4 = courseSchdeduleTable[Symbol.iterator]();

        case 87:
          if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
            _context6.next = 137;
            break;
          }

          _courseSchedule = _step4.value;

          if (!_courseSchedule.slots) {
            _context6.next = 134;
            break;
          }

          _iteratorNormalCompletion7 = true;
          _didIteratorError7 = false;
          _iteratorError7 = undefined;
          _context6.prev = 93;
          _iterator7 = _courseSchedule.slots[Symbol.iterator]();

        case 95:
          if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
            _context6.next = 120;
            break;
          }

          _slot = _step7.value;

          if (!(_slot.instructor == academicMemberID)) {
            _context6.next = 117;
            break;
          }

          _iteratorNormalCompletion8 = true;
          _didIteratorError8 = false;
          _iteratorError8 = undefined;
          _context6.prev = 101;

          for (_iterator8 = recievedReplacementReq[Symbol.iterator](); !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            _req2 = _step8.value;

            if (_req2.slotID == _slot.ID && _req2.courseID == _courseSchedule.ID && extraUtils.isRequestInWeek(_req2.requestedDate, new Date())) {
              schedule.push({
                "courseID": _courseSchedule.ID,
                "slot": _slot
              });
            }
          }

          _context6.next = 109;
          break;

        case 105:
          _context6.prev = 105;
          _context6.t3 = _context6["catch"](101);
          _didIteratorError8 = true;
          _iteratorError8 = _context6.t3;

        case 109:
          _context6.prev = 109;
          _context6.prev = 110;

          if (!_iteratorNormalCompletion8 && _iterator8["return"] != null) {
            _iterator8["return"]();
          }

        case 112:
          _context6.prev = 112;

          if (!_didIteratorError8) {
            _context6.next = 115;
            break;
          }

          throw _iteratorError8;

        case 115:
          return _context6.finish(112);

        case 116:
          return _context6.finish(109);

        case 117:
          _iteratorNormalCompletion7 = true;
          _context6.next = 95;
          break;

        case 120:
          _context6.next = 126;
          break;

        case 122:
          _context6.prev = 122;
          _context6.t4 = _context6["catch"](93);
          _didIteratorError7 = true;
          _iteratorError7 = _context6.t4;

        case 126:
          _context6.prev = 126;
          _context6.prev = 127;

          if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
            _iterator7["return"]();
          }

        case 129:
          _context6.prev = 129;

          if (!_didIteratorError7) {
            _context6.next = 132;
            break;
          }

          throw _iteratorError7;

        case 132:
          return _context6.finish(129);

        case 133:
          return _context6.finish(126);

        case 134:
          _iteratorNormalCompletion4 = true;
          _context6.next = 87;
          break;

        case 137:
          _context6.next = 143;
          break;

        case 139:
          _context6.prev = 139;
          _context6.t5 = _context6["catch"](85);
          _didIteratorError4 = true;
          _iteratorError4 = _context6.t5;

        case 143:
          _context6.prev = 143;
          _context6.prev = 144;

          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }

        case 146:
          _context6.prev = 146;

          if (!_didIteratorError4) {
            _context6.next = 149;
            break;
          }

          throw _iteratorError4;

        case 149:
          return _context6.finish(146);

        case 150:
          return _context6.finish(143);

        case 151:
          return _context6.abrupt("return", res.send(JSON.stringify(schedule)));

        case 152:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[14, 70, 74, 82], [22, 53, 57, 65], [31, 35, 39, 47], [40,, 42, 46], [58,, 60, 64], [75,, 77, 81], [85, 139, 143, 151], [93, 122, 126, 134], [101, 105, 109, 117], [110,, 112, 116], [127,, 129, 133], [144,, 146, 150]]);
}; // const viewSchedule = async(req, res) =>{
//     const {ID, type} = req.header.user;
// }
// {documents : String, startDate : Number, endDate : Number, msg : String}


var sendMaternityLeaveRequest = function sendMaternityLeaveRequest(req, res) {
  var _req$header$user6, ID, type, gender, departmentID, department, message, startDate, endDate, documents, hodID, isValid, request, maternity_leave_request;

  return regeneratorRuntime.async(function sendMaternityLeaveRequest$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _req$header$user6 = req.header.user, ID = _req$header$user6.ID, type = _req$header$user6.type;
          _context7.next = 3;
          return regeneratorRuntime.awrap(Staff_Member.findOne({
            ID: ID
          }));

        case 3:
          gender = _context7.sent.gender;

          if (!(gender != "female")) {
            _context7.next = 6;
            break;
          }

          return _context7.abrupt("return", res.status(403).send("You must be a female to have birth"));

        case 6:
          _context7.next = 8;
          return regeneratorRuntime.awrap(Academic_Member.findOne({
            ID: ID
          }));

        case 8:
          departmentID = _context7.sent.departmentID;
          _context7.next = 11;
          return regeneratorRuntime.awrap(Department.findOne({
            ID: departmentID
          }));

        case 11:
          department = _context7.sent;
          message = req.body.msg;
          startDate = req.body.startDate;
          endDate = req.body.endDate;
          documents = req.body.documents;

          if (!(department == null)) {
            _context7.next = 18;
            break;
          }

          return _context7.abrupt("return", res.status(403).send("The user does not belong to a department yet"));

        case 18:
          hodID = department.hodID;

          if (!(hodID == null)) {
            _context7.next = 21;
            break;
          }

          return _context7.abrupt("return", res.status(404).send("The department does not have a head yet, you can't send this request"));

        case 21:
          if (message == null) message = "";
          isValid = validator.validateMaternityLeave(req.body);

          if (!isValid.error) {
            _context7.next = 25;
            break;
          }

          return _context7.abrupt("return", res.status(400).send({
            error: isValid.error.details[0].message
          }));

        case 25:
          _context7.next = 27;
          return regeneratorRuntime.awrap(Maternity_Leave_Request.find());

        case 27:
          request = _context7.sent;
          maternity_leave_request = new Maternity_Leave_Request({
            ID: getMaxSlotID(request),
            senderID: ID,
            receiverID: hodID,
            documents: documents,
            submissionDate: Date.now(),
            startDate: startDate,
            endDate: endDate,
            msg: message,
            status: "pending"
          });
          maternity_leave_request.save();
          return _context7.abrupt("return", res.send("The request has been created successfully."));

        case 31:
        case "end":
          return _context7.stop();
      }
    }
  });
}; //{documents: String, requestedDate : Number, msg: String}


var sendSickLeaveRequest = function sendSickLeaveRequest(req, res) {
  var _req$header$user7, ID, type, departmentID, department, message, documents, requestedDate, hodID, isValid, request, sick_leave_request;

  return regeneratorRuntime.async(function sendSickLeaveRequest$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _req$header$user7 = req.header.user, ID = _req$header$user7.ID, type = _req$header$user7.type;
          _context8.next = 3;
          return regeneratorRuntime.awrap(Academic_Member.findOne({
            ID: ID
          }));

        case 3:
          departmentID = _context8.sent.departmentID;
          _context8.next = 6;
          return regeneratorRuntime.awrap(Department.findOne({
            ID: departmentID
          }));

        case 6:
          department = _context8.sent;
          message = req.body.msg;
          documents = req.body.documents;
          requestedDate = req.body.requestedDate;

          if (!(department == null)) {
            _context8.next = 12;
            break;
          }

          return _context8.abrupt("return", res.status(403).send("The user does not belong to a department yet"));

        case 12:
          hodID = department.hodID;

          if (!(hodID == null)) {
            _context8.next = 15;
            break;
          }

          return _context8.abrupt("return", res.status(404).send("The department does not have a head yet, you can't send this request"));

        case 15:
          if (message == null) message = "";
          isValid = validator.validateSickLeave(req.body);

          if (!isValid.error) {
            _context8.next = 19;
            break;
          }

          return _context8.abrupt("return", res.status(400).send({
            error: isValid.error.details[0].message
          }));

        case 19:
          _context8.next = 21;
          return regeneratorRuntime.awrap(Sick_Leave_Request.find());

        case 21:
          request = _context8.sent;
          sick_leave_request = new Sick_Leave_Request({
            ID: getMaxSlotID(request),
            senderID: ID,
            receiverID: hodID,
            documents: documents,
            submissionDate: Date.now(),
            requestedDate: requestedDate,
            status: "pending",
            msg: message
          });
          sick_leave_request.save();
          return _context8.abrupt("return", res.send("The request has been created successfully."));

        case 25:
        case "end":
          return _context8.stop();
      }
    }
  });
}; // body : {"requestedDate" , "msg"}


var sendAnnualLeaveRequest = function sendAnnualLeaveRequest(req, res) {
  var _req$header$user8, ID, type, requestedDate, msg, isValid, user, department, replacementsRequests, requests, annual_leave_request;

  return regeneratorRuntime.async(function sendAnnualLeaveRequest$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _req$header$user8 = req.header.user, ID = _req$header$user8.ID, type = _req$header$user8.type;
          requestedDate = req.body.requestedDate;

          if (!(extraUtils.getDifferenceInDays(requestedDate, Date.now()) <= 0)) {
            _context9.next = 4;
            break;
          }

          return _context9.abrupt("return", res.status(400).send("The requested date already passed !"));

        case 4:
          msg = req.body.msg;
          if (msg == null) req.body.msg = "";
          console.log(req.body.msg);
          isValid = validator.validateAnnualLeaveRequest(req.body);

          if (!isValid.error) {
            _context9.next = 10;
            break;
          }

          return _context9.abrupt("return", res.status(400).send({
            error: isValid.error.details[0].message
          }));

        case 10:
          _context9.next = 12;
          return regeneratorRuntime.awrap(Academic_Member.findOne({
            ID: ID
          }));

        case 12:
          user = _context9.sent;
          _context9.next = 15;
          return regeneratorRuntime.awrap(Department.findOne({
            ID: user.departmentID
          }));

        case 15:
          department = _context9.sent;

          if (!(department == null)) {
            _context9.next = 18;
            break;
          }

          return _context9.abrupt("return", res.status(400).send("your department has no head !"));

        case 18:
          _context9.next = 20;
          return regeneratorRuntime.awrap(Replacement_Request.find({
            senderID: ID
          }));

        case 20:
          replacementsRequests = _context9.sent;
          replacementsRequests = replacementsRequests.filter(function (elm) {
            return extraUtils.twoDatesAreEqual(new Date(elm.requestedDate), new Date(requestedDate));
          });
          replacementsRequests = replacementsRequests.map(function (elm) {
            return elm.ID;
          });
          _context9.next = 25;
          return regeneratorRuntime.awrap(Replacement_Request.find());

        case 25:
          requests = _context9.sent;
          annual_leave_request = new Annual_Leave_Request({
            ID: getMaxSlotID(requests) + 1,
            senderID: ID,
            receiverID: department.hodID,
            msg: msg,
            submissionDate: Date.now(),
            requestedDate: requestedDate,
            replacementRequestsID: replacementsRequests,
            status: "pending"
          });
          _context9.next = 29;
          return regeneratorRuntime.awrap(annual_leave_request.save());

        case 29:
          res.send("the annual leave request has already sucessfully created !");

        case 30:
        case "end":
          return _context9.stop();
      }
    }
  });
};

module.exports = {
  sendReplacementRequest: sendReplacementRequest,
  viewSchedule: viewSchedule,
  sendSlotLinkingRequest: sendSlotLinkingRequest,
  sendChangeDayOffRequest: sendChangeDayOffRequest,
  getAllNotifications: getAllNotifications,
  viewAllRequests: viewAllRequests,
  sendMaternityLeaveRequest: sendMaternityLeaveRequest,
  sendSickLeaveRequest: sendSickLeaveRequest,
  sendAnnualLeaveRequest: sendAnnualLeaveRequest
};