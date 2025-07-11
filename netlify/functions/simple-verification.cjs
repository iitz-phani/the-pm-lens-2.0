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
    console.log('Function started');
    console.log('Event body:', event.body);
    
    const { email, action, code } = JSON.parse(event.body);

    console.log('Parsed data:', { email, action, code });

    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email address' })
      };
    }

    // Check environment variables
    console.log('Environment check:', {
      hasEmailUser: !!process.env.EMAIL_USER,
      hasEmailPass: !!process.env.EMAIL_PASS,
      emailUser: process.env.EMAIL_USER ? 'Set' : 'Missing',
      emailPass: process.env.EMAIL_PASS ? 'Set' : 'Missing'
    });

    if (action === 'send') {
      console.log('Sending verification code to:', email);
      
      // Generate a 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      console.log('Generated code:', verificationCode);
      
      // Clean up expired codes
      cleanupExpiredCodes();
      
      // Store the code with expiration (10 minutes)
      verificationCodes[email] = {
        code: verificationCode,
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
      };

      console.log('Stored codes:', Object.keys(verificationCodes));

      // For now, just return success without sending email
      // This will help us test if the basic function works
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'Verification code generated successfully (email sending disabled for testing)',
          email: email,
          code: verificationCode, // For testing purposes only
          timestamp: new Date().toISOString(),
          debug: 'Email sending is temporarily disabled for testing'
        })
      };

    } else if (action === 'verify') {
      console.log('Verifying code for:', email);
      
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
      console.log('Stored data for email:', storedData);

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
    console.error('Function error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to process verification request',
        details: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      })
    };
  }
}; 