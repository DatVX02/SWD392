// controllers/cartController.js

const asyncHandler = require("express-async-handler");
const Cart = require("../models/Cart");

const getCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    res.json(cart);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

const addToCart = asyncHandler(async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      const index = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );
      if (index !== -1) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

const updateCartItem = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(400).json({ msg: "Cart not found" });
    }

    const index = cart.items.findIndex(
      (item) => item.productId._id.toString() === productId
    );
    if (index !== -1) {
      cart.items[index].quantity = quantity;
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

const removeCartItem = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(400).json({ msg: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
