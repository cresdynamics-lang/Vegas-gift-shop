import { Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Package,
  Truck,
  Globe,
  Sparkles,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import InfoPageShell from '../../components/info/InfoPageShell';

const STEPS = [
  { icon: Package, title: 'Order confirmed', desc: 'We verify payment and customization details.' },
  { icon: Sparkles, title: 'Prepared with care', desc: 'Engraving, wrapping, and quality checks where needed.' },
  { icon: Truck, title: 'On its way', desc: 'Dispatched via courier with updates by SMS or WhatsApp.' },
];

const ZONES = [
  {
    icon: MapPin,
    name: 'Nairobi Express',
    time: 'Same day / next day',
    price: 'From KSh 500',
    highlight: true,
    detail: 'Eligible in-stock orders before our daily cut-off. CBD, Westlands, Karen & more.',
  },
  {
    icon: Truck,
    name: 'Rest of Kenya',
    time: '1–3 business days',
    price: 'From KSh 1,000',
    highlight: false,
    detail: 'Major towns via trusted courier partners. Remote areas may need extra time.',
  },
  {
    icon: Globe,
    name: 'International',
    time: '7–14 days (quoted)',
    price: 'Custom quote',
    highlight: false,
    detail: 'Select items only, contact us with your destination and basket.',
  },
];

const ShippingPage = () => {
  return (
    <InfoPageShell title="Shipping & Delivery">
      {/* Hero */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <img
          src="/collection-bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-red-900/40" />
        <div className="max-w-7xl mx-auto px-4 py-16 lg:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Shipping &amp; Delivery
              </h1>
              <p className="text-lg text-white/70 leading-relaxed max-w-lg">
                From same-day surprises in Nairobi to thoughtful deliveries across Kenya, we get your
                gifts there safely and on time.
              </p>
            </div>
            <div className="hidden lg:block relative">
              <div className="aspect-video rounded-2xl overflow-hidden ring-1 ring-white/20 shadow-2xl">
                <img
                  src="/products/product_14.jpeg"
                  alt="Gift delivery"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white text-gray-900 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3">
                <Clock className="text-red-600" size={24} />
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500">Nairobi</p>
                  <p className="font-bold">Same-day available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">How delivery works</h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-red-200 via-red-400 to-red-200" />
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="relative text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/25 mb-4 relative z-10">
                  <Icon size={28} />
                </div>
                <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
                  Step {i + 1}
                </span>
                <h3 className="font-bold text-gray-900 mt-1 mb-2">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zone cards */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Delivery zones &amp; rates</h2>
          <p className="text-gray-600 mb-8 max-w-2xl">
            Fees appear at checkout. Free or discounted shipping may apply above the minimum spend shown
            on the site or during promotions.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {ZONES.map((zone) => (
              <div
                key={zone.name}
                className={`rounded-2xl p-6 border transition-shadow hover:shadow-lg ${
                  zone.highlight
                    ? 'bg-red-600 text-white border-red-600 shadow-xl shadow-red-600/20 scale-[1.02]'
                    : 'bg-white border-gray-200'
                }`}
              >
                <zone.icon
                  size={32}
                  className={zone.highlight ? 'text-white/90 mb-4' : 'text-red-600 mb-4'}
                />
                <h3 className={`text-xl font-bold mb-1 ${zone.highlight ? '' : 'text-gray-900'}`}>
                  {zone.name}
                </h3>
                <p className={`text-sm mb-3 ${zone.highlight ? 'text-white/80' : 'text-gray-500'}`}>
                  {zone.time}
                </p>
                <p className={`text-2xl font-bold mb-4 ${zone.highlight ? '' : 'text-red-600'}`}>
                  {zone.price}
                </p>
                <p className={`text-sm leading-relaxed ${zone.highlight ? 'text-white/75' : 'text-gray-600'}`}>
                  {zone.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom + issues */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-8">
          <div className="rounded-2xl bg-amber-50 border border-amber-200/80 p-8">
            <Sparkles className="text-amber-600 mb-4" size={32} />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Custom &amp; engraved items</h3>
            <p className="text-gray-700 leading-relaxed text-sm">
              Personalized gifts need production time before dispatch. Allow extra business days for
              engraving, branding, or made-to-order pieces, we&apos;ll confirm timelines at checkout or
              on WhatsApp if anything needs clarification.
            </p>
          </div>
          <div className="rounded-2xl bg-gray-50 border border-gray-200 p-8">
            <CheckCircle2 className="text-red-600 mb-4" size={32} />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Tracking &amp; issues</h3>
            <p className="text-gray-700 leading-relaxed text-sm mb-4">
              After dispatch you may receive SMS or WhatsApp updates. If a package is delayed, damaged,
              or incomplete, contact us within <strong>48 hours</strong> with your order number and
              photos where possible.
            </p>
            <Link to="/contact" className="text-red-600 font-bold text-sm hover:underline">
              Contact support →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gray-900 text-white rounded-2xl p-8">
          <div className="flex items-center gap-4">
            <Phone className="text-red-400 shrink-0" size={36} />
            <div>
              <p className="font-bold text-lg">Need it urgently?</p>
              <p className="text-white/60 text-sm">Call or WhatsApp us for same-day availability.</p>
            </div>
          </div>
          <Link
            to="/shop"
            className="shrink-0 bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-full transition-colors"
          >
            Start shopping
          </Link>
        </div>
      </section>
    </InfoPageShell>
  );
};

export default ShippingPage;
