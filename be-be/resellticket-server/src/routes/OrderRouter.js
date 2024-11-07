const express = require("express");
const orderRouter = express.Router();
const {
  createOrder,
  getOrders,
  getOrderByOrderId,
  updateOrderStatus,
  getOrdersOfUser,
  getOrderStatistics,
  createOrderWithoutAccount,
} = require("../app/controllers/OrderController");
const { validateToken } = require("../app/middleware/validateTokenHandler");

orderRouter.get("/", validateToken, getOrders);

orderRouter.get("/history", validateToken, getOrdersOfUser);

orderRouter.get("/statistics", validateToken, getOrderStatistics);

orderRouter.get("/:orderId", validateToken, getOrderByOrderId);

orderRouter.post("/", validateToken, createOrder);

orderRouter.post("/withoutAccount", createOrderWithoutAccount);

orderRouter.put("/:orderId", validateToken, updateOrderStatus);

module.exports = orderRouter;
