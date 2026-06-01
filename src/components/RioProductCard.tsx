import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import type { Product } from '../data/products';
import ProductCardImage from './ProductCardImage';
import { formatDisplayText } from '../utils/formatText';

type RioProductCardProps = {
  product: Product;
  priority?: boolean;
};

/** WooCommerce / Rio Gift Shop product tile (optimized for 2-column mobile grids). */
export default function RioProductCard({ product, priority = false }: RioProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const displayName = formatDisplayText(product.name);

  return (
    <article className="group flex flex-col bg-white border border-gray-200 rounded-sm overflow-hidden h-full">
      <Link to={`/product/${product.id}`} className="relative aspect-square block bg-gray-50 p-2">
        <ProductCardImage product={product} className="w-full h-full" priority={priority}>
          {product.isSale && (
            <span className="absolute top-1.5 left-1.5 z-10 bg-[#C7447E] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase">
              Sale!
            </span>
          )}
        </ProductCardImage>
      </Link>

      <div className="flex flex-col flex-1 p-2.5 sm:p-3 border-t border-gray-100">
        <Link to={`/product/${product.id}`} className="flex-1 mb-2">
          <h3 className="text-[11px] sm:text-sm font-medium text-gray-800 line-clamp-2 leading-snug group-hover:text-[#C7447E] transition-colors">
            {displayName}
          </h3>
        </Link>

        <div className="mb-2 space-y-0.5">
          {product.oldPrice != null && product.oldPrice > product.price && (
            <p className="text-[10px] sm:text-xs text-gray-400 line-through leading-none">
              KShs {product.oldPrice.toLocaleString()}
            </p>
          )}
          <p className="text-xs sm:text-sm font-bold text-gray-900 leading-none">
            KShs {product.price.toLocaleString()}
          </p>
        </div>

        <button
          type="button"
          onClick={() => addItem(product)}
          className="w-full mt-auto bg-[#333] hover:bg-[#C7447E] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wide py-2 sm:py-2.5 transition-colors"
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}
