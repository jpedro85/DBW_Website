// Importing mongoose
const mongoose = require("mongoose");
// Importing passportLocal extension for mongoose
const passportLocalMongoose = require("passport-local-mongoose");

// The schema that our user gonna have in the database
var userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
});

// Adds the username and password to the schema
userSchema.plugin(passportLocalMongoose);

// Creates a model called User using UserSchema ands exports it
module.exports = mongoose.model("User", userSchema);

