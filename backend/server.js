const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// In-memory storage for verification codes (in production, use a database)
const verificationCodes = new Map();

dotenv.config();

// Debug logging
console.log('Environment variables loaded:');
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());

// PostgreSQL Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ PostgreSQL connection error:', err);
  } else {
    console.log('✅ Connected to Neon PostgreSQL successfully!');
  }
});

// Create messages table if it doesn't exist
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

pool.query(createTableQuery, (err, res) => {
  if (err) {
    console.error('❌ Error creating table:', err);
  } else {
    console.log('✅ Messages table ready');
  }
});

// Email Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test Database Connection endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    // Try to create a test message
    const testQuery = `
      INSERT INTO messages (name, email, message) 
      VALUES ($1, $2, $3) 
      RETURNING id
    `;
    const testValues = ['Test User', 'test@example.com', 'Test message'];
    
    const result = await pool.query(testQuery, testValues);
    const testId = result.rows[0].id;
    
    // Clean up test message
    await pool.query('DELETE FROM messages WHERE id = $1', [testId]);
    
    res.status(200).json({ message: 'Database connection successful!' });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// Routes
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Save to database
    const insertQuery = `
      INSERT INTO messages (name, email, message) 
      VALUES ($1, $2, $3) 
      RETURNING id
    `;
    const values = [name, email, message];
    
    const result = await pool.query(insertQuery, values);
    const messageId = result.rows[0].id;
    
    console.log('✅ Message saved to database:', messageId);

    // Send email notification
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'phani.bozzam@gmail.com',
        subject: `New Contact Form Submission from ${name}`,
        text: `
          Name: ${name}
          Email: ${email}
          Message: ${message}
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('✅ Email notification sent');
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      // Continue execution even if email fails
    }

    res.status(200).json({ 
      message: 'Message saved successfully',
      id: messageId
    });
  } catch (error) {
    console.error('❌ Error in /api/contact:', error);
    res.status(500).json({ error: 'Failed to process message', details: error.message });
  }
});

// Test email endpoint
app.get('/api/test-email', async (req, res) => {
  try {
    const testMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'phani.bozzam@gmail.com',
      subject: 'Test Email from PM Lens',
      text: 'This is a test email to verify the email configuration is working correctly.'
    };

    await transporter.sendMail(testMailOptions);
    res.status(200).json({ message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Email test error:', error);
    res.status(500).json({ error: 'Failed to send test email', details: error.message });
  }
});

// Send verification code endpoint
app.post('/api/send-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store the code with expiration (10 minutes)
    verificationCodes.set(email, {
      code: verificationCode,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
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

    res.status(200).json({ 
      message: 'Verification code sent successfully',
      email: email 
    });

  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).json({ 
      error: 'Failed to send verification code. Please try again.' 
    });
  }
});

// Verify code endpoint
app.post('/api/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and verification code are required' });
    }

    // Get stored verification data
    const storedData = verificationCodes.get(email);

    if (!storedData) {
      return res.status(400).json({ error: 'No verification code found for this email. Please request a new code.' });
    }

    // Check if code has expired
    if (Date.now() > storedData.expiresAt) {
      verificationCodes.delete(email); // Clean up expired code
      return res.status(400).json({ error: 'Verification code has expired. Please request a new code.' });
    }

    // Verify the code
    if (storedData.code !== code) {
      return res.status(400).json({ error: 'Invalid verification code. Please try again.' });
    }

    // Code is valid - remove it from storage and mark email as verified
    verificationCodes.delete(email);

    res.status(200).json({ 
      message: 'Email verified successfully',
      email: email,
      verified: true
    });

  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).json({ 
      error: 'Failed to verify code. Please try again.' 
    });
  }
});

// Endpoint for sending upgrade emails
app.post('/api/send-upgrade-email', async (req, res) => {
  try {
    const { paymentId, customerEmail, customerName } = req.body;

    if (!paymentId || !customerEmail) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Create email transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Create upgrade offer email
    const upgradeEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3B82F6;">Thank you for your Discovery Call booking!</h2>
        <p>Hi ${customerName || 'there'},</p>
        <p>Thank you for booking your discovery call with The PM Lens. We're excited to discuss your project management and content strategy goals!</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Special Upgrade Offer</h3>
          <p>Since you've invested in understanding your needs, we'd like to offer you a special upgrade to our coaching services:</p>
          
          <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #3B82F6;">
            <h4 style="margin: 0 0 10px 0; color: #1e40af;">LinkedIn Growth Coaching</h4>
            <p style="margin: 5px 0; color: #374151;">Original Price: ₹1,499/Session</p>
            <p style="margin: 5px 0; color: #059669; font-weight: bold;">Your Price: ₹1,000/Session</p>
            <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">(₹499 credit applied from discovery call)</p>
          </div>
          
          <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #8b5cf6;">
            <h4 style="margin: 0 0 10px 0; color: #7c3aed;">AI Content Strategy</h4>
            <p style="margin: 5px 0; color: #374151;">Original Price: ₹2,999/Session</p>
            <p style="margin: 5px 0; color: #059669; font-weight: bold;">Your Price: ₹2,500/Session</p>
            <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">(₹499 credit applied from discovery call)</p>
          </div>
          
          <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #f59e0b;">
            <h4 style="margin: 0 0 10px 0; color: #d97706;">Project Management Consulting</h4>
            <p style="margin: 5px 0; color: #374151;">Original Price: ₹2,499/Session</p>
            <p style="margin: 5px 0; color: #059669; font-weight: bold;">Your Price: ₹2,000/Session</p>
            <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">(₹499 credit applied from discovery call)</p>
            </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/upgrade?payment_id=${paymentId}" 
             style="background: #3B82F6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            View Upgrade Options
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
          This offer is valid for 7 days. After your discovery call, we can discuss which service best fits your needs.
        </p>
        
        <p>Best regards,<br>Phani Bhushan Bozzam<br>The PM Lens</p>
      </div>
    `;

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: 'Your Discovery Call is Booked! Special Upgrade Offers Inside',
      html: upgradeEmailContent
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: 'Upgrade email sent successfully',
      paymentId: paymentId
    });

  } catch (error) {
    console.error('Error sending upgrade email:', error);
    res.status(500).json({ 
      error: 'Failed to send upgrade email. Please try again.' 
    });
  }
});

