const mongoose = require("mongoose");
const defaultImage = require('../config/defaultImage');

var userSchema = mongoose.Schema({
  username: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  status: {
    type: String,
    enum: ["Pending", "Active"],
    default: "Pending",
  },
  confirmationCode: {
    type: String,
    unique: true,
  },
  profileImage:{
    type: String,
    default:defaultImage,
  }
});

module.exports =  mongoose.model("User", userSchema);

