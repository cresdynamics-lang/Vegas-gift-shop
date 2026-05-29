import { ShieldCheck, Truck, CreditCard } from 'lucide-react';

const Features = () => {
  return (
    <section className="py-12 bg-gray-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-red-600">
              <ShieldCheck size={32} />
            </div>
            <h3 className="font-bold text-lg mb-2">Verified Excellence</h3>
            <p className="text-gray-600 text-sm">Every item is rigorously inspected to ensure it meets our uncompromising standards of luxury.</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-red-600">
              <Truck size={32} />
            </div>
            <h3 className="font-bold text-lg mb-2">White-Glove Delivery</h3>
            <p className="text-gray-600 text-sm">Signature same-day delivery within Nairobi, presented with the utmost care and discretion.</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-red-600">
              <CreditCard size={32} />
            </div>
            <h3 className="font-bold text-lg mb-2">Secure & Private</h3>
            <p className="text-gray-600 text-sm">Your transactions are protected with bank-grade security for complete peace of mind.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;