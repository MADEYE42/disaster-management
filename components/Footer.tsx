import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-300 text-gray-900 py-12">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-green-800 text-lg font-bold">M</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Disaster Management</span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Your all-in-one solution for disaster preparedness, response, and recovery. Stay informed, connected, and safe.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-700 hover:text-green-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-700 hover:text-green-600 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-700 hover:text-green-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-700 hover:text-green-600 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media and Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-green-600 transition-colors">
                <Facebook size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-green-600 transition-colors">
                <Twitter size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-green-600 transition-colors">
                <Instagram size={24} />
              </a>
              <a href="mailto:support@disastermanagementapp.com" className="text-gray-700 hover:text-green-600 transition-colors">
                <Mail size={24} />
              </a>
            </div>
            <p className="text-gray-700">
              Email: <a href="mailto:support@disastermanagementapp.com" className="hover:text-green-600 transition-colors">support@disastermanagementapp.com</a>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-8 border-t border-gray-900 text-center">
          <p className="text-gray-700">© 2025 Disaster Management App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}