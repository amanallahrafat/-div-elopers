const mongoose = require('mongoose');

const Schema = mongoose.Schema
const CompensationLeaveRequestSchema = new Schema({
    senderID : Number,
    receiverID : Number,
    submissionDate : Date,
    requestedDate : Date,//The day he will attend
    absenceDate : Date,//The day he will be absent
    status: String
});

module.exports =mongoose.model('Compensation_Leave_Request',CompensationLeaveRequestSchema);