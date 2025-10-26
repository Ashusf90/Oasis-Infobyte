require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Inventory = require('./models/Inventory');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Inventory.deleteMany({});

    // Create Admin User
    console.log('Creating admin user...');
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@pizzaapp.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true,
    });

    // Create Test User
    console.log('Creating test user...');
    const user = await User.create({
      name: 'Test User',
      email: 'user@test.com',
      password: 'user123',
      role: 'user',
      isVerified: true,
    });

    // Create Inventory Items
    console.log('Creating inventory items...');
    const inventoryData = [
      // Bases
      { category: 'base', name: 'Thin Crust', quantity: 50, price: 100, threshold: 20 },
      { category: 'base', name: 'Thick Crust', quantity: 50, price: 120, threshold: 20 },
      { category: 'base', name: 'Cheese Burst', quantity: 40, price: 150, threshold: 20 },
      { category: 'base', name: 'Whole Wheat', quantity: 30, price: 130, threshold: 20 },
      { category: 'base', name: 'Gluten Free', quantity: 25, price: 180, threshold: 15 },

      // Sauces
      { category: 'sauce', name: 'Marinara', quantity: 60, price: 30, threshold: 20 },
      { category: 'sauce', name: 'BBQ Sauce', quantity: 55, price: 35, threshold: 20 },
      { category: 'sauce', name: 'Pesto', quantity: 45, price: 40, threshold: 20 },
      { category: 'sauce', name: 'White Sauce', quantity: 50, price: 35, threshold: 20 },
      { category: 'sauce', name: 'Hot Sauce', quantity: 40, price: 30, threshold: 20 },

      // Cheeses
      { category: 'cheese', name: 'Mozzarella', quantity: 70, price: 50, threshold: 25 },
      { category: 'cheese', name: 'Cheddar', quantity: 60, price: 55, threshold: 25 },
      { category: 'cheese', name: 'Parmesan', quantity: 50, price: 60, threshold: 20 },
      { category: 'cheese', name: 'Feta', quantity: 40, price: 65, threshold: 20 },
      { category: 'cheese', name: 'Vegan Cheese', quantity: 35, price: 70, threshold: 15 },

      // Veggies
      { category: 'veggie', name: 'Tomatoes', quantity: 80, price: 20, threshold: 30 },
      { category: 'veggie', name: 'Onions', quantity: 80, price: 15, threshold: 30 },
      { category: 'veggie', name: 'Bell Peppers', quantity: 70, price: 25, threshold: 25 },
      { category: 'veggie', name: 'Mushrooms', quantity: 65, price: 30, threshold: 25 },
      { category: 'veggie', name: 'Olives', quantity: 60, price: 35, threshold: 20 },
      { category: 'veggie', name: 'Jalapeños', quantity: 55, price: 25, threshold: 20 },
      { category: 'veggie', name: 'Corn', quantity: 70, price: 20, threshold: 25 },
      { category: 'veggie', name: 'Spinach', quantity: 50, price: 25, threshold: 20 },
      { category: 'veggie', name: 'Broccoli', quantity: 45, price: 30, threshold: 20 },

      // Meat
      { category: 'meat', name: 'Pepperoni', quantity: 60, price: 60, threshold: 25 },
      { category: 'meat', name: 'Chicken', quantity: 55, price: 65, threshold: 25 },
      { category: 'meat', name: 'Bacon', quantity: 50, price: 70, threshold: 20 },
      { category: 'meat', name: 'Sausage', quantity: 45, price: 65, threshold: 20 },
      { category: 'meat', name: 'Ham', quantity: 40, price: 60, threshold: 20 },
      { category: 'meat', name: 'Beef', quantity: 35, price: 75, threshold: 15 },
    ];

    await Inventory.insertMany(inventoryData);

    console.log('\n✅ Database seeded successfully!\n');
    console.log('═══════════════════════════════════════');
    console.log('📧 ADMIN CREDENTIALS:');
    console.log('   Email: admin@pizzaapp.com');
    console.log('   Password: admin123');
    console.log('═══════════════════════════════════════');
    console.log('📧 USER CREDENTIALS:');
    console.log('   Email: user@test.com');
    console.log('   Password: user123');
    console.log('═══════════════════════════════════════');
    console.log(`\n📦 Created ${inventoryData.length} inventory items`);
    console.log('🚀 You can now start the backend server!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
