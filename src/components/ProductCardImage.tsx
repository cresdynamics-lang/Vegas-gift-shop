import { useState, type ReactNode } from 'react';
import type { Product } from '../data/products';
import { getProductSecondaryImage } from '../utils/productDisplay';
import OptimizedImage from './OptimizedImage';

interface ProductCardImageProps {
  product: Product;
  className?: string;
  imageClassName?: string;
  children?: ReactNode;
  /** First row of grids: load immediately for faster LCP */
  priority?: boolean;
}

/**
 * Rio / WPZoom secondary image fade on hover.
 * Secondary image loads only on hover to avoid doubling grid bandwidth.
 */
const ProductCardImage = ({
  product,
  className = '',
  imageClassName = 'p-2',
  children,
  priority = false,
}: ProductCardImageProps) => {
  const secondaryUrl = getProductSecondaryImage(product);
  const [showSecondary, setShowSecondary] = useState(false);
  const transition =
    'transition-opacity duration-[850ms] ease-[cubic-bezier(0.23,1,0.32,1)]';

  const handlePointerEnter = () => {
    if (secondaryUrl) setShowSecondary(true);
  };

  return (
    <div
      className={`relative overflow-hidden bg-gray-50 ${className}`}
      onPointerEnter={handlePointerEnter}
    >
      <OptimizedImage
        src={product.image}
        alt={product.name}
        priority={priority}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className={`absolute inset-0 w-full h-full object-contain ${imageClassName} ${transition} ${
          secondaryUrl ? 'group-hover:opacity-0' : 'group-hover:scale-[1.03] transition-all duration-500'
        }`}
      />
      {secondaryUrl && showSecondary && (
        <OptimizedImage
          src={secondaryUrl}
          alt=""
          aria-hidden
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`absolute inset-0 w-full h-full object-contain ${imageClassName} opacity-0 ${transition} group-hover:opacity-100`}
        />
      )}
      {children}
    </div>
  );
};

export default ProductCardImage;
