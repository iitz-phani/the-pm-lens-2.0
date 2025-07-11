// In-memory storage for verification codes (in production, use a database)
// This should be the same Map instance as in send-verification.cjs
// For now, we'll use a simple approach - in production, use a proper database
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
    const { email, code } = JSON.parse(event.body);

    if (!email || !code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email and verification code are required' })
      };
    }

    // Get stored verification data
    const storedData = verificationCodes.get(email);

    if (!storedData) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No verification code found for this email. Please request a new code.' })
      };
    }

    // Check if code has expired
    if (Date.now() > storedData.expiresAt) {
      verificationCodes.delete(email); // Clean up expired code
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
    verificationCodes.delete(email);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Email verified successfully',
        email: email,
        verified: true
      })
    };

  } catch (error) {
    console.error('Error verifying code:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to verify code. Please try again.' 
      })
    };
  }
}; 