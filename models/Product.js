const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
  {
    labelId: {
      type: String,
      default: "لا يوجد",
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    netPrice: {
      type: Number,
      required: true,
    },
    sellPrice: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dehopk28l/image/upload/v1700271148/samples/ecommerce/accessories-bag.jpg",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

exports.Product = Product;
