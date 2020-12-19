const Annual_Leave_Request = require('../Models/Requests/Annual_Leave_Request.js');
const Slot_Linking_Request = require('../Models/Requests/Slot_Linking_Request.js');
const Change_Day_Off_Request = require("../Models/Requests/Change_Day_Off_Request.js");
const Accidental_Leave_Request = require('../Models/Requests/Accidental_Leave_Request.js');
const Compensation_Leave_Request = require('../Models/Requests/Compensation_Leave_Request.js');
const Maternity_Leave_Request = require('../Models/Requests/Maternity_Leave_Request.js');
const Replacement_Request = require('../Models/Requests/Replacement_Request.js');
const Sick_Leave_Request = require('../Models/Requests/Sick_Leave_Request');
const Course_Schedule = require('../Models/Academic/Course_Schedule.js');
const Academic_Member = require('../Models/Users/Academic_Member.js');
const Staff_Member = require('../Models/Users/Staff_Member');
const Course = require('../Models/Academic/Course.js');
const Department = require('../Models/Academic/Department.js');
const validator = require('../Validations/academicMemberValidations');
const Notification = require('../Models/Others/Notification.js');
const extraUtils = require('../utils/extraUtils.js');

// {replacementID, courseID, slotID}
// const sendReplacementRequest = async (req, res) =>{
//     const {ID, type}  = req.header.user;
//     const courseID = req.body.courseID;
//     const replacementID = req.body.replacementID;
//     const slotID = req.body.slotID;
//     const replacedCourse = (await Course_Schedule.find({ID: courseID}));
//     if(replacedCourse == null)
//         return res.status(404).send("The requested course was not found");
//     const replacedSlot = replacedCourse.slots.filter((elm) => elm.ID == slotID);
//     if(replacedSlot == null)
//         return res.status(404).send("The requested slot was not found");
//     if((await Academic_Member.find({ID : replacementID})) == null)
//         return res.status(404).send("The replacement member was not found");
//     const coursesSchedules = await Course_Schedule.find();
//     for(const coursesSchedule of coursesSchedules){
//         const slots = coursesSchedule.slots;
//         for(const slot of slots){
//             if(slot.slotNumber == replacedSlot.slotNumber && slot.instructor == replacedSlot.instructor &&
//                 replacedSlot.day == slot.day)
//                 return res.status(403).send("The request is not allowed as the replacement member has a slot in the same time");
//         }
//     }
//     const replacement_requests = await Replacement_Request.find({}) 

