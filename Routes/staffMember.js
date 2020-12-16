const staffMemberController = require('../Controllers/staffMemberController.js');
const authorization = require('../Authorization/auth.js'); 
const express = require('express');
const staffMemberRouter = express.Router();

staffMemberRouter.post('/login', staffMemberController.login);
staffMemberRouter.post('/logout', authorization.authStaffMember,staffMemberController.logout);

module.exports = staffMemberRouter;