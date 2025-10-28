const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const sendEmail = require('../config/email');
const { orderStatusEmail } = require('../utils/emailTemplates');
const checkLowStock = require('../utils/stockChecker');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { pizza, totalPrice, paymentId } = req.body;

    // Create order
    const order = await Order.create({
      user: req.user._id,
      pizza,
      totalPrice,
      paymentId,
      paymentStatus: 'completed',
      statusHistory: [{
        status: 'Order Received',
        timestamp: Date.now()
      }]
    });

    // Update inventory
    const updatePromises = [];
    
    // Update base
    updatePromises.push(
      Inventory.findOneAndUpdate(
        { category: 'base', name: pizza.base },
        { $inc: { quantity: -1 } }
      )
    );
    
    // Update sauce
    updatePromises.push(
      Inventory.findOneAndUpdate(
        { category: 'sauce', name: pizza.sauce },
        { $inc: { quantity: -1 } }
      )
    );
    
    // Update cheese
    updatePromises.push(
      Inventory.findOneAndUpdate(
        { category: 'cheese', name: pizza.cheese },
        { $inc: { quantity: -1 } }
      )
    );
    
    // Update veggies
    if (pizza.veggies && pizza.veggies.length > 0) {
      pizza.veggies.forEach(veggie => {
        updatePromises.push(
          Inventory.findOneAndUpdate(
            { category: 'veggie', name: veggie },
            { $inc: { quantity: -1 } }
          )
        );
      });
    }
    
    // Update meats
    if (pizza.meat && pizza.meat.length > 0) {
      pizza.meat.forEach(meat => {
        updatePromises.push(
          Inventory.findOneAndUpdate(
            { category: 'meat', name: meat },
            { $inc: { quantity: -1 } }
          )
        );
      });
    }

    await Promise.all(updatePromises);

    // Check low stock and send alert if needed
    await checkLowStock();

    const populatedOrder = await Order.findById(order._id).populate('user', 'name email');
    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/orders/my-orders
// @desc    Get user's orders
// @access  Private
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (Admin)
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin)
// @access  Private/Admin
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: Date.now()
    });
    
    await order.save();

    // Send status update email to user
    await sendEmail({
      to: order.user.email,
      subject: `Order ${order.orderNumber} Status Update`,
      html: orderStatusEmail(order.user.name, order.orderNumber, status)
    });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
