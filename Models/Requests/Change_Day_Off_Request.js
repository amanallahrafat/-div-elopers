const mongoose = require('mongoose');

const Schema = mongoose.Schema
const ChangeDayOffrequestSchema = new Schema({
    ID : Number,
    senderID : Number,
    receiverID : Number,
    msg : String,
    targetDayOff : String,
    submissionDate : Date,
    status: String
});

module.exports =mongoose.model('Change_Day_Off_Request',ChangeDayOffrequestSchema);