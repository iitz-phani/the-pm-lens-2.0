const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();

// Debug logging
console.log('Environment variables loaded:');
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8082',
  credentials: true
}));
app.use(express.json());

// MongoDB Connection with better error handling
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas successfully!');
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Add connection event listeners
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

// Message Schema
const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('Message', messageSchema);

// Email Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test MongoDB Connection endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    // Try to create a test document
    const testMessage = new Message({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message'
    });
    await testMessage.save();
    await Message.findByIdAndDelete(testMessage._id);
    
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
    const newMessage = new Message({
      name,
      email,
      message
    });
    await newMessage.save();
    console.log('✅ Message saved to database:', newMessage._id);

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
      id: newMessage._id
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✨ Server running on port ${PORT}`);
}); 