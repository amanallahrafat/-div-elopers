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
const Course = require('../Models/Academic/Course.js');
const Department = require('../Models/Academic/Department.js');
const validator = require('../Validations/academicMemberValidations');
const Location = require('../Models/Others/Location')
const extraUtils = require('../utils/extraUtils.js');
const Notification = require('../Models/Others/Notification.js');
const Staff_Member = require('../Models/Users/Staff_Member.js');



// body : {replacementID, courseID, slotID , requestedDate}
const sendReplacementRequest = async (req, res) => {
    const { ID, type } = req.header.user;
    const courseID = req.body.courseID;
    const replacementID = req.body.replacementID;
    const slotID = req.body.slotID;
    const requestedDate = req.body.requestedDate;
    const isValid = validator.validateReplacementRequest(req.body);
    if (isValid.error)
        return res.status(400).send({ error: isValid.error.details[0].message });
    const replacedCourse = (await Course_Schedule.findOne({ ID: courseID }));
    if (replacedCourse == null)
        return res.status(404).send("The requested course was not found");
    const replacedSlot = replacedCourse.slots.filter((elm) => elm.ID == slotID);
    if (replacedSlot[0] == null)
        return res.status(404).send("The requested slot was not found");
    if ((await Academic_Member.findOne({ ID: replacementID })) == null)
        return res.status(404).send("The replacement member was not found");
    if ((await Academic_Member.findOne({ ID: ID })).departmentID != (await Academic_Member.findOne({ ID: replacementID })).departmentID)
        return res.status(400).send("you cannot be replaced by a member does not belong to your department");
    const course = await Course.findOne({ ID: courseID });
    if (!((course.teachingStaff.includes(ID) ^ course.instructor.includes(ID)) &&
        (course.teachingStaff.includes(replacementID) ^ course.instructor.includes(replacementID))))
        return res.status(400).send("you canot be replaced by a member does not teach the same course");
    if (extraUtils.getDifferenceInDays(requestedDate, Date.now()) <= 0)
        return res.status(400).send("The requested date already passed !");
    const coursesSchedules = await Course_Schedule.find();
    for (const coursesSchedule of coursesSchedules) {
        const slots = coursesSchedule.slots;
        for (const slot of slots) {
            if (slot.slotNumber == replacedSlot.slotNumber && slot.instructor == replacedSlot.instructor &&
                replacedSlot.day == slot.day)
                return res.status(403).send("The request is not allowed as the replacement member has a slot in the same time");
        }
    }
    const requests = await Replacement_Request.find();
    const replacement_request = new Replacement_Request({
        ID: getMaxSlotID(requests) + 1,
        senderID: ID,
        receiverID: replacementID,
        submissionDate: Date.now(),
        requestedDate: requestedDate,
        slotID: slotID,
        courseID: courseID,
        status: "pending"
    });
    await replacement_request.save();
    const replaced_member = await Staff_Member.findOne({ ID: ID, type: type });
    const replacedSlotNumber = ((await Course_Schedule.findOne({ ID: courseID })).slots.filter((elem) =>
        elem.ID == slotID))[0].slotNumber;
    const notification = new Notification({
        senderID: ID,
        receiverID: replacementID,
        msg: "you have a replacement request from " + replaced_member.name + " for the slot number " +
            replacedSlotNumber + " in the course" + course.name,
        date: Date.now(),
    });
    await notification.save();
    res.send("The replacement request has been sent sucessfully !");
}

// body : {requestID , decision} // 0 for rejection and 1 for accepting
// const handleReplacmentRequest = async (req,res)=>{
//     const {ID,type} = req.header.user;

// }

const getMaxSlotID = (requests) => {
    let max = 0;
    if (requests.length != 0) {
        max = Math.max.apply(Math, requests.map(obj => obj.ID));
    }
    return max;
}
const getMaxChangeDayOffRequest = (req) => {
    max = 0;
    if (req.length != 0) {
        max = Math.max.apply(Math, req.map(obj => obj.ID));
    }
    return max;
}

