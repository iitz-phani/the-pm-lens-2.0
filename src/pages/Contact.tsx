import React, { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          body: JSON.stringify(form)
        }
      );
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      setSubmitted(true);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl py-16 px-4 text-white">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <p className="mb-4">We’d love to hear from you!</p>
      <div className="mb-6">
        <p><b>Email:</b> <a href="mailto:phani.bozzam@gmail.com" className="text-brand-blue underline">phani.bozzam@gmail.com</a></p>
        <p><b>Phone / WhatsApp:</b> <a href="tel:+916302094966" className="text-brand-blue underline">+91 63020 94966</a> (Mon–Fri 10 am–6 pm IST)</p>
        <p><b>Business Hours:</b> Monday–Friday</p>
        <p><b>LinkedIn:</b> <a href="https://linkedin.com/in/phani-bozzam" target="_blank" rel="noopener noreferrer" className="text-brand-blue underline">linkedin.com/in/phani-bozzam</a></p>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Contact Form</h2>
      {submitted ? (
        <div className="text-green-400 font-semibold">Thank you for reaching out! We'll get back to you soon.</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="w-full bg-dark-card border border-dark-border rounded-lg p-4 text-white placeholder-gray-500 text-lg"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            className="w-full bg-dark-card border border-dark-border rounded-lg p-4 text-white placeholder-gray-500 text-lg"
          />
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Subject"
            required
            className="w-full bg-dark-card border border-dark-border rounded-lg p-4 text-white placeholder-gray-500 text-lg"
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            required
            rows={4}
            className="w-full bg-dark-card border border-dark-border rounded-lg p-4 text-white placeholder-gray-500 text-lg"
          ></textarea>
          {error && <div className="text-red-400 font-semibold">{error}</div>}
          <button
            type="submit"
            className="w-full bg-brand-blue hover:bg-brand-blue-dark text-lg py-3 rounded-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Contact; 