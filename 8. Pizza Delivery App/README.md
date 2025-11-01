# 🍕 Pizza App - Full Stack Application

A complete full-stack pizza ordering application with custom pizza builder, Razorpay payment integration, inventory management, and real-time order tracking.

## 🌟 Features

### User Features
- ✅ Complete authentication system (Register, Login, Email Verification, Forgot Password)
- 🍕 Interactive custom pizza builder with step-by-step process
- 🛒 Real-time order tracking with status updates
- 💳 Razorpay payment integration (Test Mode)
- 📧 Email notifications for order status changes
- 📱 Responsive design with smooth animations

### Admin Features
- 📊 Comprehensive dashboard with order statistics
- 🏪 Complete inventory management system
- 📦 Real-time stock tracking
- ⚠️ Low stock alerts via email
- 🔄 Order status management (Received → Kitchen → Delivery → Delivered)
- 📈 Analytics and reporting

## 🛠️ Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Nodemailer for emails
- Razorpay for payments
- Node-cron for scheduled tasks

### Frontend
- React 18 with Vite
- React Router v6
- Tailwind CSS
- Framer Motion for animations
- Axios for API calls
- React Hot Toast for notifications

## 📁 Project Structure

```
pizza-app/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── email.js              # Email configuration
│   ├── middleware/
│   │   └── auth.js               # Authentication middleware
│   ├── models/
│   │   ├── User.js               # User model
│   │   ├── Order.js              # Order model
│   │   └── Inventory.js          # Inventory model
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── pizza.js              # Pizza routes
│   │   ├── order.js              # Order routes
│   │   ├── inventory.js          # Inventory routes
│   │   └── payment.js            # Payment routes
│   ├── utils/
│   │   ├── emailTemplates.js     # Email HTML templates
│   │   └── stockChecker.js       # Stock monitoring utility
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── server.js                 # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/             # Authentication components
│   │   │   ├── user/             # User components
│   │   │   ├── admin/            # Admin components
│   │   │   └── shared/           # Shared components
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Auth context provider
│   │   ├── utils/
│   │   │   └── api.js            # Axios configuration
│   │   ├── App.jsx               # Main App component
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Global styles
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Gmail account for sending emails
- Razorpay account (for payment integration)

### Step 1: Clone the Repository
```bash
# Create project directory
mkdir pizza-app
cd pizza-app
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
# Create a .env file and add the following:
```

**.env Configuration:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pizza-app
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

# Gmail Configuration (for sending emails)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
ADMIN_EMAIL=admin@pizzaapp.com

# Razorpay Test Mode Credentials
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Stock Threshold
STOCK_THRESHOLD=20
```

**Important Notes:**
- For Gmail, you need to generate an "App Password" from your Google Account settings
- Go to: Google Account → Security → 2-Step Verification → App passwords
- Generate a new app password and use it in EMAIL_PASSWORD

**Razorpay Setup:**
1. Sign up at https://razorpay.com/
2. Go to Settings → API Keys
3. Generate Test Mode keys
4. Copy Key ID and Key Secret to .env file

### Step 3: MongoDB Setup

**Option 1: Local MongoDB**
```bash
# Install MongoDB locally and start the service
# On Windows:
net start MongoDB

# On Mac:
brew services start mongodb-community

# On Linux:
sudo systemctl start mongodb
```

**Option 2: MongoDB Atlas (Cloud)**
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update MONGODB_URI in .env file

### Step 4: Initialize Database with Sample Data

