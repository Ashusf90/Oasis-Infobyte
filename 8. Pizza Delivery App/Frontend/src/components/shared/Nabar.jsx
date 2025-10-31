import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Pizza, LogOut, User, ShoppingBag, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'} className="flex items-center space-x-2">
            <Pizza className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Pizza App
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            {user && (
              <>
                <div className="flex items-center space-x-2 text-gray-700">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{user.name}</span>
                  {isAdmin && (
                    <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-600 rounded-full">
                      Admin
                    </span>
                  )}
                </div>

                {!isAdmin && (
                  <Link
                    to="/my-orders"
                    className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 transition"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    <span>My Orders</span>
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to="/admin/inventory"
                    className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 transition"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Inventory</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
