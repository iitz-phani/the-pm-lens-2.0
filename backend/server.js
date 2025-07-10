const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✨ Server running on port ${PORT}`);
}); 