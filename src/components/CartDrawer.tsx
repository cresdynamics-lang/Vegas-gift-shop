import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Gift } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { Link } from 'react-router-dom';
import { getStaticAssetUrl } from '../utils/imageUtils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, removeItem, updateQuantity, getTotal, getItemCount } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white text-gray-900">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <ShoppingBag size={24} className="text-gray-900" />
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {getItemCount()}
                  </span>
                </div>
                <h2 className="text-xl font-bold tracking-tight">Shopping Cart</h2>
              </div>
              <button 
                onClick={onClose} 
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={32} className="text-gray-400" />
                  </div>
                  <p className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</p>
                  <p className="text-gray-500 text-sm mb-8">Looks like you haven't added any items yet.</p>
                  <button 
                    onClick={onClose}
                    className="bg-black text-white px-8 py-3 rounded font-bold uppercase text-sm hover:bg-red-600 transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                      <img src={getStaticAssetUrl(item.image)} alt={item.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between gap-4 mb-1">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center border border-gray-200 rounded">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-gray-900">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="font-bold text-red-600 text-sm">
                          KShs {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-gray-600 font-medium">
                    <span>Subtotal</span>
                    <span>KShs {getTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 font-medium">
                    <span>Delivery</span>
                    <span className="text-green-600">Calculated at checkout</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-red-600">KShs {getTotal().toLocaleString()}</span>
                  </div>
                </div>

                <Link 
                  to="/checkout"
                  onClick={onClose}
                  className="bg-black text-white w-full flex items-center justify-center gap-2 py-4 rounded font-bold uppercase text-sm hover:bg-red-600 transition-colors"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