Create a file `backend/seedData.js`:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Inventory = require('./models/Inventory');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB Connected');
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Inventory.deleteMany({});

    // Create Admin User
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@pizzaapp.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true,
    });

    // Create Test User
    const user = await User.create({
      name: 'Test User',
      email: 'user@test.com',
      password: 'user123',
      role: 'user',
      isVerified: true,
    });

    // Create Inventory Items
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

      // Meat
      { category: 'meat', name: 'Pepperoni', quantity: 60, price: 60, threshold: 25 },
      { category: 'meat', name: 'Chicken', quantity: 55, price: 65, threshold: 25 },
      { category: 'meat', name: 'Bacon', quantity: 50, price: 70, threshold: 20 },
      { category: 'meat', name: 'Sausage', quantity: 45, price: 65, threshold: 20 },
      { category: 'meat', name: 'Ham', quantity: 40, price: 60, threshold: 20 },
    ];

    await Inventory.insertMany(inventoryData);

    console.log('✅ Database seeded successfully!');
    console.log('\n📧 Admin Credentials:');
    console.log('Email: admin@pizzaapp.com');
    console.log('Password: admin123');
    console.log('\n📧 User Credentials:');
    console.log('Email: user@test.com');
    console.log('Password: user123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
```

Run the seed script:
```bash
node seedData.js
```

### Step 5: Start Backend Server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5000`

### Step 6: Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🎯 Usage Guide

### For Users:

1. **Register Account**
   - Go to http://localhost:5173/register
   - Fill in your details
   - Check email for verification link
   - Click verification link

2. **Login**
   - Use verified email and password
   - You'll be redirected to dashboard

3. **Build Custom Pizza**
   - Click "Start Building" button
   - Choose base, sauce, cheese, veggies, and meat
   - Review your pizza and total price
   - Click "Checkout"

4. **Make Payment**
   - Click "Pay Now"
   - Razorpay test mode will open
   - Use test card: 4111 1111 1111 1111
   - Any future date and CVV
   - Click "Success" to complete payment

5. **Track Order**
   - Go to "My Orders"
   - See real-time status updates
   - Receive email notifications

### For Admin:

1. **Login as Admin**
   - Email: admin@pizzaapp.com
   - Password: admin123

2. **View Dashboard**
   - See all orders and statistics
   - Monitor order status
   - Update order progress

3. **Manage Inventory**
   - Click "Inventory" in navbar
   - Add/Edit/Delete items
   - Monitor stock levels
   - Receive low stock alerts

4. **Update Order Status**
   - Click "Move to [Next Status]" button
   - Customer receives email notification
   - Status updates in real-time

## 📧 Email Notifications

The system sends emails for:
- ✉️ Account verification
- 🔐 Password reset
- 📦 Order status updates
- ⚠️ Low stock alerts (to admin)

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Email verification required
- Admin-only routes
- Secure payment integration

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
# Windows:
net start MongoDB

# Mac/Linux:
sudo systemctl status mongodb
```

### Email Not Sending
- Verify Gmail App Password is correct
- Enable "Less secure app access" if needed
- Check EMAIL_USER and EMAIL_PASSWORD in .env

### Razorpay Integration Issues
- Ensure you're using TEST mode keys
- Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
- Verify frontend can access the backend

### Port Already in Use
```bash
# Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

## 📝 API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- POST `/api/auth/verify-email/:token` - Verify email
- POST `/api/auth/forgot-password` - Request password reset
- POST `/api/auth/reset-password/:token` - Reset password

### Orders
- POST `/api/orders` - Create order
- GET `/api/orders/my-orders` - Get user orders
- GET `/api/orders` - Get all orders (Admin)
- PUT `/api/orders/:id/status` - Update order status (Admin)

### Inventory
- GET `/api/inventory` - Get all inventory
- GET `/api/inventory/available` - Get available items
- POST `/api/inventory` - Add item (Admin)
- PUT `/api/inventory/:id` - Update item (Admin)
- DELETE `/api/inventory/:id` - Delete item (Admin)

### Payment
- POST `/api/payment/create-order` - Create Razorpay order
- POST `/api/payment/verify` - Verify payment

## 🎨 UI Features

- Smooth animations with Framer Motion
- Responsive design for all devices
- Interactive pizza builder
- Real-time order tracking
- Beautiful gradient backgrounds
- Toast notifications
- Loading states
- Error handling

## 🚀 Production Deployment

### Backend Deployment (Heroku/Railway/Render)
1. Set environment variables
2. Update FRONTEND_URL
3. Deploy backend

### Frontend Deployment (Vercel/Netlify)
1. Build frontend: `npm run build`
2. Update API_URL in api.js
3. Deploy frontend

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Developer

Built with ❤️ using React, Node.js, MongoDB, and Razorpay

---

**Happy Coding! 🍕**
