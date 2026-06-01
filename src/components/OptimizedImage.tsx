import { useEffect, useMemo, useState, type ImgHTMLAttributes } from 'react';
import { useInView } from '../hooks/useInView';
import {
  getProductImageUrl,
  getStaticAssetUrl,
  PRODUCT_CARD_FALLBACK,
} from '../utils/imageUtils';

export type OptimizedImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  /** Above-the-fold / LCP: eager load + high fetch priority */
  priority?: boolean;
  fallbackSrc?: string;
  /** Request a resized WebP from the API (local paths only). */
  width?: number;
  /** Gray pulse while loading (default true for lazy images). */
  showPlaceholder?: boolean;
};

const OptimizedImage = ({
  priority = false,
  fallbackSrc = PRODUCT_CARD_FALLBACK,
  width,
  loading,
  decoding = 'async',
  fetchPriority,
  onError,
  onLoad,
  alt = '',
  className = '',
  style,
  showPlaceholder = true,
  src: srcProp,
  ...props
}: OptimizedImageProps) => {
  const { ref, inView } = useInView<HTMLDivElement>({ enabled: !priority });
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [useOriginal, setUseOriginal] = useState(false);

  const targetSrc = useMemo(() => {
    if (!srcProp || failed) return getStaticAssetUrl(fallbackSrc);
    if (useOriginal) return getStaticAssetUrl(String(srcProp));
    if (width != null) return getProductImageUrl(String(srcProp), width);
    return getStaticAssetUrl(String(srcProp));
  }, [srcProp, width, failed, useOriginal, fallbackSrc]);

  const shouldLoad = priority || inView;
  const displaySrc = shouldLoad ? targetSrc : undefined;

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
    setUseOriginal(false);
  }, [srcProp, width]);

  const resolvedLoading = loading ?? (priority ? 'eager' : 'lazy');
  const resolvedFetchPriority = fetchPriority ?? (priority ? 'high' : undefined);

  return (
    <div ref={ref} className="relative w-full h-full min-h-0">
      {showPlaceholder && !loaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" aria-hidden />
      )}
      {displaySrc ? (
        <img
          {...props}
          src={displaySrc}
          alt={alt}
          style={style}
          loading={resolvedLoading}
          decoding={decoding}
          {...(resolvedFetchPriority ? { fetchPriority: resolvedFetchPriority } : {})}
          className={className}
          onLoad={(e) => {
            setLoaded(true);
            onLoad?.(e);
          }}
          onError={(e) => {
            if (width != null && !useOriginal && srcProp) {
              setUseOriginal(true);
              setLoaded(false);
            } else if (!failed && fallbackSrc && displaySrc !== fallbackSrc) {
              setFailed(true);
              setLoaded(false);
            }
            onError?.(e);
          }}
        />
      ) : null}
    </div>
  );
};

export default OptimizedImage;
