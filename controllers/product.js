const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id).exec((err, prod) => {
    if (err || !prod) {
      return res.status(400).json({
        err: "Not able to find the product in DB",
      });
    }
    req.product = prod;
    next();
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.status(200).json(req.product);
};

exports.createProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) return res.status.json({ err: "Problem with image" });

    const { name, description, price, category, stock } = fields;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({ err: "Please include all fields" });
    }

    let product = new Product(fields);

    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({ err: "file size too big" });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    product.save((err, prod) => {
      if (err || !prod) {
        return res.status(400).json({ err: "failed to save photo in DB" });
      }
      res.json(prod);
    });
  });
};

exports.getAllProducts = (req, res) => {
 let limit = req.query.limit ? parseInt(req.query.limit) : 8
 let sortby = req.query.sort || "_id";
  Product.find({})
  .select("-photo")
  .populate("category")
  .sort([[sortby, "asc"]])
  .limit(limit)
  .exec((err, prod) => {
    if (err || !prod) {
      return res.status(400).json({ msg: "Failed to get all products !!" });
    }
    return res.json(prod);
  });
};

exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(400).json({ err: "problem with image" });

    // Updation Code
    let product = req.product;
    product = _.extend(product, fields);

    product.photo.data = fs.readFileSync(file.photo.path);
    product.photo.contentType = file.photo.type;

    product.save((err, prod) => {
      if (err || !prod) {
        return res.status(400).json({ err: "failed to update in DB" });
      }
      return res.json(prod);
    });
  });
};

exports.deleteProduct = (req, res) => {
  const product = req.product;
  product.remove((err, prod) => {
    if (err || !prod) {
      return res.status(400).json({ msg: "Failed to delete the product !!" });
    }
    return res.json({
      err: "Deleted product successfully !!",
    });
  });
};

// middleware
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};
