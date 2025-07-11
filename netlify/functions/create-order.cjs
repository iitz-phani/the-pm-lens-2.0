const Razorpay = require('razorpay');

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
    const { amount, currency, receipt, notes } = JSON.parse(event.body);

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    // Create order
    const order = await razorpay.orders.create({
      amount: amount, // Amount in paise
      currency: currency || 'INR',
      receipt: receipt,
      notes: notes || {
        service: 'Discovery Call',
        description: '30-minute discovery call consultation'
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      })
    };

  } catch (error) {
    console.error('Error creating order:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to create order. Please try again.' 
      })
    };
  }
}; 