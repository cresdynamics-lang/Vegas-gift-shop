import { Mail, Phone, MapPin, Send, Gift, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-brand-charcoal pt-32 pb-12 text-white overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-crimson/10 rounded-full blur-[100px]" />
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-brand-gold/5 rounded-full blur-[80px]" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12 mb-24">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-10 group">
              <span className="text-3xl font-bold tracking-tighter flex items-center gap-3">
                VEGAS <span className="text-brand-crimson italic font-light group-hover:text-brand-gold transition-colors">GIFT SHOP</span>
              </span>
            </Link>
            <p className="text-white/40 text-base leading-relaxed mb-10 max-w-xs font-light italic">
              "Every gift is a bridge between hearts. We curate excellence to make your moments unforgettable."
            </p>
            <div className="flex gap-4">
              <SocialIcon label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </SocialIcon>
              <SocialIcon label="Facebook">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </SocialIcon>
              <SocialIcon label="Twitter">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </SocialIcon>
              <SocialIcon label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </SocialIcon>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-10 opacity-80">Gift Collections</h4>
            <ul className="space-y-5">
              <FooterLink to="/shop">Browse All Gifts</FooterLink>
              <FooterLink to="/shop?category=Executive%20Sets">Executive Gifting</FooterLink>
              <FooterLink to="/shop?category=Luxury%20Watches">Timeless Treasures</FooterLink>
              <FooterLink to="/shop?category=Romantic%20&%20Valentine">Romantic Gestures</FooterLink>
              <FooterLink to="/shop?category=Leather%20Goods">Personalized Leather</FooterLink>
            </ul>
          </div>

          {/* Gifting Concierge */}
          <div>
            <h4 className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-10 opacity-80">The Concierge</h4>
            <ul className="space-y-5">
              <FooterLink to="/about">Our Story</FooterLink>
              <FooterLink to="/corporate">Corporate Solutions</FooterLink>
              <FooterLink to="/shipping">Wrapped & Delivered</FooterLink>
              <FooterLink to="/faq">Gifting FAQ</FooterLink>
              <FooterLink to="/contact">Private Consultation</FooterLink>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-10 opacity-80">Gift Inspiration</h4>
            <p className="text-white/40 text-sm mb-8 leading-relaxed font-light">Subscribe for thoughtful gifting ideas and early access to our seasonal boxes.</p>
            <form className="relative group mb-10">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-sm focus:outline-none focus:border-brand-gold/50 transition-all placeholder:text-white/20 font-light"
              />
              <button className="absolute right-2 top-2 bottom-2 px-6 bg-brand-crimson text-white rounded-xl flex items-center justify-center hover:bg-brand-crimson-mid transition-all shadow-lg active:scale-95 group-hover:shadow-brand-crimson/20">
                <Send size={16} className="mr-2" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Join</span>
              </button>
            </form>
            
            <div className="space-y-5 pt-4 border-t border-white/5">
              <a href="tel:+254700000000" className="flex items-center gap-4 text-xs text-white/40 hover:text-brand-gold transition-colors group">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:border-brand-gold/30 transition-all">
                  <Phone size={14} className="text-brand-gold" />
                </div>
                <span className="font-medium tracking-wider">+254 740 282041</span>
              </a>
              <a href="mailto:concierge@vegasgiftshop.co.ke" className="flex items-center gap-4 text-xs text-white/40 hover:text-brand-gold transition-colors group">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:border-brand-gold/30 transition-all">
                  <Mail size={14} className="text-brand-gold" />
                </div>
                <span className="font-medium tracking-wider">concierge@vegasgiftshop.co.ke</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-white/20 text-[9px] font-bold uppercase tracking-[0.3em] flex items-center gap-2">
              <Gift size={10} className="text-brand-crimson" />
              © 2026 Vegas Gift Shop Luxury. Nairobi's Finest.
            </p>
            <p className="text-white/10 text-[8px] font-medium uppercase tracking-[0.2em] flex items-center gap-2">
              <Sparkles size={8} className="text-brand-gold" />
              Crafted for Memorable Moments.
            </p>
          </div>
          
          <div className="flex items-center gap-8 px-8 py-3 bg-white/[0.02] rounded-full border border-white/5">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/1200px-M-PESA_LOGO-01.svg.png" alt="Mpesa" className="h-5 opacity-20 hover:opacity-100 transition-all grayscale hover:grayscale-0 cursor-pointer" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-3 opacity-20 hover:opacity-100 transition-all grayscale hover:grayscale-0 cursor-pointer" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-5 opacity-20 hover:opacity-100 transition-all grayscale hover:grayscale-0 cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, children }: { to: string, children: React.ReactNode }) => (
  <li>
    <Link to={to} className="text-white/40 text-xs hover:text-brand-gold transition-all font-medium flex items-center gap-3 group">
      <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/0 group-hover:bg-brand-gold transition-all transform scale-0 group-hover:scale-100" />
      {children}
    </Link>
  </li>
);

const SocialIcon = ({ children, label }: { children: React.ReactNode, label: string }) => {
  return (
    <a 
      href="#" 
      aria-label={label}
      className="w-12 h-12 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center text-white/30 hover:text-brand-gold hover:bg-white/[0.08] hover:border-brand-gold/30 transition-all duration-500 hover:-translate-y-1 shadow-lg"
    >
      {children}
    </a>
  );
};

export default Footer;
