import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Navbar from '../shared/Navbar';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pizza, totalPrice } = location.state || {};
  const [loading, setLoading] = useState(false);

  if (!pizza) {
    navigate('/build-pizza');
    return null;
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Failed to load payment gateway');
        setLoading(false);
        return;
      }

      // Create Razorpay order
      const { data: orderData } = await api.post('/payment/create-order', {
        amount: totalPrice,
      });

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Pizza App',
        description: 'Custom Pizza Order',
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const { data: verifyData } = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyData.success) {
              // Create order
              const { data: order } = await api.post('/orders', {
                pizza,
                totalPrice,
                paymentId: verifyData.paymentId,
              });

              toast.success('Order placed successfully!');
              navigate('/my-orders');
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            toast.error('Order creation failed');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#7c3aed',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast.error('Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Order Summary
          </h2>

          <div className="space-y-6 mb-8">
            {/* Base */}
            <div className="flex justify-between items-center py-3 border-b">
              <div>
                <span className="font-semibold">Pizza Base:</span>
                <span className="ml-2 text-gray-600">{pizza.base}</span>
              </div>
              <span className="font-bold text-purple-600">Included</span>
            </div>

            {/* Sauce */}
            <div className="flex justify-between items-center py-3 border-b">
              <div>
                <span className="font-semibold">Sauce:</span>
                <span className="ml-2 text-gray-600">{pizza.sauce}</span>
              </div>
              <span className="font-bold text-purple-600">Included</span>
            </div>

            {/* Cheese */}
            <div className="flex justify-between items-center py-3 border-b">
              <div>
                <span className="font-semibold">Cheese:</span>
                <span className="ml-2 text-gray-600">{pizza.cheese}</span>
              </div>
              <span className="font-bold text-purple-600">Included</span>
            </div>

            {/* Veggies */}
            {pizza.veggies.length > 0 && (
              <div className="flex justify-between items-start py-3 border-b">
                <div>
                  <span className="font-semibold">Veggies:</span>
                  <div className="ml-2 text-gray-600">
                    {pizza.veggies.map((v, idx) => (
                      <div key={idx} className="flex items-center">
                        <Check className="h-4 w-4 text-green-600 mr-1" />
                        {v}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Meat */}
            {pizza.meat.length > 0 && (
              <div className="flex justify-between items-start py-3 border-b">
                <div>
                  <span className="font-semibold">Meat:</span>
                  <div className="ml-2 text-gray-600">
                    {pizza.meat.map((m, idx) => (
                      <div key={idx} className="flex items-center">
                        <Check className="h-4 w-4 text-red-600 mr-1" />
                        {m}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">Total Amount:</span>
              <span className="text-4xl font-bold text-purple-600">₹{totalPrice}</span>
            </div>
          </div>

          {/* Payment Button */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/build-pizza')}
              className="btn-secondary flex-1"
            >
              Back to Builder
            </button>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="btn-primary flex-1"
            >
              <CreditCard className="inline-block mr-2 h-5 w-5" />
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            🔒 Secure payment powered by Razorpay
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
