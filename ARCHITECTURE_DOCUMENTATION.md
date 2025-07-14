# The PM Lens 2.0 - Technical Architecture Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Database Architecture](#database-architecture)
6. [Payment Integration](#payment-integration)
7. [Email System](#email-system)
8. [Deployment Architecture](#deployment-architecture)
9. [Security Implementation](#security-implementation)
10. [Development Environment](#development-environment)
11. [API Documentation](#api-documentation)
12. [Performance & Scalability](#performance--scalability)
13. [Monitoring & Logging](#monitoring--logging)
14. [Troubleshooting Guide](#troubleshooting-guide)

---

## System Overview

**The PM Lens 2.0** is a modern web application built for project management consulting and content strategy services. The system provides a comprehensive platform for booking discovery calls, managing payments, and handling customer communications.

### Key Features
- **Responsive Web Interface** with dark/light theme support
- **Payment Processing** via Razorpay integration
- **Email Verification System** for customer communications
- **Contact Form Management** with database storage
- **Service Booking** and upgrade management
- **Real-time Notifications** and toast messages

### Technology Stack Summary
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express.js + Netlify Functions
- **Database:** PostgreSQL (Neon)
- **Payment:** Razorpay
- **Email:** Gmail SMTP via Nodemailer
- **Deployment:** Netlify (Frontend + Serverless Functions)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐  │
│  │   React App     │    │   Vite Dev      │    │   Browser   │  │
│  │   (TypeScript)  │    │   Server        │    │   Cache     │  │
│  └─────────────────┘    └─────────────────┘    └─────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NETWORK LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐  │
│  │   Netlify CDN   │    │   SSL/TLS       │    │   CORS      │  │
│  │   (Global)      │    │   Encryption    │    │   Headers   │  │
│  └─────────────────┘    └─────────────────┘    └─────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐  │
│  │ Netlify         │    │ Express.js      │    │ Razorpay    │  │
│  │ Functions       │    │ Server          │    │ API         │  │
│  │ (Serverless)    │    │ (Development)   │    │ Integration │  │
│  └─────────────────┘    └─────────────────┘    └─────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐  │
│  │ PostgreSQL      │    │ Neon Database   │    │ Email       │  │
│  │ (Neon)          │    │ (Serverless)    │    │ Service     │  │
│  │                 │    │                 │    │ (Gmail)     │  │
│  └─────────────────┘    └─────────────────┘    └─────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Technology Stack
- **Framework:** React 18.3.1
- **Language:** TypeScript 5.5.3
- **Build Tool:** Vite 5.4.1
- **Styling:** Tailwind CSS 3.4.11
- **UI Components:** shadcn/ui + Radix UI
- **Routing:** React Router DOM 6.26.2
- **State Management:** React Hooks + Context API
- **Form Handling:** React Hook Form 7.53.0 + Zod 3.23.8
- **Icons:** Lucide React 0.462.0

### Project Structure
```
src/
├── components/                 # Reusable UI components
│   ├── ui/                    # shadcn/ui component library
│   │   ├── button.tsx         # Button component
│   │   ├── dialog.tsx         # Modal dialogs
│   │   ├── card.tsx           # Card layouts
│   │   ├── form.tsx           # Form components
│   │   └── ...                # Other UI components
│   └── PaymentModal.tsx       # Payment integration component
├── pages/                     # Route components
│   ├── Index.tsx              # Main landing page
│   ├── Pricing.tsx            # Pricing and services
│   ├── Contact.tsx            # Contact form
│   ├── Upgrade.tsx            # Service upgrades
│   ├── Privacy.tsx            # Privacy policy
│   ├── TermsAndConditions.tsx # Terms of service
│   └── CancellationRefunds.tsx # Refund policy
├── hooks/                     # Custom React hooks
│   ├── use-mobile.tsx         # Mobile detection hook
│   └── use-toast.ts           # Toast notification hook
├── lib/                       # Utility functions
│   └── utils.ts               # Common utilities
├── App.tsx                    # Main application component
├── main.tsx                   # Application entry point
├── index.css                  # Global styles
└── vite-env.d.ts              # Vite type definitions
```

### Key Features
- **Responsive Design:** Mobile-first approach with Tailwind CSS
- **Theme Switching:** Dark/light theme with next-themes
- **Component Library:** Consistent UI with shadcn/ui
- **Type Safety:** Full TypeScript implementation
- **Performance:** Vite for fast development and optimized builds
- **Accessibility:** ARIA-compliant components via Radix UI

### Build Configuration
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

---

## Backend Architecture

### Technology Stack
- **Runtime:** Node.js
- **Framework:** Express.js 4.18.2
- **Database:** PostgreSQL with pg 8.16.3
- **Email:** Nodemailer 6.9.9
- **Payment:** Razorpay 2.9.6
- **Security:** CORS, crypto for signature verification
- **Development:** Nodemon 3.1.10

### Server Configuration
```javascript
// server.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const nodemailer = require('nodemailer');
const Razorpay = require('razorpay');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());
```

### Database Connection
```javascript
// PostgreSQL Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
```

### Email Configuration
```javascript
// Email Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

---

## Database Architecture

### Database Provider: Neon PostgreSQL
- **Type:** Serverless PostgreSQL
- **Hosting:** Cloud-based with automatic scaling
- **Connection:** Connection pooling for performance
- **SSL:** Enabled for secure connections
- **Backup:** Automatic backups

### Database Schema

#### Messages Table
```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table Structure
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| name | VARCHAR(255) | NOT NULL | Customer's full name |
| email | VARCHAR(255) | NOT NULL | Customer's email address |
| message | TEXT | NOT NULL | Contact form message content |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Message creation timestamp |

### In-Memory Storage
- **Verification Codes:** Map for temporary email verification codes
- **Payment Data:** Temporary storage for payment verification
- **Session Data:** Client-side session management

---

## Payment Integration

### Payment Gateway: Razorpay
- **Integration Type:** Client-side + Server-side
- **Security:** HMAC signature verification
- **Currency:** INR (Indian Rupees)
- **Payment Methods:** UPI, Cards, Net Banking, Wallets

### Payment Flow
```mermaid
sequenceDiagram
    participant Client
    participant Frontend
    participant Backend
    participant Razorpay
    participant Database

    Client->>Frontend: Initiate Payment
    Frontend->>Backend: Create Order
    Backend->>Razorpay: Create Order API
    Razorpay->>Backend: Order ID
    Backend->>Frontend: Order Details
    Frontend->>Razorpay: Open Checkout
    Client->>Razorpay: Complete Payment
    Razorpay->>Frontend: Payment Response
    Frontend->>Backend: Verify Payment
    Backend->>Razorpay: Verify Signature
    Razorpay->>Backend: Verification Result
    Backend->>Database: Store Payment Data
    Backend->>Frontend: Success Response
    Frontend->>Client: Payment Success
```

### Payment Components
- **Order Creation:** Server-side order generation
- **Checkout Modal:** Client-side payment interface
- **Signature Verification:** Server-side payment validation
- **Success Handling:** Email notifications and database updates

---

## Email System

### Email Service: Gmail SMTP
- **Provider:** Gmail SMTP via Nodemailer
- **Authentication:** App-specific passwords
- **Templates:** HTML email templates with branding
- **Delivery:** Asynchronous email sending

### Email Types

#### 1. Contact Form Notifications
- **Recipient:** Support team (phani.bozzam@gmail.com)
- **Content:** Customer inquiry details
- **Trigger:** Contact form submission

#### 2. Email Verification
- **Recipient:** Customer email
- **Content:** 6-digit verification code
- **Trigger:** Email verification request
- **Expiration:** 10 minutes

#### 3. Payment Success Notifications
- **Recipient:** Customer email
- **Content:** Payment confirmation and next steps
- **Trigger:** Successful payment verification

#### 4. Upgrade Offer Emails
- **Recipient:** Customer email
- **Content:** Special upgrade offers
- **Trigger:** Post-discovery call

### Email Template Example
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #3B82F6; color: white; padding: 20px; text-align: center;">
    <h1 style="margin: 0; font-size: 24px;">The PM Lens</h1>
  </div>
  <div style="background-color: white; padding: 30px;">
    <!-- Email content -->
  </div>
</div>
```

---

## Deployment Architecture

### Frontend Deployment: Netlify
- **Platform:** Netlify
- **Build Command:** `npm run build`
- **Publish Directory:** `dist/`
- **Domain:** Custom domain with SSL
- **CDN:** Global content delivery network
- **Branch Deployments:** Automatic from Git

### Backend Deployment: Netlify Functions
- **Platform:** Netlify Functions (Serverless)
- **Runtime:** Node.js
- **Functions:** 13 serverless functions
- **Scaling:** Automatic scaling based on demand
- **Cold Start:** Optimized for performance

### Netlify Functions Structure
```
netlify/functions/
├── contact.cjs              # Contact form handling
├── create-order.cjs         # Razorpay order creation
├── verify-payment.cjs       # Payment verification
├── send-verification.cjs    # Email verification
├── verify-code.cjs          # Code verification
├── send-upgrade-email.cjs   # Upgrade email notifications
├── debug-email.cjs          # Email debugging
├── debug-env.cjs            # Environment debugging
├── test-basic.cjs           # Basic function testing
├── test-email.cjs           # Email testing
├── test-verification.cjs    # Verification testing
├── simple-verification.cjs  # Simple verification
└── package.json             # Function dependencies
```

### Environment Configuration
```env
# Production Environment Variables
DATABASE_URL=postgresql://...
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=your-live-secret
CORS_ORIGIN=https://your-domain.com
FRONTEND_URL=https://your-domain.com
```

---

## Security Implementation

### Authentication & Authorization
- **Email Verification:** 6-digit codes with expiration
- **Session Management:** Client-side session handling
- **Input Validation:** Zod schema validation
- **SQL Injection Protection:** Parameterized queries

### Data Protection
- **HTTPS:** SSL/TLS encryption for all communications
- **Environment Variables:** Secure configuration management
- **Database Security:** SSL connections to PostgreSQL
- **Payment Security:** HMAC signature verification

### CORS Configuration
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  credentials: true
}));
```

### Payment Security
```javascript
// HMAC Signature Verification
const text = `${razorpay_order_id}|${razorpay_payment_id}`;
const signature = crypto
  .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
  .update(text)
  .digest('hex');

if (signature !== razorpay_signature) {
  return res.status(400).json({ error: 'Invalid payment signature' });
}
```

---

## Development Environment

### Prerequisites
- **Node.js:** Version 18 or higher
- **npm:** Package manager
- **Git:** Version control
- **PostgreSQL:** Neon database account

### Local Setup
```bash
# Clone repository
git clone https://github.com/iitz-phani/the-pm-lens-2.0.git
cd the-pm-lens-2.0

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development servers
npm run dev          # Frontend (Port 8080)
cd backend && npm run dev  # Backend (Port 5000)
```

### Environment Variables
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your-test-secret

# CORS Configuration
CORS_ORIGIN=http://localhost:8080

# Frontend URL
FRONTEND_URL=http://localhost:8080
```

### Development Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

---

## API Documentation

### Contact Form API
```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'm interested in your services."
}
```

**Response:**
```json
{
  "message": "Message saved successfully",
  "id": 123
}
```

### Email Verification API
```http
POST /api/send-verification
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "message": "Verification code sent successfully"
}
```

### Payment Order Creation API
```http
POST /api/create-order
Content-Type: application/json

{
  "amount": 49900,
  "currency": "INR",
  "receipt": "discovery_call_1234567890",
  "notes": {
    "service": "Discovery Call",
    "description": "30-minute discovery call consultation"
  }
}
```

**Response:**
```json
{
  "id": "order_1234567890",
  "amount": 49900,
  "currency": "INR",
  "receipt": "discovery_call_1234567890"
}
```

### Payment Verification API
```http
POST /api/verify-payment
Content-Type: application/json

{
  "razorpay_order_id": "order_1234567890",
  "razorpay_payment_id": "pay_1234567890",
  "razorpay_signature": "signature_hash"
}
```

**Response:**
```json
{
  "verified": true,
  "payment_id": "pay_1234567890",
  "order_id": "order_1234567890",
  "message": "Payment verified successfully"
}
```

---

## Performance & Scalability

### Frontend Performance
- **Build Optimization:** Vite for fast builds and HMR
- **Code Splitting:** Automatic route-based code splitting
- **Asset Optimization:** Compressed images and optimized bundles
- **Caching:** Browser caching for static assets
- **CDN:** Netlify's global CDN for fast delivery

### Backend Performance
- **Serverless Functions:** Auto-scaling based on demand
- **Connection Pooling:** Database connection optimization
- **Caching:** In-memory caching for verification codes
- **Async Operations:** Non-blocking email sending
- **Error Handling:** Graceful error recovery

### Database Performance
- **Connection Pooling:** Efficient database connections
- **Indexing:** Optimized query performance
- **Serverless:** Neon's serverless PostgreSQL
- **Backup:** Automatic backups and point-in-time recovery

### Monitoring Metrics
- **Response Time:** API endpoint performance
- **Error Rates:** Application error monitoring
- **Database Performance:** Query execution times
- **Email Delivery:** Email success rates
- **Payment Success:** Payment completion rates

---

## Monitoring & Logging

### Application Logging
```javascript
// Console logging for development
console.log('✅ Payment verified:', paymentData);
console.error('❌ Error in /api/contact:', error);

// Structured logging for production
const logPayment = (paymentData) => {
  console.log(JSON.stringify({
    level: 'info',
    message: 'Payment processed',
    payment_id: paymentData.payment_id,
    amount: paymentData.amount,
    timestamp: new Date().toISOString()
  }));
};
```

### Error Handling
```javascript
// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});
```

### Health Checks
```javascript
// Database health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.status(200).json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', database: 'disconnected' });
  }
});
```

---

## Troubleshooting Guide

### Common Issues

#### 1. Database Connection Issues
**Problem:** Cannot connect to PostgreSQL
**Solution:**
- Verify DATABASE_URL in environment variables
- Check SSL configuration
- Ensure database is accessible from your IP

#### 2. Email Sending Failures
**Problem:** Emails not being sent
**Solution:**
- Verify EMAIL_USER and EMAIL_PASS
- Check Gmail app-specific password
- Ensure 2FA is properly configured

#### 3. Payment Verification Failures
**Problem:** Payment verification errors
**Solution:**
- Verify Razorpay keys
- Check signature verification logic
- Ensure order creation is successful

#### 4. CORS Issues
**Problem:** Cross-origin request blocked
**Solution:**
- Update CORS_ORIGIN in environment variables
- Check frontend URL configuration
- Verify Netlify function CORS headers

#### 5. Build Failures
**Problem:** Frontend build errors
**Solution:**
- Clear node_modules and reinstall
- Check TypeScript compilation errors
- Verify all dependencies are installed

### Debug Commands
```bash
# Test database connection
curl http://localhost:5000/api/test-db

# Test email service
curl http://localhost:5000/api/test-email

# Check environment variables
curl http://localhost:8888/.netlify/functions/debug-env

# Test payment creation
curl -X POST http://localhost:5000/api/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount": 49900, "currency": "INR"}'
```

### Log Analysis
```bash
# View Netlify function logs
netlify logs --functions

# View build logs
netlify logs --build

# View deployment logs
netlify logs --deploy
```

---

## Conclusion

The PM Lens 2.0 architecture provides a robust, scalable, and maintainable solution for project management consulting services. The system leverages modern web technologies and best practices to deliver a seamless user experience while maintaining security and performance standards.

### Key Strengths
- **Modern Tech Stack:** React, TypeScript, and Vite for optimal development experience
- **Scalable Architecture:** Serverless functions for automatic scaling
- **Security First:** Comprehensive security measures throughout the stack
- **Performance Optimized:** CDN, caching, and optimized builds
- **Developer Friendly:** Clear documentation and debugging tools

### Future Enhancements
- **Real-time Features:** WebSocket integration for live updates
- **Analytics Dashboard:** User behavior and payment analytics
- **Multi-language Support:** Internationalization (i18n)
- **Advanced Caching:** Redis for session and data caching
- **Microservices:** Service decomposition for better scalability

---

**Document Version:** 1.0  
**Last Updated:** January 2025  
**Maintained By:** Development Team  
**Contact:** phani.bozzam@gmail.com 