const express = require("express");
const productRouter = express.Router();
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  upload,
} = require("../app/controllers/ProductController");
const asyncHandler = require("express-async-handler");
const {
  validateTokenStaff,
} = require("../app/middleware/validateTokenHandler");

// Create a new product
productRouter.post(
  "/",
  validateTokenStaff,
  upload.single("image"),
  asyncHandler(createProduct)
);

// Update an existing product
productRouter.put(
  "/:id",
  validateTokenStaff,
  upload.single("image"),
  asyncHandler(updateProduct)
);

// Delete a product
productRouter.delete("/:id", validateTokenStaff, asyncHandler(deleteProduct));

// Get all products
productRouter.get("/", asyncHandler(getAllProducts));

// Get a product by ID
productRouter.get("/:id", asyncHandler(getProductById));

module.exports = productRouter;