//{slotID , CourseID}
const sendSlotLinkingRequest = async (req, res) => {
    const { ID, type } = req.header.user;
    const courseID = req.body.courseID;
    const slotID = req.body.slotID;
    const course = await Course.findOne({ ID: courseID });
    if (course == null)
        return res.status(404).send("The requested course was not found");
    // if (!course.instructor.includes(ID) && !course.teachingStaff.includes(ID))
    //     res.status(403).send("You are not part of the course teaching staff")
    const course_schedule = await Course_Schedule.findOne({ ID: courseID })
    if (course_schedule == null)
        res.status(404).send("The requested course does not exist");
    const slot = course_schedule.slots.filter((elm) => elm.ID == slotID);
    if (slot == null || slot.length == 0)
        return res.status(404).send("The requested slot was not found");
    if (slot.instructor != null)
        return res.status(400).send("The requested slot is already assigned to another academic member");
    const requests = await Slot_Linking_Request.find();
    const slotLinkingRequest = new Slot_Linking_Request({
        ID: getMaxSlotID(requests) + 1,
        senderID: ID,
        receiverID: course.coordinatorID,
        courseID: courseID,
        slotID: slotID,
        status: "pending"
    });
    await slotLinkingRequest.save();
    res.send("The request has been sent sucessfully");
}
// {newdayoff , msg}
const sendChangeDayOffRequest = async (req, res) => {
    const { ID, type } = req.header.user;
    const departmentID = (await Academic_Member.findOne({ ID: ID })).departmentID;
    const department = await Department.findOne({ ID: departmentID });
    const newDayOff = req.body.newDayOff;
    let message = req.body.msg;
    if (department == null)
        return res.status(403).send("The user does not belong to a department yet");
    const hodID = department.hodID;
    if (hodID == null)
        return res.status(404).send("The department does not have a head yet, you can't send this request");
    if (message == null)
        message = "";
    const isValid = validator.validateDayOff(req.body);
    if (isValid.error)
        return res.status(400).send({ error: isValid.error.details[0].message });
    const request = await Change_Day_Off_Request.find();
    const changeDayOffRequest = new Change_Day_Off_Request({
        ID: getMaxChangeDayOffRequest(request) + 1,
        senderID: ID,
        receiverID: hodID,
        msg: message,
        targetDayOff: newDayOff,
        submissionDate: Date.now(),
        status: "pending"
    });
    await changeDayOffRequest.save();
    return res.send("The change day request is added successfully.");
}
const getAllNotifications = async (req, res) => {
    const { ID, type } = req.header.user;
    let notifications = await Notification.find({ receiverID: ID });
    const newNotifications = [];
    for(const not of notifications){
        const n = not;
        const user = await extraUtils.getAcademicMemberByID(n.senderID);
        n['_doc']['senderName'] = user.name;
        newNotifications.push(n);
    }

    res.send(newNotifications);
}

