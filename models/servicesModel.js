const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const serviceSchema = new mongoose.Schema({
  ticketId: { type: String },
  manualId: { type: String },
  ticketStatus: { type: String },
  to: { type: String },
  dateOfOrder: { type: String },
  contactName: { type: String },
  tel: { type: String },
  createdBy: { type: String },
  assignedTo: { type: String },
  customerOrderNo: { type: String },
  startDate: { type: String },
  jobName: { type: String },
  jobLocation: { type: String },
  invoiceDate: { type: String },
  terms: { type: String },
  description: { type: String },
  laborArr: [
    {
      id: { type: String },
      laborHours: { type: Number },
      rate: { type: Number },
      amount: { type: Number },
      description: { type: String },
      taxStatus: { type: String },
    },
  ],
  totalLabor: { type: Number },
  materialArr: [
    {
      id: { type: String },
      materialQuantity: { type: Number },
      rate: { type: Number },
      amount: { type: Number },
      description: { type: String },
      taxStatus: { type: String },
    },
  ],
  totalMaterail: { type: Number },
  total: { type: Number },
  remaining: { type: Number },
  payments: [
    {
      date: { type: String },
      paymentType: { type: String },
      checkNo: { type: String },
      payment: { type: Number },
      amount: { type: Number },
      remainingAmount: { type: Number },
      note: { type: String },
    },
  ],
  attachments: [
    {
      files: [
        {
          fileUrl: { type: String },
          filename: { type: String },
        },
      ],
      user: { type: String },
      date: { type: String },
      time: { type: String },
      note: { type: String },
    },
  ],
  signature: {
    fileUrl: { type: String },
    filename: { type: String },
    default: {},
  },
});
module.exports = mongoose.model("services", serviceSchema);
