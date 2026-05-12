import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Eye, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { type Product } from '../data/products';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  bgColor?: string;
}

const ProductSection = ({ title, subtitle, products, bgColor = 'bg-white' }: ProductSectionProps) => {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <section className={`py-32 ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-[1px] bg-brand-crimson" />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-crimson">Collection</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-brand-charcoal tracking-tight">{title}</h2>
            {subtitle && <p className="text-brand-text-muted mt-6 text-lg font-light leading-relaxed">{subtitle}</p>}
          </div>
          <Link to="/shop" className="group flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-charcoal hover:text-brand-crimson transition-all border-b border-brand-charcoal/10 pb-2">
            Explore All
            <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group"
            >
              <div className="relative mb-6">
                {/* Image Area */}
                <div className="aspect-[4/5] bg-brand-warm-white rounded-[32px] overflow-hidden relative flex items-center justify-center p-8 group-hover:shadow-2xl transition-all duration-700">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-1000 ease-out"
                  />

                  {/* Badges */}
                  <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                    {product.isNew && (
                      <span className="bg-brand-gold text-white text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg">New Arrival</span>
                    )}
                    {product.isSale && (
                      <span className="bg-brand-crimson text-white text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg">Boutique Offer</span>
                    )}
                  </div>

                  <button className="absolute top-6 right-6 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-brand-charcoal hover:bg-brand-crimson hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 shadow-sm">
                    <Heart size={18} />
                  </button>

                  {/* Quick Add Overlay */}
                  <div className="absolute inset-x-6 bottom-6 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                    <button
                      onClick={() => addItem(product)}
                      className="flex-1 bg-brand-charcoal text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-brand-crimson transition-all shadow-xl shadow-brand-charcoal/20 active:scale-95"
                    >
                      <ShoppingCart size={14} />
                      Secure for Gifting
                    </button>
                    <Link
                      to={`/product/${product.id}`}
                      className="w-12 h-12 bg-white text-brand-charcoal rounded-2xl flex items-center justify-center hover:bg-brand-stone transition-colors shadow-xl"
                    >
                      <Eye size={18} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="px-2">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-bold text-brand-charcoal text-base leading-tight hover:text-brand-crimson transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-text-muted mb-4">{product.category}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-3">
                    <span className="text-xl font-bold text-brand-charcoal tracking-tight">Ksh {product.price.toLocaleString()}</span>
                    {product.oldPrice && (
                      <span className="text-sm text-brand-text-hint line-through font-medium">Ksh {product.oldPrice.toLocaleString()}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star size={12} className="fill-brand-gold text-brand-gold" />
                    <span className="text-[11px] font-bold text-brand-charcoal">{product.rating}.0</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
