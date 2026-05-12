import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Gift } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { Link } from 'react-router-dom';

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
            className="fixed inset-0 bg-brand-charcoal/60 backdrop-blur-sm z-[100]"
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
            <div className="p-8 border-b border-brand-stone flex items-center justify-between bg-brand-charcoal text-white">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Gift size={24} className="text-brand-gold" />
                  <span className="absolute -top-2 -right-2 bg-brand-crimson text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-charcoal">
                    {getItemCount()}
                  </span>
                </div>
                <h2 className="text-xl font-serif font-bold tracking-tight">Gifting Bag</h2>
              </div>
              <button 
                onClick={onClose} 
                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-brand-stone/20 rounded-full flex items-center justify-center mb-6">
                    <Gift size={32} className="text-brand-text-hint" />
                  </div>
                  <p className="text-xl font-bold text-brand-charcoal mb-2">Your gift bag is empty</p>
                  <p className="text-brand-text-muted text-sm mb-8 max-w-[200px]">Looks like you haven't added any luxury treasures yet.</p>
                  <button 
                    onClick={onClose}
                    className="btn-primary"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-5 group">
                    <div className="w-24 h-24 bg-brand-stone/30 rounded-2xl overflow-hidden flex-shrink-0 p-4">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between gap-4 mb-1">
                        <h3 className="text-sm font-bold text-brand-charcoal line-clamp-1">{item.name}</h3>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-brand-text-hint hover:text-brand-crimson transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs font-bold text-brand-text-muted mb-4 uppercase tracking-widest">{item.category}</p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center bg-brand-stone/20 rounded-lg p-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center hover:text-brand-crimson transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-brand-charcoal">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center hover:text-brand-crimson transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <p className="font-bold text-brand-charcoal text-sm">
                          Ksh {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-8 border-t border-brand-stone bg-brand-warm-white">
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-sm text-brand-text-muted font-bold uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span>Ksh {getTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-brand-text-hint font-bold uppercase tracking-widest">
                    <span>Delivery</span>
                    <span className="text-green-600">Calculated at checkout</span>
                  </div>
                  <div className="pt-3 border-t border-brand-stone flex justify-between items-center">
                    <span className="text-lg font-serif font-bold text-brand-charcoal">Total Amount</span>
                    <span className="text-2xl font-bold text-brand-charcoal">Ksh {getTotal().toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-6 text-[10px] font-bold text-brand-text-muted uppercase tracking-[0.15em] justify-center">
                  <ShieldCheck size={14} className="text-brand-gold" />
                  Secure checkout with M-Pesa & Cards
                </div>

                <Link 
                  to="/checkout"
                  onClick={onClose}
                  className="btn-primary w-full flex items-center justify-center gap-3 !py-5 text-sm"
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
