const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

let tableReady = false;

const createVerificationToken = (email, code, expiresAt) => {
  const payload = Buffer.from(JSON.stringify({ email, code, expiresAt })).toString('base64url');
  const secret = process.env.VERIFICATION_SECRET || process.env.EMAIL_PASS || 'pm-lens-fallback-secret';
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
};

const readVerificationToken = (token) => {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [payload, signature] = token.split('.');
  const secret = process.env.VERIFICATION_SECRET || process.env.EMAIL_PASS || 'pm-lens-fallback-secret';
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('base64url');

  if (signature !== expected) return null;

  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch (error) {
    return null;
  }
};

const ensureVerificationTable = async () => {
  if (tableReady) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS verification_codes (
      email TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      expires_at BIGINT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  tableReady = true;
};

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send verification email
const sendVerificationEmail = async (email, code) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🔐 Your Verification Code - The PM Lens',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🔐 Email Verification</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">The PM Lens - Project Management & Design Services</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Your Verification Code</h2>
            
            <div style="background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #667eea; font-size: 36px; margin: 0; letter-spacing: 5px; font-family: 'Courier New', monospace;">${code}</h1>
            </div>
            
            <p style="color: #666; margin-bottom: 20px;">
              Please enter this 6-digit code in the verification field on our website to complete your email verification.
            </p>
            
            <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #1976d2;">
                <strong>⏰ This code expires in 10 minutes</strong><br>
                If you didn't request this code, please ignore this email.
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 14px; text-align: center; margin: 0;">
              This is an automated message from The PM Lens. Please do not reply to this email.
            </p>
          </div>
        </div>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
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
    const { email, action, code, verificationToken } = JSON.parse(event.body);



    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email address' })
      };
    }



    try {
      await ensureVerificationTable();
      // Delete expired codes before every operation
      await pool.query('DELETE FROM verification_codes WHERE expires_at < $1', [Date.now()]);
    } catch (dbError) {
      console.error('Verification DB unavailable, using token fallback:', dbError.message);
    }

    if (action === 'send') {
      // Generate a 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      const token = createVerificationToken(email, verificationCode, expiresAt);
      let dbStored = false;

      // Persist code in DB when available
      try {
        await pool.query(
          `
            INSERT INTO verification_codes (email, code, expires_at)
            VALUES ($1, $2, $3)
            ON CONFLICT (email)
            DO UPDATE SET
              code = EXCLUDED.code,
              expires_at = EXCLUDED.expires_at,
              created_at = CURRENT_TIMESTAMP
          `,
          [email, verificationCode, expiresAt]
        );
        dbStored = true;
      } catch (dbError) {
        console.error('Failed to persist verification code in DB:', dbError.message);
      }

      // Send verification email
      const emailResult = await sendVerificationEmail(email, verificationCode);
      
      if (emailResult.success) {

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            message: 'Verification code sent successfully to your email',
            email: email,
            timestamp: new Date().toISOString(),
            emailSent: true,
            messageId: emailResult.messageId,
            verificationToken: token,
            storageMode: dbStored ? 'database' : 'token'
          })
        };
      } else {

        // Don't show the code, just inform about the failure
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ 
            error: 'Email delivery failed',
            message: 'Unable to send verification code. Please check your email configuration.',
            email: email,
            timestamp: new Date().toISOString(),
            emailSent: false,
            emailError: emailResult.error,
            debugUrl: '/.netlify/functions/debug-env'
          })
        };
      }

    } else if (action === 'verify') {

      
      if (!code) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Verification code is required' })
        };
      }

      let storedData = null;

      try {
        const result = await pool.query(
          'SELECT code, expires_at FROM verification_codes WHERE email = $1',
          [email]
        );
        storedData = result.rows[0] || null;
      } catch (dbError) {
        console.error('DB lookup failed during verification:', dbError.message);
      }

      if (storedData) {
        if (Date.now() > Number(storedData.expires_at)) {
          try {
            await pool.query('DELETE FROM verification_codes WHERE email = $1', [email]);
          } catch (error) {
            console.error('DB cleanup failed:', error.message);
          }
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Verification code has expired. Please request a new code.' })
          };
        }

        if (storedData.code !== code) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Invalid verification code. Please try again.' })
          };
        }

        try {
          await pool.query('DELETE FROM verification_codes WHERE email = $1', [email]);
        } catch (error) {
          console.error('Failed to delete used verification code:', error.message);
        }
      } else {
        // Token fallback for stateless verification in serverless environments.
        const tokenData = readVerificationToken(verificationToken);
        if (!tokenData || tokenData.email !== email) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'No verification code found for this email. Please request a new code.' })
          };
        }

        if (Date.now() > Number(tokenData.expiresAt)) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Verification code has expired. Please request a new code.' })
          };
        }

        if (String(tokenData.code) !== String(code)) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Invalid verification code. Please try again.' })
          };
        }
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'Email verified successfully',
          email: email,
          verified: true,
          timestamp: new Date().toISOString()
        })
      };

    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid action. Use "send" or "verify".' })
      };
    }

  } catch (error) {
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to process verification request',
        details: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      })
    };
  }
}; 