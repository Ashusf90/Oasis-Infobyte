import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Pizza } from 'lucide-react';
import api from '../../utils/api';

const VerifyEmail = () => {
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    try {
      const { data } = await api.post(`/auth/verify-email/${token}`);
      setStatus('success');
      setMessage(data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center"
      >
        {status === 'verifying' && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Pizza className="h-16 w-16 text-purple-600 mx-auto" />
            </motion.div>
            <h2 className="text-2xl font-bold mt-4 text-gray-800">
              Verifying your email...
            </h2>
            <p className="text-gray-600 mt-2">Please wait a moment</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold mt-4 text-gray-800">
              Email Verified!
            </h2>
            <p className="text-gray-600 mt-2">{message}</p>
            <p className="text-sm text-gray-500 mt-4">
              Redirecting to login...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold mt-4 text-gray-800">
              Verification Failed
            </h2>
            <p className="text-gray-600 mt-2">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="btn-primary mt-6"
            >
              Go to Login
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
