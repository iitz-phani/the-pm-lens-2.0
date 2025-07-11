# Email Verification Setup Guide

## Step 1: Gmail App Password Setup

1. **Enable 2-Factor Authentication** on your Gmail account
   - Go to Google Account settings
   - Security → 2-Step Verification → Turn it on

2. **Generate App Password**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it "The PM Lens"
   - Copy the 16-character password

## Step 2: Netlify Environment Variables

1. **Go to your Netlify dashboard**
2. **Navigate to Site settings → Environment variables**
3. **Add these variables:**

```
EMAIL_USER = your-gmail@gmail.com
EMAIL_PASS = your-16-character-app-password
```

## Step 3: Test the Setup

1. **Deploy the changes** (should happen automatically)
2. **Test the verification** on your website
3. **Check your email** for the verification code

## Troubleshooting

### If emails still fail:

1. **Check Gmail settings:**
   - Make sure "Less secure app access" is enabled (if not using app password)
   - Check if Gmail is blocking the connection

2. **Verify environment variables:**
   - Use the debug function: `/.netlify/functions/debug-env`
   - Check Netlify function logs

3. **Common issues:**
   - Wrong app password format
   - Gmail account not properly configured
   - Netlify environment variables not saved

## Alternative: Use a Different Email Service

If Gmail continues to have issues, we can switch to:
- SendGrid
- Mailgun
- AWS SES
- Resend

Let me know if you need help with any of these alternatives! 