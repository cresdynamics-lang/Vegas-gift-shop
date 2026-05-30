import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Share2, ShieldCheck, Truck, RotateCcw, Star, Check, ArrowLeft, ChevronRight } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { products } from '../data/products';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-brand-warm-white">
        <div className="w-24 h-24 bg-brand-stone/20 rounded-full flex items-center justify-center mb-8">
           <ShoppingCart size={40} className="text-brand-text-hint" />
        </div>
        <h1 className="text-3xl font-bold text-brand-charcoal mb-4">Product Not Found</h1>
        <p className="text-brand-text-muted mb-10 max-w-md text-center leading-relaxed">The luxury piece you are looking for might have been moved or is currently unavailable in our collection.</p>
        <Link 
          to="/shop"
          className="btn-primary !px-12"
        >
          Return to Boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-warm-white pb-32">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-text-muted">
          <Link to="/" className="hover:text-brand-crimson transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link to="/shop" className="hover:text-brand-crimson transition-colors">Boutique</Link>
          <ChevronRight size={10} />
          <Link to={`/shop?category=${product.category}`} className="hover:text-brand-crimson transition-colors">{product.category}</Link>
          <ChevronRight size={10} />
          <span className="text-brand-charcoal">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-start">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="aspect-[4/5] bg-white rounded-[40px] overflow-hidden relative flex items-center justify-center p-12 group shadow-sm border border-brand-stone/50 hover:shadow-2xl transition-all duration-700">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-1000 ease-out"
              />
              {product.isSale && (
                <div className="absolute top-10 left-10 bg-brand-crimson text-white text-[10px] font-bold px-5 py-2 rounded-full shadow-xl tracking-widest">
                  SPECIAL OFFER
                </div>
              )}
            </div>
            
            {/* Gallery Thumbnails */}
            <div className="grid grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <button key={i} className={`aspect-square bg-white rounded-3xl border-2 transition-all overflow-hidden p-3 ${i === 1 ? 'border-brand-crimson shadow-lg' : 'border-brand-stone/50 hover:border-brand-crimson/30 opacity-60 hover:opacity-100'}`}>
                   <img src={product.image} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="mb-10">
              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-1.5 bg-brand-charcoal text-brand-gold text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                  {product.category}
                </span>
                <div className="flex items-center gap-1.5">
                  <Star size={14} className="fill-brand-gold text-brand-gold" />
                  <span className="text-sm font-bold text-brand-charcoal">{product.rating}.0</span>
                  <span className="text-brand-text-muted text-xs font-medium ml-1">({product.reviews} Verified Reviews)</span>
                </div>
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold text-brand-charcoal mb-8 tracking-tight leading-[1.1]">{product.name}</h1>
              
              <div className="flex items-center gap-6 mb-10">
                <span className="text-4xl font-bold text-brand-charcoal tracking-tighter">KShs {product.price.toLocaleString()}</span>
                {product.oldPrice && (
                  <span className="text-2xl text-brand-text-hint line-through font-medium opacity-50">KShs {product.oldPrice.toLocaleString()}</span>
                )}
              </div>

              <p className="text-brand-text-muted text-lg mb-12 leading-relaxed font-light">
                {product.description || `Experience the pinnacle of luxury with the ${product.name}. A masterpiece of design and craftsmanship, curated specifically for those who appreciate the finer things in life.`}
              </p>

              {product.features && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                   {product.features.map((feature, i) => (
                     <div key={i} className="flex items-center gap-3 text-sm text-brand-charcoal font-bold">
                        <div className="w-6 h-6 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
                          <Check size={14} />
                        </div>
                        {feature}
                     </div>
                   ))}
                </div>
              )}

              <div className="space-y-4 mb-12 border-y border-brand-stone py-8">
                 <div className="flex items-center gap-4 text-sm text-brand-charcoal font-medium">
                    <Truck size={18} className="text-brand-gold" />
                    <span>Free shipping on orders above <span className="font-bold">KShs 10,000</span></span>
                 </div>
                 <div className="flex items-center gap-4 text-sm text-brand-charcoal font-medium">
                    <ShieldCheck size={18} className="text-brand-gold" />
                    <span>Secure payments via <span className="font-bold">M-Pesa, Visa & Mastercard</span></span>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => addItem(product)}
                  className="flex-[3] btn-primary flex items-center justify-center gap-4 !py-6 text-base tracking-widest shadow-2xl shadow-brand-charcoal/20 active:scale-95 transition-all"
                >
                  <ShoppingCart size={22} />
                  Add to Shopping Bag
                </button>
                <button className="flex-1 border-2 border-brand-stone hover:border-brand-crimson hover:bg-brand-crimson/5 rounded-[20px] flex items-center justify-center transition-all group">
                  <Heart size={22} className="text-brand-charcoal group-hover:text-brand-crimson transition-colors" />
                </button>
                <button className="flex-1 border-2 border-brand-stone hover:border-brand-crimson hover:bg-brand-crimson/5 rounded-[20px] flex items-center justify-center transition-all group">
                  <Share2 size={22} className="text-brand-charcoal group-hover:text-brand-crimson transition-colors" />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10">
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-brand-stone shadow-sm">
                <Truck size={20} className="text-brand-crimson shrink-0" />
                <div>
                  <h4 className="font-bold text-[10px] uppercase tracking-widest">Fast Shipping</h4>
                  <p className="text-[9px] text-brand-text-muted font-bold">24h Nairobi</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-brand-stone shadow-sm">
                <ShieldCheck size={20} className="text-brand-crimson shrink-0" />
                <div>
                  <h4 className="font-bold text-[10px] uppercase tracking-widest">Secure Pay</h4>
                  <p className="text-[9px] text-brand-text-muted font-bold">100% Protected</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-brand-stone shadow-sm">
                <RotateCcw size={20} className="text-brand-crimson shrink-0" />
                <div>
                  <h4 className="font-bold text-[10px] uppercase tracking-widest">Easy Return</h4>
                  <p className="text-[9px] text-brand-text-muted font-bold">7-Day Terms</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
