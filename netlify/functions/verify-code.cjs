const fs = require('fs').promises;

// Simple file-based storage for verification codes
const CODES_FILE = '/tmp/verification_codes.json';

// Helper function to read codes
const readCodes = async () => {
  try {
    const data = await fs.readFile(CODES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
};

// Helper function to write codes
const writeCodes = async (codes) => {
  try {
    await fs.writeFile(CODES_FILE, JSON.stringify(codes, null, 2));
  } catch (error) {
    console.error('Error writing codes:', error);
  }
};

// Fallback: Get code from environment variable
const getCodeFromEnv = (email) => {
  try {
    const envKey = `VERIFICATION_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const stored = process.env[envKey];
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  } catch (error) {
    console.error('Error reading code from env:', error);
    return null;
  }
};

// Fallback: Remove code from environment variable
const removeCodeFromEnv = (email) => {
  try {
    const envKey = `VERIFICATION_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
    delete process.env[envKey];
  } catch (error) {
    console.error('Error removing code from env:', error);
  }
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
    const { email, code } = JSON.parse(event.body);

    if (!email || !code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email and verification code are required' })
      };
    }

    // Try to read from file storage first, fallback to env
    let storedData = null;
    let codes = {};
    
    try {
      codes = await readCodes();
      storedData = codes[email];
    } catch (error) {
      console.log('File storage failed, trying env fallback');
      storedData = getCodeFromEnv(email);
    }

    if (!storedData) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No verification code found for this email. Please request a new code.' })
      };
    }

    // Check if code has expired
    if (Date.now() > storedData.expiresAt) {
      // Clean up expired code
      try {
        delete codes[email];
        await writeCodes(codes);
      } catch (error) {
        removeCodeFromEnv(email);
      }
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
    try {
      delete codes[email];
      await writeCodes(codes);
    } catch (error) {
      removeCodeFromEnv(email);
    }

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