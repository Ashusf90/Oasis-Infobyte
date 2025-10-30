import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, ChefHat, Truck, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Navbar from '../shared/Navbar';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  useEffect(() => {
    fetchData();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, stockRes] = await Promise.all([
        api.get('/orders'),
        api.get('/inventory/low-stock/list'),
      ]);
      setOrders(ordersRes.data);
      setLowStock(stockRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'Order Received': 'In the Kitchen',
      'In the Kitchen': 'Sent to Delivery',
      'Sent to Delivery': 'Delivered',
    };
    return statusFlow[currentStatus];
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

  const stats = {
    total: orders.length,
    received: orders.filter(o => o.status === 'Order Received').length,
    kitchen: orders.filter(o => o.status === 'In the Kitchen').length,
    delivery: orders.filter(o => o.status === 'Sent to Delivery').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage orders and monitor inventory</p>
        </motion.div>

        {/* Low Stock Alert */}
        {lowStock.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-600 p-4 mb-6 rounded-lg"
          >
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-800 mb-1">Low Stock Alert!</h3>
                <p className="text-red-700">
                  {lowStock.length} item{lowStock.length > 1 ? 's are' : ' is'} running low. 
                  <a href="/admin/inventory" className="ml-2 underline font-semibold">
                    View Inventory
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <TrendingUp className="h-10 w-10 text-purple-600 mb-3" />
            <p className="text-gray-600 mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-purple-600">{stats.total}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <Package className="h-10 w-10 text-green-600 mb-3" />
            <p className="text-gray-600 mb-1">Received</p>
            <p className="text-3xl font-bold text-green-600">{stats.received}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <ChefHat className="h-10 w-10 text-orange-600 mb-3" />
            <p className="text-gray-600 mb-1">In Kitchen</p>
            <p className="text-3xl font-bold text-orange-600">{stats.kitchen}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <Truck className="h-10 w-10 text-blue-600 mb-3" />
            <p className="text-gray-600 mb-1">In Delivery</p>
            <p className="text-3xl font-bold text-blue-600">{stats.delivery}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <CheckCircle className="h-10 w-10 text-purple-600 mb-3" />
            <p className="text-gray-600 mb-1">Delivered</p>
            <p className="text-3xl font-bold text-purple-600">{stats.delivered}</p>
          </motion.div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
          
          {orders.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 10).map((order, idx) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">#{order.orderNumber}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Customer: {order.user?.name} ({order.user?.email})
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleString('en-IN')}
                      </p>
                      <p className="text-sm font-semibold text-purple-600 mt-1">
                        Amount: ₹{order.totalPrice}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {order.status !== 'Delivered' && (
                        <button
                          onClick={() => updateOrderStatus(order._id, getNextStatus(order.status))}
                          disabled={updatingOrder === order._id}
                          className="btn-primary text-sm py-2 px-4"
                        >
                          {updatingOrder === order._id ? 'Updating...' : `Move to ${getNextStatus(order.status)}`}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
