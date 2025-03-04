const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const vendorSchema = new mongoose.Schema({
  name: { type: String },
  companyName: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  primaryContact: { type: String },
  phone: { type: String },
  email: { type: String },
  website: { type: String },
  locations: [
    {
      locationName: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      primaryContact: { type: String },
      phone: { type: String },
      email: { type: String },
    },
  ],
});
module.exports = mongoose.model("vendors", vendorSchema);
