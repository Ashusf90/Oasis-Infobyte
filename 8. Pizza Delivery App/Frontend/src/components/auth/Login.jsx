import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Pizza } from 'lucide-react';
import toast from 'react-hot-toast';
// We don't need 'api' here anymore, as AuthContext handles it
// import api from '../../utils/api'; 
import { useAuth } from '../../context/AuthContext'; // Ensure this path is correct

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Call the context's login function with email and password
      //    It handles the API call and updates global state (user, token)
      const user = await login(formData.email, formData.password); 

      // 2. If login succeeded (didn't throw), show success and navigate
      toast.success('Login successful!');

      // 3. Navigate based on the user data returned by the context function
      if (user.role === 'admin') {
        navigate('/admin/dashboard'); // Or '/admin/inventory' if preferred
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      // Error toast is likely already handled by the login function in AuthContext,
      // as it catches errors and displays them.
      // You could add extra specific logging here if needed:
      // console.error("Login component caught error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <Pizza className="h-16 w-16 text-purple-600 mx-auto" />
          </motion.div>
          <h2 className="text-3xl font-bold mt-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome Back!
          </h2>
          <p className="text-gray-600 mt-2">Login to order delicious pizzas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                className="input-field pl-10" // Assumes input-field is defined in index.css
                placeholder="you@example.com"
                value={formData.email}
                // Update state on change
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="password"
                required
                className="input-field pl-10" // Assumes input-field is defined in index.css
                placeholder="••••••••"
                value={formData.password}
                // Update state on change
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="/forgot-password" // Ensure this route exists in App.jsx
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full" // Assumes btn-primary is defined in index.css
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-purple-600 hover:text-purple-700 font-semibold">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
