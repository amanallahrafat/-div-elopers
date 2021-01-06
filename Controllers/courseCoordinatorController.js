const Course = require('../Models/Academic/Course.js');
const Course_Schedule = require('../Models/Academic/Course_Schedule.js');
const Notification = require('../Models/Others/Notification.js');
const Slot_Linking_Request = require('../Models/Requests/Slot_Linking_Request.js');
const Staff_Member = require('../Models/Users/Staff_Member');
const Academic_Member = require('../Models/Users/Academic_Member');
const Location = require('../Models/Others/Location.js')
const validator = require('../Validations/courseCoordinatorValidation.js');
const checkings = require('../utils/checkings.js');

const viewAllLocations = async (req, res) => {
    res.send(await Location.find());
}

const viewAllMembersProfiles = async (req,res) =>{
    const academicMembers = await Academic_Member.find();
    let data = []
    for(const staff of academicMembers){
        const ac = await Staff_Member.findOne({ID : staff.ID , type : 0});
        staff['_doc'].name = ac.name;
        data.push(staff);
    }
    res.send(data);
}

const viewAllSlots = async (req,res) =>{
    const {ID,type} = req.header.user;
    const course = await Course.findOne({ coordinatorID: ID });
    const schedule = await Course_Schedule.findOne({ID : course.ID});
    for (const entry of schedule.slots) {
        entry.courseName = course.code;
        entry.courseID = course.ID;
    }
    res.send(schedule);
}

const viewSlotLinkingRequests = async(req, res) => {
    const { ID, type } = req.header.user;
    const course = await Course.findOne({ coordinatorID: ID });
    if (course == null)
        return res.status(400).send("You are not a coordinator of any course");
    const requests = await Slot_Linking_Request.find({ courseID: course.ID });
    res.send(requests);
}

// body => requestID , accepted = 1 or rejected = 0
const hendleSlotLinkingRequest = async(req, res) => {
    const { ID, type } = req.header.user;
    const { requestID, decision } = req.body;
    if(decision != 0 && decision != 1)
        return res.status(400).send("Decision must either be 0 or 1");
    const request = await Slot_Linking_Request.findOne({ ID: requestID });
    if (request == null)
        return res.status(400).send("You can't handle unexisted request !");

    if (request.status != "pending")
        return res.status(400).send("The request is already handled");
    // handle rejection case
    if (decision == 0) {
        const course = await Course.findOne({ ID: request.courseID });
        const notification = new Notification({
            senderID: ID,
            receiverID: request.senderID,
            msg: "Your Slot Linking Request for the slot with ID " + request.slotID + " for the course " +
                course.code + " is rejected",
            date: Date.now(),
        });
        await notification.save();
        await Slot_Linking_Request.updateOne({ ID: requestID }, { status: "rejected" });
        res.send("The Request is rejected sucessfully !");
    }
    // handle acceptance case
    else {
        const course = await Course.findOne({ ID: request.courseID });
        const course_schedule = await Course_Schedule.findOne({ ID: request.courseID });
        let slots = course_schedule.slots.filter((elm) => elm.ID != request.slotID);
        // Assign the instructor to a course slot
        let slot = course_schedule.slots.filter((elm) => elm.ID == request.slotID);
        slot[0].instructor = request.senderID;
        slots.push(slot[0]);
        await Course_Schedule.updateOne({ ID: request.courseID }, { slots: slots });
        //....................
        const notification = new Notification({
            senderID: ID,
            receiverID: request.senderID,
            msg: "Your Slot Linking Request for the slot with ID " + request.slotID + " for the course " +
                course.code + " is accepted",
            date: Date.now(),
        });
        await notification.save();
        await Slot_Linking_Request.updateOne({ ID: requestID }, { status: "accepted" });
        res.send("The Request is accepted successfully !");
    }
}

const getMaxSlotID = (slots) => {
    let max = 0;
    if (slots.length != 0) {
        max = Math.max.apply(Math, slots.map(obj => obj.ID));
    }
    return max;
}

