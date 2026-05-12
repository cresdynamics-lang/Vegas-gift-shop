import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import menGiftsImg from '../assets/gifts for men 1.jpg';
import womenGiftsImg from '../assets/gifts for women 1.jpg';
import corporateImg from '../assets/mug gift 1.jpg';
import romanticImg from '../assets/teddy bear gift.jpg';

const categories = [
  {
    name: 'Gifts for Him',
    description: 'Precision timepieces and fine leather goods for the modern gentleman.',
    image: menGiftsImg,
    size: 'large',
    href: '/shop?category=Men Gifts',
    badge: 'Trending'
  },
  {
    name: 'Gifts for Her',
    description: 'Elegant jewelry and luxury self-care essentials.',
    image: womenGiftsImg,
    size: 'small',
    href: '/shop?category=Women Gifts',
    badge: 'Popular'
  },
  {
    name: 'Corporate Excellence',
    description: 'Branded executive sets and prestige awards.',
    image: corporateImg,
    size: 'small',
    href: '/shop?category=Corporate Gifts',
  },
  {
    name: 'Romantic Collection',
    description: 'Timeless floral arrangements and luxury tokens of affection.',
    image: romanticImg,
    size: 'wide',
    href: '/shop?category=Romantic & Valentine',
    badge: 'New'
  },
];

const CategoryGrid = () => {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-[1px] bg-brand-crimson" />
            <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-brand-crimson">The Collections</span>
            <div className="w-12 h-[1px] bg-brand-crimson" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-brand-charcoal mb-6">Curated for Distinction</h2>
          <p className="text-brand-text-muted max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Select a collection tailored to your specific occasion and discover the pinnacle of luxury gifting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-8 min-h-[800px] md:h-[700px]">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative overflow-hidden rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-700 ${
                cat.size === 'large' ? 'md:col-span-2 md:row-span-2' : 
                cat.size === 'wide' ? 'md:col-span-2' : ''
              }`}
            >
              <Link to={cat.href} className="block w-full h-full relative">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="absolute inset-0 w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-transform duration-2000 ease-out"
                />
                
                {/* Overlays */}
                <div className="absolute inset-0 bg-brand-charcoal/20 group-hover:bg-brand-charcoal/5 transition-colors duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/90 via-brand-charcoal/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
                
                {cat.badge && (
                  <div className="absolute top-8 left-8 bg-brand-crimson text-white text-[9px] font-bold uppercase tracking-[0.3em] px-4 py-2 rounded-full z-10 shadow-lg">
                    {cat.badge}
                  </div>
                )}

                <div className="absolute bottom-0 left-0 p-10 w-full z-10">
                  <h3 className="text-white text-3xl font-bold mb-4 tracking-tight leading-tight">{cat.name}</h3>
                  <p className="text-white/60 text-sm font-light mb-8 max-w-[280px] transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out">
                    {cat.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-brand-gold font-bold text-[10px] uppercase tracking-[0.3em] group/btn">
                    <span className="relative">
                      View Collection
                      <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-gold group-hover/btn:w-full transition-all duration-500" />
                    </span>
                    <div className="w-10 h-10 rounded-full border border-brand-gold/30 flex items-center justify-center group-hover/btn:bg-brand-gold group-hover/btn:text-white transition-all duration-500">
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        →
                      </motion.div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
