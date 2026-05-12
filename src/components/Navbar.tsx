import { Search, ShoppingCart, User, Menu, Phone, Truck, X, Gift } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { categories } from '../data/products';
import CartDrawer from './CartDrawer';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());
  const navigate = useNavigate();

  return (
    <header className="w-full relative z-[60]">
      {/* Top Bar */}
      <div className="bg-brand-charcoal text-white py-2.5 px-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em]">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Phone size={12} className="text-brand-gold" />
              <span className="opacity-80">Support:</span> +254 740 282041
            </span>
            <span className="hidden md:flex items-center gap-2">
              <Truck size={12} className="text-brand-gold" />
              <span className="opacity-80">Delivery:</span> Same day in Nairobi
            </span>
          </div>
          <div className="flex gap-6">
            <Link to="/shop" className="hover:text-brand-gold transition-colors opacity-80 hover:opacity-100">Track Order</Link>
            <Link to="/shop" className="hover:text-brand-gold transition-colors opacity-80 hover:opacity-100">Contact Us</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-brand-stone shadow-sm h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-brand-charcoal group-hover:bg-brand-crimson rounded-lg flex items-center justify-center transition-all duration-500 rotate-0 group-hover:rotate-[360deg]">
              <span className="text-white font-serif font-bold text-xl">V</span>
            </div>
            <div className="flex flex-col -gap-1">
              <h1 className="text-xl font-bold tracking-tight text-brand-charcoal leading-none">
                VEGAS <span className="text-brand-crimson italic">GIFT</span> SHOP
              </h1>
              <span className="text-[10px] font-bold tracking-[0.3em] text-brand-gold uppercase">Luxury Gift Boutique</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-[11px] font-bold uppercase tracking-widest text-brand-charcoal hover:text-brand-crimson transition-colors">Home</Link>
            <Link to="/shop" className="text-[11px] font-bold uppercase tracking-widest text-brand-charcoal hover:text-brand-crimson transition-colors">The Boutique</Link>
            <Link to="/admin" className="text-[11px] font-bold uppercase tracking-widest text-brand-gold hover:text-brand-crimson transition-colors">Admin</Link>
            {categories.slice(0, 3).map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.name}`}
                className="text-[11px] font-bold uppercase tracking-widest text-brand-charcoal hover:text-brand-crimson transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 md:gap-6">
            <button className="text-brand-charcoal hover:text-brand-crimson transition-colors hidden md:block">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <button className="text-brand-charcoal hover:text-brand-crimson transition-colors">
              <User size={20} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-brand-charcoal hover:text-brand-crimson transition-colors relative flex items-center gap-3 bg-brand-stone/20 hover:bg-brand-stone/40 px-4 py-2.5 rounded-full transition-all group"
            >
              <div className="relative">
                <Gift size={18} strokeWidth={2} />
                {itemCount > 0 && (
                  <span className="absolute -top-3 -right-3 bg-brand-crimson text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:block">My Gifts</span>
            </button>
            <button className="lg:hidden text-brand-charcoal p-2" onClick={() => setIsMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-brand-charcoal/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed inset-y-0 right-0 w-full max-w-xs bg-white z-[101] p-8 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-charcoal rounded-lg flex items-center justify-center">
                    <span className="text-white font-serif font-bold text-lg">V</span>
                  </div>
                  <h2 className="text-lg font-bold text-brand-charcoal tracking-tight">Navigation</h2>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="w-10 h-10 flex items-center justify-center hover:bg-brand-stone/20 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-[0.2em] text-brand-charcoal border-b border-brand-stone pb-2">Home</Link>
                <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-[0.2em] text-brand-charcoal border-b border-brand-stone pb-2">Shop All</Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/shop?category=${cat.name}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm font-bold uppercase tracking-[0.2em] text-brand-text-muted hover:text-brand-crimson transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-8 border-t border-brand-stone flex flex-col gap-4">
                <div className="flex items-center gap-3 text-xs font-bold text-brand-text-muted">
                  <Phone size={16} className="text-brand-gold" />
                  +254 740 282041
                </div>
                <button className="btn-primary w-full !py-4 text-xs tracking-widest">
                  Secure Checkout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Navbar;
