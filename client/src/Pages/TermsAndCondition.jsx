// src/components/TermsAndConditions.js
import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="bg-gradient-to-t from-pink-200 via-white py-10 to-pink-100">
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-semibold text-center text-blue-600 mb-6">Terms and Conditions</h1>
      <p className="text-lg text-center text-gray-700 mb-10">
        Welcome to <span className="text-pink-600 text-pretty"> OPEN HEART</span>. These Terms and Conditions govern your use of our website and services. 
        Please read them carefully.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl text-blue-600 mb-2">1. Acceptance of Terms</h2>
        <p className="text-gray-700">
          By using <span className="text-pink-600 text-pretty"> OPEN HEART</span>, you agree to comply with these terms and conditions. If you do not agree, 
          please do not use the website or services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl text-blue-600 mb-2">2. Use of Services</h2>
        <p className="text-gray-700">
          Our platform offers mental health resources, counseling services, and educational content. You agree to use these 
          services in a responsible and respectful manner.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl text-blue-600 mb-2">3. Privacy and Data Security</h2>
        <p className="text-gray-700">
          We value your privacy. Your personal data will be handled according to our Privacy Policy. We strive to protect 
          your information but cannot guarantee absolute security.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl text-blue-600 mb-2">4. Counseling Sessions</h2>
        <p className="text-gray-700">
          If you book a session with one of our counselors, you acknowledge that these sessions are for informational 
          and therapeutic purposes. They are not substitutes for medical advice or treatment.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl text-blue-600 mb-2">5. Payment and Refund Policy</h2>
        <p className="text-gray-700">
          Our services may involve charges for certain offerings. All payments are processed securely. Refunds are available 
          based on the specific conditions outlined in our Refund Policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl text-blue-600 mb-2">6. Limitation of Liability</h2>
        <p className="text-gray-700">
          We are not liable for any damages, loss, or injury that may result from the use of our website or services. You 
          use our platform at your own risk.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl text-blue-600 mb-2">7. Termination of Services</h2>
        <p className="text-gray-700">
          We reserve the right to suspend or terminate your access to our services if you violate these Terms and Conditions.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl text-blue-600 mb-2">8. Changes to Terms</h2>
        <p className="text-gray-700">
          We may update these Terms and Conditions from time to time. Any changes will be communicated to users through 
          our website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl text-blue-600 mb-2">9. Contact Us</h2>
        <p className="text-gray-700">
          If you have any questions about these Terms and Conditions, feel free to contact us at [your contact info].
        </p>
      </section>

      <footer className="text-center text-gray-500 text-sm mt-12">
        <p>&copy; 2025 [Your Mental Health Project]. All Rights Reserved.</p>
      </footer>
    </div>
    </div>
  );
};

export default TermsAndConditions;
