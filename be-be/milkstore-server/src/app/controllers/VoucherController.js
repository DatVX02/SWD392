const Voucher = require("../models/Voucher");

const createVoucher = async (req, res) => {
  try {
    const voucher = new Voucher(req.body);
    const checkExistVoucherCode = await Voucher.findOne({
      voucherCode: voucher.voucherCode,
    });
    console.log(checkExistVoucherCode);
    if (checkExistVoucherCode) {
      return res.status(400).send("Voucher code is already exists");
    }
    await voucher.save();
    res.status(201).send(voucher);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getAllVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find({});
    res.send(vouchers);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getVoucherById = async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id);
    if (!voucher) {
      return res.status(404).send("Voucher not found");
    }
    res.send(voucher);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getVoucherByVoucherCode = async (req, res) => {
  try {
    const voucher = await Voucher.findOne({
      voucherCode: req.params.voucherCode,
    });
    if (!voucher) {
      return res.status(404).send("Voucher not found");
    }
    res.send(voucher);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateVoucherById = async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id);
    if (!voucher) {
      res.status(404);
      throw new Error("Voucher not found");
    }

    const {
      voucherCode,
      voucherName,
      description,
      startDay,
      endDay,
      voucher_discount,
    } = req.body;

    voucher.voucherCode = voucherCode || voucher.voucherCode;
    voucher.voucherName = voucherName || voucher.voucherName;
    voucher.description = description || voucher.description;
    voucher.startDay = startDay || voucher.startDay;
    voucher.endDay = endDay || voucher.endDay;
    voucher.voucher_discount = voucher_discount || voucher.voucher_discount;

    const updatedVoucher = await voucher.save();
    res.status(200).json(updatedVoucher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteVoucherById = async (req, res) => {
  try {
    const voucher = await Voucher.findByIdAndDelete(req.params.id);
    if (!voucher) {
      return res.status(404).send();
    }
    res.send(voucher);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  createVoucher,
  getAllVouchers,
  getVoucherById,
  getVoucherByVoucherCode,
  updateVoucherById,
  deleteVoucherById,
};
