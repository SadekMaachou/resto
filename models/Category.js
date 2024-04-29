const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name for the category"],
    unique: true,
  },
  group: {
    type: String,
    required: [true, "Pleas enter a group for the category"],
  },
  image: {
    type: String,
    required: [true, "Pleas enter a photo for the category"],
  },
});

categorySchema.post("save", function (doc, next) {
  console.log("new category was added", doc);
  next();
});

const Category = mongoose.model("category", categorySchema);
module.exports = Category;