//{view : 0}
//all : 0 , accepted : 1, rejected : 2, pending : 3.
const viewAllRequests = async (req, res) => {
    const { ID, type } = req.header.user;
    let result = [];
    if (req.params.view == 0) {
        result.push(await Accidental_Leave_Request.find({ senderID: ID }));
        result.push(await Annual_Leave_Request.find({ senderID: ID }));
        result.push(await Change_Day_Off_Request.find({ senderID: ID }));
        result.push(await Compensation_Leave_Request.find({ senderID: ID }));
        result.push(await Maternity_Leave_Request.find({ senderID: ID }));
        result.push(await Replacement_Request.find({ senderID: ID }));
        result.push(await Sick_Leave_Request.find({ senderID: ID }));
        result.push(await Slot_Linking_Request.find({ senderID: ID }));
        return res.send(result);
    } else if (req.params.view == 1) {
        result.push(await Accidental_Leave_Request.find({ senderID: ID, status: "accepted" }));
        result.push(await Annual_Leave_Request.find({ senderID: ID, status: "accepted" }));
        result.push(await Change_Day_Off_Request.find({ senderID: ID, status: "accepted" }));
        result.push(await Compensation_Leave_Request.find({ senderID: ID, status: "accepted" }));
        result.push(await Maternity_Leave_Request.find({ senderID: ID, status: "accepted" }));
        result.push(await Replacement_Request.find({ senderID: ID, status: "accepted" }));
        result.push(await Sick_Leave_Request.find({ senderID: ID, status: "accepted" }));
        result.push(await Slot_Linking_Request.find({ senderID: ID, status: "accepted" }));
        return res.send(result);
    } else if (req.params.view == 2) {
        result.push(await Accidental_Leave_Request.find({ senderID: ID, status: "rejected" }));
        result.push(await Annual_Leave_Request.find({ senderID: ID, status: "rejected" }));
        result.push(await Change_Day_Off_Request.find({ senderID: ID, status: "rejected" }));
        result.push(await Compensation_Leave_Request.find({ senderID: ID, status: "rejected" }));
        result.push(await Maternity_Leave_Request.find({ senderID: ID, status: "rejected" }));
        result.push(await Replacement_Request.find({ senderID: ID, status: "rejected" }));
        result.push(await Sick_Leave_Request.find({ senderID: ID, status: "rejected" }));
        result.push(await Slot_Linking_Request.find({ senderID: ID, status: "rejected" }));
        return res.send(result);
    } else if (req.params.view == 3) {
        result.push(await Accidental_Leave_Request.find({ senderID: ID, status: "pending" }));
        result.push(await Annual_Leave_Request.find({ senderID: ID, status: "pending" }));
        result.push(await Change_Day_Off_Request.find({ senderID: ID, status: "pending" }));
        result.push(await Compensation_Leave_Request.find({ senderID: ID, status: "pending" }));
        result.push(await Maternity_Leave_Request.find({ senderID: ID, status: "pending" }));
        result.push(await Replacement_Request.find({ senderID: ID, status: "pending" }));
        result.push(await Sick_Leave_Request.find({ senderID: ID, status: "pending" }));
        result.push(await Slot_Linking_Request.find({ senderID: ID, status: "pending" }));
        return res.send(result);
    }
    res.status(403).send("The required filer is not a valid one");
}



