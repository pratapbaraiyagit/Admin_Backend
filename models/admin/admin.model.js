const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  profileImage: {
    type: String,
    default: null
  },
  fullName: {
    type: String
  },
  email: {
    type: String,
    unique: true
  },
  phoneNumber: {
    type: Number
  },
  password: {
    type: String
  },
  otpCode: {
    type: Number,
    default: null
  },
  otpExpireIn: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
});

module.exports = new mongoose.model("admin", adminSchema);
