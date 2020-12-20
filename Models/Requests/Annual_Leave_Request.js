const mongoose = require('mongoose');

const Schema = mongoose.Schema
const AnnualLeaveRequestSchema = new Schema({
    ID : Number,
    senderID : Number,
    receiverID : Number,
    msg : String,
    submissionDate : Date,
    requestedDate : Date,
    replacementRequestsID : Array,
    status: String,
});

module.exports =mongoose.model('Annual_Leave_Request',AnnualLeaveRequestSchema);