// }
//{slotID , CourseID}
const getMaxSlotID = (requests) => {
    let max = 0;
    if (requests.length != 0) {
        max = Math.max.apply(Math, requests.map(obj => obj.ID));
    }
    return max;
}
const getMaxChangeDayOffRequest = (req) =>{
    max = 0;
    if(req.length != 0){
        max = Math.max.apply(Math, req.map(obj => obj.ID));
    }
    return max;
}
const sendSlotLinkingRequest = async (req, res) =>{
    const {ID, type} = req.header.user;
    const courseID = req.body.courseID;
    const slotID = req.body.slotID;
    const course = await Course.findOne({ID: courseID});
    if(course  == null)
        return res.status(404).send("The requested course was not found");
    if(!course.instructor.includes(ID) && !course.teachingStaff.includes(ID))
        res.status(403).send("You are not part of the course teaching staff")
    const course_schedule = await Course_Schedule.findOne({ID : courseID})
    if(course_schedule == null)
        res.status(404).send("The requested course does not exist");
    const slot = course_schedule.slots.filter((elm) => elm.ID == slotID);
    if(slot == null)
        return res.status(404).send("The requested slot was not found");
    if(slot.instructor != null)
        return res.status(400).send("The requested slot is already assigned to another academic member");
    const requests = await Slot_Linking_Request.find();
    const slotLinkingRequest = new Slot_Linking_Request({
        ID : getMaxSlotID(requests) + 1,
        senderID : ID,
        receiverID : course.coordinatorID,
        courseID : courseID,
        slotID : slotID,
        status : "pending"
    });
    await slotLinkingRequest.save();
    res.send("The request has been sent sucessfully");
}
// {newdayoff , msg}
const sendChangeDayOffRequest = async (req, res) =>{
    const {ID, type} = req.header.user;
    const departmentID = (await Academic_Member.findOne({ID : ID})).departmentID;
    const department = await Department.findOne({ID:departmentID});
    const newDayOff = req.body.newDayOff;
    let message = req.body.msg;
    if(department == null)
        return res.status(403).send("The user does not belong to a department yet");
    const hodID = department.hodID;
    if(hodID == null)
        return res.status(404).send("The department does not have a head yet, you can't send this request");
    if(message == null) 
        message = "";
    const isValid = validator.validateDayOff(req.body);
    console.log(req.body);
    if(isValid.error)
        return res.status(400).send({ error: isValid.error.details[0].message });
    const request = await Change_Day_Off_Request.find();
    const changeDayOffRequest = new Change_Day_Off_Request({
        ID : getMaxChangeDayOffRequest(request) + 1,
        senderID : ID,
        receiverID : hodID,
        msg : message,
        targetDayOff : newDayOff,
        submissionDate : Date.now(),
        status: "pending"
    });
    await changeDayOffRequest.save();
    return res.send("The change day request is added successfully.");
}
const getAllNotifications = async (req, res) =>{
    const {ID, type} = req.header.user;
    res.send(await Notification.find({receiverID : ID}));
}
//{view : 0}
//all : 0 , accepted : 1, rejected : 2, pending : 3.
const viewAllRequests = async(req, res) => {
const {ID, type} = req.header.user;
if(req.body.view == 0){
    const accidental = await Accidental_Leave_Request.find({senderID : ID});
    const annual = await Annual_Leave_Request.find({senderID : ID});
    const changeDayOff = await Change_Day_Off_Request.find({senderID : ID});
    const compensation = await Compensation_Leave_Request.find({senderID : ID});
    const maternity = await Maternity_Leave_Request.find({senderID : ID});
    const replacement = await Replacement_Request.find({senderID : ID});
    const sick = await Replacement_Request.find({senderID : ID});
    const slotLinking = await Slot_Linking_Request.find({senderID : ID});
    const result = accidental.concat(annual).concat(changeDayOff).concat(compensation).concat(maternity).concat(replacement).concat(sick).concat(slotLinking);
    return res.send(result);
}else if(req.body.view == 1){
    const accidental = await Accidental_Leave_Request.find({senderID : ID, status : "accepted"});
    const annual = await Annual_Leave_Request.find({senderID : ID, status : "accepted"});
    const changeDayOff = await Change_Day_Off_Request.find({senderID : ID, status : "accepted"});
    const compensation = await Compensation_Leave_Request.find({senderID : ID, status : "accepted"});
    const maternity = await Maternity_Leave_Request.find({senderID : ID, status : "accepted"});
    const replacement = await Replacement_Request.find({senderID : ID, status : "accepted"});
    const sick = await Replacement_Request.find({senderID : ID, status : "accepted"});
    const slotLinking = await Slot_Linking_Request.find({senderID : ID, status : "accepted"});
    const result = accidental.concat(annual).concat(changeDayOff).concat(compensation).concat(maternity).concat(replacement).concat(sick).concat(slotLinking);
    return res.send(result);
}else if(req.body.view == 2){
    
    const accidental = await Accidental_Leave_Request.find({senderID : ID, status : "rejected"});
    const annual = await Annual_Leave_Request.find({senderID : ID, status : "rejected"});
    const changeDayOff = await Change_Day_Off_Request.find({senderID : ID, status : "rejected"});
    const compensation = await Compensation_Leave_Request.find({senderID : ID, status : "rejected"});
    const maternity = await Maternity_Leave_Request.find({senderID : ID, status : "rejected"});
    const replacement = await Replacement_Request.find({senderID : ID, status : "rejected"});
    const sick = await Replacement_Request.find({senderID : ID, status : "rejected"});
    const slotLinking = await Slot_Linking_Request.find({senderID : ID, status : "rejected"});
    const result = accidental.concat(annual).concat(changeDayOff).concat(compensation).concat(maternity).concat(replacement).concat(sick).concat(slotLinking);
    return res.send(result);
}else if(req.body.view == 3){

    const accidental = await Accidental_Leave_Request.find({senderID : ID, status : "pending"});
    const annual = await Annual_Leave_Request.find({senderID : ID, status : "pending"});
    const changeDayOff = await Change_Day_Off_Request.find({senderID : ID, status : "pending"});
    const compensation = await Compensation_Leave_Request.find({senderID : ID, status : "pending"});
    const maternity = await Maternity_Leave_Request.find({senderID : ID, status : "pending"});
    const replacement = await Replacement_Request.find({senderID : ID, status : "pending"});
    const sick = await Replacement_Request.find({senderID : ID, status : "pending"});
    const slotLinking = await Slot_Linking_Request.find({senderID : ID, status : "pending"});
    const result = accidental.concat(annual).concat(changeDayOff).concat(compensation).concat(maternity).concat(replacement).concat(sick).concat(slotLinking);
    return res.send(result);
}
return res.status(403).send("The required filer is not a valid one");
}


