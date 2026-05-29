import { Search, ShoppingCart, User, Menu, X, Phone, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import CartDrawer from './CartDrawer';
import { motion, AnimatePresence } from 'framer-motion';
import { categories } from '../data/products';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { items, getTotal } = useCartStore();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="w-full relative z-[60] bg-white border-b border-gray-100 shadow-sm">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded flex items-center justify-center">
            <span className="text-white font-serif font-bold text-xl">V</span>
          </div>
          <div className="flex flex-col -gap-1">
            <h1 className="text-xl font-bold tracking-tight text-black leading-none">
              VEGAS <span className="text-red-600 italic">GIFT</span> SHOP
            </h1>
            <span className="text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase">Luxury Gift Boutique</span>
          </div>
        </Link>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
          <input 
            type="text" 
            placeholder="Products search..." 
            className="w-full border-2 border-gray-200 rounded-full py-3 px-6 pr-12 focus:outline-none focus:border-red-600 text-sm"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600">
            <Search size={20} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-2 text-gray-700">
            <Phone size={20} className="text-red-600" />
            <span className="font-bold text-sm">0711 667 733</span>
          </div>
          
          <Link to="/account" className="hidden md:flex items-center gap-2 text-gray-700 hover:text-red-600">
            <User size={20} />
            <span className="font-bold text-sm">My Account</span>
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 text-gray-700 hover:text-red-600 group"
          >
            <div className="text-right hidden sm:block">
              <div className="text-xs text-gray-500">Cart</div>
              <div className="font-bold text-sm">KShs {getTotal().toLocaleString()}</div>
            </div>
            <div className="relative bg-gray-100 p-3 rounded-full group-hover:bg-red-50 transition-colors">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {itemCount}
              </span>
            </div>
          </button>
          
          <button className="lg:hidden text-gray-600 p-1" onClick={() => setIsMenuOpen(true)}>
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex border-t border-gray-100 relative z-50">
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-center gap-4 py-4 flex-wrap">
          {categories.slice(0, 10).map((category) => (
            <div 
              key={category.id} 
              className="relative group"
              onMouseEnter={() => setActiveDropdown(category.id)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to={`/shop?category=${category.name}`}
                className="flex items-center gap-1 text-xs font-bold text-gray-800 hover:text-red-600 uppercase tracking-wide py-2"
              >
                {category.name.replace(' Gifts', '')}
                {category.subcategories.length > 0 && (
                  <ChevronDown size={14} className={`transition-transform ${activeDropdown === category.id ? 'rotate-180 text-red-600' : ''}`} />
                )}
              </Link>

              {/* Dropdown Menu */}
              {category.subcategories.length > 0 && (
                <AnimatePresence>
                  {activeDropdown === category.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-64 bg-white shadow-xl border border-gray-100 rounded-b-lg overflow-hidden py-2 z-50"
                    >
                      {category.subcategories.map((sub, idx) => (
                        <Link
                          key={idx}
                          to={`/shop?category=${category.name}&subcategory=${sub}`}
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          {sub}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
          <Link to="/shop?category=Wholesale" className="text-xs font-bold text-gray-800 hover:text-red-600 uppercase tracking-wide py-2">Wholesale</Link>
          <Link to="/blog" className="text-xs font-bold text-gray-800 hover:text-red-600 uppercase tracking-wide py-2">Blog</Link>
        </div>
      </nav>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Products search..." 
            className="w-full border-2 border-gray-200 rounded-full py-2 px-4 pr-10 focus:outline-none focus:border-red-600 text-sm"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-[100]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 w-full max-w-xs bg-white z-[101] flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <span className="font-bold text-lg">Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-500 hover:text-black">
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col overflow-y-auto p-4 gap-2">
                {categories.slice(0, 10).map((category) => (
                  <div key={category.id} className="border-b border-gray-50 pb-2">
                    <div 
                      className="flex items-center justify-between py-2"
                      onClick={() => setActiveDropdown(activeDropdown === category.id ? null : category.id)}
                    >
                      <Link
                        to={`/shop?category=${category.name}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="text-sm font-bold text-gray-800 hover:text-red-600 uppercase"
                      >
                        {category.name.replace(' Gifts', '')}
                      </Link>
                      {category.subcategories.length > 0 && (
                        <button className="p-1 text-gray-500">
                          <ChevronDown size={16} className={`transition-transform ${activeDropdown === category.id ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>
                    
                    {/* Mobile Subcategories */}
                    {activeDropdown === category.id && category.subcategories.length > 0 && (
                      <div className="flex flex-col pl-4 gap-2 mt-2 border-l-2 border-red-100">
                        {category.subcategories.map((sub, idx) => (
                          <Link
                            key={idx}
                            to={`/shop?category=${category.name}&subcategory=${sub}`}
                            onClick={() => setIsMenuOpen(false)}
                            className="text-sm text-gray-500 hover:text-red-600 py-1"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Link to="/shop?category=Wholesale" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-gray-800 hover:text-red-600 uppercase py-2 border-b border-gray-50">Wholesale</Link>
                <Link to="/blog" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-gray-800 hover:text-red-600 uppercase py-2 border-b border-gray-50">Blog</Link>
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
