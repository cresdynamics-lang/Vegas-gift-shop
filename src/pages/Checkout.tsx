import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CreditCard, Smartphone, ShieldCheck, ShoppingBag, ArrowLeft, Check, Lock, Gift } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';

const steps = [
  { id: 1, name: 'Information' },
  { id: 2, name: 'Shipping' },
  { id: 3, name: 'Payment' }
];

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { items, total, clearCart } = useCartStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: 'Nairobi',
    phone: '',
    shippingMethod: 'standard',
    paymentMethod: 'mpesa'
  });

  if (items.length === 0 && currentStep !== 4) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 bg-brand-stone/20 rounded-full flex items-center justify-center mb-6">
          <Gift size={32} className="text-brand-text-hint" />
        </div>
        <h2 className="text-2xl font-bold text-brand-charcoal mb-4">Your gift selection is empty</h2>
        <p className="text-brand-text-muted mb-8">Add some luxury treasures to your selection to proceed.</p>
        <Link to="/shop" className="btn-primary !px-10">Return to Boutique</Link>
      </div>
    );
  }

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
    else handleComplete();
  };

  const handleComplete = () => {
    setCurrentStep(4);
    setTimeout(() => {
      clearCart();
      navigate('/');
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-brand-warm-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-brand-stone py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold text-brand-charcoal mb-8 tracking-tight">Checkout</h1>
            
            {/* Steps Progress */}
            <div className="flex items-center gap-4 sm:gap-8">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center gap-2 ${currentStep >= step.id ? 'text-brand-crimson' : 'text-brand-text-hint'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${currentStep >= step.id ? 'border-brand-crimson bg-brand-crimson text-white shadow-lg' : 'border-brand-stone'}`}>
                      {currentStep > step.id ? <Check size={14} /> : step.id}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:block">{step.name}</span>
                  </div>
                  {step.id !== 3 && (
                    <div className="w-8 sm:w-16 h-[2px] bg-brand-stone mx-4 sm:mx-6 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: currentStep > step.id ? '100%' : '0%' }}
                        className="h-full bg-brand-crimson"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-[32px] p-8 sm:p-12 shadow-sm border border-brand-stone"
                >
                  <h2 className="text-xl font-bold text-brand-charcoal mb-8 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson" />
                    Contact Information
                  </h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="First Name" placeholder="Your first name" />
                      <Input label="Last Name" placeholder="Your last name" />
                    </div>
                    <Input label="Email Address" placeholder="email@example.com" type="email" />
                    <Input label="Phone Number" placeholder="+254 7XX XXX XXX" />
                    
                    <div className="pt-6 border-t border-brand-stone mt-10">
                      <h2 className="text-xl font-bold text-brand-charcoal mb-8 flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson" />
                        Shipping Address
                      </h2>
                      <div className="space-y-6">
                        <Input label="Street Address" placeholder="Apartment, suite, unit, etc." />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input label="City" defaultValue="Nairobi" />
                          <Input label="Postal Code" placeholder="00100" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-[32px] p-8 sm:p-12 shadow-sm border border-brand-stone"
                >
                  <h2 className="text-xl font-bold text-brand-charcoal mb-8 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson" />
                    Shipping Method
                  </h2>
                  <div className="space-y-4">
                    <ShippingOption 
                      id="standard"
                      title="Premium Delivery"
                      description="Nairobi & Metropolitan Area"
                      price="KShs 500"
                      active={formData.shippingMethod === 'standard'}
                      onSelect={() => setFormData({...formData, shippingMethod: 'standard'})}
                    />
                    <ShippingOption 
                      id="express"
                      title="VIP Express Delivery"
                      description="Guaranteed within 3 hours (Nairobi Central)"
                      price="KShs 1,500"
                      active={formData.shippingMethod === 'express'}
                      onSelect={() => setFormData({...formData, shippingMethod: 'express'})}
                    />
                    <ShippingOption 
                      id="country"
                      title="Nationwide Luxury Courier"
                      description="Major towns across Kenya (1-2 days)"
                      price="KShs 850"
                      active={formData.shippingMethod === 'country'}
                      onSelect={() => setFormData({...formData, shippingMethod: 'country'})}
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-[32px] p-8 sm:p-12 shadow-sm border border-brand-stone"
                >
                  <h2 className="text-xl font-bold text-brand-charcoal mb-8 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson" />
                    Payment Method
                  </h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button 
                        onClick={() => setFormData({...formData, paymentMethod: 'mpesa'})}
                        className={`flex flex-col items-center gap-4 p-8 rounded-3xl border-2 transition-all ${formData.paymentMethod === 'mpesa' ? 'border-brand-crimson bg-brand-crimson/5' : 'border-brand-stone hover:border-brand-crimson/30'}`}
                      >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${formData.paymentMethod === 'mpesa' ? 'bg-brand-crimson text-white shadow-lg' : 'bg-brand-stone text-brand-charcoal'}`}>
                          <Smartphone size={28} />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-sm text-brand-charcoal">M-Pesa</p>
                          <p className="text-[10px] text-brand-text-muted font-bold uppercase tracking-widest mt-1">Mobile Money</p>
                        </div>
                      </button>
                      <button 
                        onClick={() => setFormData({...formData, paymentMethod: 'card'})}
                        className={`flex flex-col items-center gap-4 p-8 rounded-3xl border-2 transition-all ${formData.paymentMethod === 'card' ? 'border-brand-crimson bg-brand-crimson/5' : 'border-brand-stone hover:border-brand-crimson/30'}`}
                      >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${formData.paymentMethod === 'card' ? 'bg-brand-crimson text-white shadow-lg' : 'bg-brand-stone text-brand-charcoal'}`}>
                          <CreditCard size={28} />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-sm text-brand-charcoal">Card Payment</p>
                          <p className="text-[10px] text-brand-text-muted font-bold uppercase tracking-widest mt-1">Visa / Mastercard</p>
                        </div>
                      </button>
                    </div>

                    <div className="mt-8 p-8 bg-brand-warm-white rounded-3xl border border-brand-stone space-y-6">
                      {formData.paymentMethod === 'mpesa' ? (
                        <div className="space-y-4">
                          <p className="text-xs text-brand-text-muted leading-relaxed">A prompt will be sent to your phone to enter your M-Pesa PIN once you complete the order.</p>
                          <Input label="M-Pesa Phone Number" placeholder="07XX XXX XXX" />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Input label="Cardholder Name" placeholder="Full name as on card" />
                          <Input label="Card Number" placeholder="XXXX XXXX XXXX XXXX" />
                          <div className="grid grid-cols-2 gap-4">
                            <Input label="Expiry Date" placeholder="MM / YY" />
                            <Input label="CVV" placeholder="XXX" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-[40px] p-12 sm:p-20 shadow-2xl border border-brand-stone text-center"
                >
                  <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl shadow-green-200">
                    <Check size={48} strokeWidth={3} />
                  </div>
                  <h2 className="text-4xl font-bold text-brand-charcoal mb-6 tracking-tight">Gift Confirmed</h2>
                  <p className="text-brand-text-muted text-lg mb-10 max-w-md mx-auto leading-relaxed">
                    Thank you for choosing <span className="text-brand-charcoal font-bold">Vegas Gift Shop</span>. Your luxury gift is being prepared with excellence.
                  </p>
                  <div className="p-6 bg-brand-warm-white rounded-2xl border border-brand-stone inline-block mb-10">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-text-hint mb-1">Order Reference</p>
                    <p className="text-xl font-bold text-brand-charcoal tracking-widest">VEGAS-98432-XYZ</p>
                  </div>
                  <p className="text-xs text-brand-text-hint italic">Redirecting to homepage...</p>
                </motion.div>
              )}
            </AnimatePresence>

            {currentStep < 4 && (
              <div className="mt-8 flex justify-between items-center px-4">
                <button 
                  onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
                  className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors ${currentStep > 1 ? 'text-brand-charcoal hover:text-brand-crimson' : 'text-transparent cursor-default'}`}
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
                <button 
                  onClick={handleNext}
                  className="btn-primary !px-12 !py-5 flex items-center gap-3 shadow-xl active:scale-95 transition-all"
                >
                  {currentStep === 3 ? 'Confirm & Send Gift' : 'Continue to ' + (currentStep === 1 ? 'Shipping' : 'Payment')}
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Sidebar - Order Summary */}
          {currentStep < 4 && (
            <div className="lg:col-span-1 space-y-8 sticky top-24">
              <div className="bg-brand-charcoal text-white rounded-[32px] p-8 shadow-2xl">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                  <Gift size={20} className="text-brand-gold" />
                  Gift Selection
                </h3>
                
                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 mb-8">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-white/5 rounded-xl overflow-hidden flex items-center justify-center p-2 border border-white/10 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{item.name}</p>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-sm whitespace-nowrap">KShs {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-8 border-t border-white/10">
                  <div className="flex justify-between text-white/60 text-xs">
                    <span>Subtotal</span>
                    <span className="font-bold">KShs {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-white/60 text-xs">
                    <span>Shipping</span>
                    <span className="font-bold">KShs {formData.shippingMethod === 'standard' ? '500' : formData.shippingMethod === 'express' ? '1,500' : '850'}</span>
                  </div>
                  <div className="flex justify-between text-white/60 text-xs">
                    <span>V.A.T (16%)</span>
                    <span className="font-bold">Included</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-white pt-4 border-t border-white/10">
                    <span className="tracking-tight">Grand Total</span>
                    <span className="text-brand-gold">KShs {(total + (formData.shippingMethod === 'standard' ? 500 : formData.shippingMethod === 'express' ? 1500 : 850)).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Secure Checkout Badge */}
              <div className="bg-white rounded-3xl p-6 border border-brand-stone flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                  <Lock size={20} />
                </div>
                <div>
                  <p className="font-bold text-xs uppercase tracking-widest text-brand-charcoal">Secure Checkout</p>
                  <p className="text-[10px] text-brand-text-muted mt-1 leading-tight font-medium">Your data is encrypted and protected with bank-grade security.</p>
                </div>
              </div>

              <div className="flex justify-center gap-6 opacity-30 grayscale pointer-events-none">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/1200px-M-PESA_LOGO-01.svg.png" alt="Mpesa" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, placeholder, type = 'text', defaultValue }: { label: string, placeholder?: string, type?: string, defaultValue?: string }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-text-muted ml-1">{label}</label>
    <input 
      type={type} 
      placeholder={placeholder}
      defaultValue={defaultValue}
      className="w-full bg-brand-warm-white border border-brand-stone rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-crimson transition-all font-medium placeholder:text-brand-text-hint/50"
    />
  </div>
);

const ShippingOption = ({ id, title, description, price, active, onSelect }: { id: string, title: string, description: string, price: string, active: boolean, onSelect: () => void }) => (
  <button 
    onClick={onSelect}
    className={`w-full flex items-center justify-between p-6 rounded-3xl border-2 transition-all group ${active ? 'border-brand-crimson bg-brand-crimson/5 shadow-md' : 'border-brand-stone hover:border-brand-crimson/30'}`}
  >
    <div className="flex items-center gap-5">
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${active ? 'border-brand-crimson' : 'border-brand-stone group-hover:border-brand-crimson/50'}`}>
        {active && <div className="w-2.5 h-2.5 rounded-full bg-brand-crimson" />}
      </div>
      <div className="text-left">
        <p className={`font-bold text-sm transition-colors ${active ? 'text-brand-charcoal' : 'text-brand-text-muted group-hover:text-brand-charcoal'}`}>{title}</p>
        <p className="text-[10px] text-brand-text-hint font-medium uppercase tracking-widest mt-1">{description}</p>
      </div>
    </div>
    <span className="font-bold text-sm text-brand-charcoal">{price}</span>
  </button>
);

export default Checkout;
