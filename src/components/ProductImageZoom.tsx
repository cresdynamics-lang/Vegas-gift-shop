import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import OptimizedImage from './OptimizedImage';
import { IMAGE_WIDTH } from '../utils/imageUtils';

/** Subtle magnify, WooCommerce/Rio default is ~1.5×, not a heavy zoom. */
const ZOOM_SCALE = 1.5;

interface ProductImageZoomProps {
  src: string;
  alt: string;
  className?: string;
  children?: ReactNode;
  priority?: boolean;
}

/**
 * WooCommerce-style inner zoom on hover (Rio product page uses jquery.zoom).
 * Only active on devices with a fine pointer (mouse/trackpad).
 */
const ProductImageZoom = ({ src, alt, className = '', children, priority = true }: ProductImageZoomProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canZoom, setCanZoom] = useState(false);
  const [zooming, setZooming] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setCanZoom(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const updateOrigin = useCallback((clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    setOrigin({ x, y });
  }, []);

  const handleMove = (e: React.MouseEvent) => {
    if (!canZoom) return;
    updateOrigin(e.clientX, e.clientY);
  };

  const active = canZoom && zooming;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      onMouseEnter={() => canZoom && setZooming(true)}
      onMouseLeave={() => {
        setZooming(false);
        setOrigin({ x: 50, y: 50 });
      }}
      onMouseMove={handleMove}
    >
      <OptimizedImage
        key={src}
        src={src}
        alt={alt}
        priority={priority}
        width={IMAGE_WIDTH.detail}
        draggable={false}
        sizes="(max-width: 1024px) 100vw, 50vw"
        showPlaceholder={false}
        className="w-full h-full object-contain select-none will-change-transform"
        style={{
          transform: active ? `scale(${ZOOM_SCALE})` : 'scale(1)',
          transformOrigin: `${origin.x}% ${origin.y}%`,
          transition: active ? 'none' : 'transform 0.25s ease-out',
        }}
      />
      {children}
    </div>
  );
};

export default ProductImageZoom;
