const mongoose = require('mongoose');

const Schema = mongoose.Schema
const CourseScheduleSchema = new Schema({
    ID : {type:Number , unique:true , required:true},
    slots : Array, 
//    Array[{"slotNumber":Number,
//     "day":String,
//     "location:locationID",
//     "instructor":"instructor"
//   }]

});

module.exporst =mongoose.model('Course_Schedule',CourseScheduleSchema);