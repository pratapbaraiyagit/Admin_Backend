const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  subCategoryName: {
    type: String
  },
  description: {
    type: String,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
  isActive: {
    type: Boolean,
  }
}, {
  timestamps: true
});

module.exports = new mongoose.model("subCategory", subCategorySchema);