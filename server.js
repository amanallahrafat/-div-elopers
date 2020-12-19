const mongoose = require('mongoose');
const app = require('./index.js');
const periodic = require('./periodic.js');

mongoose.connect("mongodb+srv://team9:team9@cluster0.j2oep.mongodb.net/gucDB?retryWrites=true&w=majority")
.then(()=>{
    app.listen(3000);
    console.log("Server is UP");
    periodic.loop_month(0);
   // periodic.loop_year();
})
.catch((err)=>{
    console.log(err);
})