//This whole part was not tested
//parameters of the request is the ID of the request to be cancelled
//We only change if it's still pending 
const cancelChangeDayOffRequest = async (req, res) => {
    const { ID, type } = req.header.user;
    const reqID = parseInt(req.params.ID);
    const request = await Change_Day_Off_Request.findOne({ ID: reqID });
    if (request == null)
        return res.status(400).send("This request doesn't exist");
    if (ID != request.senderID) {
        return res.status(400).send("You didn't send this request");
    }
    if (request.status != "pending") {
        return res.status(400).send("This request can't be cancelled");
    }
    //Delete from the database 
    await Change_Day_Off_Request.deleteOne({ ID: reqID });
    return res.send("The change day off request was cancelled successfully");
}
const cancelCompensationLeaveRequest = async (req, res) => {
    const { ID, type } = req.header.user;
    const reqID = parseInt(req.params.ID);
    const request = await Compensation_Leave_Request.findOne({ ID: reqID });
    if (request == null)
        return res.status(400).send("This request doesn't exist");
    if (ID != request.senderID) {
        return res.status(400).send("You didn't send this request");
    }
    if (request.status == "rejected") {
        return res.send("This request was rejected");
    }
    if (request.status == "pending") {
        await Compensation_Leave_Request.deleteOne({ ID: reqID });
        return res.send("Compensation leave was deleted successfully");
    }
    //request is still pending
    if (new Date(Date.now()) > new Date(request.requestedDate)) {
        return res.send("You can't cancel this request");
    }
    await Compensation_Leave_Request.deleteOne({ ID: reqID });
    return res.send("Compensation leave was deleted successfully");

}
const cancelMaternityLeaveRequest = async (req, res) => {
    const { ID, type } = req.header.user;
    const reqID = parseInt(req.params.ID);
    const request = await Maternity_Leave_Request.findOne({ ID: reqID });
    if (request == null)
        return res.status(400).send("This request doesn't exist");
    if (ID != request.senderID) {
        return res.status(400).send("You didn't send this request");
    }
    if (request.status == "rejected") {
        return res.send("This request was rejected");
    }
    if (request.status == "pending") {
        await Maternity_Leave_Request.deleteOne({ ID: reqID });
        return res.send("Maternity leave was deleted successfully");
    }
    //request is still pending
    if (new Date() > request.startDate) {
        return res.send("You can't cancel this request");
    }
    await Maternity_Leave_Request.deleteOne({ ID: reqID });
    return res.send("Maternity leave was deleted successfully");

}
const cancelSickLeaveRequest = async (req, res) => {
    const { ID, type } = req.header.user;
    const reqID = parseInt(req.params.ID);
    const request = await Sick_Leave_Request.findOne({ ID: reqID });
    if (request == null)
        return res.status(400).send("This request doesn't exist");
    if (ID != request.senderID) {
        return res.status(400).send("You didn't send this request");
    }
    if (request.status == "rejected") {
        return res.send("This request was rejected");
    }
    if (request.status == "pending") {
        await Sick_Leave_Request.deleteOne({ ID: reqID });
        return res.send("Sick leave was deleted successfully");
    }
    //request is still pending
    if (new Date() > request.requestedDate) {
        return res.send("You can't cancel this request");
    }
    await Sick_Leave_Request.deleteOne({ ID: reqID });
    return res.send("Sick leave was deleted successfully");
}
const cancelReplacementRequest = async (req, res) => {
    const { ID, type } = req.header.user;
    const reqID = parseInt(req.params.ID);
    const request = await Replacement_Request.findOne({ ID: reqID });
    if (request == null)
        return res.status(400).send("This request doesn't exist");
    if (ID != request.senderID) {
        return res.status(400).send("You didn't send this request");
    }
    if (request.status == "rejected") {
        return res.send("This request was rejected");
    }
    if (request.status == "pending") {
        await Replacement_Request.deleteOne({ ID: reqID });
        return res.send("Replacement request was deleted successfully");
    }
    //request is still pending
    if (new Date() > request.requestedDate) {
        return res.send("You can't cancel this request");
    }
    await Replacement_Request.deleteOne({ ID: reqID });
    return res.send("Replacement request was deleted successfully");

}

const viewSchedule = async (req, res) => {
    const academicMemberID = req.header.user.ID;
    const courseSchdeduleTable = await Course_Schedule.find();
    const recievedReplacementReq = await Replacement_Request.find({ receiverID: academicMemberID, status: "accepted" });
    const sentAnnualLeaveReqTable = await Annual_Leave_Request.find({ senderID: academicMemberID, status: "accepted" });
    const annualLeaveReqTable = await Annual_Leave_Request.find({ status: "accepted" });

    const schedule = [];
    for (const courseSchedule of courseSchdeduleTable) {
        if (courseSchedule.slots != null) {
            for (const slot of courseSchedule.slots) {
                if (slot.instructor == academicMemberID) {
                    const leaveAccepted = false;
                    for (const req of sentAnnualLeaveReqTable) {
                        if (extraUtils.getCurDay(req.requestedDate) == slot.day &&
                            extraUtils.isRequestInWeek(new Date(req.requestedDate), new Date(Date.now()))
                        ) {
                            leaveAccepted = true;
                            break;
                        }
                    }

                    if (!leaveAccepted) {
                        schedule.push({ "courseID": courseSchedule.ID, "slot": slot });
                    }
                }
            }
        }
    }

    for (const annualReq of annualLeaveReqTable) {
        if (annualReq.replacementRequestsID) {
            for (const replReqID of annualReq.replacementRequestsID) {
                const replReq = recievedReplacementReq.filter(req =>
                    req.ID == replReqID &&
                    req.status == "accepted");
                if (replReq.length) {
                    const req = replReq[0];
                    // const slot = courseSchdeduleTable.filter(sch =>
                    //     sch.ID == req.courseID &&
                    //     sch.slots != null &&
                    //     sch.slots.filter(s => s.ID == req.slotID).length&&
                    //     sch
                    // );
                    const slot = [];
                    for (const sch of courseSchdeduleTable) {
                        if (sch.ID && req.courseID && sch.slots != null) {
                            for (const s of sch.slots) {
                                if (s.ID == req.slotID) {
                                    slot.push(s);
                                }
                            }
                        }
                    }
                    if (slot.length)
                        schedule.push({ "courseID": req.courseID, "slot": slot[0] });
                    else
                        console.log("SOMETHING IS GOING WRONG");
                }
            }
        }
    }
    const locationsTable = await Location.find();
    const coursesTable = await Course.find();
    for(const entry of schedule){
        const slot = entry.slot;
        slot.locationName = locationsTable.filter(elem => elem.ID == slot.locationID)[0].name;
        const course = entry.courseID;
        entry.courseName = coursesTable.filter(elem => elem.ID == entry.courseID)[0].code;
    }

    return res.send(JSON.stringify(schedule));
}


