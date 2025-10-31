import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, ChefHat, Truck, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Navbar from '../shared/Navbar';

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/my-orders');
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Order Received':
        return <Package className="h-8 w-8 text-green-600" />;
      case 'In the Kitchen':
        return <ChefHat className="h-8 w-8 text-orange-600" />;
      case 'Sent to Delivery':
        return <Truck className="h-8 w-8 text-blue-600" />;
      case 'Delivered':
        return <CheckCircle className="h-8 w-8 text-purple-600" />;
      default:
        return <Clock className="h-8 w-8 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Received':
        return 'bg-green-100 text-green-800';
      case 'In the Kitchen':
        return 'bg-orange-100 text-orange-800';
      case 'Sent to Delivery':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (status) => {
    switch (status) {
      case 'Order Received':
        return 25;
      case 'In the Kitchen':
        return 50;
      case 'Sent to Delivery':
        return 75;
      case 'Delivered':
        return 100;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            My Orders
          </h1>
          <p className="text-gray-600">Track your pizza orders in real-time</p>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">Start building your perfect pizza!</p>
            <button
              onClick={() => window.location.href = '/build-pizza'}
              className="btn-primary"
            >
              Build Pizza
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, idx) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="text-2xl font-bold text-purple-600 mt-2">₹{order.totalPrice}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${getProgressPercentage(order.status)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="flex flex-col items-center">
                      <Package className={`h-6 w-6 ${order.status === 'Order Received' || getProgressPercentage(order.status) > 25 ? 'text-purple-600' : 'text-gray-400'}`} />
                      <span className="text-xs mt-1">Received</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <ChefHat className={`h-6 w-6 ${order.status === 'In the Kitchen' || getProgressPercentage(order.status) > 50 ? 'text-purple-600' : 'text-gray-400'}`} />
                      <span className="text-xs mt-1">Kitchen</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Truck className={`h-6 w-6 ${order.status === 'Sent to Delivery' || getProgressPercentage(order.status) > 75 ? 'text-purple-600' : 'text-gray-400'}`} />
                      <span className="text-xs mt-1">Delivery</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <CheckCircle className={`h-6 w-6 ${order.status === 'Delivered' ? 'text-purple-600' : 'text-gray-400'}`} />
                      <span className="text-xs mt-1">Delivered</span>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 rounded-xl p-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Base</p>
                    <p className="font-semibold">{order.pizza.base}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Sauce</p>
                    <p className="font-semibold">{order.pizza.sauce}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Cheese</p>
                    <p className="font-semibold">{order.pizza.cheese}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Toppings</p>
                    <p className="font-semibold">
                      {[...order.pizza.veggies, ...order.pizza.meat].length} items
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatus;
