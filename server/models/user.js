const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

//will store the properties for the user
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,

        //ensures that the password doesnt exist
        unique: true,

        //third party library called validator has this method
        validate: {
            //passes true if the email is valid
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
       }
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

   //tokens is an array; can only be done using mongodb
   //syntax is given by mongoose
   //properties/attributes that are available for a token is access and token
    tokens: [{
        access:{
            type: String,
            required: true
        },
        token:{
            type: String,
            required: true
        }
    }]
});

//overriding a method so that user sensitive details are not sent back to the user
UserSchema.methods.toJSON = function (){
    var user = this;

    //responsible for taking the mongoose variables and converting it to regular object
    //where onlyt he properties that are available on the document exist
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}

//instance method
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    //this returns an object; because of that to string method is used
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString(); 
    
    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(( ) => {
        return token;
    });
};


//defining the user model with the required properties
var User = mongoose.model('Users',UserSchema);

module.exports = {User};