import { Link } from 'react-router-dom';
import {
  Gift,
  Sparkles,
  Truck,
  Shield,
  Heart,
  Building2,
  MessageCircle,
} from 'lucide-react';
import InfoPageShell from '../../components/info/InfoPageShell';

const MOSAIC = [
  { src: '/products/product_3.jpeg', alt: 'Awards and trophies', className: 'aspect-[4/5]' },
  { src: '/gifts for women 1.jpg', alt: 'Luxury gifts', className: 'aspect-square' },
  { src: '/products/product_16.jpeg', alt: 'Watches', className: 'aspect-square' },
  { src: '/products/product_4.jpeg', alt: 'Corporate gifts', className: 'aspect-[4/5]' },
];

const OFFERS = [
  { icon: Sparkles, title: 'Personalization', desc: 'Names, messages, logos, and premium gift packaging.' },
  { icon: Building2, title: 'Corporate gifting', desc: 'Awards, branded merch, and bulk orders for teams.' },
  { icon: Gift, title: 'Curated collections', desc: 'Jewelry, watches, drinkware, and seasonal favourites.' },
  { icon: Truck, title: 'Fast delivery', desc: 'Same-day options in Nairobi when available.' },
  { icon: Shield, title: 'Trusted checkout', desc: 'M-Pesa, card, and secure order confirmation.' },
  { icon: MessageCircle, title: 'Real support', desc: 'Phone, email, and WhatsApp when you need us.' },
];

const AboutPage = () => {
  return (
    <InfoPageShell title="About Us" darkHero>
      {/* Hero */}
      <section className="relative overflow-hidden text-white pb-16 lg:pb-24">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/35 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[380px] h-[380px] bg-amber-500/25 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-8 lg:pt-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold leading-[1.08] tracking-tight mb-6">
                <span className="block text-white/90">Vegas Gift Shop</span>
                <span className="block mt-2 bg-gradient-to-r from-red-400 via-amber-300 to-red-400 bg-clip-text text-transparent">
                  Where every gift tells a story
                </span>
              </h1>
              <p className="text-lg text-white/60 leading-relaxed max-w-lg font-light mb-8">
                Nairobi&apos;s destination for premium presents, bespoke awards, and personalized
                treasures, crafted to make ordinary moments unforgettable.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 bg-white text-black px-7 py-3.5 rounded-full text-sm font-bold hover:bg-red-500 hover:text-white transition-all"
                >
                  Explore the shop
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 border border-white/30 text-white px-7 py-3.5 rounded-full text-sm font-bold hover:bg-white/10 transition-all"
                >
                  Get in touch
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-3 sm:space-y-4">
                <div className={`${MOSAIC[0].className} rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl`}>
                  <img src={MOSAIC[0].src} alt={MOSAIC[0].alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className={`${MOSAIC[1].className} rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl`}>
                  <img src={MOSAIC[1].src} alt={MOSAIC[1].alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4 pt-8">
                <div className={`${MOSAIC[2].className} rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl`}>
                  <img src={MOSAIC[2].src} alt={MOSAIC[2].alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className={`${MOSAIC[3].className} rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl`}>
                  <img src={MOSAIC[3].src} alt={MOSAIC[3].alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '1,800+', label: 'Premium products' },
              { value: 'Same day', label: 'Nairobi delivery' },
              { value: '100%', label: 'Care in every order' },
              { value: 'Bespoke', label: 'Personalization' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-xs text-white/50 uppercase tracking-widest font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story + image band */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[420px] shadow-xl">
              <img
                src="/products/product_5.jpeg"
                alt="Vegas Gift Shop gifts and awards"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white text-sm font-bold uppercase tracking-widest text-red-300 mb-1">
                  Since Nairobi
                </p>
                <p className="text-white text-xl font-semibold">Gifts with heart, delivered with care</p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Who we are</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Vegas Gift Shop is a Nairobi-based boutique helping individuals and businesses celebrate
                life&apos;s milestones with thoughtful, high-quality presents, from engraved jewelry and
                romantic keepsakes to corporate trophies and everyday luxuries.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Whether you&apos;re surprising someone in Westlands, rewarding a team downtown, or sending
                love across Kenya, we pair a vast catalog with customization, gift wrapping, and reliable
                delivery so you can shop with confidence.
              </p>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <Heart className="text-red-600 shrink-0" size={28} />
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">Our promise:</strong> quality products, clear
                  communication, and fulfillment you can trust, from first click to unboxing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What we offer grid */}
      <section className="bg-gray-50 py-16 lg:py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What we offer</h2>
            <p className="text-gray-600">Everything you need to give something truly memorable.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {OFFERS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-red-100 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-red-600 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to find the perfect gift?</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Browse thousands of products or message us on WhatsApp for personalized recommendations.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-white text-red-600 font-bold px-8 py-3.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            Shop now
          </Link>
        </div>
      </section>
    </InfoPageShell>
  );
};

export default AboutPage;
