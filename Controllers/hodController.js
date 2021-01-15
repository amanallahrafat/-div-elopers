const Course_Schedule = require('../Models/Academic/Course_Schedule.js');
const Course = require('../Models/Academic/Course.js');
const Department = require('../Models/Academic/Department.js');
const Faculty = require('../Models/Academic/Faculty.js');
const Location = require('../Models/Others/Location.js');
const Notification = require('../Models/Others/Notification.js');
const Accidental_Leave_Request = require('../Models/Requests/Accidental_Leave_Request.js');
const Annual_Leave_Request = require('../Models/Requests/Annual_Leave_Request.js');
const Change_Day_Off_Request = require('../Models/Requests/Change_Day_Off_Request.js');
const Compensation_Leave_Request = require('../Models/Requests/Compensation_Leave_Request.js');
const Maternity_Leave_Request = require('../Models/Requests/Maternity_Leave_Request.js');
const Sick_Leave_Request = require('../Models/Requests/Sick_Leave_Request.js');
const Replacement_Requests = require('../Models/Requests/Replacement_Request.js');
const Academic_Member = require('../Models/Users/Academic_Member.js');
const Staff_Member = require('../Models/Users/Staff_Member.js');
const checkings = require('../utils/checkings.js');
const removeCascade = require('../utils/removeCascade.js');
const createCascade = require('../utils/createCascade.js');
const mongoose = require('mongoose');

