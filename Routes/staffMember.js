const express = require('express');
const staffMemberController = require('../Controllers/staffMemberController.js');
const app = require('../index.js');
const staffMemberRouter = express.Router();

staffMemberRouter.post('/login', staffMemberController.login);

module.exports = staffMemberRouter;