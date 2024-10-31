const express = require("express");
const voucherRouter = express.Router();
const {
  createVoucher,
  deleteVoucherById,
  getAllVouchers,
  getVoucherById,
  updateVoucherById,
  getVoucherByVoucherCode,
} = require("../app/controllers/VoucherController");
const {
  validateTokenStaff,
  validateToken,
} = require("../app/middleware/validateTokenHandler");

voucherRouter.post("/", validateTokenStaff, createVoucher);

voucherRouter.get("/", validateToken, getAllVouchers);

voucherRouter.get("/:id", validateToken, getVoucherById);

voucherRouter.get(
  "/voucherCode/:voucherCode",
  validateToken,
  getVoucherByVoucherCode
);

voucherRouter.patch("/:id", validateTokenStaff, updateVoucherById);

voucherRouter.delete("/:id", validateTokenStaff, deleteVoucherById);

module.exports = voucherRouter;