// {documents : String, startDate : Number, endDate : Number, msg : String}
const sendMaternityLeaveRequest = async (req, res) => {
    const { ID, type } = req.header.user;
    const gender = (await Staff_Member.findOne({ ID: ID, type: type })).gender;
    if (gender != "female")
        return res.status(403).send("You must be a female to have birth");
    const departmentID = (await Academic_Member.findOne({ ID: ID })).departmentID;
    const department = await Department.findOne({ ID: departmentID });
    let message = req.body.msg;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const documents = req.body.documents;
    if (department == null)
        return res.status(403).send("The user does not belong to a department yet");
    const hodID = department.hodID;
    if (hodID == null)
        return res.status(404).send("The department does not have a head yet, you can't send this request");
    if (message == null)
        message = "";
    const isValid = validator.validateMaternityLeave(req.body);
    if (isValid.error)
        return res.status(400).send({ error: isValid.error.details[0].message });
    const request = await Maternity_Leave_Request.find();
    const maternity_leave_request = new Maternity_Leave_Request({
        ID: getMaxSlotID(request) + 1,
        senderID: ID,
        receiverID: hodID,
        documents: documents,
        submissionDate: Date.now(),
        startDate: startDate,
        endDate: endDate,
        msg: message,
        status: "pending"
    });
    await maternity_leave_request.save();
    return res.send("The request has been created successfully.")
}
//{documents: String, requestedDate : Number, msg: String}
const sendSickLeaveRequest = async (req, res) => {
    const { ID, type } = req.header.user;
    const departmentID = (await Academic_Member.findOne({ ID: ID })).departmentID;
    const department = await Department.findOne({ ID: departmentID });
    let message = req.body.msg;
    const documents = req.body.documents;
    const requestedDate = req.body.requestedDate;
    if (department == null)
        return res.status(403).send("The user does not belong to a department yet");
    const hodID = department.hodID;
    if (hodID == null)
        return res.status(404).send("The department does not have a head yet, you can't send this request");
    if (message == null)
        message = "";
    const isValid = validator.validateSickLeave(req.body);
    if (isValid.error)
        return res.status(400).send({ error: isValid.error.details[0].message });
    if (extraUtils.getDifferenceInDays(Date.now(), requestedDate) > 3)
        return res.status(400).send("You can't send sick leave requests for days more than three days before.")
    const request = await Sick_Leave_Request.find();
    const sick_leave_request = new Sick_Leave_Request({
        ID: getMaxSlotID(request) + 1,
        senderID: ID,
        receiverID: hodID,
        documents: documents,
        submissionDate: Date.now(),
        requestedDate: requestedDate,
        status: "pending",
        msg: message
    });
    await sick_leave_request.save();
    return res.send("The request has been created successfully.")

}
//{requestedDate: Number, absenceDate : Number, msg : String}
const sendCompensationLeaveRequest = async (req, res) => {
    const { ID, type } = req.header.user;
    isValid = validator.validateCompensationRequest(req.body);
    if (isValid.error)
        return res.status(400).send({ error: isValid.error.details[0].message });
    const departmentID = (await Academic_Member.findOne({ ID: ID })).departmentID;
    const department = await Department.findOne({ ID: departmentID });
    const requestedDate = req.body.requestedDate;
    const absenceDate = req.body.absenceDate;
    if (department == null)
        return res.status(403).send("The user does not belong to a department yet");
    const hodID = department.hodID;
    if (hodID == null)
        return res.status(404).send("The department does not have a head yet, you can't send this request");
    const user = await Staff_Member.findOne({ ID: ID, type: type });
    const dayOff = extraUtils.getCurDay(new Date(requestedDate));
    if (dayOff != user.dayOff) {
        return res.send("You can't accept this request, since the compensation day is not the day off");
    }
    const curDate = new Date(requestedDate);
    const curYear = curDate.getFullYear();
    const curMonth = curDate.getMonth();
    const curDay = curDate.getDate();
    const startOfMonth = new Date(curYear, curMonth, 11, 2, 0, 0, 0);
    const endOfMonth = new Date(curYear, curMonth + 1, 10, 2, 0, 0, 0);

    if (curDay <= 10) {
        startOfMonth.setMonth(curMonth - 1);
        endOfMonth.setMonth(curMonth);
    }
    if (!(startOfMonth <= new Date(absenceDate) && new Date(absenceDate) <= endOfMonth)) {
        return res.status(403).send("The requested compensation day is not in same month as the missed day");
    }
    const request = await Compensation_Leave_Request.find();
    const compensation_leave_request = new Compensation_Leave_Request({
        ID: getMaxSlotID(request) + 1,
        senderID: ID,
        receiverID: hodID,
        submissionDate: Date.now(),
        requestedDate: requestedDate,
        msg: req.body.msg,
        absenceDate: absenceDate,
        status: "pending"
    });
    await compensation_leave_request.save();
    return res.send("The compensation request is sent successfully");
}
//{requestedDate : Number, msg : String}
const sendAccidentalLeaveRequest = async (req, res) => {
    const { ID, type } = req.header.user;
    const user = await Staff_Member.findOne({ ID: ID, type: type });
    const accidentalLeave = user.accidentalLeaveBalance;
    const annualBalance = user.annualBalance;
    if (accidentalLeave < 1 || annualBalance < 1)
        return res.status(400).send("You don't have enough anuual/accidental leave balance available.");
    isValid = validator.validateAccidentalRequest(req.body);
    if (isValid.error)
        return res.status(400).send({ error: isValid.error.details[0].message });
    const departmentID = (await Academic_Member.findOne({ ID: ID })).departmentID;
    const department = await Department.findOne({ ID: departmentID });
    const requestedDate = req.body.requestedDate;
    let message = req.body.msg;
    if (message == null)
        message = "";
    if (department == null)
        return res.status(403).send("The user does not belong to a department yet");
    const hodID = department.hodID;
    if (hodID == null)
        return res.status(404).send("The department does not have a head yet, you can't send this request");
    const request = await Accidental_Leave_Request.find();
    const accidental_leave_request = new Accidental_Leave_Request({
        ID: getMaxSlotID(request) + 1,
        senderID: ID,
        receiverID: hodID,
        msg: message,
        submissionDate: Date.now(),
        requestedDate: requestedDate,
        status: "pending",
    });
    await accidental_leave_request.save();
    return res.send("The accidental leave request created successfully");
}

