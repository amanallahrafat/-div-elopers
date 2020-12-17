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
const Academic_Member = require('../Models/Users/Academic_Member.js');
const Staff_Member = require('../Models/Users/Staff_Member.js');
const checkings = require('../utils/checkings.js');
const removeCascade = require('../utils/removeCascade.js');
const createCascade = require('../utils/createCascade.js');
const mongoose = require('mongoose');

const validator = require('../Validations/hrValidations.js');
const mongoValidator = require('mongoose-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const key = "jkanbvakljbefjkawkfew";

const viewCourseCoverage = async(req, res) => {
    const courseID = parseInt(req.params.courseID);
    if (!await checkings.courseIDExists(courseID)) {
        return res.status(400).send("Course does not exist");
    }

    const instructorID = req.header.user.ID;
    if (!await checkings.isInstructorOfCourse(instructorID, courseID)) {
        return res.status(400).send("The member is not the instructor of the given course");
    }

    const course = await Course.findOne({ ID: courseID });
    const courseSchedule = await Course_Schedule.findOne({ ID: course.scheduleID });
    if (courseSchedule==null)
        return res.status(400).send("No schedule is set yet for the course");
    if (courseSchedule.slots.length == 0)
        return res.status(400).send("Course schedule has no slot entries yet");
    const filteredSlots = courseSchedule.slots.filter((s) => s.instructor != null);
    const coverage = filteredSlots.length / courseSchedule.slots.length;
    return res.send(JSON.stringify(coverage));
}

const viewSlotAssignment = async(req, res) => {
    const instructorID = req.header.user.ID;
    const CourseScheduleTable = await Course_Schedule.find();
    const slots = [];
    for (const schedule of CourseScheduleTable) {
        for (const slot of schedule.slots) {
            if (slot.instructor == instructorID) {
                slots.push(slot);
            }
        }
    }
    return res.send(JSON.stringify(slots));
}

const assignAcademicMemberToSlot = async(req, res) => {
    const instructorID = req.header.user.ID;
    const slotID = req.body.slotID;
    const courseID = req.body.courseID;
    const academicMemberID = req.body.academicMemberID;
    // if (!await checkings.isAcademicMember(academicMemberID))
    //     res.status(400).send("The provided ID does not an acadmic memeber");
    if (!await checkings.isTA(academicMemberID))
        return res.status(400).send("The provided ID is not an acadmic memeber");
    if (!await checkings.courseIDExists(courseID))
        return res.status(400).send("The provided ID does not belong to a valid course");
    if (!await checkings.isInstructorOfCourse(instructorID, courseID))
        return res.status(400).send("You are not an instructor of the given course");
    const course = await Course.findOne({ ID: courseID });
    const schedule = await Course_Schedule.findOne({ ID: course.scheduleID });
    if (schedule.slots == null || schedule.slots.length == 0) {
        return res.status(400).send("No slots are assigned for the given course yet");
    }
    const slot = schedule.slots.filter(x => x.ID == slotID);
    console.log(slot);
    if (slot[0] == null)  
        return res.status(400).send("No slot is assigned for the given course with the provided slotID");
    if (slot[0].instructor != null)
        return res.status(400).send("The slot is already assigned to another instructor");
    // Q1: Could a course Instructor assign another course instructor (OR it should eb only a TA) to an assigned slot?
    // Q2: What is the difference betweeh this functionalty and the functionality of the course-coordinator of assigning slot
    // After the slot linkin request is approved.
    const slots = schedule.slots;
    slots.forEach(elm => {
        if( elm.ID == slotID ){
            if(elm.instructor)
                return res.status(400).send("The Specified slot is already assigned to an instructor !");
            elm.instructor = academicMemberID;
        }
    });
    await Course_Schedule.updateOne({ ID: course.scheduleID }, { slots: slots });
    res.send("Academic memeber is assigned to the slot the successfuly");
}

const removeAssignmentOfAcademicMemberToSlot = async(req, res) => {

    const instructorID = req.header.user.ID;
    const slotID = req.body.slotID;
    const courseID = req.body.courseID;
    const academicMemberID = req.body.academicMemberID;
    // if (!await checkings.isAcademicMember(academicMemberID))
    //     res.status(400).send("The provided ID does not an acadmic memeber");
    if (!await checkings.isTA(academicMemberID))
        return res.status(400).send("The provided ID does not an acadmic memeber");
    if (!await checkings.courseIDExists(courseID))
        return res.status(400).send("The provided ID does not belong to a valid course");
    if (!await checkings.isInstructorOfCourse(instructorID, courseID))
        return res.status(400).send("You are not an instructor of the given course");

    const course = await Course.findOne({ ID: courseID });
    const schedule = await Course_Schedule.findOne({ ID: course.scheduleID });
    if (schedule.slots == null || schedule.slots.length == 0) {
        return res.status(400).send("No slots are assigned for the given course yet");
    }
    const slot = schedule.slots.filter(x => x.ID == slotID);
    if (slot[0] == null)
        return res.status(400).send("No slot is assigned for the given course with the provided slotID");
    if (slot[0].instructor != academicMemberID)
        return res.status(400).send("The given academic member was not assigned to the provided slot");
    // Q1: Could a course Instructor assign another course instructor (OR it should eb only a TA) to an assigned slot?
    // Q2: What is the difference betweeh this functionalty and the functionality of the course-coordinator of assigning slot
    // After the slot linkin request is approved.
    const slots = schedule.slots;
    slots.forEach(elm => {
        if( elm.ID == slotID ){
            elm.instructor = undefined;
            delete(elm.instructor);
        }
    });
    await Course_Schedule.updateOne({ ID: course.scheduleID }, { slots: slots });
    res.send("Academic memeber assignment to the slot is removed successfuly");
}

const updateAssignmentOfAcademicMemberToSlot = async(req, res) => {
    const instructorID = req.header.user.ID;
    const newSlotID = req.body.newSlotID;
    const oldSlotID = req.body.oldSlotID;
    const courseID = req.body.courseID;
    const academicMemberID = req.body.academicMemberID;
    // if (!await checkings.isAcademicMember(academicMemberID))
    //     res.status(400).send("The provided ID does not an acadmic memeber");
    if (!await checkings.isTA(academicMemberID))
        return res.status(400).send("The provided ID does not an acadmic memeber");
    if (!await checkings.courseIDExists(courseID))
        return res.status(400).send("The provided ID does not belong to a valid course");
    if (!await checkings.isInstructorOfCourse(instructorID, courseID))
        return res.status(400).send("You are not an instructor of the given course");

    const course = await Course.findOne({ ID: courseID });
    const schedule = await Course_Schedule.findOne({ ID: course.scheduleID });
    if (schedule.slots == null || schedule.slots.length == 0) {
        return res.status(400).send("No slots are assigned for the given course yet");
    }
    const oldSlot = schedule.slots.filter(x => x.ID == oldSlotID);
    console.log(schedule.slots);
    console.log(oldSlot);
    if (oldSlot[0] == null)
        return res.status(400).send("No oldSlot is assigned for the given course with the provided slotID");
    if (oldSlot[0].instructor != academicMemberID)
        return res.status(400).send("The given academic member was not assigned to the provided oldSlot");

    const newSlot = schedule.slots.filter(x => x.ID == newSlotID);
    if (newSlot[0] == null)
        return res.status(400).send("No newSlot is assigned for the given course with the provided slotID");
    if (newSlot[0].instructor != null)
        return res.status(400).send("The slot is already assigned to another academic member");
    // Q1: Could a course Instructor assign another course instructor (OR it should eb only a TA) to an assigned slot?
    // Q2: What is the difference betweeh this functionalty and the functionality of the course-coordinator of assigning slot
    // After the slot linkin request is approved.

    oldSlot[0].instructor = undefined;
    delete(oldSlot[0].instructor);

    newSlot[0].instructor = academicMemberID;

    const slots = schedule.slots;
    slots.forEach(elm => {
        if( elm.ID == oldSlotID ){
            elm.instructor = undefined;
            delete(elm.instructor);
        }
        if(elm.ID == newSlotID){
            elm.instructor = academicMemberID;
        }
    });

    await Course_Schedule.updateOne({ ID: course.scheduleID }, { slots: slots });
    await Course_Schedule.updateOne({ ID: course.scheduleID }, { slots: schedule.slots });
    res.send("Academic memeber assignment to the slot is updated successfuly");
}

module.exports = {
    viewCourseCoverage,
    assignAcademicMemberToSlot,
    removeAssignmentOfAcademicMemberToSlot,
    updateAssignmentOfAcademicMemberToSlot,
    viewSlotAssignment,
}