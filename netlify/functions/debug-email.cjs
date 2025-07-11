exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Check environment variables
    const envCheck = {
      EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Missing',
      EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Missing',
      NODE_ENV: process.env.NODE_ENV || 'Not set',
      NETLIFY: process.env.NETLIFY || 'Not set',
      NETLIFY_DEV: process.env.NETLIFY_DEV || 'Not set'
    };

    // Check if nodemailer is available
    let nodemailerStatus = 'Not tested';
    try {
      const nodemailer = require('nodemailer');
      nodemailerStatus = 'Available';
    } catch (error) {
      nodemailerStatus = `Error: ${error.message}`;
    }

    // Test file system access
    let fsStatus = 'Not tested';
    try {
      const fs = require('fs').promises;
      await fs.writeFile('/tmp/test.txt', 'test');
      await fs.unlink('/tmp/test.txt');
      fsStatus = 'Working';
    } catch (error) {
      fsStatus = `Error: ${error.message}`;
    }

    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: envCheck,
      nodemailer: nodemailerStatus,
      fileSystem: fsStatus,
      functionName: context.functionName,
      requestId: context.awsRequestId,
      userAgent: event.headers['user-agent'] || 'Not provided',
      method: event.httpMethod,
      path: event.path
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(debugInfo, null, 2)
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Debug function failed',
        message: error.message,
        stack: error.stack
      })
    };
  }
}; 