// body : {courseID , slot}
// slot = {slotNumber:1,day:"sunday",locationID:1,ID:2}
const createSlot = async(req, res) => {
    const {ID, type} = req.header.user;
    const { courseID, slot } = req.body;
    const isValid = validator.validateSlot(slot);
    if (isValid.error)
        return res.status(400).send({ error: isValid.error.details[0].message });

    const course = await Course.findOne({ ID: courseID });
    if (!courseID)
        return res.status(400).send("the requested course does not existed!");
    if(course.coordinatorID!= ID){
        return res.status(400).send("You have to be a coordinator of this course to do this");

    }

    const location = await Location.findOne({ID:slot.locationID});
    if(location == null)
        return res.status(400).send("This location doesn't exist");
    if(location.type == 2){
        return res.status(400).send("You can't assign a slot in an office");
    }
    
    let course_schedule = await Course_Schedule.findOne({ ID: course.ID });
    if (!course_schedule) {
        course_schedule = new Course_Schedule({
            ID: courseID,
            slots: []
        });
        await course_schedule.save();
        await Course.updateOne({ ID: course.ID }, { scheduleID: course.ID });
    }

    const newSlot = {
        ID: getMaxSlotID(course_schedule.slots) + 1,
        slotNumber: slot.slotNumber,
        day: slot.day,
        locationID: slot.locationID
    };

    course_schedule.slots.push(newSlot);
    await Course_Schedule.updateOne({ ID: course.ID }, { slots: course_schedule.slots });
    newSlot.courseName = course.code;
    res.send(newSlot);
}

const deleteSlot = async(req, res) => {
    const { ID, type } = req.header.user;
    const { courseID, slotID } = req.params;
    if (!checkings.isCourseCoordinator(ID, courseID))
        return res.status(400).send("You are not the coordinator of the requested course");

    const course_schedule = await Course_Schedule.findOne({ ID: courseID });
    let slots = course_schedule.slots.filter((elem) => elem.ID != slotID);
    if (slots.length == course_schedule.slots.length)
        return res.status(400).send("The Specified slot id already deleted");
    await Course_Schedule.updateOne({ ID: courseID }, { slots: slots });
    res.send("The Slot has been deleted sucessfully");
}

// body : slot fields to be updated
const updateSlot = async(req, res) => {
    const { ID, type } = req.header.user;
    const { courseID, slotID } = req.params;
    if (!checkings.isCourseCoordinator(ID, courseID))
        return res.status(400).send("You are not the coordinator of the requested course");
        
    if(req.body.locationID!=null){
        const location = await Location.findOne({ID:req.body.locationID});
        if(location.type == 2){
            return res.status(400).send("You can't assign a slot in an office");
        } 
    }   
    const course_schedule = await Course_Schedule.findOne({ ID: courseID });
    let oldSlot = course_schedule.slots.filter((elem) => elem.ID == slotID);
    let slots = course_schedule.slots.filter((elm) => elm.ID != slotID);
    if (req.body.slotNumber == null) req.body.slotNumber = oldSlot[0].slotNumber;
    if (req.body.day == null) req.body.day = oldSlot[0].day;
    if (req.body.locationID == null) req.body.locationID = oldSlot[0].locationID;
    if (req.body.instructor != null)
        return res.status(400).send("you are not allowed to update the instructor field !");
    const isValid = validator.validateSlot(req.body);
    if (isValid.error)
        return res.status(400).send({ error: isValid.error.details[0].message });
    if(oldSlot[0].instructor != null ) req.body.instructor = oldSlot[0].instructor;
    req.body.ID = oldSlot[0].ID;
    slots.push(req.body);
    await Course_Schedule.updateOne({ ID: courseID }, { slots: slots });
    console.log(req.body);
    res.send(req.body);
}

module.exports = {
    viewAllSlots,
    viewAllLocations,
    viewAllMembersProfiles,
    viewSlotLinkingRequests,
    hendleSlotLinkingRequest,
    createSlot,
    updateSlot,
    deleteSlot,
}