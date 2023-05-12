const mongoose = require("mongoose");

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
});

module.exports =  mongoose.model("User", userSchema);

