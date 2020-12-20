const mongoose = require('mongoose');

const Schema = mongoose.Schema
const SickLeaveRequestSchema = new Schema({
    ID: Number,
    senderID : Number,
    receiverID : Number,
    documents : String,
    submissionDate : Date,
    requestedDate : Date,
    status: String,
    msg : String,
});

module.exports =mongoose.model('Sick_Leave_Request',SickLeaveRequestSchema);