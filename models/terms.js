const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const termsschema = new mongoose.Schema({
  name: { type: String },
  shortCode: { type: String },
});
module.exports = mongoose.model("terms", termsschema);
