const mongoose = require('mongoose');

const Schema = mongoose.Schema
const CompensationLeaveRequestSchema = new Schema({
    ID : Number,
    senderID : Number,
    receiverID : Number,
    submissionDate : Date,
    requestedDate : Date,
    absenceDate : Date,
    status: String
});

module.exports =mongoose.model('Compensation_Leave_Request',CompensationLeaveRequestSchema);