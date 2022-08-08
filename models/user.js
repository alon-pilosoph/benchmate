const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// Schema that represents a user, with email (username and password added with passport)
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// If username or email already exist, throw error with custom message
userSchema.post('save', function (error, user, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        if ('email' in error.keyValue) {
            return next(new Error('This email address is already registered.'));
        }
    } else {
        next(error);
    }
});

// Add passport plugin to schema
userSchema.plugin(passportLocalMongoose);
// Compile schema to model and export
module.exports = mongoose.model("User", userSchema);