import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { products, categories } from '../data/products';
import ProductSection from '../components/ProductSection';
import OptimizedImage from '../components/OptimizedImage';
import { Filter, X, ChevronDown, Search } from 'lucide-react';
import { productMatchesTarget } from '../data/categoryMatchers';
import RioGiftShopCategories from '../components/RioGiftShopCategories';
import { IMAGE_WIDTH } from '../utils/imageUtils';

const SHOP_PAGE_SIZE = 48;

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const subcategoryParam = searchParams.get('subcategory');
  
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(subcategoryParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(SHOP_PAGE_SIZE);

  // Sync state with URL param
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('All');
    }
    setSelectedSubcategory(subcategoryParam);
  }, [categoryParam, subcategoryParam]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedSubcategory(null);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    searchParams.delete('subcategory');
    setSearchParams(searchParams);
  };

  const handleSubcategoryChange = (cat: string, sub: string) => {
    setSelectedCategory(cat);
    setSelectedSubcategory(sub);
    searchParams.set('category', cat);
    searchParams.set('subcategory', sub);
    setSearchParams(searchParams);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      let matchesCategory = false;

      if (selectedCategory === 'All') {
        matchesCategory = true;
      } else if (selectedCategory === 'Gifts below 1000') {
        matchesCategory = product.price < 1000;
      } else if (selectedSubcategory) {
        matchesCategory = productMatchesTarget(product, selectedSubcategory);
      } else {
        const categoryObj = categories.find((c) => c.name === selectedCategory);
        if (categoryObj) {
          matchesCategory =
            productMatchesTarget(product, selectedCategory) ||
            categoryObj.subcategories.some((sub) => productMatchesTarget(product, sub));
        } else {
          matchesCategory = productMatchesTarget(product, selectedCategory);
        }
      }

      const searchTarget = [
        product.name,
        product.category,
        ...(product.categories || []),
        product.description || '',
      ].join(' ').toLowerCase();

      const matchesSearch = searchTarget.includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, selectedSubcategory, searchQuery]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-low') return list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') return list.sort((a, b) => b.price - a.price);
    if (sortBy === 'newest') return list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    return list;
  }, [filteredProducts, sortBy]);

  useEffect(() => {
    setVisibleCount(SHOP_PAGE_SIZE);
  }, [selectedCategory, selectedSubcategory, searchQuery, sortBy]);

  const visibleProducts = useMemo(
    () => sortedProducts.slice(0, visibleCount),
    [sortedProducts, visibleCount]
  );

  const hasMore = visibleCount < sortedProducts.length;

  return (
    <div className="bg-brand-warm-white min-h-screen">
      {/* Header Section */}
      <section className="relative py-10 sm:py-20 lg:py-36 text-white overflow-hidden min-h-[160px] sm:min-h-[280px] lg:min-h-[420px] flex items-center">
        <div className="absolute inset-0">
          <OptimizedImage
            src="/products/product_5.jpeg"
            alt=""
            priority
            width={IMAGE_WIDTH.hero}
            sizes="100vw"
            className="w-full h-full object-cover object-center"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <div className="max-w-2xl">
            <span className="inline-block text-red-400 text-xs font-bold tracking-[0.25em] uppercase mb-4">
              Shop All Gifts
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-sans font-bold mb-2 sm:mb-5 leading-tight tracking-tight">
              The Full Collection
            </h1>
            <p className="text-white/75 text-sm sm:text-lg leading-relaxed font-light max-w-xl hidden sm:block">
              Discover our entire range of premium gifts, personalized sets, and corporate awards designed for moments that matter.
            </p>
          </div>
        </div>
      </section>

      {/* Mobile: Rio categories above products */}
      <div className="lg:hidden max-w-7xl mx-auto px-3 pt-4 pb-2">
        <RioGiftShopCategories
          variant="home"
          showAll
          selectedCategory={selectedCategory}
          onSelect={(name) => handleCategoryChange(name)}
        />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-64 space-y-8 shrink-0">
            <RioGiftShopCategories
              showAll
              selectedCategory={selectedCategory}
              onSelect={(name) => handleCategoryChange(name)}
            />

            {selectedCategory !== 'All' && (() => {
              const cat = categories.find((c) => c.name === selectedCategory);
              if (!cat?.subcategories.length) return null;
              return (
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-brand-gold mb-4">
                    {cat.navLabel || cat.name}
                  </h3>
                  <ul className="pl-1 border-l-2 border-brand-stone/30 space-y-2 max-h-64 overflow-y-auto">
                    {cat.subcategories.map((sub) => (
                      <li key={sub}>
                        <button
                          type="button"
                          onClick={() => handleSubcategoryChange(cat.name, sub)}
                          className={`text-xs transition-colors text-left pl-3 ${
                            selectedSubcategory === sub
                              ? 'text-brand-crimson font-bold'
                              : 'text-brand-text-muted hover:text-brand-crimson'
                          }`}
                        >
                          {sub}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}

            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-brand-gold mb-6">Price Range</h3>
              <div className="space-y-3">
                {['Under KShs 2,000', 'KShs 2,000 - 5,000', 'KShs 5,000 - 10,000', 'Over KShs 10,000'].map(range => (
                  <label key={range} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-4 h-4 border-2 border-brand-stone rounded group-hover:border-brand-crimson transition-colors" />
                    <span className="text-xs font-bold text-brand-charcoal uppercase tracking-widest">{range}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-6 mb-6 sm:mb-12 bg-white p-3 sm:p-6 rounded-lg sm:rounded-2xl border border-brand-stone shadow-sm">
              <div className="relative flex-1 min-w-0 w-full sm:min-w-[250px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-hint" size={18} />
                <input 
                  type="text" 
                  placeholder="Search your gift..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-brand-stone/20 border-transparent rounded-xl focus:bg-white focus:border-brand-crimson focus:ring-0 transition-all text-sm font-medium"
                />
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-brand-stone px-4 py-3 rounded-xl"
                >
                  <Filter size={16} />
                  Filters
                </button>
                
                <div className="relative group">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-brand-stone px-6 py-3 pr-12 rounded-xl text-xs font-bold uppercase tracking-widest focus:border-brand-crimson focus:ring-0 cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">New Arrivals</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-text-hint" />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {sortedProducts.length > 0 ? (
              <>
                <ProductSection
                  title={selectedCategory === 'All' ? 'All Products' : selectedCategory}
                  products={visibleProducts}
                  bgColor="bg-transparent"
                  compactTitle
                />
                {hasMore && (
                  <div className="mt-8 sm:mt-10 flex flex-col items-center gap-2">
                    <p className="text-xs text-brand-text-muted">
                      Showing {visibleProducts.length} of {sortedProducts.length} products
                    </p>
                    <button
                      type="button"
                      onClick={() => setVisibleCount((n) => n + SHOP_PAGE_SIZE)}
                      className="btn-primary px-8"
                    >
                      Load more products
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-brand-stone border-dashed">
                <div className="w-20 h-20 bg-brand-stone/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-brand-text-hint" />
                </div>
                <h3 className="text-xl font-bold text-brand-charcoal mb-2">No gifts found</h3>
                <p className="text-brand-text-muted mb-8">Try adjusting your search or filters.</p>
                <button 
                  onClick={() => { handleCategoryChange('All'); setSearchQuery(''); }}
                  className="btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-brand-charcoal/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 w-full max-w-xs bg-white z-[101] p-8 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-xl font-bold text-brand-charcoal">Filters</h2>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2">
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6 overflow-y-auto pb-10">
                <RioGiftShopCategories
                  showAll
                  selectedCategory={selectedCategory}
                  onSelect={(name) => {
                    handleCategoryChange(name);
                    if (name === 'All') setIsMobileFilterOpen(false);
                  }}
                />
                {selectedCategory !== 'All' && (() => {
                  const cat = categories.find((c) => c.name === selectedCategory);
                  if (!cat?.subcategories.length) return null;
                  return (
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-widest text-brand-gold mb-3">
                        Subcategories
                      </h3>
                      <div className="flex flex-col pl-3 border-l-2 border-brand-stone/30 gap-2 max-h-48 overflow-y-auto">
                        {cat.subcategories.map((sub) => (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => {
                              handleSubcategoryChange(cat.name, sub);
                              setIsMobileFilterOpen(false);
                            }}
                            className={`text-xs text-left ${
                              selectedSubcategory === sub
                                ? 'text-brand-crimson font-bold'
                                : 'text-brand-text-muted'
                            }`}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="mt-auto pt-8 border-t border-brand-stone">
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="btn-primary w-full"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
