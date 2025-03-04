const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const manpowerSchema = new mongoose.Schema({
  job: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  shiftStartTime: { type: String },
  shiftEndTime: { type: String },
  notes: { type: String },
  days: {
    monday: { type: Boolean },
    tuesday: { type: Boolean },
    wednesday: { type: Boolean },
    thursday: { type: Boolean },
    friday: { type: Boolean },
    saturday: { type: Boolean },
    sunday: { type: Boolean },
  },
  requiredEmp: {
    foreman: {
      noOfEmp: { type: Number },
    },
    journeyman: { noOfEmp: { type: Number } },
    apprentice: { noOfEmp: { type: Number } },
    construction: { noOfEmp: { type: Number } },
  },
  assignedEmp: {
    foreman: { noOfEmp: { type: Number }, employees: [{ type: Object }] },
    journeyman: { noOfEmp: { type: Number }, employees: [{ type: Object }] },
    apprentice: { noOfEmp: { type: Number }, employees: [{ type: Object }] },
    construction: { noOfEmp: { type: Number }, employees: [{ type: Object }] },
  },
  workingEmp: {
    foreman: { noOfEmp: { type: Number }, employees: [{ type: Object }] },
    journeyman: { noOfEmp: { type: Number }, employees: [{ type: Object }] },
    apprentice: { noOfEmp: { type: Number }, employees: [{ type: Object }] },
    construction: { noOfEmp: { type: Number }, employees: [{ type: Object }] },
  },
});
module.exports = mongoose.model("manpowers", manpowerSchema);
