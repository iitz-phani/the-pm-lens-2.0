import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

const Contact = () => {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    subject: '', 
    message: '',
    verificationCode: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Reset verification when email changes
    if (e.target.name === 'email') {
      setEmailVerified(false);
      setVerificationSent(false);
      setForm(prev => ({ ...prev, verificationCode: '' }));
    }
  };

  const sendVerificationCode = async () => {
    if (!form.email || !form.email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const response = await fetch(
        '/.netlify/functions/simple-verification',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: form.email, action: 'send' })
        }
      );

      const data = await response.json();
      setVerificationSent(true);
      
      if (data.emailSent) {
        // Email was sent successfully

        
        toast({
          title: "✅ Verification Code Sent!",
          description: "Please check your email for the verification code.",
          duration: 5000,
        });
      } else {
        // Email failed - show error message

        
        toast({
          title: "❌ Email Delivery Failed",
          description: "Unable to send verification code. Please try again later.",
          variant: "destructive",
          duration: 8000,
        });
      }
    } catch (err) {
      setError('Failed to send verification code. Please try again.');
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const verifyCode = async () => {
    if (!form.verificationCode || form.verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the 6-digit verification code.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const response = await fetch(
        '/.netlify/functions/simple-verification',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: form.email, 
            code: form.verificationCode,
            action: 'verify'
          })
        }
      );

      if (!response.ok) {
        throw new Error('Invalid verification code');
      }

      setEmailVerified(true);
      toast({
        title: "Email Verified!",
        description: "Your email has been successfully verified.",
      });
    } catch (err) {
      setError('Invalid verification code. Please try again.');
      toast({
        title: "Verification Failed",
        description: "Invalid verification code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!emailVerified) {
      toast({
        title: "Email Not Verified",
        description: "Please verify your email address before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch(
        import.meta.env.PROD
          ? '/.netlify/functions/contact'
          : 'http://localhost:5000/api/contact',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            subject: form.subject,
            message: form.message
          })
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      setSubmitted(true);
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
    } catch (err) {
      setError('Failed to send message. Please try again.');
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto max-w-4xl py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            Contact Us
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We'd love to hear from you! Please verify your email to ensure we can reach you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-white">Get in Touch</h2>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <a href="mailto:phani.bozzam@gmail.com" className="text-blue-400 hover:text-blue-300 underline">
                    phani.bozzam@gmail.com
                  </a>
                </div>
                <p><strong>Phone / WhatsApp:</strong> <a href="tel:+916302094966" className="text-blue-400 hover:text-blue-300 underline">+91 63020 94966</a></p>
                <p><strong>Business Hours:</strong> Monday–Friday, 10 AM–6 PM IST</p>
                <p><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/phani-bozzam" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">linkedin.com/in/phani-bozzam</a></p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
              <h3 className="text-lg font-semibold mb-3 text-white">Why Email Verification?</h3>
              <p className="text-gray-400 text-sm">
                We verify your email address to ensure we can respond to your inquiry and to protect against spam messages.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white">Send Message</h2>
            
            {submitted ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-400 mb-2">Message Sent!</h3>
                <p className="text-gray-400">Thank you for reaching out. I'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
                
                <div className="space-y-3">
                  <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                  
                  {!emailVerified && form.email && (
                    <div className="space-y-3">
                      {!verificationSent ? (
                        <Button
                          type="button"
                          onClick={sendVerificationCode}
                          disabled={isVerifying}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          {isVerifying ? 'Sending...' : 'Send Verification Code'}
                        </Button>
                      ) : (
                        <div className="space-y-3">
                          <Input
                            type="text"
                            name="verificationCode"
                            value={form.verificationCode}
                            onChange={handleChange}
                            placeholder="Enter 6-digit verification code"
                            maxLength={6}
                            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                          />
                          <div className="flex gap-3">
                            <Button
                              type="button"
                              onClick={verifyCode}
                              disabled={isVerifying || !form.verificationCode}
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                            >
                              {isVerifying ? 'Verifying...' : 'Verify Code'}
                            </Button>
                            <Button
                              type="button"
                              onClick={sendVerificationCode}
                              disabled={isVerifying}
                              variant="outline"
                              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                              Resend
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {emailVerified && (
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <CheckCircle className="h-4 w-4" />
                      Email verified successfully
                    </div>
                  )}
                </div>

                <Input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  required
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
                
                <Textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                  rows={4}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
                
                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
                
                <Button
                  type="submit"
                  disabled={isSubmitting || !emailVerified}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 