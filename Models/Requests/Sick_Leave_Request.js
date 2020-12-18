const mongoose = require('mongoose');

const Schema = mongoose.Schema
const SickLeaveRequestSchema = new Schema({
    senderID : Number,
    receiverID : Number,
    documents : String,
    submissionDate : Date,
    requestedDate : Date,
    status: String
});

module.exports =mongoose.model('Sick_Leave_Request',SickLeaveRequestSchema);