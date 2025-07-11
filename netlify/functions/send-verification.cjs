const nodemailer = require('nodemailer');

// In-memory storage for verification codes (in production, use a database)
const verificationCodes = new Map();

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email } = JSON.parse(event.body);

    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email address' })
      };
    }

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store the code with expiration (10 minutes)
    verificationCodes.set(email, {
      code: verificationCode,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    // Configure email transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS  // Your Gmail app password
      }
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification - The PM Lens',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #3B82F6; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">The PM Lens</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Email Verification</p>
          </div>
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Verify Your Email Address</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Thank you for contacting The PM Lens! To ensure we can respond to your inquiry, 
              please verify your email address by entering the following verification code:
            </p>
            <div style="background-color: #f8f9fa; border: 2px solid #3B82F6; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
              <h3 style="color: #3B82F6; font-size: 32px; margin: 0; letter-spacing: 5px; font-family: 'Courier New', monospace;">
                ${verificationCode}
              </h3>
            </div>
            <p style="color: #666; font-size: 14px; margin-bottom: 25px;">
              This code will expire in 10 minutes for security reasons.
            </p>
            <div style="background-color: #f0f9ff; border-left: 4px solid #3B82F6; padding: 15px; margin: 25px 0;">
              <p style="color: #1e40af; margin: 0; font-size: 14px;">
                <strong>Why email verification?</strong><br>
                We verify email addresses to ensure we can respond to your inquiry and to protect against spam messages.
              </p>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 25px;">
              If you didn't request this verification, please ignore this email.
            </p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>The PM Lens - Project Management Consulting & AI Content Strategy</p>
            <p>© 2025 Phani Bhushan Bozzam. All rights reserved.</p>
          </div>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Verification code sent successfully',
        email: email 
      })
    };

  } catch (error) {
    console.error('Error sending verification code:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to send verification code. Please try again.' 
      })
    };
  }
}; 