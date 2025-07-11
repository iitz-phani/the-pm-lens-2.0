const nodemailer = require('nodemailer');

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
    const { paymentId, customerEmail, customerName } = JSON.parse(event.body);

    if (!paymentId || !customerEmail) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required parameters' })
      };
    }

    // Create email transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Create upgrade offer email
    const upgradeEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3B82F6;">Thank you for your Discovery Call booking!</h2>
        <p>Hi ${customerName || 'there'},</p>
        <p>Thank you for booking your discovery call with The PM Lens. We're excited to discuss your project management and content strategy goals!</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Special Upgrade Offer</h3>
          <p>Since you've invested in understanding your needs, we'd like to offer you a special upgrade to our coaching services:</p>
          
          <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #3B82F6;">
            <h4 style="margin: 0 0 10px 0; color: #1e40af;">LinkedIn Growth Coaching</h4>
            <p style="margin: 5px 0; color: #374151;">Original Price: ₹1,499/Session</p>
            <p style="margin: 5px 0; color: #059669; font-weight: bold;">Your Price: ₹1,000/Session</p>
            <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">(₹499 credit applied from discovery call)</p>
          </div>
          
          <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #8b5cf6;">
            <h4 style="margin: 0 0 10px 0; color: #7c3aed;">AI Content Strategy</h4>
            <p style="margin: 5px 0; color: #374151;">Original Price: ₹2,999/Session</p>
            <p style="margin: 5px 0; color: #059669; font-weight: bold;">Your Price: ₹2,500/Session</p>
            <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">(₹499 credit applied from discovery call)</p>
          </div>
          
          <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #f59e0b;">
            <h4 style="margin: 0 0 10px 0; color: #d97706;">Project Management Consulting</h4>
            <p style="margin: 5px 0; color: #374151;">Original Price: ₹2,499/Session</p>
            <p style="margin: 5px 0; color: #059669; font-weight: bold;">Your Price: ₹2,000/Session</p>
            <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">(₹499 credit applied from discovery call)</p>
          </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'https://your-domain.com'}/upgrade?payment_id=${paymentId}" 
             style="background: #3B82F6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            View Upgrade Options
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
          This offer is valid for 7 days. After your discovery call, we can discuss which service best fits your needs.
        </p>
        
        <p>Best regards,<br>Phani Bhushan Bozzam<br>The PM Lens</p>
      </div>
    `;

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: 'Your Discovery Call is Booked! Special Upgrade Offers Inside',
      html: upgradeEmailContent
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Upgrade email sent successfully',
        paymentId: paymentId
      })
    };

  } catch (error) {
    console.error('Error sending upgrade email:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to send upgrade email. Please try again.' 
      })
    };
  }
}; 