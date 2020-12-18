const Course = require('../Models/Academic/Course.js');
const Course_Schedule = require('../Models/Academic/Course_Schedule.js');
const Notification = require('../Models/Others/Notification.js');
const Slot_Linking_Request = require('../Models/Requests/Slot_Linking_Request.js');
const validator = require('../Validations/courseCoordinatorValidation.js');
const checkings = require('../utils/checkings.js');


const viewSlotLinkingRequests = async(req, res) => {
    const { ID, type } = req.header.user;
    const courseID = await Course.findOne({ coordinatorID: ID });
    const requests = await Slot_Linking_Request.find({ courseID: courseID });
    res.send(requests);
}

// body => requestID , accepted = 1 or rejected = 0
const hendleSlotLinkingRequest = async(req, res) => {
    const { ID, type } = req.header.user;
    const { requestID, decision } = req.body;
    const request = await Slot_Linking_Request.find({ ID: requestID });
    if (!request)
        return res.status(400).send("You can't handle unexisted request !");
    // handle rejection case
    if (decision == 0) {
        const notification = new Notification({
            senderID: ID,
            receiverID: request.senderID,
            msg: "Your Slot Linking Request with ID" + request.slotID + "for the course with ID" +
                request.courseID + " is rejected",
            date: Date.now(),
        });
        await notification.save();
        res.send("The Request is rejected sucessfully !");
    }
    // handle acceptance case
    else {
        const course = await Course.findOne({ ID: request.courseID });
        const course_schedule = await Course_Schedule.findOne({ ID: course.scheduleID });
        let slots = course_schedule.slots;
        // Assign the instructor to a course slot
        let slot = slots.filter((elem) => { elem.ID == slotID });
        slot.instructor = request.senderID;
        await Course_Schedule.updateOne({ Id: courseID }, { slots: slots });
        //....................
        const notification = new Notification({
            senderID: ID,
            receiverID: request.senderID,
            msg: "Your Slot Linking Request with ID" + request.slotID + "for the course with ID" +
                request.courseID + " is accepted",
            date: Date.now(),
        });
        await notification.save();
        res.send("The Request is accepted sucessfully !");
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
    const { courseID, slot } = req.body;
    const isValid = validator.validateSlot(slot);
    if (isValid.error)
        return res.status(400).send({ error: isValid.error.details[0].message });

    const course = await Course.findOne({ ID: courseID });
    if (!courseID)
        return res.status(400).send("the requested course does not existed!");

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
    res.send("Slot added sucessfully !");
}

// body : {courseID , slotID}
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
    if (!checkings.isCourseCoordinatorO(ID, courseID))
        return res.status(400).send("You are not the coordinator of the requested course");
    const course_schedule = await Course_Schedule.findOne({ ID: courseID });
    let oldSlot = course_schedule.slots.filter((elem) => elem.ID == slotID);
    let slots = course_schedule.slots.filter((elm) => elm.ID != slotID);
    if (req.body.slotNumber == null) oldSlot.slotNumber = req.body.slotNumber;
    if (req.body.day == null) oldSlot.day = req.body.day;
    if (req.body.locationID == null) oldSlot.locationID = req.body.locationID;
    if (req.body.instructor != null)
        return res.status(400).send("you are not allowed to update this field !");
    slots.push(oldSlot);
    await Course_Schedule.updateOne({ ID: courseID }, { slots: slots });
    res.send("The slot has been updated sucessfully !");
}

module.exports = {
    viewSlotLinkingRequests,
    hendleSlotLinkingRequest,
    createSlot,
    updateSlot,
    deleteSlot,
}