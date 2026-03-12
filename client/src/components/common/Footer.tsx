import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#172337', color: '#9e9e9e' }} className="mt-8">
      <div className="max-w-[1300px] mx-auto px-4 py-10">
        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-8 border-b border-gray-700">
          <div>
            <h4 className="text-[11px] font-bold uppercase mb-4 tracking-wider text-gray-400">ABOUT</h4>
            <ul className="space-y-3">
              {['Contact Us', 'About Us', 'Careers', 'Flipkart Stories', 'Press', 'Corporate Information'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs hover:text-white transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase mb-4 tracking-wider text-gray-400">GROUP COMPANIES</h4>
            <ul className="space-y-3">
              {['Myntra', 'Cleartrip', 'Shopsy'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs hover:text-white transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase mb-4 tracking-wider text-gray-400">HELP</h4>
            <ul className="space-y-3">
              {['Payments', 'Shipping', 'Cancellation & Returns', 'FAQ', 'Report Infringement'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs hover:text-white transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase mb-4 tracking-wider text-gray-400">CONSUMER POLICY</h4>
            <ul className="space-y-3">
              {['Return Policy', 'Terms Of Use', 'Security', 'Privacy', 'Sitemap', 'EPR Compliance'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs hover:text-white transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase mb-4 tracking-wider text-gray-400">FOLLOW US</h4>
            <div className="flex gap-4 text-lg">
              <a href="#" className="hover:text-white transition-colors duration-200" title="Facebook">
                <FaFacebook />
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200" title="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200" title="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200" title="YouTube">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left - Business Links */}
          <div className="space-y-3">
            <h4 className="text-[12px] font-bold uppercase text-gray-400 mb-4">BUSINESS</h4>
            <div className="flex flex-col gap-2">
              <a href="#" className="text-xs hover:text-white transition-colors duration-200 flex items-center gap-2">
                🏢 Become a Seller
              </a>
              <a href="#" className="text-xs hover:text-white transition-colors duration-200 flex items-center gap-2">
                📢 Advertise
              </a>
              <a href="#" className="text-xs hover:text-white transition-colors duration-200 flex items-center gap-2">
                🎁 Gift Cards
              </a>
            </div>
          </div>

          {/* Center - Help */}
          <div className="space-y-3">
            <h4 className="text-[12px] font-bold uppercase text-gray-400 mb-4">HELP</h4>
            <div className="flex flex-col gap-2">
              <a href="#" className="text-xs hover:text-white transition-colors duration-200 flex items-center gap-2">
                ❓ Help Centre
              </a>
              <a href="#" className="text-xs hover:text-white transition-colors duration-200 flex items-center gap-2">
                📞 Contact Us
              </a>
            </div>
          </div>

          {/* Right - Info */}
          <div className="space-y-3">
            <h4 className="text-[12px] font-bold uppercase text-gray-400 mb-4">CONTACT</h4>
            <div className="text-xs space-y-2">
              <p>Flipkart Internet Pvt. Ltd.</p>
              <p>Buildings Alyssa, Bengaluru & Clove Embassy Tech Village</p>
              <p>Outer Ring Road, Bangalore, 560103</p>
              <p className="text-blue-400 hover:text-blue-300 cursor-pointer">044-45614700 / 044-67415800</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © 2007–2026 Flipkart.com (Clone for Educational Purposes)
          </p>
          <div className="flex gap-3">
            <img src="https://static-assets-web.flixcart.com/fk-p-flag/en_US.svg" alt="EN" className="w-5 h-3" />
            <span className="text-xs text-gray-400">India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
