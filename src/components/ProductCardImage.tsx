import { useEffect, useState, type ReactNode } from 'react';
import type { Product } from '../data/products';
import { getProductSecondaryImage } from '../utils/productDisplay';
import {
  getProductImageUrl,
  getStaticAssetUrl,
  IMAGE_WIDTH,
  sanitizeProductImageSrc,
} from '../utils/imageUtils';

interface ProductCardImageProps {
  product: Product;
  className?: string;
  imageClassName?: string;
  children?: ReactNode;
  priority?: boolean;
  /** Defer image fetch until parent section is near viewport (e.g. related products). */
  loadWhenVisible?: boolean;
  /** Preload hover image in background (disable for below-fold grids). */
  preloadSecondary?: boolean;
}

const fade =
  'transition-opacity duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]';

/**
 * Product card image with optional second gallery image on hover.
 * Secondary is preloaded; primary only fades after secondary is ready.
 */
const ProductCardImage = ({
  product,
  className = '',
  imageClassName = 'p-2',
  children,
  priority = false,
  loadWhenVisible = true,
  preloadSecondary = true,
}: ProductCardImageProps) => {
  const primarySrc = sanitizeProductImageSrc(product.image);
  const secondaryRaw = getProductSecondaryImage(product);
  const secondarySrc =
    secondaryRaw && sanitizeProductImageSrc(secondaryRaw) !== primarySrc
      ? sanitizeProductImageSrc(secondaryRaw)
      : null;

  const [hovering, setHovering] = useState(false);
  const [secondaryReady, setSecondaryReady] = useState(false);
  const [secondaryFailed, setSecondaryFailed] = useState(false);
  const [secondaryDisplayUrl, setSecondaryDisplayUrl] = useState<string | null>(null);

  const primaryUrl = getProductImageUrl(primarySrc, IMAGE_WIDTH.card);
  const secondaryUrl = secondarySrc
    ? getProductImageUrl(secondarySrc, IMAGE_WIDTH.card)
    : null;

  const canSwap = Boolean(secondaryUrl) && secondaryReady && !secondaryFailed;
  const swapVisible = canSwap && hovering;

  useEffect(() => {
    setSecondaryReady(false);
    setSecondaryFailed(false);
    setSecondaryDisplayUrl(null);
    if (!secondarySrc || !preloadSecondary || !loadWhenVisible) return;

    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      setSecondaryDisplayUrl(secondaryUrl);
      setSecondaryReady(true);
    };
    img.onerror = () => {
      if (secondarySrc) {
        const fallback = getStaticAssetUrl(secondarySrc);
        const retry = new Image();
        retry.onload = () => {
          setSecondaryDisplayUrl(fallback);
          setSecondaryReady(true);
        };
        retry.onerror = () => setSecondaryFailed(true);
        retry.src = fallback;
        return;
      }
      setSecondaryFailed(true);
    };
    img.src = secondaryUrl || '';
  }, [secondarySrc, secondaryUrl, preloadSecondary, loadWhenVisible]);

  const imgClass = `w-full h-full object-contain ${imageClassName}`;

  return (
    <div
      className={`relative overflow-hidden bg-gray-50 ${className}`}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
    >
      {/* Primary — stays visible until swap is safe */}
      <div
        className={`absolute inset-0 ${fade} ${
          swapVisible ? 'opacity-0' : 'opacity-100'
        } ${!secondarySrc ? 'group-hover:scale-[1.03] transition-transform duration-500' : ''}`}
      >
        {loadWhenVisible ? (
          <img
            src={primaryUrl}
            alt={product.name}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            {...(priority ? { fetchPriority: 'high' as const } : {})}
            className={imgClass}
            onError={(e) => {
              const el = e.currentTarget;
              if (el.src !== getStaticAssetUrl(primarySrc)) {
                el.src = getStaticAssetUrl(primarySrc);
              }
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 animate-pulse" aria-hidden />
        )}
      </div>

      {/* Secondary — preloaded, only shown when ready + hovered */}
      {secondaryDisplayUrl && !secondaryFailed && (
        <div
          className={`absolute inset-0 ${fade} ${
            swapVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-hidden={!swapVisible}
        >
          <img src={secondaryDisplayUrl} alt="" className={imgClass} />
        </div>
      )}

      {children}
    </div>
  );
};

export default ProductCardImage;
