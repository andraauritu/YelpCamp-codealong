const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true //this sets up a unique index in mongodb
    }
});

UserSchema.plugin(passportLocalMongoose); //this is going to add to our schema a username and password field, and it will make sure that the username is unique
///////////////////////////////////////////it will also give us some additional methods that we can use

module.exports = mongoose.model('User', UserSchema); 
