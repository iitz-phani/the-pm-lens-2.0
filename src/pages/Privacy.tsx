import React from 'react';

const Privacy = () => (
  <div className="container mx-auto max-w-3xl py-16 px-4 text-white">
    <h1 className="text-4xl font-bold mb-6">Privacy Notice</h1>
    <p className="text-gray-400 mb-4">Last updated 10 July 2025</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2">3.1 Who We Are</h2>
    <p>The PM Lens operates thepmlens.netlify.app and provides professional services worldwide.</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2">3.2 What Data We Collect</h2>
    <table className="w-full mb-4 border border-gray-700 text-left">
      <thead>
        <tr className="bg-dark-border">
          <th className="p-2">Category</th>
          <th className="p-2">Examples</th>
          <th className="p-2">Purpose</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="p-2">Identity & Contact</td>
          <td className="p-2">Name, email, phone, LinkedIn URL</td>
          <td className="p-2">Service delivery, invoices</td>
        </tr>
        <tr>
          <td className="p-2">Payment</td>
          <td className="p-2">Transaction ID, last 4 digits of card</td>
          <td className="p-2">Record-keeping (handled by gateway)</td>
        </tr>
        <tr>
          <td className="p-2">Usage</td>
          <td className="p-2">Pages viewed, referral source, device type</td>
          <td className="p-2">Improve site performance</td>
        </tr>
        <tr>
          <td className="p-2">Marketing</td>
          <td className="p-2">Newsletter preferences, survey answers</td>
          <td className="p-2">Send relevant updates</td>
        </tr>
      </tbody>
    </table>
    <h2 className="text-2xl font-semibold mt-8 mb-2">3.3 Legal Bases (DPDP Act 2023 & GDPR)</h2>
    <p>We process data only when: (a) you consent (newsletter sign-up), (b) it’s necessary for a contract (deliver paid service), or (c) we have a legitimate interest that doesn’t override your rights (analytics).</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2">3.4 Cookies</h2>
    <p>We use essential cookies for site functionality and optional analytics cookies (Google Analytics 4). You can opt out of non-essential cookies via the banner.</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2">3.5 Data Sharing</h2>
    <p>We never sell your data. Trusted sub-processors (e.g., payment gateways, email service providers) handle data under contractual DPDP-compliant terms.</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2">3.6 Retention</h2>
    <p>We keep client records for 6 years to comply with tax regulations, unless a shorter/longer period is required by law or a contract.</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2">3.7 Your Rights</h2>
    <ul className="list-disc ml-6 mb-4">
      <li>Access or correct your data</li>
      <li>Withdraw consent at any time</li>
      <li>Request deletion (“right to be forgotten”)</li>
    </ul>
    <p>Email <a href="mailto:phani.bozzam@gmail.com" className="text-brand-blue underline">phani.bozzam@gmail.com</a> with your request; we’ll respond within 15 days.</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2">3.8 Data Security</h2>
    <p>We employ SSL/TLS encryption, role-based access, and periodic security audits. Hosting is on AWS Mumbai, with ISO 27001-certified infrastructure.</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2">3.9 Contact</h2>
    <p>Questions? See “Contact Us” below.</p>
  </div>
);

export default Privacy; 