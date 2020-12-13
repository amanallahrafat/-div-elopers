const mongoose = require('mongoose');

const Schema = mongoose.Schema
const MaternityLeaveRequestSchema = new Schema({
    senderID : Number,
    receiverID : Number,
    documents : String,
    submissionDate : Date,
    startDate : Date,
    endDate : Date,
});

module.exports =mongoose.model('Maternity_Leave_Request',MaternityLeaveRequestSchema);