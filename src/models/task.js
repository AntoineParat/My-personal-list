const mongoose = require('mongoose');
// var validator = require('validator');
const Schema = mongoose.Schema;

const TaskSchema = new Schema (
    { 
        description : {type : String, required : true, trim : true },
        completed : {type : Boolean, default : false},
        id : {type : String, required : true},
    },
    {
        timestamps : true
    }
);
TaskSchema.index({description : "text"});


const Task = mongoose.model('Task', TaskSchema);

module.exports = Task