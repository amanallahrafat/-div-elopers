const mongoose = require('mongoose');

const Schema = mongoose.Schema
const SlotLinkingRequestSchema = new Schema({
    ID : Number,
    senderID : Number,
    receiverID : Number,
    courseID : Number,
    slotID : Number,
    status : String,
});

module.exports = mongoose.model('Slot_Linking_request',SlotLinkingRequestSchema);