const viewReplacementRequests = async (req, res) => {
    const academicMemberID = req.header.user.ID;
    const sentReplacementReq = await Replacement_Request.find({ senderID: academicMemberID });
    const recievedReplacementReq = await Replacement_Request.find({ receiverID: academicMemberID });
    res.send(JSON.stringify(sentReplacementReq.concat(recievedReplacementReq)));
}

const respondToReplacementRequest = async (req, res) => {
    const academicMemberID = req.header.user.ID;
    const requestID = req.body.requestID;
    const response = req.body.response;
    const recievedReplacementReq = await Replacement_Request.findOne({ receiverID: academicMemberID, ID: requestID });
    const replacementReqTable = await Replacement_Request.find();
    if (recievedReplacementReq == null)
        return res.status(400).send("You are trying to respond to an invalid request");
    if (recievedReplacementReq.status != "pending")
        return res.status(400).send(`You already responded ${recievedReplacementReq.status}.You can not respond multiple times!`);
    if (replacementReqTable.filter(req =>
        req.senderID == recievedReplacementReq.senderID &&
        req.receiverID != recievedReplacementReq.receiverID &&
        req.requestedDate == recievedReplacementReq.requestedDate &&
        req.courseID == recievedReplacementReq.courseID &&
        req.slotID == recievedReplacementReq.slotID &&
        req.status == "accepted"
    ).length) {
        return res.status(400).send("Request is no longer availible. Another member accepted the request");
    }
    recievedReplacementReq.status = response ? "accepted" : "rejected";
    await Replacement_Request.updateOne({ ID: requestID }, recievedReplacementReq);
    return res.send("Responded to replacement request successfully");
}
// body : {"requestedDate" , "msg"}
const sendAnnualLeaveRequest = async (req, res) => {
    const { ID, type } = req.header.user;
    const staff_member = await Staff_Member.findOne({ ID: ID });
    if (staff_member.accidentalLeaveBalance < 1)
        return res.status(400).send("you don't have enough leave balance");
    const requestedDate = req.body.requestedDate;
    if (extraUtils.getDifferenceInDays(requestedDate, Date.now()) <= 0)
        return res.status(400).send("The requested date already passed !");
    let message = req.body.msg;
    if (message == null) message = "";
    const isValid = validator.validateAnnualLeaveRequest(req.body);
    if (isValid.error)
        return res.status(400).send({ error: isValid.error.details[0].message });
    const user = await Academic_Member.findOne({ ID: ID });
    const department = await Department.findOne({ ID: user.departmentID });
    if (department == null)
        return res.status(400).send("your department has no head !");
    let replacementsRequests = await Replacement_Request.find({ senderID: ID });
    replacementsRequests = replacementsRequests.filter((elm) => extraUtils.twoDatesAreEqual(new Date(elm.requestedDate), new Date(requestedDate)));
    replacementsRequests = replacementsRequests.map((elm) => elm.ID);
    const requests = await Annual_Leave_Request.find();
    const annual_leave_request = new Annual_Leave_Request({
        ID: getMaxSlotID(requests) + 1,
        senderID: ID,
        receiverID: department.hodID,
        msg: message,
        submissionDate: Date.now(),
        requestedDate: requestedDate,
        replacementRequestsID: replacementsRequests,
        status: "pending",
    });
    await annual_leave_request.save();
    res.send("The annual leave request has already sucessfully created !");
}

