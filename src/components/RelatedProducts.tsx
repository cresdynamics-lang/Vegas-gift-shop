import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import type { Product } from '../data/products';
import ProductCardImage from './ProductCardImage';
import { formatDisplayText } from '../utils/formatText';
import { useInView } from '../hooks/useInView';
import { IMAGE_WIDTH, preloadProductImages } from '../utils/imageUtils';

interface RelatedProductsProps {
  products: Product[];
}

/** Rio / WooCommerce-style related products grid below product tabs. */
const RelatedProducts = ({ products }: RelatedProductsProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const { ref, inView } = useInView<HTMLElement>({ rootMargin: '320px' });

  useEffect(() => {
    if (!inView || !products.length) return;
    const sources = products.flatMap((p) => {
      const list =
        p.images && p.images.length > 0 ? p.images : p.image ? [p.image] : [];
      return list.slice(0, 2);
    });
    preloadProductImages(sources, [IMAGE_WIDTH.card]);
  }, [inView, products]);

  if (!products.length) return null;

  return (
    <section
      ref={ref}
      className="mt-14 pt-10 border-t border-gray-200"
      aria-labelledby="related-products-heading"
    >
      <h2
        id="related-products-heading"
        className="text-xl font-normal text-gray-900 mb-8"
      >
        Related products
      </h2>

      <ul className="grid grid-cols-2 md:grid-cols-4 gap-6 list-none p-0 m-0">
        {products.map((product, index) => (
          <li key={product.id} className="flex flex-col text-center group">
            <Link
              to={`/product/${product.id}`}
              className="relative block aspect-square border border-gray-100 rounded overflow-hidden mb-3"
            >
              <ProductCardImage
                product={product}
                className="w-full h-full"
                loadWhenVisible={inView}
                preloadSecondary={inView}
                priority={inView && index < 2}
              >
                {product.isSale && (
                  <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 uppercase">
                    Sale!
                  </span>
                )}
              </ProductCardImage>
            </Link>

            <Link
              to={`/product/${product.id}`}
              className="text-sm text-gray-800 hover:text-red-600 line-clamp-2 mb-2 min-h-[2.5rem] leading-snug"
            >
              {formatDisplayText(product.name)}
            </Link>

            <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
              <span className="text-sm font-semibold text-gray-900">
                KShs{product.price.toLocaleString()}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-gray-400 line-through">
                  KShs{product.oldPrice.toLocaleString()}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => addItem(product)}
              className="mt-auto w-full border border-gray-300 text-gray-900 text-xs font-bold uppercase tracking-wide py-2.5 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors"
            >
              Add to cart
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RelatedProducts;
