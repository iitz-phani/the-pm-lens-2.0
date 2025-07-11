exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

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
      EMAIL_USER: {
        exists: !!process.env.EMAIL_USER,
        value: process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 3)}***@${process.env.EMAIL_USER.split('@')[1]}` : 'NOT SET',
        length: process.env.EMAIL_USER ? process.env.EMAIL_USER.length : 0
      },
      EMAIL_PASS: {
        exists: !!process.env.EMAIL_PASS,
        value: process.env.EMAIL_PASS ? `${process.env.EMAIL_PASS.substring(0, 4)}***${process.env.EMAIL_PASS.substring(process.env.EMAIL_PASS.length - 4)}` : 'NOT SET',
        length: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0
      }
    };

    // Test nodemailer availability
    let nodemailerStatus = 'NOT AVAILABLE';
    try {
      const nodemailer = require('nodemailer');
      nodemailerStatus = 'AVAILABLE';
    } catch (error) {
      nodemailerStatus = `ERROR: ${error.message}`;
    }

    // Test email configuration
    let emailTestResult = null;
    if (envCheck.EMAIL_USER.exists && envCheck.EMAIL_PASS.exists) {
      try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        // Test the connection
        await transporter.verify();
        emailTestResult = {
          success: true,
          message: 'Email configuration is valid'
        };
      } catch (error) {
        emailTestResult = {
          success: false,
          error: error.message,
          code: error.code
        };
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        environmentVariables: envCheck,
        nodemailer: nodemailerStatus,
        emailTest: emailTestResult,
        recommendations: getRecommendations(envCheck, emailTestResult)
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Debug function failed',
        details: error.message,
        stack: error.stack
      })
    };
  }
};

function getRecommendations(envCheck, emailTest) {
  const recommendations = [];

  if (!envCheck.EMAIL_USER.exists) {
    recommendations.push('Set EMAIL_USER environment variable in Netlify');
  }

  if (!envCheck.EMAIL_PASS.exists) {
    recommendations.push('Set EMAIL_PASS environment variable in Netlify');
  }

  if (envCheck.EMAIL_PASS.exists && envCheck.EMAIL_PASS.length !== 16) {
    recommendations.push('EMAIL_PASS should be 16 characters (Gmail app password)');
  }

  if (emailTest && !emailTest.success) {
    if (emailTest.code === 'EAUTH') {
      recommendations.push('Invalid email credentials - check your Gmail app password');
    } else if (emailTest.code === 'ECONNECTION') {
      recommendations.push('Connection failed - check your internet connection');
    } else {
      recommendations.push(`Email test failed: ${emailTest.error}`);
    }
  }

  if (recommendations.length === 0) {
    recommendations.push('All configurations look good!');
  }

  return recommendations;
} 