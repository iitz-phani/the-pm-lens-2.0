const nodemailer = require('nodemailer');

// Simple in-memory storage for this function instance
let verificationCodes = {};

// Clean up expired codes
const cleanupExpiredCodes = () => {
  const now = Date.now();
  Object.keys(verificationCodes).forEach(email => {
    if (verificationCodes[email].expiresAt < now) {
      delete verificationCodes[email];
    }
  });
};

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
    const { email, action, code } = JSON.parse(event.body);

    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email address' })
      };
    }

    // Check environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Email configuration missing. Please check EMAIL_USER and EMAIL_PASS environment variables.',
          hasEmailUser: !!process.env.EMAIL_USER,
          hasEmailPass: !!process.env.EMAIL_PASS
        })
      };
    }

    if (action === 'send') {
      // Generate a 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Clean up expired codes
      cleanupExpiredCodes();
      
      // Store the code with expiration (10 minutes)
      verificationCodes[email] = {
        code: verificationCode,
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
      };

      // Configure email transporter
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
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
          email: email,
          timestamp: new Date().toISOString()
        })
      };

    } else if (action === 'verify') {
      if (!code) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Verification code is required' })
        };
      }

      // Clean up expired codes
      cleanupExpiredCodes();

      // Get stored verification data
      const storedData = verificationCodes[email];

      if (!storedData) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'No verification code found for this email. Please request a new code.' })
        };
      }

      // Check if code has expired
      if (Date.now() > storedData.expiresAt) {
        delete verificationCodes[email]; // Clean up expired code
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Verification code has expired. Please request a new code.' })
        };
      }

      // Verify the code
      if (storedData.code !== code) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid verification code. Please try again.' })
        };
      }

      // Code is valid - remove it from storage and mark email as verified
      delete verificationCodes[email];

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'Email verified successfully',
          email: email,
          verified: true,
          timestamp: new Date().toISOString()
        })
      };

    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid action. Use "send" or "verify".' })
      };
    }

  } catch (error) {
    console.error('Error in simple verification:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to process verification request',
        details: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
}; 