"use strict";

var mongoose = require('mongoose');

var app = require('./index.js');

var periodic = require('./periodic.js');

mongoose.connect("mongodb+srv://team9:team9@cluster0.j2oep.mongodb.net/gucDB?retryWrites=true&w=majority").then(function () {
  app.listen(3000);
  console.log("Server is UP"); //periodic.loop_month(0);
  // periodic.loop_year();

  periodic.setAnnualLeaveBalance();
})["catch"](function (err) {
  console.log(err);
});