const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

UserSchema.methods.removeToken = function(token) {
    //$pull lets you remove items from an array that match certain criteria
    var user = this;

    return user.updateOne({
        $pull:{
            tokens: {token}
        }
    })
};

//statics is to create a model method
UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
    
    try{
        decoded = jwt.verify(token, 'abc123')
    }catch (e){
        // return new Promise((resolve, reject) => {
        //     reject();
        // })
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        
        //querying a nested document
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function (email, password){
    var User = this;

    return User.findOne({email}).then((user) => {
        if(!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(res){
                    resolve(user);
                }else {
                    reject();
                }
            });
        });
    });
};

UserSchema.pre('save', function (next){
    var user = this;

    //returns true if password is modified
    //we need the encryption to run if the password is modified
    if(user.isModified('password')){
        bcrypt.genSalt(10, (err,salt) =>{
            bcrypt.hash(user.password,salt, (err, hash) =>{
                user.password = hash;
                next();
            });
        })
    }else{
        next();
    }
});

//defining the user model with the required properties
var User = mongoose.model('Users',UserSchema);

module.exports = {User};