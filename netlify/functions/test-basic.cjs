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
    // Test basic functionality
    const testData = {
      message: 'Basic function is working!',
      timestamp: new Date().toISOString(),
      method: event.httpMethod,
      path: event.path,
      functionName: context.functionName,
      requestId: context.awsRequestId,
      environment: {
        NODE_ENV: process.env.NODE_ENV || 'Not set',
        NETLIFY: process.env.NETLIFY || 'Not set'
      }
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(testData, null, 2)
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Basic function failed',
        message: error.message,
        stack: error.stack
      })
    };
  }
}; 