import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  Mail,
  Clock,
  CreditCard,
  AlertCircle,
} from 'lucide-react';
import InfoPageShell from '../../components/info/InfoPageShell';

const ELIGIBLE = [
  'Non-personalized items in original, unused condition with tags and packaging',
  'Defective or damaged items reported within 48 hours of delivery',
  'Wrong item sent, we arrange replacement or refund',
];

const NOT_ELIGIBLE = [
  'Personalized, engraved, or custom-made products (unless defective or our error)',
  'Perishable goods, gift cards, or digital products',
  'Final sale or clearance items (where stated on the product page)',
  'Items used, damaged after delivery, or missing parts',
];

const PROCESS = [
  { step: '1', title: 'Contact us', desc: 'Email or WhatsApp with your order number and reason.' },
  { step: '2', title: 'Get approval', desc: 'We send return instructions if your case qualifies.' },
  { step: '3', title: 'Send it back', desc: 'Pack securely; unauthorized returns may be refused.' },
  { step: '4', title: 'Refund or exchange', desc: 'Processed within 5–10 business days after inspection.' },
];

const ReturnsPage = () => {
  return (
    <InfoPageShell title="Returns & Refunds">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-red-50/40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-14 lg:py-20">
          <div className="flex flex-col lg:flex-row lg:items-center gap-10">
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Returns &amp; Refunds
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                We want you to love your purchase. If something isn&apos;t right, reach out, we&apos;ll
                work with you fairly and quickly.
              </p>
            </div>
            <div className="lg:w-80 shrink-0">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
                  <Clock className="text-red-600" size={32} />
                </div>
                <p className="text-3xl font-bold text-gray-900">48 hrs</p>
                <p className="text-sm text-gray-500 mt-1">Report damage or wrong items</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eligible vs not */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <CheckCircle2 size={22} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Eligible for return</h2>
            </div>
            <ul className="space-y-3">
              {ELIGIBLE.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-gray-700">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border-2 border-red-200 bg-red-50/40 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center">
                <XCircle size={22} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Not returnable</h2>
            </div>
            <ul className="space-y-3">
              {NOT_ELIGIBLE.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-gray-700">
                  <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-14 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">Return process</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS.map((p) => (
              <div
                key={p.step}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
              >
                <span className="text-4xl font-bold text-red-400/80">{p.step}</span>
                <h3 className="font-bold text-lg mt-2 mb-2">{p.title}</h3>
                <p className="text-sm text-white/60">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refund note + image */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-5 gap-10 items-center">
          <div className="lg:col-span-2 rounded-2xl overflow-hidden aspect-[4/3] shadow-lg hidden sm:block">
            <img
              src="/gifts for women 1.jpg"
              alt="Gift packaging"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-3 space-y-6">
            <div className="flex gap-4 p-5 rounded-xl bg-gray-50 border border-gray-100">
              <CreditCard className="text-red-600 shrink-0" size={28} />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Refunds &amp; exchanges</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Approved refunds go back to your original payment method (M-Pesa, card, etc.) within
                  5–10 business days after we receive and inspect the item. Exchanges depend on stock.
                  Original delivery fees are non-refundable unless the return is our mistake or the
                  product was defective.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-5 rounded-xl bg-amber-50 border border-amber-100">
              <AlertCircle className="text-amber-600 shrink-0" size={28} />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Custom orders</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Personalized and engraved items cannot be cancelled once production has started.
                  Double-check spelling and artwork before checkout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="pb-14">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-10 shadow-sm">
            <Mail className="mx-auto text-red-600 mb-4" size={40} />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Start a return request</h2>
            <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
              Email{' '}
              <a href="mailto:support@vegasgifts.co.ke" className="text-red-600 font-semibold hover:underline">
                support@vegasgifts.co.ke
              </a>{' '}
              or visit our contact page with your order number and photos if applicable.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-gray-900 text-white font-bold px-8 py-3 rounded-full hover:bg-red-600 transition-colors"
            >
              Contact support
            </Link>
          </div>
        </div>
      </section>
    </InfoPageShell>
  );
};

export default ReturnsPage;
