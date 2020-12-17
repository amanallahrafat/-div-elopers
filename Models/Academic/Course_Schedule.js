const mongoose = require('mongoose');

const Schema = mongoose.Schema
const CourseScheduleSchema = new Schema({
    ID: { type: Number, unique: true, required: true }, // as same as the courseID
    slots: Array,
    //    Array[{
    //  "ID": Number,
    // "slotNumber":Number,
    //     "day":String,
    //     "location:locationID",
    //     "instructor":"instructor" // Can be a Doctor(i.e. instructor) or Teaching Staff memeber.
    //   }]

});

module.exports = mongoose.model('Course_Schedule', CourseScheduleSchema);

// export class slot {
//     constructor(slotNumber, day, location, instructor, ID) {
//         this.ID = ID;
//         this.slotNumber = slotNumber;
//         this.day = day;
//         this.location = location;
//         this.instructor = instructor;
//     }
// }