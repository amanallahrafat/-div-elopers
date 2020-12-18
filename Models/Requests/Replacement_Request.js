const mongoose = require('mongoose');

const Schema = mongoose.Schema
const ReplacementRequestSchema = new Schema({
    senderID : Number,
    receiverID : Number,
    submissionDate : Date,
    requestedDate : Date,
    slotID : Number,
    courseID: Number,
    status: String
});

module.exports =mongoose.model('Replacement_Request',ReplacementRequestSchema);