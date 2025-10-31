// src/components/user/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../shared/Navbar'; // Adjust path if needed
import api from '../../utils/api'; // Adjust path if needed
import { Pizza, Package } from 'lucide-react'; // Example icons

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    // Fetch user's orders when the component mounts
    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const { data } = await api.get('/orders/my-orders');
        setOrders(data.data || []); // Assuming backend returns { success: true, data: [...] }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        // Handle error (e.g., show a toast notification)
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navbar />

      <div className="container-custom section-padding"> {/* Use custom container/padding */}
        <h1 className="text-4xl font-bold text-gradient mb-8">Your Dashboard</h1>

        {/* Order Status Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Package className="mr-2 text-purple-600" />
            Active Orders
          </h2>
          {loadingOrders ? (
            <p className="text-gray-600">Loading orders...</p> // Add skeleton loader later
          ) : orders.length === 0 ? (
            <p className="text-gray-600">You have no active orders.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {orders.map((order) => (
                <div key={order._id} className="card card-hover"> {/* Use card styles */}
                  <h3 className="font-semibold mb-2">Order #{order._id.slice(-6)}</h3> {/* Display partial ID */}
                  <p className="mb-1">Status: <span className="font-medium badge badge-primary">{order.status}</span></p> {/* Use badge styles */}
                  <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                  {/* Add more order details or a link to a full order page */}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Start Building Section */}
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready for another pizza?</h2>
          <Link to="/build-pizza" className="btn-primary inline-flex items-center">
            <Pizza className="mr-2" />
            Build Your Custom Pizza
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
