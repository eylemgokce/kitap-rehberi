const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Book", bookSchema);
