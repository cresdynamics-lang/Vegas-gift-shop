import { ArrowRight, ShoppingBag, Truck, ShieldCheck, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import heroImg from '../assets/gifts for women 6.jpg';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-brand-charcoal text-white pt-20 pb-32">
      {/* Premium Background Elements */}
      <div className="absolute top-0 right-0 w-full h-full">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-brand-crimson/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-brand-gold/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-brand-gold" />
              <span className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.4em]">
                Elite Gifting Concierge • Nairobi
              </span>
            </div>

            <h1 className="text-6xl lg:text-8xl font-bold leading-[1] mb-10 tracking-tight">
              Crafting <br />
              <span className="text-brand-gold italic font-light">Excellence</span> <br />
              Since 2018
            </h1>

            <p className="text-white/50 text-xl mb-12 max-w-lg leading-relaxed font-light italic">
              "Every gift tells a story. We ensure yours is one of unmatched luxury and thoughtful precision."
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 mb-16">
              <Link 
                to="/shop" 
                className="group relative overflow-hidden bg-brand-crimson text-white px-10 py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs transition-all shadow-2xl shadow-brand-crimson/20 hover:shadow-brand-crimson/40 active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Explore Boutique
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Link>
              
              <Link 
                to="/corporate" 
                className="group flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-white hover:text-brand-gold transition-colors py-5"
              >
                Corporate Concierge
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-brand-gold/50 transition-all">
                  <ShoppingBag size={16} />
                </div>
              </Link>
            </div>

            {/* Elite Stats */}
            <div className="flex items-center gap-12 pt-12 border-t border-white/5">
              <div>
                <div className="flex items-center gap-1 text-brand-gold mb-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={10} className="fill-brand-gold" />)}
                </div>
                <p className="text-xl font-bold text-white mb-0.5 tracking-tight">5,000+</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">Private Clients</p>
              </div>
              <div className="w-[1px] h-10 bg-white/5" />
              <div>
                <p className="text-xl font-bold text-white mb-0.5 tracking-tight">100%</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">Bespoke Design</p>
              </div>
              <div className="w-[1px] h-10 bg-white/5" />
              <div>
                <p className="text-xl font-bold text-white mb-0.5 tracking-tight">Same Day</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">Nairobi Delivery</p>
              </div>
            </div>
          </motion.div>

          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative z-10 p-4 bg-white/5 backdrop-blur-3xl rounded-[40px] border border-white/10 shadow-2xl group">
              <div className="relative rounded-[32px] overflow-hidden aspect-[4/5]">
                <img 
                  src={heroImg} 
                  alt="Vegas Gift Shop Luxury Collection" 
                  className="w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-transform duration-2000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/60 via-transparent to-transparent" />
              </div>
            </div>

            {/* Floating Trust Badges */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl z-20 flex items-center gap-4 border border-brand-stone"
            >
              <div className="w-12 h-12 bg-brand-crimson/10 text-brand-crimson rounded-2xl flex items-center justify-center">
                <Truck size={24} />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-brand-text-hint mb-1">Guaranteed Delivery</p>
                <p className="text-sm font-bold text-brand-charcoal">Express Nairobi</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -top-10 -right-10 bg-brand-charcoal/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl z-20 flex items-center gap-4 border border-white/10"
            >
              <div className="w-12 h-12 bg-brand-gold/20 text-brand-gold rounded-2xl flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-1">Premium Quality</p>
                <p className="text-sm font-bold text-white">Inspected & Verified</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
