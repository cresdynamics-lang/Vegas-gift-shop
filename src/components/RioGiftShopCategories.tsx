import { Link } from 'react-router-dom';
import {
  getRioCategoryLabel,
  getRioGiftShopCategories,
  getRioHomeCategories,
} from '../data/rioGiftShopCategories';
import type { Category } from '../data/navigation';

type RioGiftShopCategoriesProps = {
  selectedCategory?: string;
  onSelect?: (categoryName: string) => void;
  showAll?: boolean;
  /** `home` = 8 categories with short labels (mobile homepage). */
  variant?: 'sidebar' | 'home';
  className?: string;
};

const DASH = 'border-t border-dashed border-white/35';

export default function RioGiftShopCategories({
  selectedCategory,
  onSelect,
  showAll = false,
  variant = 'sidebar',
  className = '',
}: RioGiftShopCategoriesProps) {
  const items: Category[] = variant === 'home' ? getRioHomeCategories() : getRioGiftShopCategories();
  const shortLabels = variant === 'home';

  const isActive = (name: string) => selectedCategory === name;

  const itemClass = (name: string) =>
    [
      'block w-full text-left px-4 py-2.5 sm:px-5 sm:py-3.5 text-sm font-medium transition-colors',
      isActive(name) ? 'bg-white/15 text-white' : 'text-white/95 hover:bg-white/10 active:bg-white/20',
    ].join(' ');

  const renderItem = (cat: Category) => {
    const label = getRioCategoryLabel(cat, shortLabels);
    if (onSelect) {
      return (
        <button type="button" onClick={() => onSelect(cat.name)} className={itemClass(cat.name)}>
          {label}
        </button>
      );
    }
    return (
      <Link
        to={`/shop?category=${encodeURIComponent(cat.name)}`}
        className={itemClass(cat.name)}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav
      className={`rounded-2xl bg-[#C7447E] text-white shadow-md overflow-hidden ${className}`}
      aria-label="Product categories"
    >
      <div className="px-4 py-3 sm:px-5 sm:py-4">
        <h3 className="text-sm sm:text-lg font-bold leading-snug tracking-tight">Product Categories</h3>
      </div>

      <div className={DASH} />

      {showAll && (
        <>
          {onSelect ? (
            <button type="button" onClick={() => onSelect('All')} className={itemClass('All')}>
              All Collections
            </button>
          ) : (
            <Link to="/shop" className={itemClass('All')}>
              All Collections
            </Link>
          )}
          <div className={`mx-4 sm:mx-5 ${DASH}`} />
        </>
      )}

      {items.map((cat, index) => (
        <div key={cat.id}>
          {renderItem(cat)}
          {index < items.length - 1 && <div className={`mx-4 sm:mx-5 ${DASH}`} />}
        </div>
      ))}
    </nav>
  );
}
