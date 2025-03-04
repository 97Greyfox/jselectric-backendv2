const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const trainingSchema = new mongoose.Schema({
  trainingCategory: { type: String },
  trainingType: { type: String },
  trainingId: { type: String },
  dateAdded: { type: String },
  addedBy: { type: String },
  title: { type: String },
  description: { type: String },
  attachments: [
    {
      fileUrl: { type: String },
      filename: { type: String },
    },
  ],
  videos: [
    {
      id: { type: String },
      url: { type: String },
    },
  ],
});
// trainingSchema.plugin(validator);
module.exports = mongoose.model("trainings", trainingSchema);
