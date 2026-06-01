import { Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const linkClass = 'text-gray-400 hover:text-white text-xs sm:text-sm';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-8 pb-4 sm:pt-12 sm:pb-6 lg:pt-16 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-5 sm:gap-x-6 sm:gap-y-8 lg:gap-12 mb-5 sm:mb-8 lg:mb-12">
          {/* Brand — full width on mobile, compact */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-2 sm:mb-4 lg:mb-6">
              <span className="text-base sm:text-xl lg:text-2xl font-bold tracking-tight">
                VEGAS GIFT SHOP
              </span>
            </Link>
            <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-5 lg:mb-6 leading-snug max-w-md">
              Premium gifts and same-day delivery across Nairobi and Kenya.
            </p>
            <div className="flex gap-2 sm:gap-4">
              <a
                href="#"
                aria-label="Instagram"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 sm:w-4 sm:h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 sm:w-4 sm:h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs sm:text-base lg:text-lg font-bold mb-2 sm:mb-4 lg:mb-6 uppercase tracking-wide text-gray-200 sm:normal-case sm:tracking-normal">
              Quick Links
            </h4>
            <ul className="space-y-1 sm:space-y-2 lg:space-y-3">
              <li><Link to="/about" className={linkClass}>About Us</Link></li>
              <li><Link to="/shop" className={linkClass}>Shop</Link></li>
              <li><Link to="/contact" className={linkClass}>Contact</Link></li>
              <li><Link to="/faq" className={linkClass}>FAQs</Link></li>
              <li><Link to="/blog" className={linkClass}>Blog</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xs sm:text-base lg:text-lg font-bold mb-2 sm:mb-4 lg:mb-6 uppercase tracking-wide text-gray-200 sm:normal-case sm:tracking-normal">
              Service
            </h4>
            <ul className="space-y-1 sm:space-y-2 lg:space-y-3">
              <li><Link to="/shipping" className={linkClass}>Shipping</Link></li>
              <li><Link to="/returns" className={linkClass}>Returns</Link></li>
              <li><Link to="/privacy-policy" className={linkClass}>Privacy</Link></li>
              <li><Link to="/terms" className={linkClass}>Terms</Link></li>
              <li><Link to="/admin/login" className={linkClass}>Staff</Link></li>
            </ul>
          </div>

          {/* Contact — spans both columns on mobile, single column on lg */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-xs sm:text-base lg:text-lg font-bold mb-2 sm:mb-4 lg:mb-6 uppercase tracking-wide text-gray-200 sm:normal-case sm:tracking-normal">
              Contact
            </h4>
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5 sm:flex-col sm:gap-x-0 sm:gap-y-3 lg:space-y-4">
              <li className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm min-w-0">
                <MapPin size={14} className="text-red-600 shrink-0 sm:w-[18px] sm:h-[18px]" />
                <span className="truncate">Nairobi CBD, Kenya</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm min-w-0">
                <Phone size={14} className="text-red-600 shrink-0 sm:w-[18px] sm:h-[18px]" />
                <a href="tel:+254792943753" className="hover:text-white truncate">
                  +254 792 943753
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm min-w-0">
                <Mail size={14} className="text-red-600 shrink-0 sm:w-[18px] sm:h-[18px]" />
                <a href="mailto:info@vegasgiftshop.co.ke" className="hover:text-white truncate">
                  info@vegasgiftshop.co.ke
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-3 sm:pt-5 lg:pt-8 flex flex-row flex-wrap justify-between items-center gap-x-3 gap-y-2">
          <p className="text-gray-500 text-[10px] sm:text-xs lg:text-sm leading-tight">
            © 2026 Vegas Gift Shop
          </p>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wide">M-Pesa</span>
            <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wide">Visa</span>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
              alt="Mastercard"
              className="h-4 sm:h-5 lg:h-6 object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
