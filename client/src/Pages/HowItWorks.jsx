import React from 'react';
import HeroImage from '../assets/robison-HeadsUpGuys-1200x.jpg';

function HowItWorks() {
  return (
    <div className="bg-gradient-to-tr from-blue-100 to-purple-100 via-pink-50">
      {/* Hero Section */}
      <div className="relative">
        <img src={HeroImage} alt="How It Works" className="w-full h-[80vh] object-cover" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl md:text-7xl text-white font-serif font-bold underline underline-offset-8">
            How It Works
          </h1>
        </div>
      </div>

      {/* Description Section */}
      <div className="py-12 px-6 md:px-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          A Seamless Experience
        </h2>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
          Discover the simplicity of getting started with our AI-driven counseling platform. Navigating through our tailored features will feel intuitive, whether it's your first time or you're a returning user.
        </p>
      </div>

      {/* Steps Section */}
      <div className="bg-white py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-500 text-white text-2xl font-bold rounded-full flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Sign Up</h3>
            <p className="text-gray-600">
              Create an account quickly and securely to get started.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-500 text-white text-2xl font-bold rounded-full flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Explore</h3>
            <p className="text-gray-600">
              Browse our platform to familiarize yourself with our comprehensive features.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-500 text-white text-2xl font-bold rounded-full flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Book a Session</h3>
            <p className="text-gray-600">
              Schedule an online counseling session that fits your availability directly through our platform.
            </p>
          </div>
          
          {/* Step 4 */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-500 text-white text-2xl font-bold rounded-full flex items-center justify-center mb-4">
              4
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Receive Confirmation</h3>
            <p className="text-gray-600">
              Get an email with the session details and link.
            </p>
          </div>

          {/* Step 5 */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-500 text-white text-2xl font-bold rounded-full flex items-center justify-center mb-4">
              5
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Join the Community</h3>
            <p className="text-gray-600">
              Upload and read blogs on mental health and wellness in our community section.
            </p>
          </div>

          {/* Step 6 */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-500 text-white text-2xl font-bold rounded-full flex items-center justify-center mb-4">
              6
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Chat with AI Friend</h3>
            <p className="text-gray-600">
              Use our chat app to talk with your virtual friend anytime for support and guidance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
