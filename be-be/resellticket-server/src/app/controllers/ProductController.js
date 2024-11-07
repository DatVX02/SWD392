const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");
const ProductStatus = require("../../enum/ProductStatusEnum");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Create a new product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      brand,
      SKU,
      stock,
      regular_price,
      sale_price,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const image = req.file.path;

    const product = new Product({
      name,
      description,
      category,
      brand,
      SKU,
      stock,
      available: stock,
      regular_price,
      sale_price,
      image,
      status: ProductStatus.COMING_SOON,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const {
      name,
      regular_price,
      sale_price,
      brand,
      description,
      SKU,
      category,
      stock,
    } = req.body;

    product.name = name || product.name;
    product.image = req.file.path || product.image;
    product.regular_price = regular_price || product.regular_price;
    product.sale_price = sale_price || product.sale_price;
    product.brand = brand || product.brand;
    product.description = description || product.description;
    product.SKU = SKU || product.SKU;
    product.category = category || product.category;
    product.stock = stock || product.stock;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    await product.remove();
    res.status(200).json({ message: "Product removed" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  upload,
};
