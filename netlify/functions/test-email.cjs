const nodemailer = require('nodemailer');

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

    // Check if environment variables are set
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

    // Configure email transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Test email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Test Email - The PM Lens',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #3B82F6;">Test Email from The PM Lens</h2>
          <p>This is a test email to verify that email sending is working correctly on Netlify.</p>
          <p>If you received this email, the email verification system should work properly.</p>
          <p>Time sent: ${new Date().toISOString()}</p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Test email sent successfully',
        email: email,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Error sending test email:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to send test email',
        details: error.message,
        hasEmailUser: !!process.env.EMAIL_USER,
        hasEmailPass: !!process.env.EMAIL_PASS
      })
    };
  }
}; 