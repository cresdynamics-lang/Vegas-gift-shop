import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initTracking, trackPageView } from './index';

/** Loads Meta Pixel + GA4 and fires PageView on SPA route changes (storefront only). */
export function TrackingProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) return;
    initTracking();
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) return;
    trackPageView(location.pathname + location.search, document.title);
  }, [location.pathname, location.search, isAdmin]);

  return <>{children}</>;
}
