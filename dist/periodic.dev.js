"use strict";

var Staff_Member = require("./Models/Users/Staff_Member.js");

var monthNum = 0;

var loop_year = function loop_year() {
  return regeneratorRuntime.async(function loop_year$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          setInterval(function () {
            if (monthNum % 12 == 0) setAccidentalLeaveBalance(); // }, 26_298_000_00)
          }, 10 * 1000);

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

var loop_month = function loop_month(monthNum) {
  setInterval(function _callee() {
    return regeneratorRuntime.async(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(setAnnualLeaveBalance());

          case 2:
            // if (monthNum % 12 == 0) {
            //     setAccidentalLeaveBalance();
            // }
            monthNum++;
             //    }, 26_298_000_00)

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    });
  }, 10 * 1000);
};

var setAccidentalLeaveBalance = function setAccidentalLeaveBalance() {
  var staffTable, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, staff;

  return regeneratorRuntime.async(function setAccidentalLeaveBalance$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Staff_Member.find());

        case 2:
          staffTable = _context3.sent;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context3.prev = 6;

          for (_iterator = staffTable[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            staff = _step.value;
            Staff_Member.updateOne({
              ID: staff.ID,
              type: staff.type
            }, {
              accidentalLeaveBalance: 6
            });
          }

          _context3.next = 14;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](6);
          _didIteratorError = true;
          _iteratorError = _context3.t0;

        case 14:
          _context3.prev = 14;
          _context3.prev = 15;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 17:
          _context3.prev = 17;

          if (!_didIteratorError) {
            _context3.next = 20;
            break;
          }

          throw _iteratorError;

        case 20:
          return _context3.finish(17);

        case 21:
          return _context3.finish(14);

        case 22:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[6, 10, 14, 22], [15,, 17, 21]]);
};

var setAnnualLeaveBalance = function setAnnualLeaveBalance() {
  var staffTable, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, staff;

  return regeneratorRuntime.async(function setAnnualLeaveBalance$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Staff_Member.find());

        case 2:
          staffTable = _context4.sent;
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context4.prev = 6;
          _iterator2 = staffTable[Symbol.iterator]();

        case 8:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context4.next = 16;
            break;
          }

          staff = _step2.value;
          _context4.next = 12;
          return regeneratorRuntime.awrap(Staff_Member.updateOne({
            ID: staff.ID,
            type: staff.type
          }, {
            annualBalance: staff.annualBalance + 2.5
          }));

        case 12:
          console.log({
            annualBalance: staff.annualBalance + 2.5
          }); // console.log(Staff_Member);

        case 13:
          _iteratorNormalCompletion2 = true;
          _context4.next = 8;
          break;

        case 16:
          _context4.next = 22;
          break;

        case 18:
          _context4.prev = 18;
          _context4.t0 = _context4["catch"](6);
          _didIteratorError2 = true;
          _iteratorError2 = _context4.t0;

        case 22:
          _context4.prev = 22;
          _context4.prev = 23;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 25:
          _context4.prev = 25;

          if (!_didIteratorError2) {
            _context4.next = 28;
            break;
          }

          throw _iteratorError2;

        case 28:
          return _context4.finish(25);

        case 29:
          return _context4.finish(22);

        case 30:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[6, 18, 22, 30], [23,, 25, 29]]);
};

module.exports = {
  loop_year: loop_year,
  loop_month: loop_month,
  setAnnualLeaveBalance: setAnnualLeaveBalance
};