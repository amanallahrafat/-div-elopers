const mongoose = require('mongoose');

const Schema = mongoose.Schema
const SlotLinkingRequestSchema = new Schema({
    ID : Number,
    senderID : Number,
    receiverID : Number,
    courseID : Number,
    status : String,
    slotID : Number
});

module.exports = mongoose.model('Slot_Linking_request',SlotLinkingRequestSchema);