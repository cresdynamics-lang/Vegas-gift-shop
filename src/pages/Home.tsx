import Hero from '../components/Hero';
import CategoryGrid from '../components/CategoryGrid';
import ProductSection from '../components/ProductSection';
import Features from '../components/Features';
import { products } from '../data/products';
import { motion } from 'framer-motion';
import { Sparkles, Star, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Get featured products
  const bestSellers = products.slice(0, 4);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);
  const saleProducts = products.filter(p => p.isSale).slice(0, 4);

  return (
    <main className="bg-brand-warm-white">
      <Hero />
      
      {/* Trust Banner - Horizontal Scrolling/Marquee Style or Static Elite List */}
      <div className="bg-white border-y border-brand-stone py-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-12 lg:justify-between items-center">
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-brand-warm-white rounded-full flex items-center justify-center border border-brand-stone group-hover:border-brand-gold transition-all">
              <Sparkles className="text-brand-gold" size={18} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-charcoal">Elite Quality</span>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-brand-warm-white rounded-full flex items-center justify-center border border-brand-stone group-hover:border-brand-gold transition-all">
              <Star className="text-brand-gold" size={18} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-charcoal">Custom Engraving</span>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-brand-warm-white rounded-full flex items-center justify-center border border-brand-stone group-hover:border-brand-gold transition-all">
              <Heart className="text-brand-gold" size={18} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-charcoal">Bespoke Gifting</span>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-brand-warm-white rounded-full flex items-center justify-center border border-brand-stone group-hover:border-brand-gold transition-all">
              <Star className="text-brand-gold" size={18} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-charcoal">Verified Luxury</span>
          </div>
        </div>
      </div>

      <CategoryGrid />

      {/* Best Sellers */}
      <ProductSection 
        title="Best Selling Treasures" 
        subtitle="Experience our most sought-after collections, curated for those who settle for nothing less than excellence."
        products={bestSellers}
        bgColor="bg-brand-warm-white"
      />

      {/* New Arrivals */}
      <ProductSection 
        title="The New Collection" 
        subtitle="Be the first to experience our latest acquisitions, where modern aesthetics meet timeless luxury."
        products={newArrivals}
        bgColor="bg-white"
      />

      {/* High-Fidelity Call to Action Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative rounded-[48px] overflow-hidden bg-brand-charcoal py-24 lg:py-40 px-8 lg:px-24">
            <div className="absolute inset-0 opacity-20 bg-[url('/src/assets/gifts for women 5.jpg')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal via-brand-charcoal/80 to-transparent" />
            
            <div className="relative z-10 max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-block px-5 py-2 bg-brand-gold/20 text-brand-gold rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-10 border border-brand-gold/30">
                  Corporate Concierge
                </span>
                <h2 className="text-5xl lg:text-7xl font-bold text-white mb-10 leading-[1.1] tracking-tight">
                  Prestige Awards & <br />
                  <span className="text-brand-gold italic font-light">Custom</span> Engraving
                </h2>
                <p className="text-white/50 text-xl mb-14 leading-relaxed font-light">
                  Elevate your corporate identity. We specialize in precision-engraved executive trophies and plaques that honor true achievement.
                </p>
                <div className="flex flex-wrap gap-8">
                  <Link to="/shop?category=Awards & Trophies" className="btn-primary !px-12 !py-6 shadow-2xl shadow-brand-crimson/20">
                    Explore Awards
                  </Link>
                  <Link to="/contact" className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-white hover:text-brand-gold transition-colors">
                    Private Consultation
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Features />

      {/* Promotional Section */}
      <ProductSection 
        title="The Boutique Edit" 
        subtitle="Discover exclusive seasonal offers on selected luxury items from our premium collection."
        products={saleProducts}
        bgColor="bg-brand-warm-white"
      />

      {/* Newsletter Section */}
      <section className="py-32 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="bg-brand-charcoal rounded-[48px] p-12 lg:p-24 text-center relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-crimson/10 rounded-full blur-[100px] translate-x-1/4 -translate-y-1/4" />
             <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-gold/5 rounded-full blur-[80px] -translate-x-1/4 translate-y-1/4" />
             
             <div className="relative z-10">
                <span className="text-brand-gold text-[10px] font-bold uppercase tracking-[0.5em] mb-8 block">Inner Circle</span>
                <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8 tracking-tight">Access the Extraordinary</h2>
                <p className="text-white/40 text-lg mb-16 max-w-xl mx-auto leading-relaxed font-light italic">
                  "Be the first to experience new collections and exclusive events curated for the discerning few."
                </p>
                <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                  <input 
                    type="email" 
                    placeholder="Your private email address" 
                    className="flex-1 px-8 py-5 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/20 focus:bg-white/[0.08] focus:border-brand-gold/50 outline-none transition-all font-light text-sm"
                  />
                  <button className="bg-brand-gold text-brand-charcoal px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-brand-crimson hover:text-white transition-all transform active:scale-95 shadow-xl shadow-brand-gold/10">
                    Subscribe
                  </button>
                </form>
             </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Home;
