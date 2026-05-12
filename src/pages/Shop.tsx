import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { products, categories } from '../data/products';
import ProductSection from '../components/ProductSection';
import { Filter, X, ChevronDown, Search } from 'lucide-react';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync state with URL param
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('All');
    }
  }, [categoryParam]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-low') return list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') return list.sort((a, b) => b.price - a.price);
    if (sortBy === 'newest') return list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    return list;
  }, [filteredProducts, sortBy]);

  return (
    <div className="bg-brand-warm-white min-h-screen">
      {/* Header Section */}
      <section className="bg-brand-charcoal py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-crimson rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">The Full Collection</h1>
          <p className="text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
            Discover our entire range of premium gifts, personalized sets, and corporate awards designed for moments that matter.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-64 space-y-10 shrink-0">
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-brand-gold mb-6">Categories</h3>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => handleCategoryChange('All')}
                    className={`text-sm font-bold transition-colors ${selectedCategory === 'All' ? 'text-brand-crimson' : 'text-brand-charcoal hover:text-brand-crimson'}`}
                  >
                    All Collections
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => handleCategoryChange(cat.name)}
                      className={`text-sm font-bold transition-colors text-left ${selectedCategory === cat.name ? 'text-brand-crimson' : 'text-brand-charcoal hover:text-brand-crimson'}`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-brand-gold mb-6">Price Range</h3>
              <div className="space-y-3">
                {['Under Ksh 2,000', 'Ksh 2,000 - 5,000', 'Ksh 5,000 - 10,000', 'Over Ksh 10,000'].map(range => (
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
            <div className="flex flex-wrap items-center justify-between gap-6 mb-12 bg-white p-6 rounded-2xl border border-brand-stone shadow-sm">
              <div className="relative flex-1 min-w-[250px]">
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
              <ProductSection 
                title={`${selectedCategory} Collection`}
                products={sortedProducts} 
                bgColor="bg-transparent !py-0"
              />
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
              
              <div className="space-y-10 overflow-y-auto pb-10">
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-brand-gold mb-6">Categories</h3>
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={() => { handleCategoryChange('All'); setIsMobileFilterOpen(false); }}
                      className={`text-sm font-bold text-left ${selectedCategory === 'All' ? 'text-brand-crimson' : 'text-brand-charcoal'}`}
                    >
                      All Collections
                    </button>
                    {categories.map(cat => (
                      <button 
                        key={cat.id}
                        onClick={() => { handleCategoryChange(cat.name); setIsMobileFilterOpen(false); }}
                        className={`text-sm font-bold text-left ${selectedCategory === cat.name ? 'text-brand-crimson' : 'text-brand-charcoal'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
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
