const crypto = require('crypto');
const User = require('../models/User'); // Adjust path if needed
const sendEmail = require('../config/email'); // Adjust path if needed
// Optional: If using HTML templates
// const { verificationEmail, resetPasswordEmail } = require('../utils/emailTemplates'); // Adjust path if needed

// Helper function to generate JWT token and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken(); // Ensure this method exists on your User model

  // Remove password from user object before sending response
  const userResponse = { ...user.toObject() };
  delete userResponse.password;

  res.status(statusCode).json({
    success: true,
    token,
    user: userResponse,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user', // Default to 'user' if role not provided
    });

    // Generate verification token (use the correct method name from your model)
    const verificationToken = user.generateVerificationToken();
    await user.save({ validateBeforeSave: false }); // Save the hashed token and expiry

    // Create verification URL (Ensure FRONTEND_URL is set in .env)
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    // Create email content (Plain text example)
    const message = `Welcome to Pizza App, ${user.name}!\n\nPlease verify your email address by clicking the link below:\n\n${verificationUrl}\n\nIf you did not create an account, please ignore this email. This link will expire in 24 hours.`;

    // Send verification email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Verify Your Email - Pizza App',
        text: message, // ✅ Passing the text content
        // html: verificationEmail(user.name, verificationUrl) // Alternatively, use HTML template
      });

      res.status(201).json({
        success: true,
        message: 'Registration successful! Please check your email to verify your account.',
      });

    } catch (err) {
      console.error('Email Sending Error during registration:', err);
      // Important: If email fails, potentially roll back user creation or mark user as needing verification later
      // For simplicity here, we clear the token and let the user exist, but they can't log in
      user.verificationToken = undefined;
      user.verificationTokenExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ success: false, message: 'Registration succeeded, but email could not be sent. Please contact support.' });
    }
  } catch (err) {
    // Handle validation errors or other DB errors
    console.error('Registration DB/Validation Error:', err);
    // Mongoose validation errors often have specific messages
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ success: false, message: messages.join('. ') });
    }
    res.status(400).json({ success: false, message: 'Registration failed. Please check your input.' });
  }
};

// @desc    Verify Email
// @route   PUT /api/auth/verifyemail (or POST /verify-email/:token if matching frontend)
exports.verifyEmail = async (req, res) => {
    // Assumes token is sent in the request body. Adjust if using URL params.
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ success: false, message: 'Verification token is required' });
    }

    try {
        // Hash the token received from the user/email link
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user by hashed token and check expiry
        const user = await User.findOne({
            verificationToken: hashedToken,
            verificationTokenExpire: { $gt: Date.now() }, // Check if token hasn't expired
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
        }

        // Mark user as verified and clear token fields
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });

        // Verification successful, log the user in by sending a JWT token
        sendTokenResponse(user, 200, res);

    } catch (err) {
        console.error('Email Verification Error:', err);
        res.status(500).json({ success: false, message: 'Server error during email verification' });
    }
};


// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    // Find user by email, include password field for comparison
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if user's email is verified
    // if (!user.isVerified) {
    //   return res.status(401).json({ success: false, message: 'Please verify your email address before logging in.' });
    // }

    // User is valid and verified, send JWT token
    sendTokenResponse(user, 200, res);

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Get current logged in user details
// @route   GET /api/auth/me
// @access  Private (Requires 'protect' middleware)
exports.getMe = async (req, res) => {
  // req.user is attached by the 'protect' middleware
  // We re-fetch user data to ensure it's fresh, though req.user could also be used
  try {
      const user = await User.findById(req.user.id);
      if (!user) {
          // Should not happen if protect middleware worked, but good safeguard
          return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.status(200).json({
        success: true,
        data: user, // Send user data (password excluded by default or select('-password'))
      });
  } catch(err) {
      console.error('Get Me Error:', err);
      res.status(500).json({ success: false, message: 'Server error fetching user data' });
  }
};

// @desc    Forgot password - Send reset token email
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide an email address' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      // Security measure: Don't reveal if the email exists or not
      return res.status(200).json({ success: true, message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    // Generate reset token
    const resetToken = user.generateResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Create email message
    const message = `You requested a password reset for your Pizza App account.\n\nPlease click the link below to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email. This link is valid for 1 hour.`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request - Pizza App',
        text: message,
        // html: resetPasswordEmail(user.name, resetUrl) // Optional HTML version
      });

      res.status(200).json({ success: true, message: 'Password reset link sent to your email.' });

    } catch (err) {
      console.error('Forgot Password Email Sending Error:', err);
      // Clear tokens if email fails to prevent potential issues
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ success: false, message: 'Email could not be sent, please try again later.' });
    }
  } catch (err) {
    console.error('Forgot Password Error:', err);
    res.status(500).json({ success: false, message: 'Server error processing forgot password request' });
  }
};

// @desc    Reset password using token
// @route   PUT /api/auth/resetpassword (Assumes token in body, adjust route if needed)
// @access  Public
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ success: false, message: 'Please provide token and new password' });
  }

  if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  try {
    // Hash the token received from the user
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user by hashed token and check expiry
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    // Set new password (pre-save hook in User model will hash it)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Optionally log the user in after successful reset
    // sendTokenResponse(user, 200, res);
    // Or just send success message
    res.status(200).json({ success: true, message: 'Password reset successful. You can now log in.' });

  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).json({ success: false, message: 'Server error during password reset' });
  }
};
