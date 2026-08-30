const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Get all products (with optional search & category filter)
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};
  const category = req.query.category ? { category: req.query.category } : {};

  const products = await Product.find({ ...keyword, ...category }).sort({ createdAt: -1 });
  res.json(products);
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock, imageUrl } = req.body;

  if (!name || !description || !price || !category) {
    res.status(400);
    throw new Error('Please provide name, description, price, and category');
  }

  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock: stock || 0,
    imageUrl,
  });

  res.status(201).json(product);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const { name, description, price, category, stock, imageUrl } = req.body;

  product.name = name ?? product.name;
  product.description = description ?? product.description;
  product.price = price ?? product.price;
  product.category = category ?? product.category;
  product.stock = stock ?? product.stock;
  product.imageUrl = imageUrl ?? product.imageUrl;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.json({ message: 'Product removed successfully' });
});

// @desc    Get all unique categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories);
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
};
