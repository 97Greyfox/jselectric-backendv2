const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const timeTrackSchema = new mongoose.Schema({
  employee: { type: String },
  jobDescription: { type: String },
  notes: { type: String },
  phase: { type: String },
  date: { type: String },
  startTime: { type: String },
  endTime: { type: String },
  spectrum: { type: Boolean },
  lunch: { type: Boolean },
  lunchTime: { type: String },
  user: { type: String },
  reimbursalFlag: { type: String },
  reimbursal: [
    {
      reimbursalType: { type: String },
      amount: { type: String },
      note: { type: String },
    },
  ],
});
module.exports = mongoose.model("timeTracks", timeTrackSchema);
