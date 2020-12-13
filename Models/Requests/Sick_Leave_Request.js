const mongoose = require('mongoose');

const Schema = mongoose.Schema
const SickLeaveRequestSchema = new Schema({
    senderID : Number,
    receiverID : Number,
    documents : URL,
    submissionDate : Date,
    requestedDate : Date,
});

module.exporst =mongoose.model('Sick_Leave_Request',SickLeaveRequestSchema);