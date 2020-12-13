const mongoose = require('mongoose');

const Schema = mongoose.Schema
const AccidentalLeaveRequestSchema = new Schema({
    senderID : Number,
    receiverID : Number,
    msg : String,
    submissionDate : Date,
    requestedDate : Date,
});

module.exporst =mongoose.model('Accidental_Leave_Request',AccidentalLeaveRequestSchema);