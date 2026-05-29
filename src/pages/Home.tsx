import { useState, useEffect } from 'react';
import CategoryGrid from '../components/CategoryGrid';
import ProductSection from '../components/ProductSection';
import Features from '../components/Features';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  isNew?: boolean;
  isSale?: boolean;
  rating: number;
  reviews: number;
  category: string;
  description: string;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products?limit=20');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
        products={featuredProducts as any}
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
        products={bestSellers as any}
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

      {/* SEO Content Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 prose prose-sm max-w-none text-gray-600">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Vegas Gift Shop – Nairobi's Premier Luxury Gifting Destination</h1>
          <p>
            Welcome to Vegas Gift Shop, where we transform ordinary moments into extraordinary memories. As Nairobi's leading luxury gift boutique, we specialize in curating an exclusive collection of premium gifts, bespoke awards, and personalized treasures that speak volumes.
          </p>
          <p>
            From high-end corporate executive sets and precision-crafted crystal trophies to elegant jewelry and timeless leather goods, Vegas Gift Shop is the definitive choice for those who refuse to compromise on quality and presentation.
          </p>
          
          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">The Vegas Advantage</h3>
          <p>At Vegas Gift Shop, we believe that a gift is a reflection of your own standards. Our discerning clientele trusts us because we deliver excellence at every touchpoint:</p>
          
          <h4 className="font-bold text-gray-900 mt-4">Unrivaled Corporate & Executive Gifting</h4>
          <p>Elevate your brand with our premium corporate gifting solutions. We offer branded executive sets, custom-engraved crystal awards, and promotional items that leave a lasting impression on your most valued partners and top-performing employees.</p>
          
          <h4 className="font-bold text-gray-900 mt-4">Bespoke Personalization</h4>
          <p>Make it truly yours. Our artisan engraving and personalization services ensure that whether it's a leather wallet, a luxury timepiece, or a delicate pendant, your gift carries a unique, intimate signature.</p>
          
          <h4 className="font-bold text-gray-900 mt-4">White-Glove Delivery Experience</h4>
          <p>Experience seamless, discreet, and prompt delivery. We offer signature same-day delivery within Nairobi and reliable nationwide shipping across Kenya, ensuring your luxury gift arrives in pristine condition.</p>
        </div>
      </section>
    </main>
  );
};

export default Home;
