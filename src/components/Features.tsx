import { ShieldCheck, Truck, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Sparkles className="text-brand-gold" size={32} />,
    title: 'Curated Variety',
    description: 'Nairobi\'s most exclusive collection of gifts hand-picked for their unique charm and character.'
  },
  {
    icon: <ShieldCheck className="text-brand-gold" size={32} />,
    title: 'Exquisite Quality',
    description: 'Every product undergoes rigorous inspection to ensure it meets our exacting luxury standards.'
  },
  {
    icon: <Clock className="text-brand-gold" size={32} />,
    title: 'Artisan Engraving',
    description: 'Masters of personalization, we transform fine gifts into timeless keepsakes with precision.'
  },
  {
    icon: <Truck className="text-brand-gold" size={32} />,
    title: 'Elite Logistics',
    description: 'Discreet and prompt nationwide shipping with priority same-day service within Nairobi.'
  }
];

const Features = () => {
  return (
    <section className="py-32 bg-brand-charcoal text-white relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-crimson/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[120px] -ml-64 -mb-64" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-brand-gold mb-4 block">The Vegas Advantage</span>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight">Why Our Clients Choose Us</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 bg-white/5 rounded-[24px] border border-white/10 flex items-center justify-center mb-8 group-hover:bg-brand-gold/10 group-hover:border-brand-gold/30 transition-all duration-500 transform group-hover:-translate-y-2">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 tracking-tight group-hover:text-brand-gold transition-colors">{feature.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed max-w-[260px] font-light">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