const cancelSlotLinkingRequest = async (req, res) => {
    const { ID, type } = req.header.user;
    const requestID = parseInt(req.params.requestID);
    const request = await Slot_Linking_Request.findOne({ ID: requestID });
    if (request == null)
        return res.status(400).send("Invalid request ID");
    if (request.status != "pending")
        return res.status(400).send("You can't cancel this request");
    await Slot_Linking_Request.deleteOne({ ID: requestID });
    res.send("Slot linking request deleted successfully");
}

const cancelAccidentalLeaveRequest = async (req, res) => {
    const { ID, type } = req.header.user;
    if (!req.body.ID) {
        return res.status(400).send("please specify the ID of the request ");
    }
    const accidentalLeave = await Accidental_Leave_Request.findOne({ ID: req.body.ID, senderID: ID });// ID of the accidental leave
    if (!accidentalLeave)
        return res.status(400).send("there is no accidental leave with this ID for this person ");
    if (accidentalLeave.status == "pending") {
        await Accidental_Leave_Request.deleteOne({ ID: req.body.ID });
        return res.send("request has been deleted succuessfully ");
    }
    if (accidentalLeave.status == "rejected") {
        //  await Accidental_Leave_Request.deleteOne({ID:req.body.ID});
        return res.send("request is already rejected ");
    }
    if (accidentalLeave.status == "accepted") {
        if (new Date() < accidentalLeave.requestedDate) {
            const staffMem = await Staff_Member.findOne({ ID: ID, type: type });
            staffMem.annualBalance = staffMem.annualBalance + 1;
            staffMem.accidentalLeaveBalance = staffMem.accidentalLeaveBalance + 1;
            await Staff_Member.updateOne({ ID: ID, type: type }, staffMem);
            await Accidental_Leave_Request.deleteOne({ ID: req.body.ID });
            return res.send("request has been deleted succuessfully ");

        } else {
            return res.status(400).send("this date has already passed");
        }
    }
}

