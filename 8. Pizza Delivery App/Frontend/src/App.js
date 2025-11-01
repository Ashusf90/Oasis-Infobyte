import { Routes, Route, Navigate } from 'react-router-dom'; // ✅ CORRECT
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword, { ResetPassword } from './components/auth/ForgotPassword';
import VerifyEmail from './components/auth/VerifyEmail';

// User Components
import Dashboard from './components/user/Dashboard';
import PizzaBuilder from './components/user/PizzaBuilder';
import Checkout from './components/user/Checkout';
import OrderStatus from './components/user/OrderStatus';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import InventoryManager from './components/admin/InventoryManager';

function App() {
  return (
    <AuthProvider>
      {/* ❌ <Router> TAG WAS REMOVED FROM HERE */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* User Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/build-pizza"
          element={
            <ProtectedRoute>
              <PizzaBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <OrderStatus />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inventory"
          element={
            <ProtectedRoute adminOnly>
              <InventoryManager />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      {/* ❌ </Router> TAG WAS REMOVED FROM HERE */}
    </AuthProvider>
  );
}

export default App;
