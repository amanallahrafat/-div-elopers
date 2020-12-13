const mongoose = require('mongoose');

const Schema = mongoose.Schema
const AnnualLeaveRequestSchema = new Schema({
    senderID : Number,
    receiverID : Number,
    msg : String,
    submissionDate : Date,
    requestedDate : Date,
    slot : Array, 
});

module.exports =mongoose.model('Annual_Leave_Request',AnnualLeaveRequestSchema);