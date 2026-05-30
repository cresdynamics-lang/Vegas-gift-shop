import { Search, ShoppingCart, User, Menu, X, Phone, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useCustomerStore } from '../store/useCustomerStore';
import CartDrawer from './CartDrawer';
import { motion, AnimatePresence } from 'framer-motion';
import { categories, type Category } from '../data/products';

const navItems: Category[] = [
  ...categories.filter((c) => c.id !== 'wholesale' && c.id !== 'gifts-below-1000'),
  categories.find((c) => c.id === 'wholesale')!,
].filter(Boolean);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user: customer, isAuthenticated } = useCustomerStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { items, getTotal } = useCartStore();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const getLabel = (cat: Category) => cat.navLabel || cat.name.replace(' Gifts', '');

  const renderDropdownLinks = (cat: Category) => {
    if (cat.groups && cat.groups.length > 0) {
      return (
        <div className="absolute top-full left-0 bg-white shadow-2xl border border-gray-100 rounded-b-xl z-50 p-6 min-w-[700px] max-w-[900px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {cat.groups.map((group) => (
              <div key={group.title}>
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-red-600 mb-3 border-b border-gray-100 pb-2">
                  {group.title}
                </h4>
                <ul className="space-y-1.5">
                  {group.items.map((item) => (
                    <li key={item}>
                      <Link
                        to={`/shop?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(item)}`}
                        className="text-sm text-gray-600 hover:text-red-600 hover:pl-1 transition-all block py-0.5"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (cat.subcategories.length > 0) {
      return (
        <div className="absolute top-full left-0 w-64 bg-white shadow-xl border border-gray-100 rounded-b-lg overflow-hidden py-2 z-50">
          {cat.subcategories.map((sub) => (
            <Link
              key={sub}
              to={`/shop?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(sub)}`}
              className="block px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              {sub}
            </Link>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <header className="w-full relative z-[60] bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
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

        <div className="flex items-center gap-6">
          <Link to="/account" className="hidden md:flex items-center gap-2 text-gray-700 hover:text-red-600">
            <User size={20} />
            <span className="font-bold text-sm">
              {isAuthenticated && customer?.name ? customer.name.split(' ')[0] : 'My Account'}
            </span>
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

      {/* Desktop Navigation - Rio Gift Shop style */}
      <nav className="hidden lg:block border-t border-gray-100 relative z-50">
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-center gap-1 py-3 flex-wrap">
          {navItems.map((category) => (
            <div
              key={category.id}
              className="relative"
              onMouseEnter={() => setActiveDropdown(category.id)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to={`/shop?category=${encodeURIComponent(category.name)}`}
                className="flex items-center gap-1 text-xs font-bold text-gray-800 hover:text-red-600 uppercase tracking-wide py-2 px-2"
              >
                {getLabel(category)}
                {(category.groups?.length || category.subcategories.length) > 0 && (
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${activeDropdown === category.id ? 'rotate-180 text-red-600' : ''}`}
                  />
                )}
              </Link>

              <AnimatePresence>
                {activeDropdown === category.id && (category.groups?.length || category.subcategories.length) > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                  >
                    {renderDropdownLinks(category)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <Link
            to="/shop?category=Gifts%20below%201000"
            className="text-xs font-bold text-gray-800 hover:text-red-600 uppercase tracking-wide py-2 px-2"
          >
            Gifts below 1000
          </Link>
          <Link to="/blog" className="text-xs font-bold text-gray-800 hover:text-red-600 uppercase tracking-wide py-2 px-2">
            Blog
          </Link>
        </div>
      </nav>

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

      {/* Mobile Menu */}
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

              <div className="flex flex-col overflow-y-auto p-4 gap-1">
                {navItems.map((category) => (
                  <div key={category.id} className="border-b border-gray-50 pb-2">
                    <div
                      className="flex items-center justify-between py-2"
                      onClick={() => setActiveDropdown(activeDropdown === category.id ? null : category.id)}
                    >
                      <Link
                        to={`/shop?category=${encodeURIComponent(category.name)}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="text-sm font-bold text-gray-800 hover:text-red-600 uppercase"
                      >
                        {getLabel(category)}
                      </Link>
                      {(category.groups?.length || category.subcategories.length) > 0 && (
                        <button className="p-1 text-gray-500">
                          <ChevronDown
                            size={16}
                            className={`transition-transform ${activeDropdown === category.id ? 'rotate-180' : ''}`}
                          />
                        </button>
                      )}
                    </div>

                    {activeDropdown === category.id && (
                      <div className="pl-3 border-l-2 border-red-100 mt-1 space-y-3">
                        {category.groups && category.groups.length > 0
                          ? category.groups.map((group) => (
                              <div key={group.title}>
                                <p className="text-[10px] font-bold uppercase text-red-600 mb-1">{group.title}</p>
                                {group.items.map((sub) => (
                                  <Link
                                    key={sub}
                                    to={`/shop?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(sub)}`}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block text-sm text-gray-500 hover:text-red-600 py-1"
                                  >
                                    {sub}
                                  </Link>
                                ))}
                              </div>
                            ))
                          : category.subcategories.map((sub) => (
                              <Link
                                key={sub}
                                to={`/shop?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(sub)}`}
                                onClick={() => setIsMenuOpen(false)}
                                className="block text-sm text-gray-500 hover:text-red-600 py-1"
                              >
                                {sub}
                              </Link>
                            ))}
                      </div>
                    )}
                  </div>
                ))}
                <Link
                  to="/shop?category=Gifts%20below%201000"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-bold text-gray-800 hover:text-red-600 uppercase py-2"
                >
                  Gifts below 1000
                </Link>
                <Link
                  to="/blog"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-bold text-gray-800 hover:text-red-600 uppercase py-2"
                >
                  Blog
                </Link>
                <Link
                  to="/account"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-bold text-gray-800 hover:text-red-600 uppercase py-2 mt-4 border-t border-gray-100 pt-4"
                >
                  <User size={18} />
                  {isAuthenticated && customer?.name ? customer.name : 'My Account'}
                </Link>
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