const cancelAnnualLeaveRequest = async (req, res) => {
    const { ID, type } = req.header.user;
    if (!req.body.ID) {
        return res.status(400).send("please specify the ID of the request ");
    }
    const annualLeave = await Annual_Leave_Request.findOne({ ID: req.body.ID, senderID: ID });// ID of the accidental leave
    if (!annualLeave)
        return res.status(400).send("there is no annual leave with this ID for this person ");
    if (annualLeave.status == "pending") {
        await Annual_Leave_Request.deleteOne({ ID: req.body.ID });
        return res.send("request has been deleted succuessfully ");
    }
    if (annualLeave.status == "rejected") {
        // await Annual_Leave_Request.deleteOne({ID:req.body.ID});
        return res.send("request is already rejected ");
    }
    if (annualLeave.status == "accepted") {
        if (new Date() < annualLeave.requestedDate) {
            const staffMem = await Staff_Member.findOne({ ID: ID, type: type });
            staffMem.accidentalLeaveBalance = staffMem.accidentalLeaveBalance + 1;
            await Staff_Member.updateOne({ ID: ID, type: type }, staffMem);
            await Annual_Leave_Request.deleteOne({ ID: req.body.ID });
            return res.send("request has been deleted succuessfully ");

        } else {
            return res.status(400).send("this date has already passed");
        }
    }
}
const viewCourseMembers = async(req, res) =>{
    console.log(req.body)
    const course = await Course.findOne({ID : req.body.courseID});
    const courseMembers = course.instructor.concat(course.teachingStaff);
    const courseMembersUnique = [];
    for(const mem of courseMembers){
        if(!courseMembersUnique.includes(mem))
            courseMembersUnique.push(mem);
    }
    const acMemNames = await extraUtils.getAcademicMemberByID_arr(courseMembersUnique);
    return res.send(acMemNames);

}
module.exports = {
    sendReplacementRequest,
    viewSchedule,
    sendSlotLinkingRequest,
    sendChangeDayOffRequest,
    getAllNotifications,
    viewAllRequests,
    sendMaternityLeaveRequest,
    sendSickLeaveRequest,
    viewReplacementRequests,
    respondToReplacementRequest,
    sendAnnualLeaveRequest,
    sendCompensationLeaveRequest,
    sendAccidentalLeaveRequest,
    cancelSlotLinkingRequest,
    cancelAccidentalLeaveRequest,
    cancelAnnualLeaveRequest,
    cancelChangeDayOffRequest,
    cancelCompensationLeaveRequest,
    cancelMaternityLeaveRequest,
    cancelSickLeaveRequest,
    cancelReplacementRequest,
    viewCourseMembers,
}
