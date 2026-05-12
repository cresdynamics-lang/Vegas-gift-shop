import { Phone, Truck, Clock, ShieldCheck } from 'lucide-react';

const TopBar = () => {
  return (
    <div className="bg-brand-charcoal text-white py-3 px-4 border-b border-white/5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <a href="tel:+254740282041" className="flex items-center gap-2 hover:text-brand-gold transition-colors group">
            <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-gold/20 transition-all">
              <Phone size={12} className="text-brand-gold" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">+254 740 282041</span>
          </a>
        </div>
        
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
            <Clock size={12} className="text-brand-gold" />
            <span>Concierge: Mon - Sat (8am - 8pm)</span>
          </div>
          <div className="w-[1px] h-3 bg-white/10" />
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
            <Truck size={12} className="text-brand-gold" />
            <span>Signature Nairobi Delivery</span>
          </div>
          <div className="w-[1px] h-3 bg-white/10" />
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
            <ShieldCheck size={12} className="text-brand-gold" />
            <span>Gifted with Care</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold animate-pulse">Bespoke Gifting</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
