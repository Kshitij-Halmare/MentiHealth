import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">About Open Heart</h3>
            <p className="text-sm text-gray-400">
              At Open Heart, we are dedicated to your mental well-being, offering AI-driven conversations and professional counseling services to help you navigate life’s challenges.
            </p>
          </div>

          {/* Navigation Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-emerald-400">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-emerald-400">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-emerald-400">Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-emerald-400">Contact</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>Email: <a href="mailto:support@openheart.com" className="hover:text-emerald-400">support@openheart.com</a></li>
              <li>Phone: <a href="tel:+1234567890" className="hover:text-emerald-400">+1 (234) 567-890</a></li>
              <li>Address: 123 Open Heart Lane, Serenity City</li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full hover:bg-emerald-400 transition"
              >
                <FaFacebookF className="text-white text-xl" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full hover:bg-emerald-400 transition"
              >
                <FaTwitter className="text-white text-xl" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full hover:bg-emerald-400 transition"
              >
                <FaInstagram className="text-white text-xl" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full hover:bg-emerald-400 transition"
              >
                <FaLinkedinIn className="text-white text-xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Open Heart. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
