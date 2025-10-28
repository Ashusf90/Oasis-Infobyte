const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/inventory
// @desc    Get all inventory items
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const inventory = await Inventory.find().sort({ category: 1, name: 1 });
    res.json(inventory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/inventory/available
// @desc    Get available items for pizza building
// @access  Private
router.get('/available', protect, async (req, res) => {
  try {
    const inventory = await Inventory.find({ quantity: { $gt: 0 } });
    
    const organized = {
      bases: inventory.filter(item => item.category === 'base'),
      sauces: inventory.filter(item => item.category === 'sauce'),
      cheeses: inventory.filter(item => item.category === 'cheese'),
      veggies: inventory.filter(item => item.category === 'veggie'),
      meats: inventory.filter(item => item.category === 'meat'),
    };
    
    res.json(organized);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/inventory
// @desc    Add inventory item (Admin)
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { category, name, quantity, price, threshold } = req.body;
    
    const item = await Inventory.create({
      category,
      name,
      quantity,
      price,
      threshold: threshold || 20,
    });
    
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/inventory/:id
// @desc    Update inventory item (Admin)
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { quantity, price, threshold } = req.body;
    
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    if (quantity !== undefined) item.quantity = quantity;
    if (price !== undefined) item.price = price;
    if (threshold !== undefined) item.threshold = threshold;
    
    if (quantity !== undefined && quantity > item.quantity) {
      item.lastRestocked = Date.now();
    }
    
    await item.save();
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/inventory/:id
// @desc    Delete inventory item (Admin)
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    await item.deleteOne();
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/inventory/low-stock
// @desc    Get low stock items (Admin)
// @access  Private/Admin
router.get('/low-stock/list', protect, authorize('admin'), async (req, res) => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: { $lte: ['$quantity', '$threshold'] }
    });
    
    res.json(lowStockItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
