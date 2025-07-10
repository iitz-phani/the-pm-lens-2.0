const { Pool } = require('pg');
const nodemailer = require('nodemailer');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { name, email, message } = JSON.parse(event.body);

  try {
    // Save to Neon
    const insertQuery = `
      INSERT INTO messages (name, email, message)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
    const values = [name, email, message];
    const result = await pool.query(insertQuery, values);

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'phani.bozzam@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Message saved successfully', id: result.rows[0].id })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process message', details: error.message })
    };
  }
}; 