import { useEffect, useRef, useState } from 'react';

type UseInViewOptions = {
  rootMargin?: string;
  /** When false, observer is not attached (e.g. priority / eager images). */
  enabled?: boolean;
};

export function useInView<T extends Element>({
  rootMargin = '280px',
  enabled = true,
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setInView(true);
      return;
    }

    setInView(false);
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return { ref, inView };
}
