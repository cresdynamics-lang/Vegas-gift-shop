import { useEffect, useState, type ImgHTMLAttributes } from 'react';
import { PRODUCT_CARD_FALLBACK } from '../utils/imageUtils';

export type OptimizedImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  /** Above-the-fold / LCP: eager load + high fetch priority */
  priority?: boolean;
  fallbackSrc?: string;
};

const OptimizedImage = ({
  priority = false,
  fallbackSrc = PRODUCT_CARD_FALLBACK,
  loading,
  decoding = 'async',
  fetchPriority,
  onError,
  alt = '',
  ...props
}: OptimizedImageProps) => {
  const [src, setSrc] = useState(props.src);

  useEffect(() => {
    setSrc(props.src);
  }, [props.src]);

  const resolvedLoading = loading ?? (priority ? 'eager' : 'lazy');
  const resolvedFetchPriority = fetchPriority ?? (priority ? 'high' : undefined);

  return (
    <img
      {...props}
      src={src}
      alt={alt}
      loading={resolvedLoading}
      decoding={decoding}
      // @ts-expect-error fetchPriority is valid in modern browsers
      fetchPriority={resolvedFetchPriority}
      onError={(e) => {
        if (fallbackSrc && src !== fallbackSrc) {
          setSrc(fallbackSrc);
        }
        onError?.(e);
      }}
    />
  );
};

export default OptimizedImage;
