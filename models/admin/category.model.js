const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String
  },
  description: {
    type: String,
  },
  isActive: {
    type: Boolean,
  }
}, {
  timestamps: true
});

module.exports = new mongoose.model("category", categorySchema);
