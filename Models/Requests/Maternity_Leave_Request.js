const mongoose = require('mongoose');

const Schema = mongoose.Schema
const MaternityLeaveRequestSchema = new Schema({
    senderID : Number,
    receiverID : Number,
    documents : URL,
    submissionDate : Date,
    startDate : Date,
    endDate : Date,
});

module.exporst =mongoose.model('Sick_Leave_Request',MaternityLeaveRequestSchema);