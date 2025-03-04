const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const purchaseOrderSchema = new mongoose.Schema({
  purchaseType: { type: String },
  vendor: { type: String },
  vendorSales: { type: String },
  PO: { type: String },
  purchaseStatus: { type: String },
  notes: { type: String },
});
module.exports = mongoose.model("purchaseOrders", purchaseOrderSchema);