const validator = require('../Validations/hodValidations.js');
const mongoValidator = require('mongoose-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findOne } = require('../Models/Academic/Course_Schedule.js');
const extraUtils = require('../utils/extraUtils.js');
const { request } = require('express');
//const { delete } = require('../Routes/hod.js');
//const { updateOne } = require('../Models/Academic/Course_Schedule.js');
const key = "jkanbvakljbefjkawkfew";

const assignCourseInstructor = async (req, res) => { // ADD check that the course doesn't exit and that it has no departments
    const isValid = validator.assignInstructorValidator(req.body);
    if (isValid.error) {
        return res.status(400).send(isValid.error.details[0].message);
    }
    if (!await checkings.isAcademicMember(req.body.instructorID)) {
        return res.status(400).send("Course instructor has to be an academic member");
    }
    //Check that the course is in the department of this HOD 
    //Get the id of the HOD from the token
    const { ID, type } = req.header.user;
    if (!await checkings.isHOD(ID)) {
        return res.status(400).send("You have to be a head of department to do this");
    }
    const academic_member = await Academic_Member.findOne({ ID: ID });
    //Get the departmentID of the HOD
    const hodDept = academic_member.departmentID;
    const course = await Course.findOne({ ID: req.body.courseID }); // Course to assign the instructor for
    if (!course)
        return res.status(400).send("This course doesn't exit")

    if (!course.department.includes(hodDept))
        return res.status(400).send("You can't assign an instructor for a course that it's not in your department");

    if (course.instructor.includes(req.body.instructorID))
        return res.send("This instructor already teaches this course");

    //Change this member to be an instructor (type = 1)
    const courseInstructor = await Academic_Member.findOne({ ID: req.body.instructorID });
    if (courseInstructor.type != 0) // Don't change it if this academic member is a hod
        courseInstructor.type = 1;
    await Academic_Member.updateOne({ ID: req.body.instructorID }, courseInstructor);
    // Change the instructor of the course
    if (!course.instructor)
        course.instructor = [];
    course.instructor.push(req.body.instructorID);
    await Course.updateOne({ ID: req.body.courseID }, course);
    return res.send("Course instructor assigned successfully");
}

const updateCourseInstructor = async (req, res) => {

    if (!await checkings.isAcademicMember(req.params.ID)) {
        return res.status(400).send("Course instructor has to be an academic member");
    }
    // if(!await checkings.isAcademicMember(req.body.newInstructorID)){
    //     return res.status(400).send("Course instructor has to be an academic member");
    // }
    //Check that the course is in the department of this HOD 
    //Get the id of the HOD from the token
    const { ID, type } = req.header.user;
    if (!await checkings.isHOD(ID)) {
        return res.status(400).send("You have to be a head of department to do this");
    }
    const academic_member = await Academic_Member.findOne({ ID: ID });
    //Get the departmentID of the HOD
    const hodDept = academic_member.departmentID;
    const oldCourse = await Course.findOne({ ID: req.body.oldCourseID }); // Course to assign the instructor for
    if (!oldCourse)
        return res.status(400).send("This course doesn't exit");

    const newCourse = await Course.findOne({ ID: req.body.newCourseID }); // Course to assign the instructor for
    if (!newCourse)
        return res.status(400).send("This course doesn't exit");

    if (oldCourse.department == null || !oldCourse.department.includes(hodDept))
        return res.status(400).send("You can't update an instructor for a course that it's not in your department");
    if (newCourse.department == null || !newCourse.department.includes(hodDept))
        return res.status(400).send("You can't update an instructor for a course that it's not in your department");

    if (oldCourse.instructor == null || !oldCourse.instructor.includes(req.params.ID))
        return res.status(400).send("This instructor doesn't teach this course");

    if (newCourse.instructor != null && newCourse.instructor.includes(req.params.ID))
        return res.status(400).send("This new instructor already teaches this course");
    if (req.body.oldCourseID == req.body.newCourseID)
        return res.send("Course updated succefully")

    //Remove the instructor from the instructors of the course
    oldCourse.instructor = oldCourse.instructor.filter(function (value) { return value != req.params.ID });
    //Add the new instructor to the instructors of this course
    newCourse.instructor.push(parseInt(req.params.ID));
    //Remove the old instructor from his slots
    const courseSchedule = await Course_Schedule.findOne({ ID: oldCourse.scheduleID });
    if (courseSchedule && courseSchedule.slots) {
        for (const curSlot of courseSchedule.slots) {
            if (curSlot.instructor == req.params.ID) {
                curSlot.instructor = undefined;
                delete (curSlot.instructor);
            }
        }
    }
    await Course_Schedule.updateOne({ ID: oldCourse.scheduleID }, courseSchedule)
    //Set the type of the new instructor to be 1
    //const academic_member2 = await Academic_Member.findOne({ID:req.body.newInstructorID})
    //Change its type if he is not the head of department
    //if(academic_member2.type != 0)
    //   academic_member2.type = 1; // course instructor
    //await Academic_Member.updateOne({ID: req.body.newInstructorID}, academic_member2);    
    await Course.updateOne({ ID: req.body.oldCourseID }, oldCourse);
    await Course.updateOne({ ID: req.body.newCourseID }, newCourse);
    return res.send("Update was successfull");
}

const deleteCourseInstructor = async (req, res) => {
    // Check that the input array only contains academic members 
    if (!await checkings.isAcademicMember(req.body.instructorID)) {
        return res.status(400).send("Course instructor has to be an academic member");
    }
    //Check that the course is in the department of this HOD 
    //Get the id of the HOD from the token
    const { ID, type } = req.header.user;
    if (!await checkings.isHOD(ID)) {
        return res.status(400).send("You have to be a head of department to do this");
    }

    const academic_member = await Academic_Member.findOne({ ID: ID });
    //Get the departmentID of the HOD
    const hodDept = academic_member.departmentID;
    const course = await Course.findOne({ ID: req.params.courseID }); // Course to assign the instructor for
    if (!course)
        return res.status(400).send("This course doesn't exit");

    if (!course.department.includes(hodDept)) {
        return res.status(400).send("You can't delete an instructor for a course that it's not in your department");
    }


    course.instructor = course.instructor.filter(function (value) { return value != req.body.instructorID })
    const courseSchedule = await Course_Schedule.findOne({ ID: course.scheduleID });
    if (courseSchedule && courseSchedule.slots) {
        for (const curSlot of courseSchedule.slots) {
            if (curSlot.instructor == req.body.instructorID) {
                curSlot.instructor = undefined;
                delete (curSlot.instructor);
            }
        }
    }
    await Course_Schedule.updateOne({ ID: course.scheduleID }, courseSchedule);
    await Course.updateOne({ ID: req.params.courseID }, course);
    return res.send("Course instructor was deleted successfully")
}

const viewDepartmentMembers = async (req, res) => {
    const { ID, type } = req.header.user;
    if (!await checkings.isHOD(ID)) {
        return res.status(400).send("You have to be a head of department to do this");
    }
    const hod = await Academic_Member.findOne({ ID: ID });
    const deptID = hod.departmentID;
    let totalArray = [];
    const departmentAcademicMembers = await Academic_Member.find({ departmentID: deptID });
    const staffMembers = await Staff_Member.find();
    const Locations = await Location.find()
    const Departments = await Department.find()

    for (const curMem of departmentAcademicMembers) {
        curEntry = createMemEntry(curMem, staffMembers, Locations, Departments)
        totalArray.push(curEntry)
    }
    return res.send(totalArray)
}

const viewDepartmentMembersByCourse = async (req, res) => {
    const { ID, type } = req.header.user;
    const hod = await Academic_Member.findOne({ ID: ID });
    const deptID = hod.departmentID;
    let totalArray = [];
    const course = await Course.findOne({ ID: req.params.courseID });

    if (!course)
        res.status(400).send("This course doesn't exist")
    if (!(course.department && course.department.includes(deptID))) {
        return res.status(400).send("This course is not in your department");
    }


    const staffMembers = await Staff_Member.find();
    const Locations = await Location.find()
    const Departments = await Department.find()
    const academicMembers = await Academic_Member.find();
    if (course.teachingStaff)
        for (const curMemID of course.teachingStaff) {
            //const curMem = await Academic_Member.findOne({ID:curMemID});
            const curMem = academicMembers.find((mem) => { return mem.ID == curMemID });
            const curEntry = createMemEntry(curMem, staffMembers, Locations, Departments);
            totalArray.push(curEntry);
        }
    if (course.instructor)
        for (const curMemID of course.instructor) {
            //const curMem = await Academic_Member.findOne({ID:curMemID});
            const curMem = academicMembers.find((mem) => { return mem.ID == curMemID });
            const curEntry = createMemEntry(curMem, staffMembers, Locations, Departments);
            totalArray.push(curEntry);
        }

    //The coordinator is already inside the teaching staff    

    // if(course.coordinatorID){
    //     //const curMem = await Academic_Member.findOne({ID:course.coordinatorID});
    //     const curMem = academicMembers.find((mem)=>{return mem.ID == curMemID});
    //     const curEntry =  createMemEntry(curMem,staffMembers,Locations,Departments);
    //     totalArray.push(curEntry);
    // }

    return res.send(totalArray)
}

const viewAllStaffDayOff = async (req, res) => {
    const { ID, type } = req.header.user;
    if (!await checkings.isHOD(ID)) {
        return res.status(400).send("You have to be a head of department to do this");
    }
    const hod = await Academic_Member.findOne({ ID: ID });
    const deptID = hod.departmentID;
    let totalArray = [];
    const dept = await Department.findOne({ ID: deptID })
    if (dept.members) {
        for (const curMem of dept.members) {
            const curStaff = await Staff_Member.findOne({ ID: curMem, type: 0 })
            const curEntry = {
                "name": curStaff.name,
                "id": "ac-" + curStaff.ID,
                "dayOff": curStaff.dayOff
            }
            totalArray.push(curEntry)
        }
    }
    return res.send(totalArray)
}

const viewSingleStaffDayOff = async (req, res) => {
    const { ID, type } = req.header.user;
    if (!await checkings.isHOD(ID)) {
        return res.status(400).send("You have to be a head of department to do this");
    }
    const hod = await Academic_Member.findOne({ ID: ID });
    const deptID = hod.departmentID;
    const dept = await Department.findOne({ ID: deptID })
    if (!(dept.members && dept.members.includes(req.params.ID))) {
        return res.status(400).send("This staff member is not in your department")
    }
    const curStaff = await Staff_Member.findOne({ ID: req.params.ID, type: 0 });
    const entry = { "name": curStaff.name, "id": "ac-" + curStaff.ID, "day off": curStaff.dayOff }
    return res.send(entry)
}

const viewCourseTeachingAssignments = async (req, res) => {
    const { ID, type } = req.header.user;
    const hod = await Academic_Member.findOne({ ID: ID });
    const deptID = hod.departmentID;
    const curCourse = await Course.findOne({ ID: req.params.ID });
    if (!curCourse)
        return res.status(400).send("This course doesn't exist")

    if (!(curCourse.department && curCourse.department.includes(deptID)))
        return res.status(400).send("This course is not in your department")

    const scheduleID = curCourse.scheduleID;
    if (!scheduleID)
        return res.status(400).send("This course doesn't have a schedule yet!")

    const curSchedule = await Course_Schedule.findOne({ ID: scheduleID });
    if (!curSchedule.slots) {
        curSchedule['_doc'].slots = []
        // return res.status(400).send("This schedule doesn't have any slots yet!")
    }
    let slotsArray = [];

    for (const curSlot of curSchedule.slots) {
        let slotInst = "Not yet assigned";
        if (curSlot.instructor) {
            const curInst = await Staff_Member.findOne({ ID: curSlot.instructor, type: 0 });
            slotInst = curInst.name
        }
        const curSubEntry = { "slot": curSlot, "staff member name": slotInst }
        slotsArray.push(curSubEntry)
    }
    curEntry = {
        "course name": curCourse.name,
        "course code": curCourse.code,
        "course slots": slotsArray
    }
    return res.send(curEntry)
}

const viewCourseCoverage = async (req, res) => {
    const { ID, type } = req.header.user;
    if (!await checkings.isHOD(ID)) {
        return res.status(400).send("You have to be a head of department to do this");
    }
    const hod = await Academic_Member.findOne({ ID: ID });
    const deptID = hod.departmentID;
    const courseID = parseInt(req.params.ID);
    if (!await checkings.courseIDExists(courseID)) {
        return res.status(400).send("Course does not exist");
    }
    const course = await Course.findOne({ ID: courseID });
    if (!(course.department && course.department.includes(deptID)))
        return res.status(400).send("This course is not in your department")

    const courseSchedule = await Course_Schedule.findOne({ ID: course.scheduleID });
    if (courseSchedule == null)
        return res.status(400).send("No schedule is set yet for the course");
    if (courseSchedule.slots.length == 0)
        return res.status(400).send("Course schedule has no slot entries yet");
    const filteredSlots = courseSchedule.slots.filter((s) => s.instructor != null);
    const coverage = filteredSlots.length / courseSchedule.slots.length;
    return res.send(JSON.stringify(coverage));
}

// GET course with all its information(schedule/ instructors....)
const viewCourseTeachingAssignmentsLocal = async (req, res) => {
    console.log("in view course TA local start ");
    const { ID, type } = req.header.user;
    const hod = await Academic_Member.findOne({ ID: ID });
    const staffMembers = await Staff_Member.find({ type: 0 });
    const deptID = hod.departmentID;
    const courses = await Course.find();
    const course_schedules = await Course_Schedule.find();
    const allCourseSlots = []
    for (const curCourse of courses) {

        if (!(curCourse.department && curCourse.department.includes(deptID)))
            continue;

        curEntry = {
            courseID: curCourse.ID,
            courseName: curCourse.name,
            courseCode: curCourse.code,
            courseSlots: [],
            courseCoverage: ""
        }


        const scheduleID = curCourse.scheduleID;
        const curSchedule = course_schedules.find((cs) => { return (cs.ID == scheduleID) });
        const courseCoverage = viewCourseCoverageLocal(curSchedule);
        curEntry.courseCoverage = courseCoverage;
        if (!scheduleID) {
            allCourseSlots.push(curEntry);
            continue;
        }
        if (!curSchedule) {
            allCourseSlots.push(curEntry);
            continue;
        }
        if (!curSchedule.slots) {
            allCourseSlots.push(curEntry);
            continue;
        }
        console.log("in view course TA local 1 ");

        let slotsArray = [];
        const locations = await Location.find();
        for (const curSlot of curSchedule.slots) {
            const slotEntry = {
                instructor: "Not yet assigned",
                instructorID: "",
                locationName: "",
                slotNumber: 0,
                day: 0
            }
            let slotInst = "Not yet assigned";
            if (curSlot.instructor) {
                const curInst = staffMembers.find((mem) => { return (mem.ID == curSlot.instructor) });
                slotInst = curInst.name
                slotEntry.instructor = slotInst;
                slotEntry.instructorID = "ac-" + curSlot.instructor;
            }
            if (curSlot.locationID) {
                const loc = locations.find((loc) => { return (loc.ID == curSlot.locationID) });
                if (loc && loc.name)
                    slotEntry.locationName = loc.name;
            }

            slotEntry.slotNumber = curSlot.slotNumber;
            slotEntry.day = getDayNumber(curSlot.day);


            slotsArray.push(slotEntry);
        }
        console.log("in view course TA local 2 ");

        curEntry.courseSlots = slotsArray;
        allCourseSlots.push(curEntry);
    }
    return res.send(allCourseSlots);
}

const getDayNumber = (day) => {
    return day;
    if (day == "saturday")
        return 0;
    if (day == "sunday")
        return 1;
    if (day == "monday")
        return 2;
    if (day == "tuesday")
        return 3;
    if (day == "wednesday")
        return 4;
    if (day == "thursday")
        return 5;
    if (day == "friday")
        return 6;
    return -1;
}
const viewCourseCoverageLocal = (courseSchedule) => {

    if (!courseSchedule)
        return ("No schedule is set yet for the course");
    if (courseSchedule.slots.length == 0)
        return ("Course schedule has no slot entries yet");
    const filteredSlots = courseSchedule.slots.filter((s) => s.instructor != null);
    const coverage = filteredSlots.length / courseSchedule.slots.length;
    return (parseInt(coverage * 100 * 100) / 100) + "%";
}

//To be tested
const viewAllRequests = async (req, res) => {
    const { ID, type } = req.header.user;
    let totalArray = [];
    const staffMembers = await Staff_Member.find({ type: 0 });

    let accidentalLeaveRequests = await Accidental_Leave_Request.find({ receiverID: ID });

    if (accidentalLeaveRequests == null) accidentalLeaveRequests = [];
    else {
        accidentalLeaveRequests = accidentalLeaveRequests.map((request) => {
            const staffMem = staffMembers.find((mem) => {
                return mem.ID == request.senderID
            })
            request['_doc'].senderID = staffMem.name;
            request['_doc'].email = staffMem.email;

            return request;
        })
    }
    totalArray.push({ "type": "accidental leave requests", "requests": accidentalLeaveRequests })

    let annualLeaveRequests = await Annual_Leave_Request.find({ receiverID: ID });
    if (annualLeaveRequests == null) annualLeaveRequests = [];
    else {
        annualLeaveRequests = annualLeaveRequests.map((request) => {
            const staffMem = staffMembers.find((mem) => {
                return mem.ID == request.senderID
            })
            request['_doc'].senderID = staffMem.name;
            request['_doc'].email = staffMem.email;

            return request;
        })
    }

    const replacementRequests = await Replacement_Requests.find();
    const courses = await Course.find();
    const courses_schedule = await Course_Schedule.find();
    totalArray.push({ "type": "annual leave requests", "requests": createAnnualLeaveRequestEntry(annualLeaveRequests, replacementRequests, staffMembers, courses, courses_schedule) })

    let changeDayOffRequests = await Change_Day_Off_Request.find({ receiverID: ID });
    if (changeDayOffRequests == null) changeDayOffRequests = [];
    else {
        changeDayOffRequests = changeDayOffRequests.map((request) => {
            const staffMem = staffMembers.find((mem) => {
                return mem.ID == request.senderID
            })
            request['_doc'].senderID = staffMem.name;
            request['_doc'].email = staffMem.email;
            request['_doc'].dayOff = staffMem.dayOff;
            return request;

        })

    }
    totalArray.push({ "type": "change day off requests", "requests": changeDayOffRequests })

    let compensationLeaveRequests = await Compensation_Leave_Request.find({ receiverID: ID });
    if (compensationLeaveRequests == null) compensationLeaveRequests = [];
    else {
        compensationLeaveRequests = compensationLeaveRequests.map((request) => {
            const staffMem = staffMembers.find((mem) => {
                return mem.ID == request.senderID
            })
            request['_doc'].senderID = staffMem.name;
            request['_doc'].email = staffMem.email;

            return request;
        })

    }
    totalArray.push({ "type": "compensation leave requests", "requests": compensationLeaveRequests })

    let maternityLeaveRequests = await Maternity_Leave_Request.find({ receiverID: ID });
    if (maternityLeaveRequests == null) maternityLeaveRequests = [];
    else {
        maternityLeaveRequests = maternityLeaveRequests.map((request) => {
            const staffMem = staffMembers.find((mem) => {
                return mem.ID == request.senderID
            })
            request['_doc'].senderID = staffMem.name;
            request['_doc'].email = staffMem.email;

            return request;
        })
    }
    totalArray.push({ "type": "maternity leave requests", "requests": maternityLeaveRequests })

    let sickLeaveRequests = await Sick_Leave_Request.find({ receiverID: ID });
    if (sickLeaveRequests == null) sickLeaveRequests = [];
    else {
        sickLeaveRequests = sickLeaveRequests.map((request) => {
            const staffMem = staffMembers.find((mem) => {
                return mem.ID == request.senderID
            })
            request['_doc'].senderID = staffMem.name;
            request['_doc'].email = staffMem.email;

            return request;
        })
    }
    totalArray.push({ "type": "sick leave requests", "requests": sickLeaveRequests });

    return res.send(totalArray);
}

const respondToChangeDayOffRequest = async (req, res) => {
    const { ID, type } = req.header.user;

    const request = await Change_Day_Off_Request.findOne({ ID: parseInt(req.params.ID) });
    if (await requestFailChecks(request, res, ID))
        return;
    const memID = request.senderID;
    if (!await checkings.isAcademicMember(memID))
        return res.status(400).send("This member is not an academic member");

    const isValid = validator.requestResponseValidation(req.body);
    if (isValid.error)
        return res.status(400).send(isValid.error.details[0].message);

    const member = await Academic_Member.find({ ID: memID });

    let msg = req.body.response == 1 ? "Your change day off request was accepted" : "Your change day off request was rejected";
    if (req.body.msg != null && req.body.msg != undefined && req.body.msg != "")
        msg = msg +". Reason: " + req.body.msg;
    const notification = new Notification({ senderID: ID, receiverID: memID, msg: msg, date: Date.now() });
    await notification.save();
    if (req.body.response == 1) { // accepted
        await Staff_Member.updateOne({ ID: memID, type: 0 }, { dayOff: request.targetDayOff });
        await Change_Day_Off_Request.updateOne({ ID: parseInt(req.params.ID) }, { status: "accepted" });
        return res.send('Request accepted succefully');
    }
    if (req.body.response == 0) { // rejected
        await Change_Day_Off_Request.updateOne({ ID: parseInt(req.params.ID) }, { status: "rejected" });
        return res.send('Request rejected succefully');
    }
}
// To be tested
const respondToMaternityLeaveRequest = async (req, res) => {
    const { ID, type } = req.header.user;
    if (!await checkings.isHOD(ID))
        return res.status(400).send("You have to be a head of department to do this");
    const request = await Maternity_Leave_Request.findOne({ ID: parseInt(req.params.ID) });
    if (await requestFailChecks(request, res, ID))
        return;
    const memID = request.senderID;
    if (!await checkings.isAcademicMember(memID))
        return res.status(400).send("This member is not an academic member");
    const isValid = validator.requestResponseValidation(req.body);
    if (isValid.error)
        return res.status(400).send( isValid.error.details[0].message);

    if (req.body.response == 1) {
        await Maternity_Leave_Request.updateOne({ ID: parseInt(req.params.ID) }, { status: "accepted" });
    }
    if (req.body.response == 0) {
        await Maternity_Leave_Request.updateOne({ ID: parseInt(req.params.ID) }, { status: "rejected" });
    }
    let msg = req.body.response == 1 ? "Your maternity leave request was accepted" : "Your maternity leave request was rejected";
    if (req.body.msg != null&& req.body.msg != "")
        msg = msg +". Reason: " + req.body.msg;
    const notification = new Notification({ senderID: ID, receiverID: memID, msg: msg, date: Date.now() });
    await notification.save();
    if (req.body.response == 1)
        return res.send("Request was accepted successfully");
    else
        return res.send("Request was rejected successfully");
}

//To be tested
const respondToSickLeaveRequests = async (req, res) => {
    const { ID, type } = req.header.user;
    if (!await checkings.isHOD(ID))
        return res.status(400).send("You have to be a head of department to do this");
    const request = await Sick_Leave_Request.findOne({ ID: parseInt(req.params.ID) });
    if (await requestFailChecks(request, res, ID))
        return;
    const memID = request.senderID;
    if (!await checkings.isAcademicMember(memID))
        return res.status(400).send("This member is not an academic member");
    const isValid = validator.requestResponseValidation(req.body);
    if (isValid.error)
        return res.status(400).send(isValid.error.details[0].message);

    if (req.body.response == 1) {
        await Sick_Leave_Request.updateOne({ ID: parseInt(req.params.ID) }, { status: "accepted" });
    }
    if (req.body.response == 0) {
        await Sick_Leave_Request.updateOne({ ID: parseInt(req.params.ID) }, { status: "rejected" });
    }
    let msg = req.body.response == 1 ? "Your sick leave request was accepted" : "Your sick leave request was rejected";
    if (req.body.msg != null&& req.body.msg != "")
        msg = msg +". Reason: " + req.body.msg;
    const notification = new Notification({ senderID: ID, receiverID: memID, msg: msg, date: Date.now() });
    await notification.save();
    if (req.body.response == 1)
        return res.send("Request was accepted successfully");
    else
        return res.send("Request was rejected successfully");
}

//To be tested
const respondToAccidentalLeaveRequest = async (req, res) => {
    const { ID, type } = req.header.user;
    if (!await checkings.isHOD(ID))
        return res.status(400).send("You have to be a head of department to do this");
    const request = await Accidental_Leave_Request.findOne({ ID: parseInt(req.params.ID) });
    if (await requestFailChecks(request, res, ID))
        return;
    const memID = request.senderID;
    if (!await checkings.isAcademicMember(memID))
        return res.status(400).send("This member is not an academic member");

    const isValid = validator.requestResponseValidation(req.body);
    if (isValid.error)
        return res.status(400).send(isValid.error.details[0].message);
    const curMem = await Staff_Member.findOne({ ID: request.senderID, type: 0 });
    if (req.body.response == 1) { //accept
        console.log("annual balance", curMem.annualBalance)
        console.log("accidental balance", curMem.accidentalLeaveBalance)

        if (curMem.accidentalLeaveBalance < 1 || curMem.annualBalance < 1) {
            // await Accidental_Leave_Request.updateOne({ ID: parseInt(req.params.ID) }, { status: "rejected" });
            // const notification = new Notification({ senderID: ID, receiverID: memID, msg: "Your accidental leave request was rejected because you don't have enough accidental leave days", date: Date.now() });
            // await notification.save();
            return res.status(400).send("You can't accept this request since this user has no more accidental leave days");
        }
        // if (new Date(request.requestedDate) < new Date()) {
        //     await Accidental_Leave_Request.updateOne({ ID: parseInt(req.params.ID) }, { status: "rejected" });
        //     const notification = new Notification({ senderID: ID, receiverID: memID, msg: "Your accidental leave request was rejected because the requested date has already passed", date: Date.now() });
        //     await notification.save();
        //     return res.status(400).send("You can't accept this request since the requested date has already passed");

        // }
        await Accidental_Leave_Request.updateOne({ ID: parseInt(req.params.ID) }, { status: "accepted" });
        curMem.accidentalLeaveBalance -= 1
        curMem.annualBalance -= 1
        await Staff_Member.updateOne({ ID: request.senderID, type: 0 }, curMem);
    }
    if (req.body.response == 0) {
        await Accidental_Leave_Request.updateOne({ ID: parseInt(req.params.ID) }, { status: "rejected" });
    }
    let msg = req.body.response == 1 ? "Your accidental leave request was accepted" : "Your accidental leave request was rejected";
    if (req.body.msg != null&& req.body.msg != "")
        msg = msg +". Reason: " + req.body.msg;
    const notification = new Notification({ senderID: ID, receiverID: memID, msg: msg, date: Date.now() });
    await notification.save();
    if (req.body.response == 1)
        return res.send("Request was accepted successfully");
    else
        return res.send("Request was rejected successfully");
}

//To be tested
const respondToCompensationLeaveRequest = async (req, res) => {
    const { ID, type } = req.header.user;
    if (!await checkings.isHOD(ID))
        return res.status(400).send("You have to be a head of department to do this");
    const request = await Compensation_Leave_Request.findOne({ ID: parseInt(req.params.ID) });
    if (await requestFailChecks(request, res, ID))
        return;
    const memID = request.senderID;
    if (!await checkings.isAcademicMember(memID))
        return res.status(400).send("This member is not an academic member");
    const isValid = validator.requestResponseValidation(req.body);
    if (isValid.error)
        return res.status(400).send(isValid.error.details[0].message);

    if (req.body.response == 1) {
        // const curMem = await Staff_Member.findOne({ID:memID, type:0});
        //const dayOff = extraUtils.getCurDay(request.requestedDate);
        // if(dayOff != curMem.dayOff){
        //     return res.send("You can't accept this request, since the compensation day is not the day off");
        // }
        // if(request.requestedDate.getMonth() != request.absenceDate.getMonth())
        //     return res.send("You can't accept this request, since the compensation month is not the same as the absence month");
        await Compensation_Leave_Request.updateOne({ ID: parseInt(req.params.ID) }, { status: "accepted" });
    }
    if (req.body.response == 0) {
        await Compensation_Leave_Request.updateOne({ ID: parseInt(req.params.ID) }, { status: "rejected" });
    }
    let msg = req.body.response == 1 ? "Your compensation leave request was accepted" : "Your compensation leave request was rejected";
    if (req.body.msg != null&& req.body.msg != "")
        msg = msg +". Reason: " + req.body.msg;
    const notification = new Notification({ senderID: ID, receiverID: memID, msg: msg, date: Date.now() });
    await notification.save();
    if (req.body.response == 1)
        return res.send("Request was accepted successfully");
    else
        return res.send("Request was rejected successfully");

}
//To be tested
const respondToAnnualLeaveRequests = async (req, res) => {
    const { ID, type } = req.header.user;
    if (!await checkings.isHOD(ID))
        return res.status(400).send("You have to be a head of department to do this");
    const request = await Annual_Leave_Request.findOne({ ID: parseInt(req.params.ID) });
    if (await requestFailChecks(request, res, ID))
        return;
    const memID = request.senderID;
    if (!await checkings.isAcademicMember(memID))
        return res.status(400).send("This member is not an academic member");
    const isValid = validator.requestResponseValidation(req.body);
    if (isValid.error)
        return res.status(400).send( isValid.error.details[0].message);

    if (req.body.response == 1) {
        const curMem = await Staff_Member.findOne({ ID: memID, type: 0 });
        if (curMem.annualBalance < 1) {
            // await Annual_Leave_Request.updateOne({ ID: parseInt(req.params.ID) }, { status: "rejected" });
            // const notification = new Notification({ senderID: ID, receiverID: memID, msg: "Your annual leave request was rejected because you don't have enough annual leave balance", date: Date.now() });
            // await notification.save();
            return res.status(400).send("You can't accept this request, since this member doesn't have enough annaul leave balance");
        }
        curMem.annualBalance -= 1
        // curMem.annualBalance - 1;
        //update the annual leave balance
        await Staff_Member.updateOne({ ID: memID, type: 0 }, curMem);
        await Annual_Leave_Request.updateOne({ ID: parseInt(req.params.ID) }, { status: "accepted" });
    }
    if (req.body.response == 0) {
        await Annual_Leave_Request.updateOne({ ID: parseInt(req.params.ID) }, { status: "rejected" });

    }
    let msg = req.body.response == 1 ? "Your annual leave request was accepted" : "Your annual leave request was rejected";
    if (req.body.msg != null&& req.body.msg != "")
        msg = msg +". Reason: " + req.body.msg;
    const notification = new Notification({ senderID: ID, receiverID: memID, msg: msg, date: Date.now() });
    await notification.save();
    if (req.body.response == 1)
        return res.send("Request was accepted successfully");
    else
        return res.send("Request was rejected successfully");
}


const createMemEntry = (curMem, staffMembers, Locations, Departments) => {
    const curStaff = staffMembers.find((mem => { return mem.ID == curMem.ID && mem.type == 0 }));
    const office = Locations.find((loc) => { return (loc.ID == curStaff.officeID && loc.type == 2) });
    const dept = Departments.find((curDept) => { return (curDept.ID == curMem.departmentID) });

    const curEntry = {
        name: curStaff.name,
        email: curStaff.email,
        ID: "ac-" + curStaff.ID,
        type: curStaff.type,
        dayOff: curStaff.dayOff,
        gender: curStaff.gender,
        officeID: office ? office.name : "Not yet assigned",
        departmentID: dept.name,
        extraInfo: curStaff.extraInfo ? curStaff.extraInfo : "None",
    }
    return curEntry;
}

const requestFailChecks = async (request, res, ID) => {
    if (request == null) {
        res.status(400).send("This request doesn't exist");
        return true;
    }
    if (request.receiverID != ID) {
        res.status(400).send("This request was not sent to you");
        return true;
    }
    if (request.status == "accepted" || request.status == "rejected") {
        res.send("This request was already responded to.");
        return true;
    }
    return false;
}

const createAnnualLeaveRequestEntry = (annualLeaveRequests, replacementRequests, staffMembers, courses, courses_schedule) => {
    let totalArray = [];
    for (const curReq of annualLeaveRequests) {
        curEntry = {
            ID: curReq.ID,
            senderID: curReq.senderID,
            email: curReq['_doc'].email,
            receiverID: curReq.receiverID,
            msg: curReq.msg,
            requestedDate: curReq.requestedDate,
            submissionDate: curReq.submissionDate,
            status: curReq.status,
            replacements: ["There are no replacements"]
        }
        const replacementRequestIDs = curReq.replacementRequestsID;
        let arr = []
        if (replacementRequestIDs != null) {
            for (const curRepl of replacementRequestIDs) {
                // const replacement = await Replacement_Requests.findOne({ID:curRepl});
                const replacement = replacementRequests.find((rep) => {
                    return rep.ID == curRepl;
                })
                arr.push(createReplacementEntry(replacement, staffMembers, courses, courses_schedule));
            }
            curEntry.replacements = arr;
        }
        totalArray.push(curEntry);
    }
    return totalArray;
}
const createReplacementEntry = (replacement, staffMembers, courses, courses_schedule) => {
    const repID = replacement.ID;
    const receiver = staffMembers.find((mem) => {
        return mem.ID == replacement.receiverID;
    })
    const course = courses.find((c) => {
        return c.ID == replacement.courseID;
    })
    const courseSchedule = courses_schedule.find((cs => {
        return cs.ID == replacement.courseID;
    }));
    slots = courseSchedule.slots;

    const replacementSlot = slots.find((s) => {
        return s.ID == replacement.slotID;
    })

    return {
        receiverName: receiver.name,
        courseName: course.name,
        slotNumber: (replacementSlot) ? replacementSlot.slotNumber : undefined,
        status: replacement.status
    }



}

const getDepartmentCourses = async (req, res) => {
    const { ID, type } = req.header.user;
    // if (!await checkings.isHOD(ID))
    //     return res.status(400).send("You have to be a head of department to do this");
    const hod = await Academic_Member.findOne({ ID: ID });
    const deptID = hod.departmentID;
    let allCourses = await Course.find();
    // allCourses = allCourses.filter((course)=>{
    //     return course.department.includes(deptID);
    // }).map( async (course)=>{ 
    //     course.instructor= await extraUtils.getAcademicMembersByID_arr(course.instructor)  
    //     return course;
    // })

    allCourses = allCourses.filter((course) => {
        //  if(!course.Department)return false;
        return course.department.includes(deptID);
    });
    const ans = [];
    for (const course of allCourses) {
        course.instructor = await extraUtils.getAcademicMembersByID_arr(course.instructor)
        ans.push(course);
    }
    res.send(ans);

}

//get all staff academic members
const getAllAcademicMembers = async (req, res) => {
    const { ID, type } = req.header.user;
    // if (!await checkings.isHOD(ID))
    //     return res.status(400).send("You have to be a head of department to do this");

    let allMemberNames = await Staff_Member.find({ type: 0 });
    return res.send(allMemberNames);
}
//academic member with names
const getAcademicMembersTable = async (req, res) => {
    let allStaffMembers = await Staff_Member.find({ type: 0 });
    let locations = await Location.find();
    let departments = await Department.find();
    let allAcademicMemberNames = await Academic_Member.find();
    for (const ac of allAcademicMemberNames) {
        const staffMem = (allStaffMembers.find((mem) => { return (mem.ID == ac['_doc'].ID) }));
        const department = departments.find((dep) => { return dep.ID == ac.departmentID });
        const loc = locations.find((l) => { return l.ID == staffMem.officeID })
        ac['_doc'].name = staffMem.name;
        ac['_doc'].email = staffMem.email;
        ac['_doc'].officeID = loc? loc.name:"";
        ac['_doc'].departmentID = department.name;




    }
    return res.send(allAcademicMemberNames);
}
module.exports =
{
    assignCourseInstructor,
    updateCourseInstructor,
    deleteCourseInstructor,
    viewDepartmentMembers,
    viewDepartmentMembersByCourse,
    viewAllStaffDayOff,
    viewSingleStaffDayOff,
    viewCourseTeachingAssignments,
    viewCourseCoverage,
    viewAllRequests,
    respondToChangeDayOffRequest,
    respondToMaternityLeaveRequest,
    requestFailChecks,
    respondToSickLeaveRequests,
    respondToAccidentalLeaveRequest,
    respondToCompensationLeaveRequest,
    respondToAnnualLeaveRequests,
    getDepartmentCourses,
    getAllAcademicMembers,
    getAcademicMembersTable,
    viewCourseTeachingAssignmentsLocal,
}