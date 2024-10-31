const express = require("express");
const cartRouter = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} = require("../app/controllers/CartController");
const { validateToken } = require("../app/middleware/validateTokenHandler");

cartRouter.get("/", validateToken, getCart);

cartRouter.post("/", validateToken, addToCart);

cartRouter.put("/:productId", validateToken, updateCartItem);

cartRouter.delete("/:productId", validateToken, removeCartItem);

module.exports = cartRouter;
