const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports like 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Should be the App Password
  },
});

const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `${process.env.FROM_NAME || 'Pizza App'} <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`, // Sender address
      to: options.to,                 // List of receivers
      subject: options.subject,       // Subject line
      text: options.text,             // ✅ Plain text body (now included)
      html: options.html,             // HTML body (optional, passed if provided)
    };

    console.log('Attempting to send email with options:', mailOptions); // Log options before sending
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');

  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;
