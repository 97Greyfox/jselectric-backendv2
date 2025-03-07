const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const clientsSchema = new mongoose.Schema({
  customerCode: { type: String },
  customerName: { type: String },
  alphaCode: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  phone: { type: String },
  fax: { type: String },
  primaryContact: { type: String },
  primaryEmail: { type: String },
  secondaryEmail: { type: String },
  customerType: { type: String },
  balance: { type: String },
  taxable: { type: String },
  status: { type: String },
  customerTerm: { type: String },
  taxCode: { type: String },
  retailCertificate: { type: String },
  resaleExpDate: { type: String },
  salesPersonCode: { type: String },
  receiveStatements: { type: String },
  financeCharge: { type: String },
  retention: { type: String },
  lastDateBilled: { type: String },
  lastDatePaid: { type: String },
  dateEstablished: { type: String },
  creditLimit: { type: String },
  materialLevel: { type: String },
  laborLevel: { type: String },
  attachments: [
    {
      files: [
        {
          fileUrl: { type: String },
          filename: { type: String },
        },
      ],
      date: { type: String },
      user: { type: String },
      note: { type: String },
      attachmentCategories: { type: String },
    },
  ],
  invoices: [
    {
      invoiceDate: { type: String },
      jobId: { type: String },
      invoice: { type: String },
      originalAmount: { type: Number },
      totalAmount: { type: Number },
      retentionAmount: { type: Number },
      retentionStartDate: { type: String },
      nonRetentionAmount: { type: Number },
      zeroDaysAmount: { type: Number },
      thirtyDaysAmount: { type: Number },
      sixtyDaysAmount: { type: Number },
      ninetyDaysAmount: { type: Number },
      auditDate: { type: String },
      lastStatementDate: { type: String },
      notes: { type: String },
      paid: { type: String },
      remainingAmount: { type: Number },
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
      attachments: {
        files: [
          {
            fileUrl: { type: String },
            filename: { type: String },
          },
        ],
      },
    },
  ],
});
module.exports = mongoose.model("clients", clientsSchema);
