import { ShieldCheck, Truck, CreditCard } from 'lucide-react';

const items = [
  {
    icon: ShieldCheck,
    title: '100% Satisfaction Guarantee',
    desc: 'We promise to make sending and receiving our gifts a joy.',
  },
  {
    icon: Truck,
    title: 'Nationwide Delivery',
    desc: 'Same day delivery in Nairobi. Next day delivery in Kenya, 365 days a year!',
  },
  {
    icon: CreditCard,
    title: 'Secure Payment',
    desc: 'We accept Mpesa & all major card payments through trusted payment gateways.',
  },
];

const Features = () => {
  return (
    <section className="py-6 sm:py-10 bg-gray-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-3 gap-2 sm:gap-8">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center px-1">
              <div className="w-10 h-10 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center mb-2 sm:mb-4 shadow-sm text-[#C7447E] sm:text-red-600">
                <Icon className="w-5 h-5 sm:w-8 sm:h-8" strokeWidth={1.75} />
              </div>
              <h3 className="font-bold text-[10px] sm:text-base lg:text-lg leading-tight mb-1 sm:mb-2 text-gray-900">
                {title}
              </h3>
              <p className="text-gray-600 text-[9px] sm:text-sm leading-snug hidden sm:block">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
