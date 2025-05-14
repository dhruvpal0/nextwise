// src/components/Footer.jsx
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand Section */}
        <div>
          <h2 className="text-xl font-bold mb-2">LMS Academy</h2>
          <p className="text-sm">Empowering learners with high-quality web development education.</p>
        </div>

        {/* Links Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/courses" className="hover:underline">Courses</a></li>
            <li><a href="/about" className="hover:underline">About Us</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
            <li><a href="/faq" className="hover:underline">FAQ</a></li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" aria-label="Facebook" className="hover:text-blue-600">
              <FaFacebookF size={20} />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-sky-500">
              <FaTwitter size={20} />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-blue-700">
              <FaLinkedinIn size={20} />
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-red-600">
              <FaYoutube size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center py-4 border-t border-gray-300 dark:border-gray-700 text-sm">
        &copy; {new Date().getFullYear()} LMS Academy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
