const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const ExpressError = require("../utils/ExpressError");

const Schema = mongoose.Schema;

// Schema that represents a user, with email (username and password added with passport)
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

// If email already exist, throw error with custom message
userSchema.pre("save", async function () {
  const emailExists = await User.exists({ email: this.email });
  if (emailExists) {
    throw new ExpressError("This email address is already registered.", 400);
  }
});

// Add passport plugin to schema
userSchema.plugin(passportLocalMongoose);
// Compile schema to model and export
const User = mongoose.model("User", userSchema);
module.exports = User;
