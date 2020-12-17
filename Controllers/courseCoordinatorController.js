const { findOne } = require('../Models/Academic/Course.js');
const Course = require('../Models/Academic/Course.js');
const Course_Schedule = require('../Models/Academic/Course_Schedule.js');
const Notification = require('../Models/Others/Notification.js');
const Slot_Linking_request = require('../Models/Requests/Slot_Linking_Request.js');

const viewSlotLinkingRequests = async (req,res)=>{
    const {ID,type} = req.header.user;
    const courseID = await Course.findOne({coordinatorID : ID});
    const requests = await Slot_Linking_request.find({courseID : courseID});
    res.send(requests);
}

// body => requestID , accepted = 1 or rejected = 0
const hendleSlotLinkingRequest = async (req,res) =>{
    const {ID , type} = req.header.user;
    const {requestID , decision} = req.body;
    const request = await Slot_Linking_request.find({ID :requestID});
    if( !request )
        return res.status(400).send("You can't handle unexisted request !");
    // handle rejection case
    if(decision == 0){
        const notification = new Notification({
            senderID : ID,
            receiverID : request.senderID,
            msg : "Your Slot Linking Request with ID" + request.slotID + "for the course with ID"
                    + request.courseID + " is rejected" ,
            date : Date.now(),
        });
        await notification.save();
        res.send("The Request is rejected sucessfully !");
    }
    // handle acceptance case
    else{
        const course = await Course.findOne({ID : request.courseID});
        const slots = await Course_Schedule.findOne({ID : course.scheduleID});
        // UNCOMLETED HANDLING
        const slot = (slots.map(obj => obj.ID)).filter();
        const notification = new Notification({
            senderID : ID,
            receiverID : request.senderID,
            msg : "Your Slot Linking Request with ID" + request.slotID + "for the course with ID"
                    + request.courseID + " is accepted" ,
            date : Date.now(),
        });
        await notification.save();
        res.send("The Request is accepted sucessfully !");
    }
}

module.exports = {
    viewSlotLinkingRequests,
    hendleSlotLinkingRequest,
}