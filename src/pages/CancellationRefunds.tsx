import React from 'react';

const CancellationRefunds = () => (
  <div className="container mx-auto max-w-3xl py-16 px-4 text-white">
    <h1 className="text-4xl font-bold mb-6">Cancellation & Refunds Policy</h1>
    <p className="text-gray-400 mb-4">Last updated 10 July 2025</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2">1.1 Scope</h2>
    <p>This policy applies to all paid services, digital products, and training sessions purchased through thepmlens.netlify.app (the “Site”).</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2">1.2 Consulting & Coaching Sessions</h2>
    <p><b>Rescheduling:</b> You may reschedule a booked session up to 24 hours before the start time at no cost.</p>
    <p><b>Cancellation & Refunds:</b></p>
    <ul className="list-disc ml-6 mb-4">
      <li>If you cancel ≥24 hours before the session, you’ll receive a full refund minus any payment-gateway fee (typically ~2%).</li>
      <li>If you cancel with &lt;24 hours’ notice or do not attend, the fee is non-refundable.</li>
    </ul>
    <h2 className="text-2xl font-semibold mt-8 mb-2">1.3 Digital Downloads / Courses</h2>
    <p>Because these are instantly accessible after purchase, all sales are final. If you experience technical issues accessing content, contact us within 7 days and we’ll ensure you receive working access or, at our discretion, a full refund.</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2">1.4 Workshops & Webinars</h2>
    <p>Launch-offer (₹0) events carry no monetary refund—but we may move you to a future cohort if you can’t attend.</p>
    <p>Paid workshops follow the same rules as consulting sessions (§1.2).</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2">1.5 How to Request a Refund</h2>
    <p>Email <a href="mailto:phani.bozzam@gmail.com" className="text-brand-blue underline">phani.bozzam@gmail.com</a> with: order number, service name, and reason. Approved refunds are processed to the original payment method within 7 business days.</p>
    <h2 className="text-2xl font-semibold mt-8 mb-2">1.6 Exceptions</h2>
    <p>We reserve the right to issue partial or full refunds outside these rules in exceptional circumstances (e.g., proven medical emergency).</p>
  </div>
);

export default CancellationRefunds; 