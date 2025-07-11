const crypto = require('crypto');

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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = JSON.parse(event.body);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing payment verification parameters' })
      };
    }

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (signature !== razorpay_signature) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid payment signature' })
      };
    }

    // Payment is verified - you can store this in your database
    const paymentData = {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      signature: razorpay_signature,
      verified_at: new Date().toISOString(),
      service: 'Discovery Call',
      amount: 49900, // ₹499 in paise
      currency: 'INR'
    };

    // Here you would typically save this to your database
    // For now, we'll just return success
    console.log('Payment verified:', paymentData);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        verified: true,
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        message: 'Payment verified successfully'
      })
    };

  } catch (error) {
    console.error('Error verifying payment:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to verify payment. Please try again.' 
      })
    };
  }
}; 