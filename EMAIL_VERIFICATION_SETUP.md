# Email Verification System Setup

## Overview
The PM Lens website now includes email verification to ensure legitimate contact form submissions. Users must verify their email address before they can submit a message.

## Features
- ✅ 6-digit verification codes sent via email
- ✅ 10-minute expiration for security
- ✅ Professional email templates
- ✅ Verification required on both contact page and home page form
- ✅ Resend functionality
- ✅ Real-time validation

## Setup Instructions

### 1. Environment Variables
Add these environment variables to your `.env` file:

```env
# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# For Netlify deployment, add these in Netlify dashboard
```

### 2. Gmail App Password Setup
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password for "Mail"
4. Use this password in `EMAIL_PASS` (not your regular Gmail password)

### 3. Backend Setup (Development)
The backend server already includes the verification endpoints:
- `POST /api/send-verification` - Sends verification code
- `POST /api/verify-code` - Verifies the code

### 4. Netlify Functions (Production)
The Netlify functions are already created:
- `netlify/functions/send-verification.cjs`
- `netlify/functions/verify-code.cjs`

## How It Works

### User Flow:
1. User enters email in contact form
2. Clicks "Send Verification Code"
3. Receives 6-digit code via email
4. Enters code in form
5. Clicks "Verify Code"
6. Once verified, can submit the message

### Security Features:
- Codes expire after 10 minutes
- Codes are single-use (deleted after verification)
- Email validation before sending codes
- Rate limiting (can be added for production)

## Email Template
The verification email includes:
- Professional branding
- Clear instructions
- Large, easy-to-read verification code
- Security information
- Expiration notice

## Testing
1. Start the development server: `npm run dev`
2. Start the backend server: `cd backend && npm start`
3. Test the contact form on both pages
4. Check that verification emails are received
5. Verify that form submission is blocked until email is verified

## Production Deployment
1. Set environment variables in Netlify dashboard
2. Deploy to Netlify
3. Test the live verification system
4. Monitor email delivery rates

## Troubleshooting
- **Emails not sending**: Check Gmail app password and 2FA settings
- **Codes not working**: Check server logs for errors
- **Form not submitting**: Ensure email is verified before submission

## Future Enhancements
- Database storage for verification codes (instead of in-memory)
- Rate limiting for code requests
- SMS verification option
- CAPTCHA integration
- Analytics tracking 