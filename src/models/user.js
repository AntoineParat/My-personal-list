// const mongoose = require('mongoose');
// var validator = require('validator');
// const bcrypt =require('bcryptjs');
// const jwt = require('jsonwebtoken');

// const Schema = mongoose.Schema;
// const UserSchema = new Schema(
//     {
//         name : {type : String, required : false, trim : true },
//         age : {type : Number, validate (value) { // setup a custom validator
//             if(value < 0) {throw new Error('age must be > 0')}
//         }},
//         email : {type : String, required : true, trim : true, lowercase : true, validate(value) {
//             if(!validator.isEmail(value)) {throw new Error('must provide valide email')}
//         }},
//         password : {type : String, required : true, minlength : [6], trim : true}
//     } 
// );

// UserSchema.pre('save', async function (next) {// must not use arrow function because of 'this' binding
//     //'this' means 'document'
//     if(this.isModified('password')) { // it will be true when password creation and update
//         const hashedPassword = await bcrypt.hash(this.password, 8);
//         this.password = hashedPassword;
//     }

//     console.log('this will be saved')
//     next()
// })

// //Creating my own method to generate token
// UserSchema.methods.generateToken = async function () { //.methods is applied on individual instance

//     const token = await jwt.sign({ _id : this._id}, 'anycharacterisgood', { expiresIn : '24h'});
    
//     //this.tokens = this.tokens.concat({token : token});
//     await this.save()
//     return token
//  }

//  //Creating my own method to login users
//  UserSchema.statics.findByCredentials = async (mail, password) => { // .statics is applied on global Schema
//      const user = await User.findOne({email : mail});
//      if(!user) {
//          throw new Error('unable to login')
//      }
//      const checkPass = await bcrypt.compare(password, user.password)
//      if(!checkPass) {
//          throw new Error('unable to login')
//      }
//      return user
//  }
 


// UserSchema.pre('remove', async function (next) {
    
//     console.log('this will be removed')
//     next()
// })

// const User = mongoose.model('user', UserSchema);

// module.exports = User

const mongoose = require('mongoose');
var validator = require('validator');
const bcrypt =require('bcryptjs');
const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema;
const UserSchema = new Schema(
    {
        name : {type : String, required : false, trim : true },
        age : {type : Number, validate (value) { // setup a custom validator
            if(value < 0) {throw new Error('age must be > 0')}
        }},
        email : {type : String, required : true, unique : true, trim : true, lowercase : true, validate(value) {
            if(!validator.isEmail(value)) {res.send({error : "Adresse mail non valide"})}
        }},
        password : {type : String, required : true, minlength : [6], trim : true},   
        avatar : {type : Buffer},
    } 
);

//Creating my own method to login users
UserSchema.statics.findByCredentials = async (mail, password) => { // .statics is applied on global Schema
    const user = await User.findOne({email : mail});
    if(!user) {
        throw new Error('unable to login')
    }
    const checkPass = await bcrypt.compare(password, user.password)
    if(!checkPass) {
        throw new Error('unable to login')
    }
    return user
}

// UserSchema.methods.getPublicProfile = function () {

// }

//Creating my own method to generate token
UserSchema.methods.generateToken = async function () { //.methods is applied on individual instance

   const token = await jwt.sign({ _id : this._id}, process.env.JWT_SECRET, { expiresIn : '24h'});
   
   await this.save()
   return token
}

//Hash password before saving user with middleware
UserSchema.pre('save', async function (next) {// must not use arrow function because of 'this' binding
    //'this' means 'document'
    if(this.isModified('password')) { // it will be true when password creation and update
        const hashedPassword = await bcrypt.hash(this.password, 8);
        this.password = hashedPassword;
        console.log('passord (re)set')
    }
     next()
})

//before removing user
UserSchema.pre('remove', async function (next) {
    
    console.log('this will be removed')
    next()
})

const User = mongoose.model('user', UserSchema);

module.exports = User