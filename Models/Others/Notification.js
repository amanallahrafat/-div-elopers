const mongoose = require('mongoose');

const Schema = mongoose.Schema
const NotificationSchema = new Schema({
    senderID : Number,
    receiverID : Number,
    msg : String,
    date : Date,
});

module.exports =mongoose.model('Notification',NotificationSchema);