const mongoose = require('mongoose');

const Schema = mongoose.Schema
const ChangeDayOffrequestSchema = new Schema({
    senderID : Number,
    receiverID : Number,
    targetDayOff : String,
    submissionDate : Date,
});

module.exporst =mongoose.model('Change_Day_Off_Request',ChangeDayOffrequestSchema);