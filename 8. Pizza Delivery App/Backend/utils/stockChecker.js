const Inventory = require('../models/Inventory');
const sendEmail = require('../config/email');
const { lowStockAlert } = require('./emailTemplates');

const checkLowStock = async () => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: { $lte: ['$quantity', '$threshold'] }
    });

    if (lowStockItems.length > 0) {
      console.log(`Found ${lowStockItems.length} low stock items`);
      
      const itemsData = lowStockItems.map(item => ({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        threshold: item.threshold
      }));

      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: '⚠️ Low Stock Alert - Pizza App',
        html: lowStockAlert(itemsData)
      });

      console.log('Low stock alert email sent to admin');
    }
  } catch (error) {
    console.error('Error checking stock:', error);
  }
};

module.exports = checkLowStock;
