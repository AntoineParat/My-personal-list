const mongoose = require('mongoose');
//var validator = require('validator');

mongoose.connect(process.env.MONGOOSE_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
})

//MOVED TO SPECIFIC MODELS' FOLDER

// const Users = mongoose.model('Users', { 
//     name : {type : String, required : true, trim : true },
//     age : {type : Number, validate (value) { // setup a custom validator
//         if(value < 0) {throw new Error('age must be > 0')}
//     }},
//     email : {type : String, required : true, trim : true, lowercase : true, validate(value) {
//         if(!validator.isEmail(value)) {throw new Error('must provide valide email')}
//     }},
//     password : {type : String, required : true, minlength : [6], trim : true, validate(value) {
//         if (!validator.contains(value,'password')) {throw new Error ('must contains password')}
//     } }
// });

// const user1 = new Users({name :"robert", age :46, email : "robert@gmail.com", password : "RobertopassWOrd12"});
// user1.save().then(() => console.log(user1));

// const tasks = mongoose.model('tasks', {
//     description : {type : String, required : true, trim : true },
//     completed : {type : Boolean, default : false},
// })

// const task1 = new tasks({
//     description : "clean the house",
//     completed : true
// })

// task1.save().then(() => console.log(task1))