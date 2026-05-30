import CategoryGrid from '../components/CategoryGrid';
import ProductSection from '../components/ProductSection';
import Features from '../components/Features';
import { products } from '../data/products';
import { Link } from 'react-router-dom';

const Home = () => {
  // Get featured products
  const featuredProducts = products.slice(0, 8);
  const bestSellers = products.slice(8, 16);
  const flashSaleProducts = products.filter(p => p.isSale).slice(0, 4);

  return (
    <main className="bg-white">
      {/* Categories Section */}
      <section className="py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold mb-6">Product Categories</h2>
          <CategoryGrid />
        </div>
      </section>

      {/* Featured Categories / Products */}
      <ProductSection 
        title="Featured Categories" 
        products={featuredProducts}
        bgColor="bg-white"
      />

      {/* Features / Trust Banner */}
      <Features />

      {/* Flash Sales */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-2xl font-bold">Exclusive Limited Offers</h2>
            <div className="flex gap-4 items-center">
              <div className="flex flex-col items-center">
                <span className="bg-red-600 text-white font-bold px-3 py-2 rounded">00</span>
                <span className="text-xs mt-1 font-medium text-gray-500">Days</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="bg-red-600 text-white font-bold px-3 py-2 rounded">00</span>
                <span className="text-xs mt-1 font-medium text-gray-500">Hours</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="bg-red-600 text-white font-bold px-3 py-2 rounded">00</span>
                <span className="text-xs mt-1 font-medium text-gray-500">Minutes</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="bg-red-600 text-white font-bold px-3 py-2 rounded">00</span>
                <span className="text-xs mt-1 font-medium text-gray-500">Seconds</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {flashSaleProducts.map(product => (
              <Link key={product.id} to={`/product/${product.id}`} className="group border border-gray-100 rounded-lg p-4 hover:shadow-lg transition-all bg-white flex flex-col">
                <div className="aspect-square overflow-hidden rounded-md mb-4 relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  {product.isSale && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">SPECIAL</span>
                  )}
                </div>
                <h3 className="font-medium text-sm text-gray-800 line-clamp-2 mb-2 group-hover:text-red-600 transition-colors">{product.name}</h3>
                <div className="flex items-center gap-2 mt-auto">
                  <span className="font-bold text-red-600">KShs {product.price.toLocaleString()}</span>
                  {product.oldPrice && (
                    <span className="text-sm text-gray-400 line-through">KShs {product.oldPrice.toLocaleString()}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Selling Products */}
      <ProductSection 
        title="Best Selling Treasures" 
        products={bestSellers}
        bgColor="bg-white"
      />

      {/* Customer Feedback & Reviews */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-12 text-center">Client Testimonials</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Eleanor M.", review: "The bespoke engraving on the crystal award was flawless. Truly a masterpiece of craftsmanship." },
              { name: "David K.", review: "Exceptional white-glove delivery. The presentation of the executive set exceeded all my expectations." },
              { name: "Sarah W.", review: "Vegas Gift Shop is my go-to for corporate gifting. Their attention to detail is unmatched in Nairobi." }
            ].map((review, i) => (
              <div key={i} className="p-6 border border-gray-100 rounded-lg shadow-sm bg-gray-50">
                <div className="flex text-yellow-400 mb-4 text-lg">
                  {'★★★★★'}
                </div>
                <p className="text-gray-700 italic mb-4 text-sm">"{review.review}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{review.name}</p>
                    <p className="text-xs text-gray-500">Verified Client</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blogs Post's */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-12">The Luxury Journal</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              "The Art of Corporate Gifting: Making a Lasting Impression",
              "A Guide to Selecting the Perfect Luxury Watch",
              "Bespoke Personalization: Why Custom Engraving Matters"
            ].map((title, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100">
                <div className="h-48 bg-gray-200 relative">
                  <img src={`/products/product_${i + 14}.jpeg`} className="w-full h-full object-cover" alt="Blog post" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4 line-clamp-2 hover:text-red-600 cursor-pointer transition-colors">{title}</h3>
                  <Link to="#" className="text-red-600 font-bold text-sm hover:underline uppercase tracking-wide">Read More</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About / SEO — modern editorial layout */}
      <section className="relative overflow-hidden bg-[#0a0a0a] text-white">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-20 lg:py-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — headline */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-sans font-semibold leading-[1.1] tracking-tight mb-6">
                <span className="block text-white/90">Vegas Gift Shop</span>
                <span className="block mt-2 bg-gradient-to-r from-red-400 via-amber-300 to-red-400 bg-clip-text text-transparent">
                  Nairobi's Premier Luxury Gifting Destination
                </span>
              </h1>
              <p className="text-lg text-white/60 leading-relaxed max-w-lg font-light">
                We transform ordinary moments into extraordinary memories — curating premium gifts, bespoke awards, and personalized treasures for every occasion.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 bg-white text-black px-7 py-3.5 rounded-full text-sm font-bold hover:bg-red-500 hover:text-white transition-all"
                >
                  Shop Collection
                </Link>
                <Link
                  to="/shop?category=Corporate%20Gifts"
                  className="inline-flex items-center gap-2 border border-white/30 text-white px-7 py-3.5 rounded-full text-sm font-bold hover:bg-white/10 transition-all"
                >
                  Corporate Gifting
                </Link>
              </div>
            </div>

            {/* Right — image mosaic */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-3 sm:space-y-4">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden ring-1 ring-white/10">
                  <img src="/products/product_3.jpeg" alt="Awards & trophies" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden ring-1 ring-white/10">
                  <img src="/gifts for women 1.jpg" alt="Luxury gifts" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4 pt-8">
                <div className="aspect-square rounded-2xl overflow-hidden ring-1 ring-white/10">
                  <img src="/products/product_16.jpeg" alt="Watches" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="aspect-[4/5] rounded-2xl overflow-hidden ring-1 ring-white/10">
                  <img src="/products/product_4.jpeg" alt="Corporate gifts" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-16 pt-12 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '1,800+', label: 'Premium Products' },
              { value: 'Same Day', label: 'Nairobi Delivery' },
              { value: '100%', label: 'Satisfaction Guarantee' },
              { value: 'Bespoke', label: 'Personalization' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-xs text-white/50 uppercase tracking-widest font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Three pillars */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Corporate & Executive Gifting',
                desc: 'Branded executive sets, crystal awards, and promotional items that leave a lasting impression on partners and top performers.',
              },
              {
                title: 'Artisan Personalization',
                desc: 'Expert engraving on leather, crystal, and jewelry — every piece carries a unique, intimate signature.',
              },
              {
                title: 'White-Glove Delivery',
                desc: 'Same-day delivery in Nairobi and reliable nationwide shipping. Your gift arrives in pristine condition.',
              },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <h3 className="font-semibold text-white mb-2 text-sm">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
