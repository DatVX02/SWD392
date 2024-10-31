const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    regular_price: {
      type: Number,
      required: true,
    },
    sale_price: {
      type: Number,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    SKU: {
      type: String,
      required: true,
    },
    origin: {
      type: String,
    },
    rating: {
      type: Number,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    ratingBreakdown: {
      fiveStar: {
        type: Number,
        default: 0,
      },
      fourStar: {
        type: Number,
        default: 0,
      },
      threeStar: {
        type: Number,
        default: 0,
      },
      twoStar: {
        type: Number,
        default: 0,
      },
      oneStar: {
        type: Number,
        default: 0,
      },
    },
    category: {
      type: String,
      required: true,
    },
    available: {
      type: Number,
    },
    stock: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