// const viewSchedule = async(req, res) =>{
//     const {ID, type} = req.header.user;

// }
// {documents : String, startDate : Number, endDate : Number, msg : String}
const sendMaternityLeaveRequest = async(req, res) =>{
    const {ID, type} = req.header.user;
    const gender = (await Staff_Member.findOne({ID: ID})).gender;
    if(gender != "female")
        return res.status(403).send("You must be a female to have birth");
    const departmentID = (await Academic_Member.findOne({ID : ID})).departmentID;
    const department = await Department.findOne({ID:departmentID});
    let message = req.body.msg;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const documents = req.body.documents;
    if(department == null)
        return res.status(403).send("The user does not belong to a department yet");
    const hodID = department.hodID;
    if(hodID == null)
        return res.status(404).send("The department does not have a head yet, you can't send this request");
    if(message == null) 
        message = "";
    const isValid = validator.validateMaternityLeave(req.body);
    if(isValid.error)
        return res.status(400).send({ error: isValid.error.details[0].message });
    const request = await Maternity_Leave_Request.find();
    const maternity_leave_request = new Maternity_Leave_Request({
        ID : getMaxSlotID(request),
        senderID : ID,
        receiverID : hodID,
        documents : documents,
        submissionDate : Date.now(),
        startDate : startDate,
        endDate : endDate,
        msg : message,
        status: "pending"
    });
    maternity_leave_request.save();
    return res.send("The request has been created successfully.")
}
//{documents: String, requestedDate : Number, msg: String}

const sendSickLeaveRequest = async(req, res) =>{
    const {ID, type} = req.header.user;
    const departmentID = (await Academic_Member.findOne({ID : ID})).departmentID;
    const department = await Department.findOne({ID:departmentID});
    let message = req.body.msg;
    const documents = req.body.documents;
    const requestedDate = req.body.requestedDate;
    if(department == null)
        return res.status(403).send("The user does not belong to a department yet");
    const hodID = department.hodID;
    if(hodID == null)
        return res.status(404).send("The department does not have a head yet, you can't send this request");
    if(message == null) 
        message = "";
    if()
    const isValid = validator.validateSickLeave(req.body);
    if(isValid.error)
        return res.status(400).send({ error: isValid.error.details[0].message });
    const request = await Sick_Leave_Request.find();
    const sick_leave_request = new Sick_Leave_Request({
        ID: getMaxSlotID(request),
        senderID : ID,
        receiverID : hodID,
        documents : documents,
        submissionDate : Date.now(),
        requestedDate : requestedDate,
        status: "pending",
        msg : message
    });
    sick_leave_request.save();
    return res.send("The request has been created successfully.")
   
}

module.exports = {
    sendSlotLinkingRequest,sendChangeDayOffRequest,getAllNotifications, viewAllRequests,sendMaternityLeaveRequest,
    sendSickLeaveRequest
}