// Email function for upgrade offers
const sendUpgradeEmail = async (paymentData) => {
  try {
    // Create upgrade offer email
    const upgradeEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3B82F6;">Thank you for your Discovery Call booking!</h2>
        <p>Hi there,</p>
        <p>Thank you for booking your discovery call with The PM Lens. We're excited to discuss your project management and content strategy goals!</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Special Upgrade Offer</h3>
          <p>Since you've invested in understanding your needs, we'd like to offer you a special upgrade to our coaching services:</p>
          
          <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #3B82F6;">
            <h4 style="margin: 0 0 10px 0; color: #1e40af;">LinkedIn Growth Coaching</h4>
            <p style="margin: 5px 0; color: #374151;">Original Price: ₹1,499/Session</p>
            <p style="margin: 5px 0; color: #059669; font-weight: bold;">Your Price: ₹1,000/Session</p>
            <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">(₹499 credit applied from discovery call)</p>
          </div>
          
          <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #8b5cf6;">
            <h4 style="margin: 0 0 10px 0; color: #7c3aed;">AI Content Strategy</h4>
            <p style="margin: 5px 0; color: #374151;">Original Price: ₹2,999/Session</p>
            <p style="margin: 5px 0; color: #059669; font-weight: bold;">Your Price: ₹2,500/Session</p>
            <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">(₹499 credit applied from discovery call)</p>
          </div>
          
          <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #f59e0b;">
            <h4 style="margin: 0 0 10px 0; color: #d97706;">Project Management Consulting</h4>
            <p style="margin: 5px 0; color: #374151;">Original Price: ₹2,499/Session</p>
            <p style="margin: 5px 0; color: #059669; font-weight: bold;">Your Price: ₹2,000/Session</p>
            <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">(₹499 credit applied from discovery call)</p>
          </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'https://your-domain.com'}/upgrade?payment_id=${paymentData.payment_id}" 
             style="background: #3B82F6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            View Upgrade Options
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
          This offer is valid for 7 days. After your discovery call, we can discuss which service best fits your needs.
        </p>
        
        <p>Best regards,<br>Phani Bhushan Bozzam<br>The PM Lens</p>
      </div>
    `;

    // Send email (you'll need to implement this based on your email service)
    console.log('Upgrade email content generated for payment:', paymentData.payment_id);
    console.log('Email would be sent to customer with upgrade offers');
    
    // For now, just log the email content
    // In production, you'd send this via your email service
    
  } catch (error) {
    console.error('Error sending upgrade email:', error);
  }
};

// Razorpay endpoints for development
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency, receipt, notes } = req.body;

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    // Create order
    const order = await razorpay.orders.create({
      amount: amount, // Amount in paise
      currency: currency || 'INR',
      receipt: receipt,
      notes: notes || {
        service: 'Discovery Call',
        description: '30-minute discovery call consultation'
      }
    });

    res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      error: 'Failed to create order. Please try again.' 
    });
  }
});

app.post('/api/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment verification parameters' });
    }

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (signature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Payment is verified - you can store this in your database
    const paymentData = {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      signature: razorpay_signature,
      verified_at: new Date().toISOString(),
      service: 'Discovery Call',
      amount: 49900, // ₹499 in paise
      currency: 'INR'
    };

    // Store payment data
    payments.set(razorpay_payment_id, paymentData);
    console.log('Payment verified:', paymentData);

    // Send follow-up email with upgrade offers
    setTimeout(() => {
      sendUpgradeEmail(paymentData);
    }, 5000); // Send after 5 seconds

    res.status(200).json({
      verified: true,
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      message: 'Payment verified successfully'
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ 
      error: 'Failed to verify payment. Please try again.' 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✨ Server running on port ${PORT}`);
}); 