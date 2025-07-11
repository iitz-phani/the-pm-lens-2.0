exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Test verification function is working',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      })
    };
  }

  if (event.httpMethod === 'POST') {
    try {
      const { email } = JSON.parse(event.body);
      
      // Generate a test code
      const testCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Test verification code generated',
          email: email,
          code: testCode,
          timestamp: new Date().toISOString(),
          note: 'This is a test - check console and toast for the code'
        })
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Test failed',
          details: error.message
        })
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
}; 