import { Link } from 'react-router-dom';
import type { Product } from '../data/products';
import RioProductCard from './RioProductCard';

interface ProductSectionProps {
  title: string;
  products: Product[];
  bgColor?: string;
  /** Rio uses h5-style headings on mobile homepage */
  compactTitle?: boolean;
  viewAllHref?: string;
}

const ProductSection = ({
  title,
  products,
  bgColor = 'bg-white',
  compactTitle = false,
  viewAllHref,
}: ProductSectionProps) => {
  if (!products || products.length === 0) return null;

  return (
    <section className={`py-6 sm:py-10 lg:py-12 ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {title && (
          <div
            className={`flex items-center justify-between gap-3 ${
              compactTitle ? 'mb-4 sm:mb-6' : 'mb-4 sm:mb-8'
            }`}
          >
            <h2
              className={
                compactTitle
                  ? 'text-base sm:text-xl font-bold text-gray-900'
                  : 'text-lg sm:text-2xl font-bold text-gray-900'
              }
            >
              {title}
            </h2>
            {viewAllHref && (
              <Link
                to={viewAllHref}
                className="text-xs sm:text-sm font-bold text-[#C7447E] hover:underline shrink-0"
              >
                View all
              </Link>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
          {products.map((product, index) => (
            <RioProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
