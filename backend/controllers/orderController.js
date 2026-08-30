const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order (checkout)
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Verify products exist and calculate prices
  const orderItems = [];
  let itemsPrice = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.product}`);
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for: ${product.name}`);
    }
    orderItems.push({
      product: product._id,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      quantity: item.quantity,
    });
    itemsPrice += product.price * item.quantity;
    // Decrement stock
    product.stock -= item.quantity;
    await product.save();
  }

  const shippingPrice = itemsPrice > 500 ? 0 : 50;
  const totalPrice = itemsPrice + shippingPrice;

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'Cash on Delivery',
    itemsPrice,
    shippingPrice,
    totalPrice,
  });

  res.status(201).json(order);
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Allow only owner or admin
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json(order);
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const { status } = req.body;
  const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status value');
  }

  order.status = status;
  if (status === 'Delivered') {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.deliveredAt = Date.now();
  }

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// @desc    Cancel order (user)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (!['Pending', 'Processing'].includes(order.status)) {
    res.status(400);
    throw new Error('Cannot cancel order that has already been shipped or delivered');
  }

  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
  }

  order.status = 'Cancelled';
  await order.save();
  res.json({ message: 'Order cancelled successfully', order });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};
