const fs = require('fs');
const path = require('path');

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

  const logMessage = (message) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
  };

  try {
    logMessage('🚀 Netlify Cache Manager started');

    // Get cache status
    const cacheStatus = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      functionName: context.functionName,
      requestId: context.awsRequestId,
      cacheInfo: {}
    };

    // Check for any temporary files that might need cleanup
    const tempDirs = ['/tmp', '/var/tmp'];
    
    for (const tempDir of tempDirs) {
      try {
        if (fs.existsSync(tempDir)) {
          const files = fs.readdirSync(tempDir);
          cacheStatus.cacheInfo[tempDir] = {
            exists: true,
            fileCount: files.length,
            size: 'unknown' // Netlify doesn't provide file size easily
          };
        } else {
          cacheStatus.cacheInfo[tempDir] = {
            exists: false,
            fileCount: 0
          };
        }
      } catch (error) {
        cacheStatus.cacheInfo[tempDir] = {
          error: error.message
        };
      }
    }

    // For Netlify, we focus on:
    // 1. Clearing any temporary function data
    // 2. Providing cache status information
    // 3. Triggering rebuilds if needed

    logMessage('✅ Cache status checked successfully');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Netlify cache status checked',
        data: cacheStatus,
        recommendations: [
          'Netlify automatically manages build cache',
          'Use cache headers for static assets',
          'Consider using Netlify cache headers in _headers file'
        ]
      })
    };

  } catch (error) {
    logMessage(`❌ Error in cache manager: ${error.message}`);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Cache management failed',
        details: error.message
      })
    };
  }
}; 