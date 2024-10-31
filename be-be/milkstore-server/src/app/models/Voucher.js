const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema({
  voucherCode: {
    type: String,
    required: true,
  },
  voucherName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDay: {
    type: Date,
    required: true,
  },
  endDay: {
    type: Date,
    required: true,
  },
  voucher_discount: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Voucher", voucherSchema);
