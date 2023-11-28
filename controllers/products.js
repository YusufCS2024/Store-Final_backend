const { Product } = require("../models/Product");
const { Invoice } = require("../models/Invoice");
const cloudinary = require("../utils/cloudinary");
const path = require("path");

const multer = require("multer");
const fileUpload = multer();
// const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

async function addProduct(req, res) {
  try {
    let product;
    if (req.file) {
      let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          });
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };
      let result = await streamUpload(req);
      product = new Product({
        labelId: req.body.labelId,
        name: req.body.name.trimRight(),
        category: req.body.category.trimRight(),
        netPrice: req.body.netPrice,
        sellPrice: req.body.sellPrice,
        stock: req.body.stock,
        image: result.secure_url,
      });
    } else {
      product = new Product({
        labelId: req.body.labelId,
        name: req.body.name.trimRight(),
        category: req.body.category.trimRight(),
        netPrice: req.body.netPrice,
        sellPrice: req.body.sellPrice,
        stock: req.body.stock,
      });
    }
    await product.save();
    return res.status(200).json("success");
  } catch (error) {
    console.log(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function getProducts(req, res) {
  try {
    let products = await Product.find();
    if (!products) {
      return res.status(404).json("No Products found");
    }
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function getProduct(req, res) {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json("not found");
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function getCatProd(req, res) {
  try {
    let products = await Product.find({ category: req.params.category });
    if (!products) {
      return res.status(404).json("No Products found");
    }
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function getCategories(req, res) {
  try {
    const categories = await Product.distinct("category");
    if (!categories) {
      return res.status(404).json("No Products found");
    }
    return res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function checkout(req, res) {
  try {
    let cart = req.body;
    let discount = cart.discount;
    let total = cart.discountedTotal;
    let netPrice = cart.totalNetPrice;
    delete cart.discount;
    delete cart.discountedTotal;
    delete cart.totalNetPrice;
    let productsArray = [];
    for (var item in cart) {
      let product = await Product.findById(cart[item].product._id);
      if (!product) {
        return res.status(400).json("something went wrong");
      }
      // netPrice += product.netPrice;
      product.stock = product.stock - cart[item].quantity;
      await product.save();
      cart[item].product.quantity = cart[item].quantity;
      productsArray.push(cart[item].product);
    }
    const invoice = new Invoice({
      products: productsArray,
      totalPrice: total,
      netPrice: netPrice,
      discount: discount ? discount : 0,
      profit: total - netPrice,
    });
    await invoice.save();
    return res.status(200).json("ok");
  } catch (error) {
    console.log(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function deleteProduct(req, res) {
  try {
    console.log(req.params.id);
    let product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json("not found");
    return res.status(200).json("deleted");
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function updateProduct(req, res) {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json("not found");
    let updateProduct = {
      labelId: req.body.labelId,
      name: req.body.name,
      netPrice: req.body.netPrice,
      sellPrice: req.body.sellPrice,
      stock: req.body.stock,
    };
    await product.updateOne(updateProduct);
    return res.status(200).json("Updated");
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

module.exports = {
  addProduct,
  getProducts,
  getCategories,
  getCatProd,
  checkout,
  getProduct,
  deleteProduct,
  updateProduct,
};
