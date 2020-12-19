const mongoose = require('mongoose');

const Schema = mongoose.Schema
const MaternityLeaveRequestSchema = new Schema({
    ID : Number,
    senderID : Number,
    receiverID : Number,
    documents : String,
    submissionDate : Date,
    startDate : Date,
    endDate : Date,
    status: String,
    msg : String
});

module.exports =mongoose.model('Maternity_Leave_Request',MaternityLeaveRequestSchema);