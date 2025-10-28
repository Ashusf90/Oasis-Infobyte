const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  verifyEmail
} = require('../controllers/authController'); 

const { protect } = require('../middleware/auth'); 


router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword', resetPassword); 
router.put('/verifyemail', verifyEmail); 


router.get('/me', protect, getMe);


module.exports = router;
