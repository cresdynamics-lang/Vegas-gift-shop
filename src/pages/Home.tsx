import CategoryGrid from '../components/CategoryGrid';
import RioGiftShopCategories from '../components/RioGiftShopCategories';
import ProductSection from '../components/ProductSection';
import Features from '../components/Features';
import { products } from '../data/products';
import { BLOG_POSTS } from '../data/blogs';
import { Link } from 'react-router-dom';
import { formatDisplayText } from '../utils/formatText';
import GoogleTestimonialsMarquee from '../components/GoogleTestimonialsMarquee';
import OptimizedImage from '../components/OptimizedImage';

const SHOP_ALL_MOBILE_COUNT = 24;
const FEATURED_MOBILE_COUNT = 8;

const Home = () => {
  const featuredProducts = products.slice(0, 8);
  const bestSellers = products.slice(8, 16);

  /** Phones / small screens only — Rio-style product grid instead of category panel */
  const shopAllMobile = products.slice(0, SHOP_ALL_MOBILE_COUNT);
  const shopAllMobileIds = new Set(shopAllMobile.map((p) => p.id));

  /** Desktop-only flash grid — avoid repeating mobile Shop All items */
  const flashSaleProducts = (() => {
    const saleItems = products.filter((p) => p.isSale);
    const desktopPool = saleItems.filter((p) => !shopAllMobileIds.has(p.id));
    return (desktopPool.length >= 4 ? desktopPool : saleItems).slice(0, 4);
  })();
  const featuredProductsMobile = (() => {
    const picked = products
      .filter((p) => !shopAllMobileIds.has(p.id) && (p.isNew || p.isSale || p.rating >= 5))
      .slice(0, FEATURED_MOBILE_COUNT);
    if (picked.length >= FEATURED_MOBILE_COUNT) return picked;
    return [
      ...picked,
      ...products
        .filter((p) => !shopAllMobileIds.has(p.id) && !picked.some((f) => f.id === p.id))
        .slice(0, FEATURED_MOBILE_COUNT - picked.length),
    ];
  })();

  return (
    <main className="bg-white">
      {/* Mobile / tablet below lg: products first (no magenta category block on home) */}
      <div className="lg:hidden">
        <ProductSection
          title="Shop All"
          products={shopAllMobile}
          bgColor="bg-white"
          compactTitle
          viewAllHref="/shop"
        />
        <ProductSection
          title="Featured Products"
          products={featuredProductsMobile}
          bgColor="bg-gray-50"
          compactTitle
        />
      </div>

      {/* Desktop (lg+): original layout — categories then featured products */}
      <section className="hidden lg:block border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-row gap-10 items-start">
            <div className="w-64 shrink-0 sticky top-28">
              <RioGiftShopCategories />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold mb-6 sr-only">Browse by category</h2>
              <CategoryGrid />
            </div>
          </div>
        </div>
      </section>

      <div className="hidden lg:block">
        <ProductSection title="Featured Categories" products={featuredProducts} bgColor="bg-white" />
      </div>

      <Features />

      <div className="hidden lg:block">
        <ProductSection
          title="Flash Sales"
          products={flashSaleProducts}
          bgColor="bg-gray-50"
          viewAllHref="/shop"
        />
      </div>

      <ProductSection
        title="Best Selling Products"
        products={bestSellers}
        bgColor="bg-white"
        compactTitle
      />

      <GoogleTestimonialsMarquee />

      {/* Blog */}
      <section className="py-10 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-8 sm:mb-12">
            <h2 className="text-lg sm:text-2xl font-bold">Blogs Post&apos;s</h2>
            <Link
              to="/blog"
              className="text-[#C7447E] font-bold text-xs sm:text-sm hover:underline uppercase tracking-wide"
            >
              View all articles
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {BLOG_POSTS.slice(0, 3).map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 group"
              >
                <Link to={`/blog/${post.slug}`} className="block h-40 sm:h-48 overflow-hidden">
                  <OptimizedImage
                    src={post.image}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt=""
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </Link>
                <div className="p-4 sm:p-6">
                  <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-3 sm:mb-4 line-clamp-2 group-hover:text-[#C7447E] transition-colors">
                    <Link to={`/blog/${post.slug}`}>{formatDisplayText(post.title)}</Link>
                  </h3>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-[#C7447E] font-bold text-xs sm:text-sm hover:underline uppercase tracking-wide"
                  >
                    Read more
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About / SEO */}
      <section className="relative overflow-hidden bg-[#0a0a0a] text-white">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-12 sm:py-20 lg:py-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
            <div>
              <h1 className="text-2xl sm:text-5xl lg:text-[3.25rem] font-sans font-semibold leading-[1.15] tracking-tight mb-4 sm:mb-6">
                <span className="block text-white/90">Vegas Gift Shop</span>
                <span className="block mt-2 bg-gradient-to-r from-red-400 via-amber-300 to-red-400 bg-clip-text text-transparent">
                  Nairobi&apos;s Premier Luxury Gifting Destination
                </span>
              </h1>
              <p className="text-sm sm:text-lg text-white/60 leading-relaxed max-w-lg font-light">
                We transform ordinary moments into extraordinary memories, curating premium gifts,
                bespoke awards, and personalized treasures for every occasion.
              </p>
              <div className="mt-6 sm:mt-10 flex flex-wrap gap-3">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 bg-white text-black px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full text-xs sm:text-sm font-bold hover:bg-red-500 hover:text-white transition-all"
                >
                  Shop Collection
                </Link>
                <Link
                  to="/shop?category=Corporate%20Gifts"
                  className="inline-flex items-center gap-2 border border-white/30 text-white px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full text-xs sm:text-sm font-bold hover:bg-white/10 transition-all"
                >
                  Corporate Gifting
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div className="space-y-2 sm:space-y-4">
                <div className="aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden ring-1 ring-white/10">
                  <OptimizedImage
                    src="/products/product_3.jpeg"
                    alt="Awards & trophies"
                    loading="lazy"
                    sizes="50vw"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden ring-1 ring-white/10">
                  <OptimizedImage
                    src="/gifts for women 1.jpg"
                    alt="Luxury gifts"
                    loading="lazy"
                    sizes="50vw"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-2 sm:space-y-4 pt-4 sm:pt-8">
                <div className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden ring-1 ring-white/10">
                  <OptimizedImage
                    src="/products/product_16.jpeg"
                    alt="Watches"
                    loading="lazy"
                    sizes="50vw"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden ring-1 ring-white/10">
                  <OptimizedImage
                    src="/products/product_4.jpeg"
                    alt="Corporate gifts"
                    loading="lazy"
                    sizes="50vw"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 sm:mt-16 pt-8 sm:pt-12 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {[
              { value: '1,800+', label: 'Premium Products' },
              { value: 'Same Day', label: 'Nairobi Delivery' },
              { value: '100%', label: 'Satisfaction Guarantee' },
              { value: 'Bespoke', label: 'Personalization' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-lg sm:text-3xl font-bold text-white mb-0.5 sm:mb-1">{stat.value}</p>
                <p className="text-[10px] sm:text-xs text-white/50 uppercase tracking-widest font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
