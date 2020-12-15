const mongoose = require('mongoose');

const Schema = mongoose.Schema
const BlackListedTokenSchema = new Schema({
   token : String
});

module.exports = mongoose.model('BlackListedToken',BlackListedTokenSchema);